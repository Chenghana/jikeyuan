import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userPhoto: 'https://img0.baidu.com/it/u=1694074520,2517635995&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1657472400&t=3b8cee3f0f6a844e69f3b43dff3d8465', // 头像地址
    username: ''
  },
  getters: {},
  mutations: {
    // 编码风格，大写
    SET_USERPHOTO (state, value) {
      state.userPhoto = value
    },
    SET_USERNAME (state, value) {
      state.username = value
    }
  },
  actions: {},
  modules: {}
})
