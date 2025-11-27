/*
 * @Author: lcj
 * @Date: 2025-04-16 09:41:06
 * @LastEditTime: 2025-11-18 19:32:53
 * @LastEditors: lcj
 * @Description:
 */
import { createApp } from "vue";
import "@/styles/index.scss";
import "uno.css";
import App from "./App.vue";
import "element-plus/dist/index.css";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import setupPlugins from "@/plugins";

const app = createApp(App);
app.use(ElementPlus, {
  locale: zhCn,
});
app.use(setupPlugins);
app.mount("#app");
