// Role configuration and display utilities
export const roleIcons: Record<string, string> = {
  servers: '🍽️',
  bartenders: '🍸',
  chefs: '👨‍🍳',
  food_prep: '🥘',
  dishwashers: '🧽'
};

export const roleDisplayNames: Record<string, string> = {
  servers: '服务员',
  bartenders: '调酒师',
  chefs: '主厨',
  food_prep: '备菜员',
  dishwashers: '洗碗工'
};

export const defaultRequirements: Record<string, number> = {
  servers: 5,
  bartenders: 2,
  chefs: 4,
  food_prep: 3,
  dishwashers: 2
};

export const roles = ['servers', 'bartenders', 'chefs', 'food_prep', 'dishwashers'];

// Role color mapping for different roles
export const roleColors: Record<string, string> = {
  servers: '#E8F5FF',
  bartenders: '#FFF2E8',
  chefs: '#F0F9FF',
  food_prep: '#F7FAFC',
  dishwashers: '#FDF2F8'
};

// Utility functions
export const getRoleIcon = (role: string): string => {
  return roleIcons[role] || '👤';
};

export const getRoleDisplayName = (role: string): string => {
  return roleDisplayNames[role] || role;
};

export const getRoleColor = (role: string): string => {
  return roleColors[role as keyof typeof roleColors] || '#F7FAFC';
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const dayName = days[date.getDay()];
  return `${dateString} (${dayName})`;
};

export const getTotalStaffCount = (scheduledStaff: any): number => {
  return Object.values(scheduledStaff).reduce((total: number, staffList: any) => {
    return total + (Array.isArray(staffList) ? staffList.length : 0);
  }, 0);
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

// Date formatting utilities to avoid timezone issues
export const formatDateForAPI = (date: Date | string | any): string => {
  if (typeof date === 'string') {
    // If already a string, validate it's in correct format
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    // If string but not in correct format, try to parse it
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
      const day = String(parsedDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return date; // Return as-is if we can't parse it
  }
  
  if (date instanceof Date) {
    // Use local timezone formatting to avoid UTC conversion issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
  
  // Handle case where date might be empty or null
  if (!date) {
    return '';
  }
  
  // Convert to string and try again
  return formatDateForAPI(String(date));
};

export const parseDate = (dateString: string): Date => {
  // Parse date string in local timezone to avoid UTC issues
  const parts = dateString.split('-').map(Number);
  const [year, month, day] = parts;
  
  if (parts.length !== 3 || !year || !month || !day) {
    throw new Error(`Invalid date string: ${dateString}`);
  }
  
  return new Date(year, month - 1, day);
};

export const getWeekDates = (targetDate?: string): string[] => {
  const referenceDate = targetDate ? parseDate(targetDate) : new Date();
  const currentDay = referenceDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const weekDates: string[] = [];
  
  // Calculate the start of the week (Sunday)
  const startOfWeek = new Date(referenceDate);
  startOfWeek.setDate(referenceDate.getDate() - currentDay);
  
  // Generate all 7 dates of the target week
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const dateString = formatDateForAPI(date);
    if (dateString) {
      weekDates.push(dateString);
    }
  }
  
  return weekDates;
};
