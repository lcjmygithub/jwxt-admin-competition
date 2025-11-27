<!--
 * @Author: lcj
 * @Date: 2025-11-14 14:17:18
 * @LastEditors: lcj
 * @LastEditTime: 2025-11-24 16:43:01
 * @FilePath: \jwxt-admin-competition\src\components\SmsForm\index.vue
 * @Description: 
-->
<template>
  <div class="login-container">
    <div class="title">欢迎使用票选作品评分系统</div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="login-form"
    >
      <el-form-item label="" prop="mobile">
        <el-input
          v-model="ruleForm.mobile"
          placeholder="请输入手机号"
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item label="" prop="code">
        <el-input
          v-model="ruleForm.code"
          placeholder="短信验证码"
          autocomplete="off"
          clearable
        >
          <template #append>
            <span v-if="time <= 0" style="cursor: pointer" @click="getSmsCode"
              >获取验证码</span
            >
            <span v-else>{{ time }}s后重试</span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-button"
          type="primary"
          @click="handleLogin(ruleFormRef)"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onBeforeUnmount } from "vue";
import LoginAPI from "@/api/login/index";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import useLoginStore from "@/store/modules/login";
import { useRouter } from "vue-router";

const router = useRouter();
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  mobile: "",
  code: "",
});

const time = ref(0);
const counterTimer = ref();

// 自定义校验手机号
const validateMobile = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("手机号不能为空"));
  } else {
    const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
    if (!reg.test(ruleForm.mobile)) {
      if (!ruleFormRef.value) return;
      callback(new Error("手机号格式错误"));
    }
    callback();
  }
};

// 自定义校验验证码验证
const validateCode = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("验证码不能为空"));
  } else {
    callback();
  }
};

const rules = reactive<FormRules<typeof ruleForm>>({
  mobile: [{ validator: validateMobile, trigger: "blur" }],
  code: [{ validator: validateCode, trigger: "blur" }],
});

// 清除定时器
const clearCounterTimer = () => {
  if (counterTimer.value) {
    clearInterval(counterTimer.value);
    counterTimer.value = null;
  }
};

// 登陆
const handleLogin = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      const params = {
        mobile: ruleForm.mobile,
        code: ruleForm.code,
        scene: 38,
      };
      LoginAPI.smsLogin(params).then((res: any) => {
        const loginStore = useLoginStore();
        if (res?.code === 0) {
          const { accessToken } = res?.data || {};
          loginStore.setToken(accessToken);
          loginStore.setUserInfo(res?.data);
          ElMessage.success("登陆成功");
          router.push("/");
        }
      });
    } else {
      console.log("error submit!");
    }
  });
};

// 发送验证码 API
const sendSmsCode = async (res: any) => {
  const { ret, randstr, ticket } = res;
  if (ret === 0) {
    try {
      // 场景21代表登录
      await LoginAPI.sendSmsCode({
        mobile: ruleForm.mobile,
        scene: 38,
        randstr,
        ticket,
      });
      ElMessage.success("获取短信验证码成功");
      time.value = 60;
      counterTimer.value = setInterval(() => {
        time.value--;
        if (time.value <= 0) clearCounterTimer();
      }, 1000);
    } catch (error) {
      ElMessage.error("发送验证码失败");
    }
  }
};

// 拼图验证
const getSmsCode = () => {
  if (time.value > 0) return;
  if (!ruleFormRef.value) return;
  ruleFormRef.value.validateField("mobile", async (message) => {
    if (message) {
      // 生成一个验证码对象
      var captcha = new (window as any).TencentCaptcha(
        "2062842474",
        sendSmsCode,
        {}
      );
      // 调用方法，显示验证码
      captcha.show();
    }
  });
};

onBeforeUnmount(() => {
  clearCounterTimer();
});
</script>
<style scoped lang="scss">
.login-container {
  width: 400px;
  height: 358px;
  padding: 40px;
  background-color: #fff;
  border-radius: 10px;
  .title {
    padding: 0px 0 10px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    font-size: 24px;
  }
  .login-form {
    margin: 30px 0;
  }
  .login-button {
    width: 100%;
  }
}
</style>
<style scoped lang="scss">
::v-deep .el-input {
  height: 45px;
}
::v-deep .el-form-item {
  padding: 5px 0;
}
::v-deep .el-button {
  margin-top: 15px;
  height: 45px;
  background-color: #df2020;
  border: 1px solid #df2020;
}
</style>
