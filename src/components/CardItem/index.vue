<!--
 * @Author: lcj
 * @Date: 2025-04-16 10:11:06
 * @LastEditTime: 2025-11-18 09:24:15
 * @LastEditors: lcj
 * @Description: 
-->
<template>
  <div class="card">
    <div class="item">
      <div class="item-label">{{ item.label }}</div>
      <div class="item-value">{{ item.value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<style scoped lang="scss">
.card {
  max-width: 250px;
  height: 100px;
  background: #f6f6f6;
  border-radius: 6px;
  padding: 16px 0;

  .item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    .item-label {
      font-size: 20px;
    }
    .item-value {
      font-weight: 600;
      font-size: 30px;
    }
  }
}
</style>
