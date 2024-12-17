<template>
  <el-form :model="form" label-width="auto" style="max-width: 600px">
    <el-form-item label="Activity name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="Activity zone">
      <el-select v-model="form.region" placeholder="please select your zone">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="Activity time">
      <el-col :span="11">
        <el-date-picker v-model="form.date1" type="date" placeholder="Pick a date" style="width: 100%" />
      </el-col>
      <el-col :span="2" class="text-center">
        <span class="text-gray-500">-</span>
      </el-col>
      <el-col :span="11">
        <el-time-picker v-model="form.date2" placeholder="Pick a time" style="width: 100%" />
      </el-col>
    </el-form-item>
    <el-form-item label="Instant delivery">
      <el-switch v-model="form.delivery" />
    </el-form-item>
    <el-form-item label="Activity type">
      <el-checkbox-group v-model="form.type">
        <el-checkbox value="Online activities" name="type"> Online activities </el-checkbox>
        <el-checkbox value="Promotion activities" name="type"> Promotion activities </el-checkbox>
        <el-checkbox value="Offline activities" name="type"> Offline activities </el-checkbox>
        <el-checkbox value="Simple brand exposure" name="type"> Simple brand exposure </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="Resources">
      <el-radio-group v-model="form.resource">
        <el-radio value="Sponsor">Sponsor</el-radio>
        <el-radio value="Venue">Venue</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="Activity form">
      <el-input v-model="form.desc" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onStartRecord"> StartRecord </el-button>
      <el-button @click="onStopRecord"> StopRecord </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { record } from "rrweb";
import { eventsStore } from "@/store";

const store = eventsStore();

const form = ref({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});

let stopRecordFn: ReturnType<typeof record>;

const rrwebEmit = (event: any) => {
  store.events.push(event);
};

const onStartRecord = () => {
  store.events = [];
  stopRecordFn = record({
    emit: rrwebEmit,
    slimDOMOptions: true,
    sampling: {
      input: "last",
    },
  });
};

const onStopRecord = () => {
  stopRecordFn && stopRecordFn();
  store.active++;
  console.log("events", store.events);
};
</script>
