import { snapshot } from 'rrweb-snapshot';
import { eventWithTime } from '@rrweb/types';

export interface MergeOption {
    events: eventWithTime[];
    startTimeStamp: number;
    endTimeStamp: number;
    iframe: HTMLIFrameElement;
    snapshotOptions?: Parameters<typeof snapshot>[1];
    onError?: (error: string) => void;
}
export declare const mergeEvents: (option: MergeOption) => eventWithTime[];
