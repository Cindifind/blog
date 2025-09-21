// src/stores/user.js
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// 从 localStorage 获取 token（辅助函数）
function getSavedToken() {
    return localStorage.getItem('userToken')
}

// 从 localStorage 获取用户信息（辅助函数）
function getSavedUserInfo() {
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
        try {
            return JSON.parse(userInfoStr)
        } catch (e) {
            console.error('解析用户信息失败', e)
            return null
        }
    }
    return null
}

export const useUserStore = defineStore('user', () => {
    // 响应式数据
    const token = ref(getSavedToken())
    const userInfo = ref(getSavedUserInfo())

    // 计算属性：是否已登录
    const isLoggedIn = computed(() => !!token.value)

    // 更新用户信息
    function setUserInfo(data) {
        const userToken = data.token
        const userInformation = data

        // 更新状态
        token.value = userToken
        userInfo.value = userInformation

        // 保存到 localStorage
        localStorage.setItem('userToken', userToken)
        localStorage.setItem('userInfo', JSON.stringify(userInformation))
    }

    // 清除用户信息
    function clearUserInfo() {
        token.value = null
        userInfo.value = null
        localStorage.removeItem('userToken')
        localStorage.removeItem('userInfo')
    }

    return {
        token,
        userInfo,
        isLoggedIn,
        setUserInfo,
        clearUserInfo
    }
})
