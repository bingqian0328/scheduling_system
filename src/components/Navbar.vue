<template>
  <el-menu
    :default-active="activeIndex"
    class="mb-5"
    mode="horizontal"
    @select="handleSelect"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="staff">
      <span>👥 值班人员管理</span>
    </el-menu-item>
    <el-menu-item index="scheduler">
      <span>📅 班次调度管理</span>
    </el-menu-item>
    <el-menu-item index="weekly">
      <span>📊 周程安排表</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const activeIndex = ref('staff');

// Set active index based on current route
watch(
  () => route.name,
  (newRouteName) => {
    activeIndex.value = newRouteName as string;
  },
  { immediate: true }
);

const handleSelect = (key: string) => {
  if (key === 'staff') {
    router.push('/');
  } else if (key === 'scheduler') {
    router.push('/scheduler');
  } else if (key === 'weekly') {
    router.push('/weekly');
  }
};
</script>
