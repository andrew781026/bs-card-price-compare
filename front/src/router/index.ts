import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'main',
        component: () => import('../views/MainView.vue'),
        meta: {title: '首頁'}
    },
    {
        path: '/search/:id',
        name: 'search',
        component: () => import('../views/SearchView.vue'),
        meta: {title: '查詢頁面'}
    },
    {
        path: '/plugin/:id',
        name: 'plugin',
        component: () => import('../views/PluginView.vue'),
        meta: {title: '插件頁-用於多查某些網站'}
    },
    {
        path: '/exchange/:id',
        name: 'exchange',
        component: () => import('../views/ExchangeView.vue'),
        meta: {title: '匯率頁'}
    },
    {
        path: '/404',
        name: '404',
        component: () => import('../views/PageNotFound.vue'),
        meta: {title: '404'}
    },
    {
        path: '/:pathMatch(.*)*', // for other not matched path
        redirect: to => ({name: '404'})
    },
]

const router = createRouter({
    history: createWebHistory('/istaging-interview/'),
    routes
})

router.beforeEach((to, from, next) => {
    // TypeGuard
    if (typeof to.meta.title === 'string') {
        window.document.title = to.meta.title
    }
    next()
})

export default router
