import { ref, computed } from 'vue';
import { getAllShifts } from '@/api/staff';
import { ElMessage } from 'element-plus';
import { roles, getRoleDisplayName } from '@/utils/scheduling';
import type { Shift } from '@/types/scheduling';

export function useWeeklyShifts() {
  const shifts = ref<Shift[]>([]);

  const weeklyStats = computed(() => {
    const stats = roles.map((role: string) => ({
      role: getRoleDisplayName(role),
      count: 0
    }));
    
    // Calculate stats from shifts data
    shifts.value.forEach(shift => {
      if (shift.scheduled_staff) {
        Object.entries(shift.scheduled_staff).forEach(([role, staff]: [string, any]) => {
          const statIndex = stats.findIndex((s: any) => s.role === getRoleDisplayName(role));
          if (statIndex !== -1 && stats[statIndex]) {
            stats[statIndex].count += Array.isArray(staff) ? staff.length : 0;
          }
        });
      }
    });
    
    return stats;
  });

  const loadWeeklyShifts = async (weekDates: string[]) => {
    try {
      const allShifts = await getAllShifts();
      
      // Filter shifts for current week
      shifts.value = allShifts.filter((shift: any) => weekDates.includes(shift.date));
      
    } catch (error: any) {
      ElMessage.error(`加载排班数据失败: ${error.message}`);
    }
  };

  const getShiftAssignments = (date: string) => {
    const dayShifts = shifts.value.filter(shift => shift.date === date);
    const assignments: any[] = [];
    
    dayShifts.forEach(shift => {
      if (shift.scheduled_staff) {
        Object.entries(shift.scheduled_staff).forEach(([role, staffList]: [string, any]) => {
          if (Array.isArray(staffList)) {
            staffList.forEach((staffName, index) => {
              assignments.push({
                id: `${date}-${role}-${index}`,
                name: staffName,
                role: role
              });
            });
          }
        });
      }
    });
    
    return assignments;
  };

  return {
    shifts,
    weeklyStats,
    loadWeeklyShifts,
    getShiftAssignments,
  };
}
