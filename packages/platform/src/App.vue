<script lang="ts">
import { defineComponent } from "vue";
import Record from "@/components/Record.vue";
import MergeEvents from "@/components/MergeEvents.vue";
import Replay from "@/components/Replay.vue";

export default defineComponent({
  name: "App",
  components: {
    Record,
    MergeEvents,
    Replay,
  },
});
</script>

<script setup lang="ts">
import { eventsStore } from "@/store";
import { storeToRefs } from "pinia";

const store = eventsStore();
const { active } = storeToRefs(store);

const activeComponentMap: Record<number, any> = {
  0: Record,
  1: MergeEvents,
  2: Replay,
};
</script>

<template>
  <div class="container">
    <el-steps class="steps" :active="active" align-center>
      <el-step title="record the page" description="do some operations to generate events" />
      <el-step title="merge events" description="Select a time range to merge events" />
      <el-step title="play merged events" description="play the merged events" />
    </el-steps>

    <div class="buttons">
      <el-button :disabled="active === 0" @click="active--" type="primary">Prev</el-button>
      <el-button :disabled="active === 2" @click="active++" type="primary">Next</el-button>
    </div>

    <component :is="activeComponentMap[active]" />
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}
.steps {
  width: 70%;
}
.buttons {
  display: flex;
}
</style>
