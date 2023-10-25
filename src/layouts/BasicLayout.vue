<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer"
        >备案号：
        <a href="https://baidu.com" target="_blank"> 11111111 </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#basicLayout {
}

#basicLayout .header {
  margin-bottom: 16px;
  box-shadow: #979797 1px 1px 2px;
}

#basicLayout .content {
  background: linear-gradient(to right, #fefefe, #ffffff);
  margin-bottom: 16px;
  padding: 20px;
}

#basicLayout .footer {
  /**边界确认颜色*/
  background: #979797;
  padding: 16px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script>
import GlobalHeader from "@/components/GlobalHeader";

export default {
  components: { GlobalHeader },
};
</script>
