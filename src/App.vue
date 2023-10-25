<template>
  <div id="app">
    <BasicLayout />
  </div>
</template>

<style>
#app {
}
</style>
<script>
import BasicLayout from "@/layouts/BasicLayout";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

// router.beforeEach( (to, from, next) = > {
//   if(to.meta?.access === "admin") {
//     if (store.state.user.loginUser?.userRole !== "admin") {
//       next("/noAuth");
//       return;
//     }
//   }
//    next();
// });

export default {
  components: { BasicLayout },
};
</script>
