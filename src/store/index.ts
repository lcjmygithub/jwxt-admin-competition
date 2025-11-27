/*
 * @Author: lcj
 * @Date: 2025-04-16 14:06:43
 * @LastEditTime: 2025-04-16 15:20:01
 * @LastEditors: lcj
 * @Description:
 */
import type { App } from "vue";
import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";

const store = createPinia();
store.use(
  createPersistedState({
    storage: {
      getItem(key: string) {
        return localStorage.getItem(key);
      },
      setItem(key: string, value: any) {
        localStorage.setItem(key, value);
      },
    },
  })
);

// 全局注册 store
export function setupStore(app: App<Element>) {
  app.use(store);
}

export * from "./modules/home";
export * from "./modules/login";
export { store };
