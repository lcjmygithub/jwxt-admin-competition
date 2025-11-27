/*
 * @Author: lcj
 * @Date: 2025-04-16 14:25:54
 * @LastEditTime: 2025-11-19 09:33:42
 * @LastEditors: lcj
 * @Description:
 */

import type { App } from "vue";
import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import useLoginStore from "@/store/modules/login";
// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    component: () => import("@/pages/Home.vue"),
    meta: { hidden: false },
  },
  {
    path: "/login",
    component: () => import("@/pages/Login.vue"),
    meta: { hidden: false },
  },
  {
    // 使用正则匹配所有路径
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import("@/pages/404.vue"),
    meta: { hidden: true, status: 404 },
  },
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// 全局注册 router
export function setupRouter(app: App<Element>) {
  app.use(router);
}

// 路由守卫
router.beforeEach((to: any, from: any, next: any) => {
  const loginStore = useLoginStore();
  const token = loginStore.token;
  if (to.path === "/login") {
    if (token) {
      next({ path: from.path, replace: true });
    } else {
      next();
    }
  } else {
    if (token) {
      next();
    } else {
      next({ path: "/login", replace: true });
    }
  }
});
export default router;
