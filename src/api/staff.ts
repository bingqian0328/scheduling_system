import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // 你的 FastAPI 地址
});

// 获取所有人员
export const getStaff = async () => {
  const res = await api.get("/staff");
  // res.data should be like: { staff: [...], count: N }
  if (!res.data || !Array.isArray(res.data.staff)) {
    throw new Error("Invalid staff data returned from server");
  }
  return res.data.staff;
};

// 新增人员
export const addStaff = async (staff: {
  name: string;
  age: number;
  position: string;
  day_off: string;
}) => {
  const params = new URLSearchParams(staff as any);
  const res = await api.post(`/staff?${params.toString()}`);
  return res.data;
};

// 删除人员
export const deleteStaff = async (id: string) => {
  const res = await api.delete(`/staff/${id}`);
  return res.data;
};

// 更新人员
export const updateStaff = async (
  id: string,
  staff: Partial<{
    name: string;
    age: number;
    position: string;
    day_off: string;
  }>
) => {
  const params = new URLSearchParams(staff as any);
  const res = await api.put(`/staff/${id}?${params.toString()}`);
  return res.data;
};

export const getAvailableStaff = async (date: string) => {
  const res = await api.get(`/staff/available/${date}`);
  return res.data;
};

export const createShift = async (date: string, scheduledStaff: Record<string, any[]>) => {
  const res = await api.post(`/shifts`, {
    date: date,
    scheduled_staff: scheduledStaff
  });
  return res.data;
};

export const getAllShifts = async () => {
  const res = await api.get(`/shifts`);
  return res.data.shifts;
};

export const getShiftByDate = async (date: string) => {
  const res = await api.get(`/shifts/${date}`);
  return res.data;
};

export const deleteShift = async (shiftId: string) => {
  const res = await api.delete(`/shifts/${shiftId}`);
  return res.data;
};
