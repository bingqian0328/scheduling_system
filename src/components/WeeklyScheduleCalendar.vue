<template>
  <div class="p-5">
    <el-card>
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4 md:gap-0">
        <h2 class="text-2xl font-bold">📊 周程安排表</h2>
        <div class="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-5 w-full md:w-auto">
          <div class="flex items-center gap-4 justify-center">
            <el-button 
              @click="handlePreviousWeek" 
              circle 
              type="primary"
              class="!bg-blue-500 !border-blue-500 hover:!bg-blue-600 hover:!border-blue-600 !text-white"
            >
              <span class="text-lg font-bold">‹</span>
            </el-button>
            <span class="text-base font-semibold min-w-[200px] text-center">{{ weekRange }}</span>
            <el-button 
              @click="handleNextWeek" 
              circle 
              type="primary"
              class="!bg-blue-500 !border-blue-500 hover:!bg-blue-600 hover:!border-blue-600 !text-white"
            >
              <span class="text-lg font-bold">›</span>
            </el-button>
            <el-button @click="handleGoToCurrentWeek" type="primary">本周</el-button>
          </div>
          <el-button 
            @click="handleExportToPDF" 
            type="success" 
            :loading="isExporting"
            class="font-semibold"
          >
            <span v-if="!isExporting">📄 导出PDF</span>
            <span v-else>导出中...</span>
          </el-button>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex gap-4 mb-5 flex-wrap">
        <div 
          class="px-4 py-2 rounded-full text-sm font-medium border border-gray-300" 
          v-for="role in roles" 
          :key="role" 
          :style="{ backgroundColor: getRoleColor(role) }"
        >
          {{ getRoleDisplayName(role) }}
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="border border-gray-300 rounded-lg overflow-hidden mb-8">
        <!-- Header Row -->
        <div class="grid grid-cols-7 bg-gray-50 border-b-2 border-gray-300">
          <div class="p-4 text-center border-r border-gray-300 last:border-r-0" v-for="day in weekDays" :key="day.date">
            <div class="font-semibold text-base mb-1">{{ day.name }}</div>
            <div class="text-sm text-gray-600">{{ day.date }}</div>
          </div>
        </div>

        <!-- Daily Schedule Row -->
        <div class="grid grid-cols-7 border-b border-gray-300 min-h-[120px]">
          <div class="p-2 border-r border-gray-300 last:border-r-0 min-h-[80px]" v-for="day in weekDays" :key="day.date">
            <div class="flex flex-col gap-1 h-full">
              <div 
                v-for="assignment in getShiftAssignments(day.date ?? '')" 
                :key="assignment.id"
                class="p-1.5 px-2 rounded border border-gray-400 text-xs cursor-pointer transition-all duration-200 hover:-translate-y-px hover:shadow-lg"
                :style="{ backgroundColor: getRoleColor(assignment.role) }"
                :title="`${assignment.name} - ${getRoleDisplayName(assignment.role)}`"
              >
                <div class="font-semibold mb-0.5">{{ assignment.name }}</div>
                <div class="text-[10px] opacity-80">{{ getRoleDisplayName(assignment.role) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useWeekNavigation } from '@/composables/useWeekNavigation';
import { useWeeklyShifts } from '@/composables/useWeeklyShifts';
import { usePDFExport } from '@/composables/usePDFExport';
import { roles, getRoleColor, getRoleDisplayName } from '@/utils/scheduling';

// Use composables
const { weekDays, weekRange, previousWeek, nextWeek, goToCurrentWeek } = useWeekNavigation();
const { shifts, weeklyStats, loadWeeklyShifts, getShiftAssignments } = useWeeklyShifts();
const { isExporting, exportToPDF } = usePDFExport();

// Handle week navigation with data loading
const handlePreviousWeek = () => {
  previousWeek();
  loadWeeklyShifts(weekDays.value.map(day => day.date));
};

const handleNextWeek = () => {
  nextWeek();
  loadWeeklyShifts(weekDays.value.map(day => day.date));
};

const handleGoToCurrentWeek = () => {
  goToCurrentWeek();
  loadWeeklyShifts(weekDays.value.map(day => day.date));
};

// Handle PDF export
const handleExportToPDF = () => {
  exportToPDF(weekRange.value, weekDays.value as any, getShiftAssignments);
};

// Watch for week changes to reload data
watch(weekDays, (newWeekDays) => {
  if (newWeekDays.length > 0) {
    loadWeeklyShifts(newWeekDays.map(day => day.date));
  }
}, { immediate: true });

// Initialize to current week
onMounted(() => {
  goToCurrentWeek();
});
</script>


