<template>
  <div>
    <!-- 关闭状态的导航 -->
    <div
        class="navgation"
        :class="isOpen ? 'navgation_open' : 'navgation_close'"
        id="navigationMenu"
    >
      <!-- 添加关闭按钮 -->
      <button
          class="close-button"
          @click="handleClose"
          v-if="isOpen"
      >
        &times;
      </button>
      <ul class="point">
        <li><router-link to="/">首页</router-link></li>
        <li><router-link to="/">博客</router-link></li>
        <li><router-link to="/">留言</router-link></li>
        <li><router-link to="/api">Api</router-link></li>
        <!-- 用户未登录时显示登录链接 -->
        <li v-if="!isLoggedIn" id="login-link">
          <router-link to="/login">登录</router-link>
        </li>

        <!-- 用户已登录时显示用户信息 -->
        <li v-else id="user-info-item" style="display: flex;">
          <div class="user-info">
            <img
                id="user-avatar"
                :src="userInfo?.imgUrl || defaultAvatar"
                :alt="userInfo?.name || '用户头像'"
                class="user-avatar"
                referrerPolicy="no-referrer"
                @error="handleImageError"
            >
            <span id="user-name" class="user-name">{{ userInfo?.name || '用户' }}</span>
            <button id="logout-btn" class="logout-btn" @click="handleLogout">退出</button>
          </div>
        </li>
      </ul>
      <div class="logo">
        <router-link to="/">Qingxi Mu</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth' // 导入 useAuth

// Props - 添加 isOpen prop
const props = defineProps({
  isOpen: Boolean,
  isLoggedIn: Boolean,
  userInfo: Object
})

// Emits
const emit = defineEmits(['logout', 'close'])

// 路由实例
const router = useRouter()

// 使用 useAuth composable
const { logout: authLogout } = useAuth()

// 响应式数据
const defaultAvatar = ref('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="%23cccccc"/><text x="12" y="16" font-size="12" text-anchor="middle" fill="%23666666">?</text></svg>')

// 方法
const handleImageError = (event) => {
  event.target.src = defaultAvatar.value
}

// 处理登出 - 使用 useAuth 中的登出方法
const handleLogout = () => {
  emit('logout')
}

// 添加关闭导航菜单的方法
const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
/* 从 index_style.css 提取的导航栏相关样式 */
@font-face {
  font-family: 'BarbaraHand';
  src: url('/font/barbarahand-webfont.eot');
  src: url('/font/barbarahand-webfont.eot?#iefix') format('embedded-opentype'),
  url('/font/barbarahand-webfont.woff2') format('woff2'),
  url('/font/barbarahand-webfont.woff') format('woff'),
  url('/font/barbarahand-webfont.ttf') format('truetype'),
  url('/font/barbarahand-webfont.svg#barbarahandregular') format('svg');
  font-weight: normal;
  font-style: normal;
}
.logo {
  font-size: 50px;
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 101;
  padding: 10px 50px;
}

.logo a {
  font-family: 'BarbaraHand', cursive; /* 添加后备字体 */
  color: #686967;
  text-decoration: none;
  font-weight: normal;
  font-style: normal;
}

/* 基础样式重置 */
* {
  padding: 0;
  margin: 0;
}

/* 基础样式重置 */
* {
  padding: 0;
  margin: 0;
}

ul li {
  list-style: none;
}

a, img {
  text-decoration: none;
  border: none;
}

/* 菜单按钮样式 */
.menu_close, .menu_open {
  position: fixed;
  z-index: 1;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  right: 55px;
  top: 40px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, .1);
  overflow: hidden;
  z-index: 102;
}

.menu_close:hover, .menu_open:hover {
  background: #6bc30d;
}

.menu_close span, .menu_open span {
  display: block;
  background: #FFF;
  width: 26px;
  height: 2px;
  line-height: 10px;
  margin: 0 auto;
  margin-top: 5px;
}

.menu_open span:first-child, .menu_open span:last-child, .menu_open span:nth-last-of-type(2) {
  -webkit-transform: rotate(0);
  transform: rotate(0);
  -webkit-transition: all .5s;
  -moz-transition: all .5s;
  -ms-transition: all .5s;
  -o-transition: all .5s;
  transition: all .5s;
}

.menu_close span:first-child {
  margin-top: 18px;
}

.menu_close span {
  margin-top: 0;
}

.menu_open span:first-child {
  margin-top: 12px;
}

.menu_close span:last-child {
  display: none;
}

.menu_close span:first-child {
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  -webkit-transition: all .5s;
  -moz-transition: all .5s;
  -ms-transition: all .5s;
  -o-transition: all .5s;
  transition: all .5s;
}

.menu_close span:nth-of-type(2) {
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  margin-top: -2px;
  -webkit-transition: all .5s;
  -moz-transition: all .5s;
  -ms-transition: all .5s;
  -o-transition: all .5s;
  transition: all .5s;
}

.hover_animation {
  -webkit-transition: all .5s;
  -moz-transition: all .5s;
  -ms-transition: all .5s;
  -o-transition: all .5s;
  transition: all .5s;
}

/* 导航栏主体样式 */
.navgation, .navgation_close, .navgation_open {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 101;
}

.navgation_close {
  height: 0;
}

.navgation_open {
  background: rgba(0, 0, 0, .6);
}

.navgation:before, .navgation_close:before, .navgation_open:before {
  content: '';
  width: 60%;
  height: 100%;
  background: #fff;
  position: fixed;
  -webkit-transition: all .5s cubic-bezier(.19, 1, .22, 1);
  -moz-transition: all .5s cubic-bezier(.19, 1, .22, 1);
  -o-transition: all .5s cubic-bezier(.19, 1, .22, 1);
  transition: all .5s cubic-bezier(.19, 1, .22, 1);
  -webkit-transform: translateZ(0) translateX(45%) skew(-12deg);
  -moz-transform: translateZ(0) translateX(45%) skew(-12deg);
  -ms-transform: translateZ(0) translateX(45%) skew(-12deg);
  -o-transform: translateZ(0) translateX(45%) skew(-12deg);
  transform: translateZ(0) translateX(45%) skew(-12deg);
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  -o-backface-visibility: hidden;
  backface-visibility: hidden;
  content: '';
  top: 0;
  z-index: 11;
  background-color: #fff;
  background-image: -webkit-linear-gradient(46deg, #fff, #f1f2f0);
  background-image: -moz-linear-gradient(46deg, #fff, #f1f2f0);
  background-image: -o-linear-gradient(46deg, #fff, #f1f2f0);
  background-image: linear-gradient(46deg, #fff, #f1f2f0);
}

.navgation_open:before {
  right: 0;
}

.navgation_close:before {
  right: -60%;
}

/* 导航链接列表样式 */
.point {
  position: absolute;
  right: 0;
  top: 200px;
  z-index: 101;
  font-size: 20px;
}

.point li {
  display: block;
  text-align: right;
  line-height: 80px;
}

.point li a {
  font-family: "Microsoft YaHei";
  color: #686967;
  display: inline-block;
  line-height: 46px;
  padding: 10px 50px;
  font-size: 20px;
  color: #686967;
  text-decoration: none;
  -webkit-transition: color .6s linear;
  transition: color .6s linear;
  position: relative;
}

.point li a:before {
  -webkit-transition: all .3s linear;
  transition: all .3s linear;
  content: '';
  height: 1px;
  background-color: transparent;
  position: absolute;
  top: 50%;
  left: 15px;
  right: 105px;
}

.point li a:hover {
  color: #6bc30d;
}

.point li a:hover:before {
  background-color: #6bc30d;
  right: 15px;
}

.navgation_open .point {
  display: block;
}

.navgation_close .point {
  display: none;
}

/* Logo 样式 */
.logo {
  font-size: 50px;
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 101;
  padding: 10px 50px;
}

.logo a {
  font-family: BarbaraHand;
  color: #686967;
  text-decoration: none;
}

.navgation_open .logo {
  display: block;
}

.navgation_close .logo {
  display: none;
}

/* 用户信息样式 */
.user-info {
  display: flex !important;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  margin: 5px 10px;
}

.user-avatar {
  width: 25px !important;
  height: 25px !important;
  border-radius: 50%;
  border: 1px solid #fff;
  display: block !important;
  object-fit: cover;
}

.user-name {
  font-family: "Microsoft YaHei", serif;
  color: #686967;
  font-size: 20px;
}

.logout-btn {
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 2px 8px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 12px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .navgation:before, .navgation_open:before, .navgation_close:before {
    width: 50%;
    transform: none;
    -webkit-transform: none;
  }

  .logo {
    width: 50%;
    padding: 0;
    text-align: center;
  }
}

/* 添加关闭按钮样式 */
.close-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background: transparent;
  border: none;
  font-size: 30px;
  color: #686967;
  cursor: pointer;
  z-index: 103;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-button:hover {
  background-color: rgba(107, 195, 13, 0.1);
  color: #6bc30d;
}
</style>
