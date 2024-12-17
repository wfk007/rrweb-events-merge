import { eventWithTime } from "@rrweb/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const eventsStore = defineStore("events", () => {
  const active = ref(0);
  const events = ref<eventWithTime[]>([]);
  const mergedEvents = ref<eventWithTime[]>([]);
  return { active, events, mergedEvents };
});
