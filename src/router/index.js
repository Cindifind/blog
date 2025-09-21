import {createRouter, createWebHistory} from 'vue-router'

// 导入页面组件
import IndexPage from '../views/index.vue'

// 定义路由规则
const routes = [
    {
        path: '/',
        name: 'Home',
        component: IndexPage
    },
    // 登录页面路由
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/login.vue')
    },
    {
        path: '/api',
        name: 'Api',
        component: () => import('../views/api.vue')
    }
    // // 博客页面路由
    // {
    //   path: '/blog',
    //   name: 'Blog',
    //   // 懒加载组件
    //   component: () => import('../views/blog.vue')
    // },
    // // 留言页面路由
    // {
    //   path: '/message',
    //   name: 'Message',
    //   component: () => import('../views/message.vue')
    // },
    // // API页面路由
    // // 关于页面路由
    // {
    //   path: '/about',
    //   name: 'About',
    //   component: () => import('../views/about.vue')
    // },
    // // 404页面路由
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'NotFound',
    //   component: () => import('../views/404.vue')
    // }
]

// 创建路由器实例
const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由导航守卫 - 用于保护需要登录的路由
router.beforeEach((to, from, next) => {
    // 检查是否需要登录的路由
    const requiresAuth = false; // 这里可以根据需要设置需要登录的路由
    const isLoggedIn = !!localStorage.getItem('userToken');

    if (requiresAuth && !isLoggedIn) {
        // 如果需要登录但用户未登录，重定向到登录页
        next('/login');
    } else {
        // 其他情况正常通过
        next();
    }
})

export default router