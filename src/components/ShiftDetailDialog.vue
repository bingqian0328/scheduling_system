<template>
  <el-dialog 
    :model-value="showShiftDialog"
    @update:model-value="$emit('update:showShiftDialog', $event)"
    :title="`${currentShift?.date} 排班详情`"
    width="600px"
  >
    <div v-if="currentShift" class="max-h-[70vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-5 pb-4 border-b-2 border-gray-200">
        <el-tag type="primary" size="large">
          <el-icon><Calendar /></el-icon>
          {{ formatDate(currentShift.date) }}
        </el-tag>
        <el-tag type="success">
          总计 {{ getTotalStaffCount(currentShift.scheduled_staff) }} 名员工
        </el-tag>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div 
          v-for="(staffArr, role) in currentShift.scheduled_staff" 
          :key="role" 
          class="bg-white border rounded-lg p-4 transition-all duration-300 shadow-sm hover:shadow-md hover:border-blue-400"
          :class="{ 
            'border-red-400 bg-red-50': isUnderstaffed(String(role), staffArr),
            'border-gray-200': !isUnderstaffed(String(role), staffArr)
          }"
        >
          <div class="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
            <h4 class="m-0 text-base font-semibold text-gray-800 flex items-center gap-2">
              <span class="text-lg">{{ getRoleIcon(String(role)) }}</span>
              {{ getRoleDisplayName(String(role)) }}
            </h4>
            <el-tag 
              :type="isUnderstaffed(String(role), staffArr) ? 'danger' : 'success'"
              size="small"
            >
              {{ staffArr.length }} / {{ getRequiredStaffCount(String(role)) }}
            </el-tag>
          </div>
          
          <div class="min-h-[60px]">
            <div 
              v-for="staffName in staffArr" 
              :key="staffName"
              class="flex items-center gap-2 py-2 border-b border-gray-50 last:border-b-0"
            >
              <el-avatar 
                :size="32" 
                class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-xs"
              >
                {{ getInitials(staffName) }}
              </el-avatar>
              <span class="text-sm text-gray-700 font-medium">{{ staffName }}</span>
            </div>
            <div 
              v-if="staffArr.length === 0" 
              class="flex items-center justify-center gap-2 py-5 text-gray-500 italic bg-gray-50 rounded border border-dashed border-gray-300"
            >
              <el-icon><Warning /></el-icon>
              未安排员工
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5">
        <el-alert
          v-if="hasUnderstaffedRoles(currentShift.scheduled_staff)"
          title="注意：部分岗位人员不足"
          type="warning"
          :closable="false"
          show-icon
        />
        <el-alert
          v-else
          title="所有岗位人员配置完整"
          type="success"
          :closable="false"
          show-icon
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <el-button @click="$emit('update:showShiftDialog', false)">关闭</el-button>
        <el-button type="primary" @click="handleEditShift(currentShift?.date || '')">
          <el-icon><Edit /></el-icon>
          编辑排班
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { 
  formatDate, 
  getTotalStaffCount, 
  getRoleIcon, 
  getRoleDisplayName, 
  getInitials 
} from '@/utils/scheduling';
import type { Shift } from '@/types/scheduling';

defineProps<{
  showShiftDialog: boolean;
  currentShift: Shift | null;
  isUnderstaffed: (role: string, staffList: string[]) => boolean;
  getRequiredStaffCount: (role: string) => number;
  hasUnderstaffedRoles: (scheduledStaff: any) => boolean;
}>();

const emit = defineEmits<{
  'update:showShiftDialog': [value: boolean];
  'editShift': [date: string];
}>();

const handleEditShift = (date: string) => {
  emit('editShift', date);
};
</script>
