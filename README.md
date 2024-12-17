# rrweb-events-merge

You can choose time range in replay and auto generate a clip of the events which can be played independently.

## Usage

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
