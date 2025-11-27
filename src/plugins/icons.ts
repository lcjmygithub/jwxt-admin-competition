/*
 * @Author: lcj
 * @Date: 2025-04-16 14:00:54
 * @LastEditTime: 2025-04-16 14:30:35
 * @LastEditors: lcj
 * @Description:
 */

import type { App } from "vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 注册所有图标
export function setupElIcons(app: App<Element>) {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
}
