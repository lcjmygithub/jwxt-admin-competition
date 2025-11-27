<!--
 * @Author: lcj
 * @Date: 2025-04-16 10:11:06
 * @LastEditTime: 2025-11-24 11:31:31
 * @LastEditors: lcj
 * @Description: 
-->
<template>
  <div class="home-page">
    <div class="header">
      <div class="expert">
        <div class="expert-name">{{ loginStore.userInfo.name }}</div>
        <div class="expert-phone">
          {{
            loginStore.userInfo.mobile
              ? maskPhoneNumber(loginStore.userInfo.mobile)
              : ""
          }}
        </div>
      </div>
      <div class="logOut" @click="handleLogOut">退出登录</div>
    </div>
    <div class="main">
      <div
        class="left-competition-list"
        v-infinite-scroll="loadList"
        v-loading="loading"
      >
        <div v-for="(item, index) in dataList" :key="index">
          <CompetitionItem
            :item="item"
            :class="{ 'active-item': index === activeIndex }"
            @click="handleClickItem(item, index)"
          />
        </div>
      </div>
      <div class="right-competition-work">
        <div class="right-inner">
          <div class="card-list">
            <CardItem
              v-for="(item, index) in cardCountList"
              :key="index"
              class="card-item"
              :item="item"
              :class="{ 'overview-card-item': index === activeBgIndex }"
              @click="handleClickCompetitionStatusItem(item, index)"
            />
          </div>
          <div class="competition-work-table">
            <WorkTable
              :competitionId="activeItem.id"
              :typeStatus="typeStatus"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import HomeAPI from "@/api/home";
import useLoginStore from "@/store/modules/login";
import CompetitionItem from "@/components/CompetitionItem/index.vue";
import CardItem from "@/components/CardItem/index.vue";
import WorkTable from "@/components/WorkTable/index.vue";
import { ElMessageBox } from "element-plus";
const loginStore = useLoginStore();

const pageNo = ref(1);
const totalNum = ref(0);
const dataList = ref([]);
const loading = ref(false);
const activeIndex = ref(0);
const activeItem = ref<any>({});
// 评审状态
const typeStatus = ref();
const activeBgIndex = ref(0);
const cardCountList = ref([
  { key: "workCount", label: "作品总数", value: 0 },
  { key: "unreviewedCount", label: "待评审", value: 0 },
  { key: "reviewedCount", label: "已评审", value: 0 },
  { key: "expiredCount", label: "已过期", value: 0 },
]);

/**
 * 隐藏手机号码中间四位，只显示前三位和最后四位
 *
 * @param phoneNumber 电话号码
 * @returns 隐藏中间四位的电话号码
 * @throws 如果电话号码格式不正确，则抛出错误
 */
const maskPhoneNumber = (phoneNumber: string) => {
  // 提取前三位和最后四位，中间四位替换为****
  const maskedNumber = `${phoneNumber.slice(0, 3)}****${phoneNumber.slice(-4)}`;
  return maskedNumber;
};
// 获取左侧列表
const getCompetitionPage = (init = false) => {
  loading.value = true;
  HomeAPI.getCompetitionPage({
    pageNo: pageNo.value,
    pageSize: 5,
  })
    .then((res) => {
      const { list, total } = res.data || {};
      dataList.value = dataList.value.concat(list || []);
      totalNum.value = total;
      loading.value = false;
      if (init && list?.length) {
        activeItem.value = dataList.value[0] || {};
        getCompetitionCount();
      }
    })
    .catch(() => {
      loading.value = false;
    });
};

// 加载更多
const loadList = async () => {
  if (dataList.value?.length < totalNum.value) {
    pageNo.value += 1;
    getCompetitionPage();
  }
};

// 加载统计数据
const getCompetitionCount = () => {
  HomeAPI.getCompetitionCount({
    competitionId: activeItem.value.id,
  }).then((res) => {
    const { data } = res || {};
    cardCountList.value = cardCountList.value.map((v, index) => {
      return {
        ...v,
        value: data[v.key],
      };
    });
  });
};

// 点击列表项
const handleClickItem = (item: any, index: number) => {
  activeIndex.value = index;
  activeItem.value = item;
  getCompetitionCount();
};

// 点击面板
const handleClickCompetitionStatusItem = (item: any, index: number) => {
  activeBgIndex.value = index;
  switch (item.key) {
    case "workCount":
      typeStatus.value = null;
      break;
    case "unreviewedCount":
      typeStatus.value = 0;
      break;
    case "reviewedCount":
      typeStatus.value = 1;
      break;
    case "expiredCount":
      typeStatus.value = 2;
      break;
  }
};

// 退出登陆
const handleLogOut = () => {
  ElMessageBox.confirm("确定退出登录？", "系统提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    loginStore.logout();
  });
};

onMounted(() => {
  getCompetitionPage(true);
});
</script>

<style scoped lang="scss">
.home-page {
  background-color: #f6f6f6;
  .header {
    padding: 0 30px;
    height: 60px;
    background: #ffffff;
    box-shadow: 0 5px 10px 0 #e8e8e8;
    display: flex;
    align-items: center;
    .expert {
      color: #333333;
      display: flex;
      align-items: center;
      .expert-name {
        font-family: PingFangSC-Medium;
        font-weight: 600;
        font-size: 20px;
      }
      .expert-phone {
        font-size: 18px;
        margin: 5px 0 0 12px;
      }
    }
    .logOut {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 32px;
      width: 104px;
      height: 36px;
      background: #df2020;
      border-radius: 4px;
      color: #fff;
    }
  }
  .main {
    display: flex;
    height: calc(100vh - 70px);
    .left-competition-list {
      margin: 4px 0 0;
      background-color: #fff;
      width: 332px;
      overflow-y: auto;
      .active-item {
        background-color: #fdebeb;
      }
    }
    .right-competition-work {
      margin-left: 20px;
      width: calc(100% - 362px);
      min-width: 800px;
      .right-inner {
        height: calc(100% - 30px);
        background-color: #fff;
        width: 100%;
        padding: 30px;
        margin: 4px 0 20px;
        overflow-y: auto;
        .card-list {
          display: flex;
          color: #333333;
          .card-item {
            flex: 1;
            margin-right: 20px;
          }
          .overview-card-item {
            color: #fff;
            background-color: #df2020;
            box-shadow: 0 6px 10px 0 #df202029;
          }
        }
        .competition-work-table {
          width: 100%;
          margin-top: 30px;
        }
      }
    }
  }
}
</style>
