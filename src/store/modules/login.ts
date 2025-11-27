/*
 * @Author: lcj
 * @Date: 2025-04-16 14:06:27
 * @LastEditTime: 2025-11-19 09:25:27
 * @LastEditors: lcj
 * @Description:
 */
import { defineStore } from "pinia";
import LoginAPI from "@/api/login/index";
import { ElMessage } from "element-plus";
import router from "@/router";
export const useLoginStore = defineStore("Login", {
  state: () => ({
    token: "",
    userInfo: <any>{},
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo;
    },

    async logout() {
      await LoginAPI.logout().catch((error) => ElMessage.error(error));
      router.replace("/login");
      ElMessage.success("退出登录成功");
      this.setToken("");
      this.setUserInfo({});
    },
  },
  persist: true,
});

export default useLoginStore;
