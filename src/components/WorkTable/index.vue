<!--
 * @Author: lcj
 * @Date: 2025-04-16 10:11:06
 * @LastEditTime: 2025-11-24 16:35:53
 * @LastEditors: lcj
 * @Description: 
-->
<template>
  <div class="competition-work-container">
    <el-table :data="tableData" border class="competition-work-table">
      <el-table-column
        prop="workTitle"
        label="作品名称"
        width="180"
        align="center"
      />
      <el-table-column
        prop="coverUrl"
        label="作品封面"
        align="center"
        min-width="200"
      >
        <template #default="scope">
          <img :src="scope.row.coverUrl" mode="scaleToFill" class="img" />
        </template>
      </el-table-column>
      <el-table-column
        prop="workTypeName"
        label="作品分类"
        align="center"
        min-width="100"
      />
      <el-table-column
        prop="trackType"
        label="赛道分类"
        align="center"
        min-width="100"
      >
        <template #default="scope">
          {{ trackType[scope.row.trackType] }}
        </template>
      </el-table-column>
      <el-table-column
        prop="authorName"
        label="作者名称"
        align="center"
        min-width="100"
      />
      <el-table-column
        prop="score"
        label="我的打分"
        align="center"
        min-width="100"
      />
      <el-table-column
        prop="comment"
        label="我的评语"
        align="center"
        min-width="150"
      >
        <!-- 自定义插槽 -->
        <template #default="{ row }">
          <!-- 手动包裹 Tooltip -->
          <!-- effect: 主题色 (dark/light) -->
          <!-- placement: 出现位置 -->
          <el-tooltip effect="dark" placement="top">
            <!-- 【重点】Tooltip 的内容插槽：在这里你可以写任意 HTML -->
            <template #content>
              <div style="max-width: 300px; line-height: 1.5">
                <span style="color: #409eff; font-weight: bold"></span><br />
                {{ row.comment }}
              </div>
            </template>

            <!-- 表格里显示的文本（带省略号） -->
            <div class="three-line-ellipsis">
              {{ row.comment }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="评审"
        align="center"
        min-width="110"
        fixed="right"
      >
        <template #default="scope">
          <div>
            <el-button
              type="primary"
              v-if="scope.row.status === 0"
              @click="handleAudit(scope.row)"
              >立即评审</el-button
            >
            <el-button type="info" v-else-if="scope.row.status === -1" disabled
              >已过期</el-button
            >
            <el-button type="info" v-else disabled>已评审</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-box">
      <el-pagination
        size="default"
        background
        layout="prev, pager, next, sizes, jumper"
        :page-sizes="[10, 20, 30, 40, 50]"
        :total="totalNum"
        :page-size="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 评作品弹窗 -->
    <el-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :title="`作品内容-${uploadWorkType[currentAuditWork.uploadWorkType]}`"
      width="1200"
      @close="handleCancelAction"
    >
      <div class="competition-work-content">
        <div class="competition-work-type">
          <div class="work-content-box">
            <el-image
              :src="
                Array.isArray(currentAuditWork?.workContents)
                  ? currentAuditWork?.workContents[0]
                  : null
              "
              :preview-src-list="currentAuditWork?.workContents"
              fit="contain"
              class="item-type"
              v-if="currentAuditWork.uploadWorkType === 1"
            />
            <video
              :src="
                Array.isArray(currentAuditWork?.workContents)
                  ? currentAuditWork?.workContents[0]
                  : null
              "
              controls
              class="item-type"
              :poster="currentAuditWork.coverUrl"
              v-if="currentAuditWork.uploadWorkType === 2"
            />
            <audio
              :src="
                Array.isArray(currentAuditWork?.workContents)
                  ? currentAuditWork?.workContents[0]
                  : null
              "
              :poster="currentAuditWork.coverUrl"
              class="audio"
              v-if="currentAuditWork.uploadWorkType === 3"
              controls
            />
          </div>
          <div></div>
        </div>
        <div class="competition-work-info">
          <div class="info-item">
            <div class="work-label">作品名称：</div>
            <div class="work-value">{{ currentAuditWork.workTitle }}</div>
          </div>
          <div class="info-item">
            <div class="work-label">作者名称：</div>
            <div class="work-value">{{ currentAuditWork.authorName }}</div>
          </div>

          <div class="form-item">
            <div class="item-label">分数：</div>
            <div class="item-value">
              <el-input
                v-model="score"
                type="number"
                placeholder="请输入分数"
                :min="0"
                :max="100"
                @input="changVal"
              />
            </div>
          </div>
          <div class="form-item">
            <div class="item-label">评语：</div>
            <div class="item-value">
              <el-input
                v-model="comment"
                type="textarea"
                placeholder="请输入评语"
                :rows="4"
                maxlength="200"
                show-word-limit
              />
            </div>
          </div>

          <div class="btn-group">
            <el-button @click="handleCancelAction">取消</el-button>
            <el-button type="primary" @click="auditReviewWorkScore"
              >确定评审</el-button
            >
          </div>

          <div class="next-btn" v-if="currentAuditIndex < auditList.length - 1">
            <el-button type="danger" @click="handleClickNext">下一个</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import HomeAPI from "@/api/home";
import { ElMessage } from "element-plus";
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  competitionId: {
    type: Number,
    default: () => 0,
  },
  typeStatus: {
    type: Number,
    default: () => null,
  },
});

// 赛道分类
const trackType = ref<any>({
  1: "个人",
  2: "团队",
  3: "学校",
});

// 作品类型
const uploadWorkType = ref<any>({
  1: "图片",
  2: "视频  ",
  3: "音频",
});
// 表格数据列表
const tableData = ref([]);
//表格数据总数
const totalNum = ref(0);
// 页码大小
const pageSize = ref(10);
// 页码
const pageNo = ref(1);
// 待评审列表
const auditList = ref([]);
// 当前评审作品
const currentAuditWork = ref<any>({});
// 当前评审作品索引
const currentAuditIndex = ref(0);
// 评审弹窗
const dialogVisible = ref(false);
// 评分
const score = ref();
// 评语
const comment = ref("");
// 作品Id
const workId = ref();
// 获取作品列表
const getCompetitionWorkPage = () => {
  HomeAPI.getCompetitionWorkPage({
    competitionId: props.competitionId,
    type: props.typeStatus,
    pageNo: pageNo.value,
    pageSize: pageSize.value,
  }).then((res) => {
    const { list, total } = res.data || {};
    tableData.value = list || [];
    totalNum.value = total || 0;
  });
};

// 获取待评审列表
const getReviewList = () => {
  HomeAPI.getReviewList({
    competitionId: props.competitionId,
  }).then((res) => {
    auditList.value = res.data || {};
    if (auditList.value?.length) {
      currentAuditWork.value =
        auditList.value.find((v: any) => v.id === workId.value) || {};
      currentAuditIndex.value = auditList.value.findIndex(
        (v: any) => v.id === workId.value
      );
    }
  });
};

// 评分值改变
const changVal = (val: any) => {
  if (Number(val) < 0) score.value = 0;
  if (Number(val) > 100) score.value = 100;
};

const resetData = () => {
  score.value = "";
  comment.value = "";
};
// 取消重置操作
const handleCancelAction = () => {
  dialogVisible.value = false;
  currentAuditWork.value = {};
  currentAuditIndex.value = 0;
  resetData();
};
// 立即评审按钮操作
const handleAudit = (row: any) => {
  dialogVisible.value = true;
  workId.value = row.id;
  getReviewList();
};

//评审
const auditReviewWorkScore = () => {
  HomeAPI.reviewWorkScore({
    id: currentAuditWork.value.id,
    score: score.value,
    comment: comment.value,
  }).then((res) => {
    ElMessage.success("评审成功");
    resetData();
    getCompetitionWorkPage();
    handleClickNext(() => {
      dialogVisible.value = false;
    });
    console.log(res);
  });
};

// 下一个操作
const handleClickNext = (Hook?: any) => {
  if (currentAuditIndex.value < auditList.value.length - 1) {
    currentAuditIndex.value++;
    currentAuditWork.value = auditList.value[currentAuditIndex.value] || {};
  } else {
    Hook();
  }
};

// 页码大小切换
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  getCompetitionWorkPage();
};

// 页码切换
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  pageNo.value = val;
  getCompetitionWorkPage();
};

watch(
  () => [props.typeStatus, props.competitionId],
  () => {
    getCompetitionWorkPage();
  }
);

onMounted(() => {});
</script>

<style scoped lang="scss">
.competition-work-container {
  .competition-work-table {
    width: 100%;
    .img {
      width: 160px;
      height: 90px;
    }
  }
  .pagination-box {
    margin: 30px 0;
    display: flex;
    justify-content: flex-end;
  }
}

.competition-work-content {
  padding: 10px;
  display: flex;
  .competition-work-type {
    width: 800px;
    .work-content-box {
      background-color: #f2f2f2;
      height: 600px;
      .item-type {
        width: 100%;
        height: 100%;
      }
      .audio {
        width: 100%;
        height: 200px;
        margin: 100px 0;
      }
    }
  }
  .competition-work-info {
    font-size: 16px;
    margin-left: 30px;
    width: 360px;
    .info-item {
      display: flex;
      margin-bottom: 14px;
      .work-label {
        width: 90px;
      }
      .work-value {
        width: calc(100% - 90px);
      }
    }
    .form-item {
      .item-value {
        margin: 6px 0 14px;
      }
    }
    .btn-group {
      margin-top: 30px;
      display: flex;
      justify-content: flex-end;
    }
    .next-btn {
      position: absolute;
      bottom: 30px;
      right: 30px;
    }
  }
}
</style>
<style scoped lang="scss">
::v-deep .el-table__empty-block {
  background-image: url(https://jwxtcdn.jinlingkeji.cn/mini/saas/empty.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  height: 200px !important;
  box-sizing: border-box;
  margin: 20px auto;
  .el-table__empty-text {
    display: none;
  }
}
::v-deep .el-table th {
  font-size: 16px;
}
</style>
