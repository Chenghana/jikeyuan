<!--
* @description  参数1
* @fileName  index
* @author userName
* @date 2022-06-20 16:48:41
* @version V1.0.0
!-->
<template>
  <div>
    <div class="home_container">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <van-tabbar v-model="active">
      <van-tabbar-item to="/layout/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/layout/user" icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>

  </div>
</template>

<script>
export default {
  name: 'Layout',
  props: { // 父辈向子辈传参
  },
  data () {
    return {
      active: 0
    }
  },
  created () { // 实例被创建之后执行代码

  },
  computed: { // 计算属性

  },
  components: { // 组件的引用

  },
  methods: { // 方法

  },
  mounted () { // 页面进入时加载内容

  },
  watch: { // 监测变化

  }
}
</script>
<style scoped lang='less'>
/* 内容底部内边距(把内容往上挤压, 防止内部被底部导航挡住) */
.home_container {
  padding-bottom: 50px;
}

/* 底部导航上边框 */
.van-tabbar {
  border-top: 1px solid #f8f8f8;
}
</style>
