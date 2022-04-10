<template>
  <div class="common-layout">
    <el-container>
      <el-header>
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
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-container>
          <el-main>
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component"/>
              </transition>
            </router-view>
          </el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import {ref, defineComponent} from 'vue'
import {useRouter, Router} from 'vue-router'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

export default defineComponent({
  name: 'App',
  setup() {

    const router = useRouter()
    const activeIndex = ref('main')

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

.el-menu-demo {
  padding: 0 20px;
  justify-content: flex-end;
}

body {
  margin: 0;
}
</style>
