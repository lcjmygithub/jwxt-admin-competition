/*
 * @Author: lcj
 * @Date: 2025-11-14 18:15:37
 * @LastEditors: lcj
 * @LastEditTime: 2025-11-18 10:03:33
 * @FilePath: \jlkj-admin-vite\src\api\login\index.ts
 * @Description:
 */
import { request } from "@/utils/request";
export default class LoginAPI {
  // 用户报名数据概览
  static sendSmsCode(queryParams: any) {
    return request({
      url: `/platform-api/activity/vote-specialist/send-sms-code`,
      method: "post",
      data: queryParams,
    });
  }

  static smsLogin(queryParams: any) {
    return request({
      url: `/platform-api/activity/vote-specialist/sms-login`,
      method: "post",
      data: queryParams,
    });
  }
  // 登出系统
  static logout() {
    return request({
      url: `/platform-api/activity/vote-specialist/logout`,
      method: "post",
    });
  }
}
