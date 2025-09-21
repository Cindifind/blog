<!-- api.vue -->
<template>
  <div class="index-container">
    <!-- 菜单按钮 -->
    <div
        class="menu_open"
        id="menuButton"
        @click="toggleNavigation"
    >
      <span></span>
      <span></span>
      <span></span>
    </div>
    <!-- 导航菜单 -->
    <Navigation
        :is-open="isNavigationOpen"
        :is-logged-in="isLoggedIn"
        :user-info="userInfo"
        @logout="handleLogout"
        @close="toggleNavigation"
    />

    <!-- 第一屏 - 背景轮播和统计信息 -->
    <BackgroundCarousel>
      <div class="content-area">
        <ApiStats />
      </div>
    </BackgroundCarousel>

    <!-- 其他内容可以放在这里 -->
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useAuth } from '../composables/useAuth'
import Navigation from '../components/Navigation.vue'
import BackgroundCarousel from '../components/BackgroundCarousel.vue'
import Footer from '../components/Footer.vue'
import ApiStats from '../components/ApiStats.vue'

//  使用 useAuth() composable
const { isLoggedIn, userInfo, login, logout } = useAuth()

// 注入全局导航状态
const globalNavigation = inject('globalNavigation')

// 使用全局状态代替局部状态
const isNavigationOpen = globalNavigation.isOpen

// 切换导航菜单
const toggleNavigation = () => {
  globalNavigation.toggle()
}

// 处理登出
const handleLogout = () => {
  logout()
}
</script>

<style scoped>
.index-container {
  display: flex;
  flex-direction: column;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  z-index: 10;
  position: relative;
}
</style>
