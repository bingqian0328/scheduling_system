import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getAvailableStaff, createShift, getAllShifts, getShiftByDate, deleteShift } from '@/api/staff';
import { getWeekDates, defaultRequirements, formatDateForAPI } from '@/utils/scheduling';
import type { AvailableStaff, Shift, WorkHistoryStats } from '@/types/scheduling';

export function useShiftScheduling() {
  // Reactive state
  const selectedDate = ref<string>("");
  const availableStaff = ref<AvailableStaff | null>(null);
  const selectedStaff = reactive<Record<string, string[]>>({
    servers: [],
    bartenders: [],
    chefs: [],
    food_prep: [],
    dishwashers: [],
  });
  const shifts = ref<Shift[]>([]);
  const isAutoScheduling = ref(false);
  const workHistoryStats = ref<WorkHistoryStats>({});

  // Load available staff for selected date
  const loadAvailableStaff = async () => {
    if (!selectedDate.value) return ElMessage.warning("请选择日期");
    try {
      // Ensure date is properly formatted
      const formattedDate = formatDateForAPI(selectedDate.value);
      const data = await getAvailableStaff(formattedDate);
      availableStaff.value = data;

      // Reset selectedStaff
      for (const role in selectedStaff) {
        selectedStaff[role] = [];
      }

      // Load work history for round robin reference (for the selected date's week)
      workHistoryStats.value = await getStaffWorkHistory(formattedDate);
    } catch (err: any) {
      ElMessage.error(err.response?.data?.detail || err.message);
    }
  };

  // Create shift schedule
  const createShiftSchedule = async () => {
    try {
      // Ensure date is properly formatted
      const formattedDate = formatDateForAPI(selectedDate.value);
      await createShift(formattedDate, selectedStaff);
      ElMessage.success("排班生成成功");
      await loadShifts();
    } catch (err: any) {
      ElMessage.error(err.response?.data?.detail || err.message);
    }
  };

  // Load all shifts
  const loadShifts = async () => {
    try {
      shifts.value = await getAllShifts();
    } catch (err: any) {
      ElMessage.error(err.response?.data?.detail || err.message);
    }
  };

  // Delete shift by ID
  const deleteShiftById = async (id: string) => {
    try {
      await deleteShift(id);
      ElMessage.success("排班删除成功");
      await loadShifts();
    } catch (err: any) {
      ElMessage.error(err.response?.data?.detail || err.message);
    }
  };

  // Get staff work history for a specific week
  const getStaffWorkHistory = async (targetDate?: string): Promise<WorkHistoryStats> => {
    try {
      // Get all existing shifts to calculate work frequency
      const allShifts = await getAllShifts();
      const workHistory: WorkHistoryStats = {};

      // Calculate the week's date range based on target date or current date
      const dateToUse = targetDate || formatDateForAPI(selectedDate.value);
      const weekDates = getWeekDates(dateToUse);

      // Count how many times each staff member has worked in the selected week
      allShifts.forEach((shift: any) => {
        // Only count shifts from the selected week
        if (weekDates.includes(shift.date) && shift.scheduled_staff) {
          Object.values(shift.scheduled_staff).forEach((staffList: any) => {
            if (Array.isArray(staffList)) {
              staffList.forEach((staffName: string) => {
                workHistory[staffName] = (workHistory[staffName] || 0) + 1;
              });
            }
          });
        }
      });

      return workHistory;
    } catch (error) {
      console.error('Error getting staff work history:', error);
      return {};
    }
  };

  // Auto-schedule using round robin algorithm
  const autoScheduleRoundRobin = async () => {
    if (!selectedDate.value) return ElMessage.warning("请选择日期");
    if (!availableStaff.value) return ElMessage.warning("请先加载可用员工");

    isAutoScheduling.value = true;

    try {
      // Get staff work history to determine rotation order (for the selected date's week)
      const formattedDate = formatDateForAPI(selectedDate.value);
      const staffWorkHistory = await getStaffWorkHistory(formattedDate);
      
      // Clear current manual selections
      for (const role in selectedStaff) {
        selectedStaff[role] = [];
      }

      // Auto-assign staff using round robin for each role
      for (const [role, staffArray] of Object.entries(availableStaff.value.available_staff)) {
        const requiredCount = availableStaff.value.requirements[role] || 0;
        
        if (Array.isArray(staffArray) && requiredCount > 0) {
          // Sort staff by their work frequency (ascending - least worked first)
          const sortedStaff = [...staffArray].sort((a, b) => {
            const aWorkCount = staffWorkHistory[a.name] || 0;
            const bWorkCount = staffWorkHistory[b.name] || 0;
            return aWorkCount - bWorkCount;
          });

          // Select the required number of staff with least work history
          const selectedForRole = sortedStaff
            .slice(0, Math.min(requiredCount, sortedStaff.length))
            .map(staff => staff.name);

          selectedStaff[role] = selectedForRole;
        }
      }

      // Show user what was automatically selected
      ElMessage.success(`自动排班完成！已按轮换原则分配员工。`);
      
      // Optionally auto-create the shift or let user review first
      const shouldAutoCreate = await showAutoScheduleConfirmation();
      if (shouldAutoCreate) {
        await createShiftSchedule();
      }

    } catch (err: any) {
      ElMessage.error(`自动排班失败: ${err.response?.data?.detail || err.message}`);
    } finally {
      isAutoScheduling.value = false;
    }
  };

  // Show confirmation dialog for auto-scheduling
  const showAutoScheduleConfirmation = (): Promise<boolean> => {
    return new Promise((resolve) => {
      ElMessageBox.confirm(
        '自动排班已完成，是否立即创建此排班？您也可以先查看并调整后再手动创建。',
        '确认自动排班',
        {
          confirmButtonText: '立即创建',
          cancelButtonText: '稍后手动创建',
          type: 'info',
        }
      ).then(() => {
        resolve(true);
      }).catch(() => {
        resolve(false);
      });
    });
  };

  // Get required staff count for a role
  const getRequiredStaffCount = (role: string): number => {
    return availableStaff.value?.requirements?.[role] || defaultRequirements[role] || 1;
  };

  // Check if a role is understaffed
  const isUnderstaffed = (role: string, staffList: string[]): boolean => {
    return staffList.length < getRequiredStaffCount(role);
  };

  // Check if any roles are understaffed
  const hasUnderstaffedRoles = (scheduledStaff: any): boolean => {
    return Object.entries(scheduledStaff).some(([role, staffList]: [string, any]) => 
      isUnderstaffed(role, staffList)
    );
  };

  return {
    // State
    selectedDate,
    availableStaff,
    selectedStaff,
    shifts,
    isAutoScheduling,
    workHistoryStats,
    
    // Actions
    loadAvailableStaff,
    createShiftSchedule,
    loadShifts,
    deleteShiftById,
    autoScheduleRoundRobin,
    getRequiredStaffCount,
    isUnderstaffed,
    hasUnderstaffedRoles,
  };
}
