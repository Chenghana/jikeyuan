import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/token'
// import Login from '@/views/Login'
// import Layout from '@/views/Layout'
// import Home from '@/views/Home'
// import User from '@/views/User'
// import Search from '@/views/Search'
// import SearchResult from '@/views/Search/SearchResult.vue'
// import ArticleDetail from '@/views/ArticleDetail'
// import UserEdit from '@/views/User/UserEdit.vue'
// import Chat from '@/views/Chat/index.vue'
Vue.use(VueRouter)
// 路由懒加载：为了让第一个页面，加载的app.js小一点，打开网页快一点
// 把组件对应的js，分成若干个js，路由切换到哪个页面，才去加载对应的.js文件
// 原因:webpack分析入口时，发现router里上来就import所有页面，所以直接打包进app.js---很大
// 解决：当路由路径匹配规则是，才现去引入import映入对应的js文件
const routes = [
  {
    path: '/',
    redirect: '/layout/home'
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login'),
    beforeEnter: (to, from, next) => {
      // ...
      // 如果已经登录了不能切换到登录页面
      if (getToken()?.length > 0 && to.path === '/login') {
        next(false)
      } else {
        next()
      }
    }
  },
  {
    path: '/layout',
    component: () => import(/* webpackChunkName: "layout" */ '@/views/Layout'),
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home')
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName: "user" */ '@/views/User')
      }
    ]
  },
  { // 搜索
    path: '/search',
    component: () => import(/* webpackChunkName: "search" */ '@/views/Search')
  },
  { // 搜索结果页
    path: '/search_result/:kw',
    component: () => import(/* webpackChunkName: "search_result" */ '@/views/Search/SearchResult.vue')
  },
  { // 文章详情
    path: '/detail',
    component: () => import(/* webpackChunkName: "detail" */ '@/views/ArticleDetail')
  },
  { // 用户编辑
    path: '/userEdit',
    component: () => import(/* webpackChunkName: "userEdit" */ '@/views/User/UserEdit.vue')
  },
  {
    // 聊天页面
    path: '/chat',
    component: () => import(/* webpackChunkName: "chat" */ '@/views/Chat/index.vue')
  }
]

const router = new VueRouter({
  routes
})
// 路由---全局前置守卫（在路由发生真正跳转之前，执行此函数）
// 此函数可以决定路由是否跳转、取消、强制中断切换到别的路由
router.beforeEach((to, from, next) => {
  // 如果已经登录了不能切换到登录页面
  if (getToken()?.length > 0 && to.path === '/login') {
    next(false)
  } else {
    next()
  }
})
export default router
