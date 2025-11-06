import { createRouter, createWebHistory } from "vue-router";
import StaffView from "@/views/StaffView.vue";
import ShiftSchedulerView from "@/views/ShiftSchedulerView.vue";
import WeeklyScheduleView from "@/views/WeeklyScheduleView.vue";

const routes = [
  { path: "/", name: "staff", component: StaffView },
  { path: "/scheduler", name: "scheduler", component: ShiftSchedulerView },
  { path: "/weekly", name: "weekly", component: WeeklyScheduleView },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
