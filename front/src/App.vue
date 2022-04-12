<template>
  <div class="common-layout">
    <el-container>
      <el-header height="60px">
        <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
        >
          <el-menu-item index="main">首頁</el-menu-item>
          <el-menu-item index="search">查詢</el-menu-item>
          <el-menu-item index="plugin">插件</el-menu-item>
          <el-menu-item index="exchange">匯率</el-menu-item>
        </el-menu>
      </el-header>
      <el-main class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component"/>
          </transition>
        </router-view>
      </el-main>
      <el-footer height="60px" class="footer">Footer</el-footer>
    </el-container>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue'
import {useRouter, useRoute} from 'vue-router'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

export default defineComponent({
  name: 'App',
  setup() {

    const router = useRouter()
    const route = useRoute()
    const activeIndex = computed(() => route.name)

    const handleSelect = (key: string) => router.push({name: key, params: {id: 3}})

    return {activeIndex, handleSelect}
  }
})
</script>

<style>

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.el-header {
  --el-header-padding: 0;
}

.common-layout > .el-container {
  min-height: 100vh;
}

.footer{
  background-color: #c71313;
  display: flex;
  justify-content: center;
  align-items: center;
  color: aliceblue;
  font-size: 40px;
}

.el-menu-demo {
  padding: 0 20px;
  justify-content: flex-end;
}

body {
  margin: 0;
}

.main {
  overflow: auto;
  height: calc(100vh - 120px);
}
</style>
