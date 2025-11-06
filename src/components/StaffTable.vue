<template>
  <div class="p-4">
    <el-card>
      <h2>餐厅值班人员管理</h2>

      <!-- 添加人员表单 -->
      <el-form :model="newStaff" inline class="mb-4">
        <el-form-item label="姓名">
          <el-input v-model="newStaff.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="年龄">
          <el-input type="number" v-model.number="newStaff.age" placeholder="年龄" />
        </el-form-item>
        <el-form-item label="职位">
          <el-select v-model="newStaff.position" placeholder="请选择职位" style="width: 120px">
            <el-option
              v-for="position in positionOptions"
              :key="position.value"
              :label="position.label"
              :value="position.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="休息日">
          <el-select v-model="newStaff.day_off" placeholder="请选择休息日" style="width: 120px">
            <el-option
              v-for="day in dayOptions"
              :key="day.value"
              :label="day.label"
              :value="day.value"
            />
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="handleAdd">添加</el-button>
      </el-form>

      <!-- 人员表格 -->
      <el-table :data="staffList" style="width: 100%">
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="age" label="年龄" />
        <el-table-column label="职位">
          <template #default="scope">
            {{ getPositionLabel(scope.row.position) }}
          </template>
        </el-table-column>
        <el-table-column label="休息日">
          <template #default="scope">
            {{ getDayLabel(scope.row.day_off) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getStaff, addStaff, deleteStaff } from "@/api/staff";
import { ElMessage } from "element-plus";

interface Staff {
  id?: string;
  name: string;
  age: number;
  position: string;
  day_off: string;
}

const staffList = ref<Staff[]>([]);
const newStaff = ref<Staff>({
  name: "",
  age: 0,
  position: "",
  day_off: "",
});

// Dropdown options
const positionOptions = [
  { value: "chef", label: "厨师" },
  { value: "dishwasher", label: "洗碗工" },
  { value: "bartender", label: "调酒师" },
  { value: "server", label: "服务员" },
  { value: "food_prep", label: "备餐员" }
];

const dayOptions = [
  { value: "monday", label: "周一" },
  { value: "tuesday", label: "周二" },
  { value: "wednesday", label: "周三" },
  { value: "thursday", label: "周四" },
  { value: "friday", label: "周五" },
  { value: "saturday", label: "周六" },
  { value: "sunday", label: "周日" }
];

const loadStaff = async () => {
  try {
    const data = await getStaff();
    staffList.value = data;
  } catch (error: any) {
    console.error("Failed to load staff:", error);
    ElMessage.error(`加载人员数据失败: ${error.response?.data?.detail || error.message}`);
  }
};


const handleAdd = async () => {
  if (!newStaff.value.name) return ElMessage.warning("请输入姓名");
  if (!newStaff.value.position) return ElMessage.warning("请选择职位");
  if (!newStaff.value.day_off) return ElMessage.warning("请选择休息日");
  
  try {
    await addStaff(newStaff.value);
    ElMessage.success("添加成功");
    await loadStaff();
    newStaff.value = { name: "", age: 0, position: "", day_off: "" };
  } catch (error: any) {
    ElMessage.error(`添加失败: ${error.response?.data?.detail || error.message}`);
  }
};

const handleDelete = async (id: string) => {
  try {
    await deleteStaff(id);
    ElMessage.success("删除成功");
    await loadStaff();
  } catch (error: any) {
    ElMessage.error(`删除失败: ${error.response?.data?.detail || error.message}`);
  }
};

// Helper functions to get display labels
const getPositionLabel = (value: string) => {
  const position = positionOptions.find(option => option.value === value);
  return position ? position.label : value;
};

const getDayLabel = (value: string) => {
  const day = dayOptions.find(option => option.value === value);
  return day ? day.label : value;
};

onMounted(loadStaff);
</script>
