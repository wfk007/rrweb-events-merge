import { utils } from "rrweb";
import { snapshot } from "rrweb-snapshot";
import { type eventWithTime, EventType, serializedNodeWithId } from "@rrweb/types";

const { getWindowScroll } = utils;

export interface MergeOption {
  events: eventWithTime[];
  startTimeStamp: number;
  endTimeStamp: number;
  iframe: HTMLIFrameElement; // iframe in replay
  snapshotOptions?: Parameters<typeof snapshot>[1]; // keep it with record
  onError?: (error: string) => void;
}

const errorHandler = (msg: string, onError?: (error: string) => void) => {
  if (typeof onError === "function") {
    onError(msg);
  }
};

export const mergeEvents = (option: MergeOption) => {
  const { events, iframe, snapshotOptions = {}, startTimeStamp, endTimeStamp, onError } = option;
  if (!events || !Array.isArray(events) || !events.length || !snapshotOptions.mirror || !iframe) {
    errorHandler("events and mirror and iframe is required", onError);
    return [];
  }
  const doc = iframe.contentDocument;
  const win = iframe.contentWindow;
  if (!doc || !win) {
    errorHandler("contentDocument and contentWindow in iframe is required", onError);
    return [];
  }

  let node: serializedNodeWithId | null;
  try {
    // TODO iframe onSerialize, onIframeLoad, onStylesheetLoad, keepIframeSrcFn
    node = snapshot(doc, snapshotOptions);
  } catch (error) {
    errorHandler("snapshot error", onError);
    return [];
  }

  const result: eventWithTime[] = [];
  let lastMeta: eventWithTime | undefined;

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    // record the last meta event
    if (event.type === EventType.Meta) {
      lastMeta = event;
    }
    if (event.timestamp < startTimeStamp) {
      continue;
    } else if (event.timestamp > endTimeStamp) {
      break;
    } else {
      if (!result.length) {
        if (!lastMeta) {
          if (typeof onError === "function") {
            errorHandler("Meta event not found", onError);
            return [];
          }
        }
        // generate meta event
        result.push({
          ...lastMeta,
          timestamp: event.timestamp - 2,
        } as eventWithTime);
        // generate full snapshot event
        result.push({
          type: EventType.FullSnapshot,
          data: {
            node,
            initialOffset: getWindowScroll(win),
          },
          timestamp: event.timestamp - 1,
        } as eventWithTime);
      }
      // append the event
      result.push(event);
    }
  }
  return result;
};
