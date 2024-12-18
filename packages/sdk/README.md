# rrweb-events-merge

You can choose any time range in replay and generate a new clip of the rrweb events which can be played independently **EVEN IF there are no fullsnapshots in this time range.**

Extremely small lib size:
- size: 1.59 KB
- gzip: 0.73 KB

## Usage

1. install dependencies

```shell
npm install rrweb-events-merge
```

2. import and generate merged events

```ts
import { mergeEvents } from "rrweb-events-merge";

const mergedEvents = mergeEvents({
  events: events,
  startTimeStamp: startTimeStamp,
  endTimeStamp: endTimeStamp,
  iframe: iframe,
  snapshotOptions: {
    mirror,
  },
  onError: (error: string) => {
    console.error(error);
  },
});
```

> you can also see the example in the [MergeEvents.vue](https://github.com/wfk007/rrweb-events-merge/blob/main/packages/platform/src/components/MergeEvents.vue)

## examples

1. install all dependencies

```shell
pnpm install
```

2. build sdk

```shell
cd packages/sdk && pnpm run build
```

3. start the platform dev server

```shell
cd packages/platform && pnpm run dev
```

4. open http://localhost:5173/

5. In step1: you need to record the page and generate the row events

   - click the button: startRecord
   - click and select the form
   - click the button: stopRecord

6. In step2: you need to choose the time range and generate the merged events

   - select the start timestamp which is the start event you want to start with
   - click the button: Merge Events and generate the merged events

7. In step3: you can watch the video created by the merged events
