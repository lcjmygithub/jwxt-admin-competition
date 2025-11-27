/*
 * @Author: lcj
 * @Date: 2025-04-16 14:25:54
 * @LastEditTime: 2025-04-16 15:46:40
 * @LastEditors: lcj
 * @Description:
 */

import { setupRouter } from "@/router";
import { setupStore } from "@/store";
import type { App } from "vue";
import { setupElIcons } from "./icons";

export default {
  install(app: App<Element>) {
    // 路由(router)
    setupRouter(app);
    // 状态管理(store)
    setupStore(app);
    // Element-plus图标
    setupElIcons(app);
  },
};
