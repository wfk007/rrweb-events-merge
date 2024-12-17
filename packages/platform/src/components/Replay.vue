<template>
  <div class="replayer-container" ref="replayerRef"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { eventsStore } from "@/store";
import { storeToRefs } from "pinia";
import rrwebPlayer from "rrweb-player";

const store = eventsStore();
const { mergedEvents } = storeToRefs(store);

const replayerRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!replayerRef.value) {
    return;
  }
  const player = new rrwebPlayer({
    target: replayerRef.value,
    props: {
      events: mergedEvents.value,
    },
  });
  player.play();
});
</script>