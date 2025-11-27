<!--
 * @Author: lcj
 * @Date: 2025-11-14 14:09:35
 * @LastEditors: lcj
 * @LastEditTime: 2025-11-17 09:51:51
 * @FilePath: \jlkj-admin-vite\src\pages\Login.vue
 * @Description: 
-->
<template>
  <div class="login-wrapper">
    <header class="login-header">
      <div class="logo">
        <img
          src="https://jwxtcdn.jinlingkeji.cn/mini/saas/login/login_logo.png"
          alt="金龄云 Logo"
        />
      </div>
    </header>

    <main class="login-main">
      <section class="brand-section"></section>
      <section class="form-section">
        <!-- 登录和重置密码的逻辑容器 -->
        <SmsForm />
      </section>
    </main>

    <footer class="login-footer">
      <span>技术支持：深圳金龄时代科技有限公司 </span>
    </footer>
  </div>
</template>
<script setup lang="ts">
import SmsForm from "@/components/SmsForm/index.vue";
</script>

<style scoped lang="scss">
$brand-bg-image: url("https://jwxtcdn.jinlingkeji.cn/mini/saas/login/login_bg.png");

.login-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f7fa;
}

.login-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  height: 80px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;

  .logo {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-size: 30px;
    font-weight: 700;
    color: #333330;
    img {
      width: 187px;
      height: 63px;
      margin-right: 15px;
    }
  }
}

.login-main {
  position: relative;
  flex: 1;
  .brand-section {
    height: 100%;
    background-image: $brand-bg-image;
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
  }

  .form-section {
    position: absolute;
    top: 25%;
    right: calc(50% - 200px);
  }
}

.login-footer {
  height: 80px;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 20px;
  font-size: 16px;
  font-family: PingFangSC-Medium;
  color: #b7b7b7;
}
</style>
