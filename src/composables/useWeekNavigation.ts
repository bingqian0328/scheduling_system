import { ref, computed } from 'vue';
import { formatDateForAPI } from '@/utils/scheduling';

export function useWeekNavigation() {
  const currentWeekStart = ref(new Date());

  const weekDays = computed(() => {
    const days = [];
    const start = new Date(currentWeekStart.value);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      
      days.push({
        name: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()],
        date: formatDateForAPI(date)
      });
    }
    
    return days;
  });

  const weekRange = computed(() => {
    const start = weekDays.value[0]?.date;
    const end = weekDays.value[6]?.date;
    return `${start} - ${end}`;
  });

  const previousWeek = () => {
    const newDate = new Date(currentWeekStart.value);
    newDate.setDate(newDate.getDate() - 7);
    currentWeekStart.value = newDate;
  };

  const nextWeek = () => {
    const newDate = new Date(currentWeekStart.value);
    newDate.setDate(newDate.getDate() + 7);
    currentWeekStart.value = newDate;
  };

  const goToCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek;
    currentWeekStart.value = new Date(today.setDate(diff));
  };

  return {
    currentWeekStart,
    weekDays,
    weekRange,
    previousWeek,
    nextWeek,
    goToCurrentWeek,
  };
}
