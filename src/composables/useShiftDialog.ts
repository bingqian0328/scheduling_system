import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getShiftByDate } from '@/api/staff';
import { formatDateForAPI } from '@/utils/scheduling';
import type { Shift } from '@/types/scheduling';

export function useShiftDialog() {
  const showShiftDialog = ref(false);
  const currentShift = ref<Shift | null>(null);

  // View shift details
  const viewShift = async (date: string) => {
    try {
      const formattedDate = formatDateForAPI(date);
      currentShift.value = await getShiftByDate(formattedDate);
      showShiftDialog.value = true;
    } catch (err: any) {
      ElMessage.error(err.response?.data?.detail || err.message);
    }
  };

  // Edit shift (switch to edit mode)
  const editShift = (date: string, selectedDate: any, loadAvailableStaff: () => void) => {
    const formattedDate = formatDateForAPI(date);
    selectedDate.value = formattedDate;
    showShiftDialog.value = false;
    loadAvailableStaff();
    ElMessage.info('已切换到编辑模式，请修改排班后重新生成');
  };

  return {
    showShiftDialog,
    currentShift,
    viewShift,
    editShift,
  };
}
