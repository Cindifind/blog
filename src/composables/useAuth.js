// src/composables/useAuth.js
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'

/**
 * Vue 3 Composition API 风格的 Auth Composable
 * 提供登录、登出、状态管理等功能
 * 使用方式：const { isLoggedIn, login, logout, userInfo, token } = useAuth()
 */

// ✅ 对外暴露一个统一的 useAuth() 函数
export function useAuth() {
    // 获取路由实例
    const router = useRouter()

    // 使用用户 store
    const userStore = useUserStore()

    // 计算属性：是否已登录
    const isLoggedIn = computed(() => userStore.isLoggedIn)

    // 🔐 登录函数
    const login = async (email, password) => {
        try {
            // 请求真实API
            const response = await fetch('http://luren.online:2345/proxy/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    email,
                    password,
                }),
            })

            const data = await response.json()

            if (data.code === 200) {
                const userData = data.data // 假设后端返回 { code: 200, data: { token, ...userInfo } }

                // 更新 store 中的用户信息
                userStore.setUserInfo(userData)

                // 显示成功消息并跳转
                ElMessage.success('登录成功')
                router.push('/')

                return { success: true, data: userData }
            } else {
                ElMessage.error(data.message || '登录失败')
                return { success: false, message: data.message || '登录失败' }
            }
        } catch (error) {
            console.error('登录请求出错:', error)
            ElMessage.error('登录过程中发生错误')
            return { success: false, message: '登录过程中发生错误' }
        }
    }

    // 🚪 退出登录
    const logout = () => {
        userStore.clearUserInfo()

        // 显示成功消息
        ElMessage.success('已退出登录')
        console.log('用户已登出')
    }

    // ✅ 可以继续添加：注册、发送验证码、重置密码等方法...

    // 返回状态与方法
    return {
        token: userStore.token,         // 当前 token（响应式）
        userInfo: userStore.userInfo,   // 当前用户信息（响应式）
        isLoggedIn,                     // 是否已登录（计算属性）
        login,                          // 登录方法
        logout,                         // 退出登录方法
    }
}
