<template>
  <div>
    <!-- 无需缓存使用exclude -->
    <keep-alive exclude="Search,SearchResult,Detail,UserEdit">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
// import { getAllChannelsAPI } from '@/api'
export default {
  // async created () {
  //   // trycatch 用来捕获同步代码的错误
  //   try {
  //     const res = await getAllChannelsAPI()
  //     console.log(res)
  //   } catch (res) {
  //     console.dir(res)
  //   }
  // }

}
</script>
<style scoped lang='less'>
</style>
