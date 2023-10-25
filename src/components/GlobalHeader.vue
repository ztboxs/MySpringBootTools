<template>
  <a-row class="globalHeader" align="center">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedkeys"
        @menu-item-click="menuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/niuniu.svg" />
            <span class="title">Niuniu</span>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <div>
        {{ store.state.user?.loginUser?.userName ?? "未登录" }}
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "../router/routes";
import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import ACCESS_ENUM from "@/access/accessEnum";
import checkAuth from "@/access/checkAuth";

const router = useRouter();
const store = useStore();
const currentUser = store.state.user.loginUser;
/** 默认主页 */
const selectedkeys = ref(["/"]);
/** 路由跳转后，更新选中的菜单项 */
router.afterEach((to, from, failure) => {
  selectedkeys.value = [to.path];
});
/** 显示或者隐藏路由 */
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    if (!checkAuth(store.state.user.loginUser, item?.meta?.access as string)) {
      return false;
    }
    return true;
  });
});
/** 测试3秒后设置登入状态 */
setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    userName: "ZT-admin",
    userRole: ACCESS_ENUM.ADMIN,
  });
}, 3000);

const menuClick = (key: string) => {
  router.push({
    path: key,
  });
};
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
  /*background: red;*/
}
.logo {
  height: 45px;
}
.title {
  color: #979797;
  text-align: center;
}
</style>
