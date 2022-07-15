import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
import directiveObj from '@/utils/directive'
import 'highlight.js/styles/default.css' // 代码高亮的样式
import './VueComponent.js' // 单独分离成一个js文件
Vue.config.productionTip = false

// 执行目标对象里install 方法并传入Vue类
Vue.use(directiveObj)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
