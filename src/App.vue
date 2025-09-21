

<template>
  <div id="app">

    <!-- 使用router-view组件让路由生效 -->
    <router-view />
    <!-- 天气小部件 -->
    <WeatherWidget />
    <div id="gui-MusicPlayer"
         data-themeColor="gui-girlPink"
         data-localMusic="http://luren.online:2345/proxy/music"
         data-fadeOutAutoplay>
    </div>
  </div>
  <Footer />

</template>
<script setup>import { ref, provide } from 'vue'
import WeatherWidget from "./components/WeatherWidget.vue";
import Footer from "./components/Footer.vue";

// 全局导航状态
const isNavigationOpen = ref(false)

const toggleNavigation = () => {
  isNavigationOpen.value = !isNavigationOpen.value
}

const closeNavigation = () => {
  isNavigationOpen.value = false
}

const openNavigation = () => {
  isNavigationOpen.value = true
}

// 提供给所有子组件
provide('globalNavigation', {
  isOpen: isNavigationOpen,
  toggle: toggleNavigation,
  close: closeNavigation,
  open: openNavigation
})
</script>
<style scoped>
/* 全局重置样式已在index.css中定义 */
</style>