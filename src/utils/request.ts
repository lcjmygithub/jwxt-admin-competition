/*
 * @Author: lcj
 * @Date: 2025-04-16 15:52:20
 * @LastEditTime: 2025-11-19 10:26:15
 * @LastEditors: lcj
 * @Description:
 */
import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import router from "@/router";
import { ElMessage, ElMessageBox } from "element-plus";
import useLoginStore from "@/store/modules/login";

// 需要忽略的提示。忽略后，自动 Promise.reject('error')
const ignoreMsgs = [
  "无效的刷新令牌", // 刷新令牌被删除时，不用提示
  "刷新令牌已过期", // 使用刷新令牌，刷新获取新的访问令牌时，结果因为过期失败，此时需要忽略。否则，会导致继续 401，无法跳转到登出界面
];

const errorCode: any = {
  401: "认证失败，无法访问系统资源",
  403: "当前操作没有权限",
  404: "访问资源不存在",
  default: "系统未知错误，请反馈给管理员",
};

const handleAuthorized = () => {
  if (router.currentRoute.value.path !== "/login") {
    ElMessageBox.confirm(
      "登录状态已过期，您可以继续留在该页面，或者重新登录",
      "系统提示",
      {
        confirmButtonText: "重新登录",
        cancelButtonText: "取消",
        type: "warning",
      }
    ).then(() => {
      router.replace("/login");
    });
  }

  return Promise.reject("无效的会话，或者会话已过期，请重新登录。");
};

// 创建 axios 实例
export const request = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const loginStore = useLoginStore();
    config.headers["Authorization"] = "Bearer " + loginStore.token;
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 未设置状态码则默认成功状态
    const code = response.data.code || 200;
    // 获取错误信息
    const msg = response.data.msg || errorCode[code] || errorCode["default"];
    if (ignoreMsgs.indexOf(msg) !== -1) {
      // 如果是忽略的错误码，直接返回 msg 异常
      handleAuthorized();
      return Promise.reject(msg);
    } else if (code === 200) {
      return response.data;
    } else if (code === 500 || code == 429) {
      ElMessage.error(msg);
      return Promise.reject(msg);
    } else if (code === 401) {
      handleAuthorized();
      ElMessage.error(msg);
      return Promise.reject(msg);
    } else {
      ElMessage.error(msg);
      return Promise.reject(msg);
    }
  },
  (error: any) => {
    ElMessage.error("系统出错");
    return Promise.reject(error.message);
  }
);
