<!--
 * @Author: lcj
 * @Date: 2025-04-16 10:11:06
 * @LastEditTime: 2025-11-19 10:01:13
 * @LastEditors: lcj
 * @Description: 
-->
<template>
  <div class="competition">
    <div class="competition-item">
      <div class="title">
        <div class="title-text">{{ item.voteEventName }}</div>
        <div class="status">{{ stage[item.stage] }}</div>
      </div>
      <div class="item">
        <div class="item-label">开始评审：</div>
        <div class="item-value">
          {{
            item.reviewStartTime
              ? dayjs(item.reviewStartTime).format("YYYY-MM-DD HH:mm")
              : "-"
          }}
        </div>
      </div>
      <div class="item">
        <div class="item-label">截至评审：</div>
        <div class="item-value">
          {{
            item.reviewEndTime
              ? dayjs(item.reviewEndTime).format("YYYY-MM-DD HH:mm")
              : "-"
          }}
        </div>
      </div>
      <div class="item">
        <div class="item-label">主办学校：</div>
        <div class="item-value">{{ item.tenantName }}</div>
      </div>
    </div>
    <div class="competition-icon">
      <el-icon :size="20" color="#999999"><ArrowRight /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import dayjs from "dayjs";
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
});

const stage = ref<any>({
  1: "初赛",
  2: "复赛",
  3: "决赛",
});

onMounted(() => {});
</script>

<style scoped lang="scss">
.competition {
  padding: 42px 30px;
  border-bottom: 1px solid #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .competition-item {
    .title {
      display: flex;
      .title-text {
        font-weight: 600;
        font-size: 18px;
        color: #333333;
      }
      .status {
        margin-left: 12px;
        font-size: 16px;
        color: #ff8701;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 64px;
        height: 30px;
        background: #fff3e5;
        border-radius: 4px;
      }
    }
    .item {
      margin-top: 10px;
      display: flex;
      font-size: 16px;
      .item-label {
        width: 90px;
        color: #666666;
      }
      .item-value {
        color: #333333;
        width: calc(100% - 90px);
      }
    }
  }
  .competition-icon {
    margin-left: 10px;
  }
}
</style>
