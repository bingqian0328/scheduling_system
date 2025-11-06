<template>
  <el-collapse-transition>
    <div v-show="showWorkHistory" class="bg-gray-50 p-4 rounded-lg mb-5 border border-gray-200">
      <h4 class="mb-3 text-gray-700 font-medium">员工当周工作统计 (用于轮换排班参考)</h4>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-3">
        <div 
          v-for="(count, staffName) in workHistoryStats" 
          :key="staffName"
          class="flex justify-between items-center p-2 bg-white rounded border text-sm"
          :class="{ 
            'bg-blue-50 border-blue-200': count < 3, 
            'bg-red-50 border-red-200': count > 6 
          }"
        >
          <span class="font-semibold">{{ staffName }}</span>
          <span class="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{{ count }}次</span>
        </div>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded border-l-4 border-blue-400">
        <el-icon><InfoFilled /></el-icon>
        自动轮换排班会优先选择当周工作次数较少的员工，统计会根据所选日期的周重置，确保工作分配公平。
      </div>
    </div>
  </el-collapse-transition>
</template>

<script setup lang="ts">
import type { WorkHistoryStats } from '@/types/scheduling';

defineProps<{
  showWorkHistory: boolean;
  workHistoryStats: WorkHistoryStats;
}>();
</script>
