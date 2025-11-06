<template>
  <div class="p-4">
    <!-- Staff Management Section -->
    <div class="mb-6">
      <StaffTable />
    </div>
    
    <!-- Shift Scheduler Section -->
    <div>
      <ShiftScheduler />
    </div>
  </div>
</template>

<script setup lang="ts">
import StaffTable from "@/components/StaffTable.vue";
import ShiftScheduler from "@/components/ShiftScheduler.vue";
</script>

<style scoped>
.mb-6 {
  margin-bottom: 2rem;
}
</style>
