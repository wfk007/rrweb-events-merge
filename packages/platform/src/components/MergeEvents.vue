<template>
  <div class="replayer-container" ref="replayerRef"></div>

  <div class="select-container">
    <div class="select-text">please select start time</div>
    <el-select
      class="select-item"
      v-model="startTimeStamp"
      placeholder="Select start timestamp"
      @change="onSelectChange"
    >
      <el-option v-for="(event, index) in events" :key="index" :label="event.timestamp" :value="event.timestamp" />
    </el-select>
  </div>

  <el-button @click="onMergeEvents" type="danger"> Merge Events </el-button>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { eventsStore } from "@/store";
import { storeToRefs } from "pinia";
import rrwebPlayer from "rrweb-player";
import { mergeEvents } from "rrweb-events-merge";

const store = eventsStore();
const { events } = storeToRefs(store);

const startTimeStamp = ref();
let player: rrwebPlayer;

const replayerRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!replayerRef.value) {
    return;
  }
  player = new rrwebPlayer({
    target: replayerRef.value,
    props: {
      events: events.value,
    },
  });
  player.pause();
});

const onSelectChange = () => {
  player.goto(startTimeStamp.value - events.value[0].timestamp, false);
};

const onMergeEvents = () => {
  const iframe = document.querySelector("iframe");
  const mirror = player.getMirror();
  const mergedEvents = mergeEvents({
    events: events.value,
    startTimeStamp: startTimeStamp.value,
    // default to choose the last event as end time
    endTimeStamp: events.value[events.value.length - 1].timestamp,
    iframe: iframe,
    snapshotOptions: {
      mirror,
    },
    onError: (error: string) => {
      console.error(error);
    },
  });
  console.log("mergedEvents", mergedEvents);
  store.mergedEvents = mergedEvents;
  store.active++;
};
</script>

<style scoped lang="scss">
.select-container {
  display: flex;
  align-items: center;
  gap: 10px;
  .select-text {
    flex-shrink: 0;
  }
  .select-item {
    width: 200px;
  }
}
</style>
