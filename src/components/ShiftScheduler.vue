<template>
  <div class="p-4">
    <el-card>
      <h2 class="text-2xl font-bold mb-4">排班管理</h2>

      <!-- 日期选择 -->
      <div class="flex gap-3 mb-6">
        <el-date-picker 
          v-model="selectedDate" 
          type="date" 
          placeholder="选择排班日期" 
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
        <el-button type="primary" @click="handleLoadStaff">加载可用员工</el-button>
      </div>

      <!-- 可用员工表 -->
      <div v-if="availableStaff">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold cursor-pointer flex items-center gap-2" @click="showEmployeeSection = !showEmployeeSection">
            <el-icon>
              <component :is="showEmployeeSection ? 'ArrowDown' : 'ArrowRight'" />
            </el-icon>
            可用员工
          </h3>
          <div class="flex gap-2">
            <el-button 
              size="small" 
              type="info" 
              plain 
              @click="showWorkHistory = !showWorkHistory"
            >
              {{ showWorkHistory ? '隐藏' : '显示' }}工作统计
            </el-button>
            <el-button 
              size="small" 
              type="primary" 
              plain 
              @click="showEmployeeSection = !showEmployeeSection"
            >
              {{ showEmployeeSection ? '收起' : '展开' }}
            </el-button>
          </div>
        </div>

        <el-collapse-transition>
          <div v-show="showEmployeeSection">
            <!-- Work History Display -->
            <WorkHistoryDisplay 
              :show-work-history="showWorkHistory"
              :work-history-stats="workHistoryStats"
            />

            <div v-for="(staffArr, role) in availableStaff.available_staff" :key="role" class="mb-4">
              <h4 class="text-base font-medium mb-2">{{ role }} (需要: {{ availableStaff.requirements[role] }})</h4>
              <el-checkbox-group v-model="selectedStaff[role]">
                <el-checkbox 
                  v-for="staff in staffArr" 
                  :label="staff.name" 
                  :key="staff.id"
                  class="mr-4 mb-2"
                >
                  <div class="flex items-center gap-2">
                    <span>{{ staff.name }}</span>
                    <span v-if="workHistoryStats[staff.name]" class="text-xs bg-gray-600 text-white px-2 py-1 rounded-full">
                      {{ workHistoryStats[staff.name] }}次
                    </span>
                  </div>
                </el-checkbox>
              </el-checkbox-group>
            </div>

            <div class="flex gap-3 mt-4 flex-wrap">
              <el-button type="success" @click="handleCreateShift" class="font-semibold">手动生成排班</el-button>
              <el-button type="primary" @click="handleAutoSchedule" :loading="isAutoScheduling" class="font-semibold">
                <span v-if="!isAutoScheduling">🔄 自动轮换排班</span>
                <span v-else>生成中...</span>
              </el-button>
            </div>
          </div>
        </el-collapse-transition>
      </div>

      <!-- 所有排班表 -->
      <h3 class="mt-6 text-lg font-semibold mb-4">所有排班表</h3>
      <el-table :data="shifts" style="width: 100%">
        <el-table-column prop="date" label="日期" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="primary" @click="viewShift(scope.row.date)">查看</el-button>
            <el-button size="small" type="danger" @click="deleteShiftById(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Shift Detail Dialog -->
      <ShiftDetailDialog
        v-model:show-shift-dialog="showShiftDialog"
        :current-shift="currentShift"
        :is-understaffed="isUnderstaffed"
        :get-required-staff-count="getRequiredStaffCount"
        :has-understaffed-roles="hasUnderstaffedRoles"
        @edit-shift="handleEditShift"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useShiftScheduling } from '@/composables/useShiftScheduling';
import { useShiftDialog } from '@/composables/useShiftDialog';
import WorkHistoryDisplay from './WorkHistoryDisplay.vue';
import ShiftDetailDialog from './ShiftDetailDialog.vue';

// Use composables for business logic
const {
  selectedDate,
  availableStaff,
  selectedStaff,
  shifts,
  isAutoScheduling,
  workHistoryStats,
  loadAvailableStaff,
  createShiftSchedule,
  loadShifts,
  deleteShiftById,
  autoScheduleRoundRobin,
  getRequiredStaffCount,
  isUnderstaffed,
  hasUnderstaffedRoles,
} = useShiftScheduling();

const {
  showShiftDialog,
  currentShift,
  viewShift,
  editShift,
} = useShiftDialog();

// Local state
const showWorkHistory = ref(false);
const showEmployeeSection = ref(true);

// Handle shift editing from dialog
const handleEditShift = (date: string) => {
  editShift(date, selectedDate, loadAvailableStaff);
  showEmployeeSection.value = true; // Show employee section when editing
};

// Handle work history display
const handleWorkHistory = () => {
  showWorkHistory.value = true;
};

// Override the createShiftSchedule to collapse section after scheduling
const handleCreateShift = async () => {
  await createShiftSchedule();
  showEmployeeSection.value = false; // Collapse after successful scheduling
};

// Override auto schedule to collapse section after scheduling
const handleAutoSchedule = async () => {
  await autoScheduleRoundRobin();
  showEmployeeSection.value = false; // Collapse after successful auto-scheduling
};

// Show employee section when loading staff
const handleLoadStaff = async () => {
  await loadAvailableStaff();
  showEmployeeSection.value = true; // Show section when loading new staff
};

onMounted(loadShifts);
</script>


