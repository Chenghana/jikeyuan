<template>
  <div>
    <!-- 头部导航 -->
    <van-nav-bar fixed>
      <template #left>
        集客头条
      </template>
      <template #right>
        <!-- 首页-放大镜搜索页面 -->
        <van-icon name="search"
                  size="0.48rem"
                  color="#fff"
                  @click="moveSearchPageFn" />
      </template>
    </van-nav-bar>
    <!-- tab栏导航 -->
    <div class="tab1">
      <van-tabs v-model="active"
                animated
                offset-top="1.226667rem"
                sticky>
        <van-tab :title="item.name"
                 v-for="item in userChannelList"
                 :key="item.id"
                 :name="item.id">
          <ArticleList :channel_id="active"></ArticleList>
        </van-tab>
      </van-tabs>
      <van-icon name="plus"
                size="0.37333334rem"
                class="moreChannels"
                @click="showPopup" />
    </div>
    <!-- 频道弹出层 -->
    <van-popup v-model="show"
               get-container="body"
               class="channelPopup">
      <ChannelEdit :userList="userChannelList"
                   :unCheckList="unCheckChannelList"
                   @addChannelEv="addChannelFn"
                   @removeChannelEV="removeChannelFn"
                   @colseEV="colseFn"
                   v-model="active"></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannelsAPI, getAllArticleListAPI, getAllChannelsAPI, updateChannelsAPI, removeTheChannelAPI } from '@/api'
import ArticleList from './components/ArticleList.vue'
import ChannelEdit from './ChannelEdit.vue'
export default {
  data () {
    return {
      active: 0, // tab导航-激活索引
      userChannelList: [], // 用户选择频道列表
      allChannelList: [], // 所有频道列表
      // artcleList: [] // 文章列表
      show: false
    }
  },
  async created () {
    // 调用获取用户频道的API
    const res = await getUserChannelsAPI()
    console.log(res)
    this.userChannelList = res.data.data.channels
    // this.channelChangeFn()

    // 所有列表频道
    const res2 = await getAllChannelsAPI()
    console.log('res2', res2)
    this.allChannelList = res2.data.data.channels
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  methods: {
    // 加号的点击方法
    showPopup () {
      this.show = true
    },
    //  tabs切换的事件
    async channelChangeFn () {
      // 调用获取文章新闻推荐
      const res1 = await getAllArticleListAPI({
        channel_id: this.active,
        timestamp: (new Date()).getTime()
      })
      console.log(res1)
      this.artcleList = res1.data.data.results
    },
    // 添加频道 子传父 通过this.$emit
    async addChannelFn (channelObj) {
      this.userChannelList.push(channelObj)

      const newArr = this.userChannelList.filter(obj => obj.id !== 0)
      const theNewArr = newArr.map((obj, index) => {
        const newObj = { ...obj } // 浅拷贝
        delete newObj.name
        return newObj
      })
      // 把最新的数组发送给后台
      const res = await updateChannelsAPI({
        channels: theNewArr
      })
      console.log(res)
    },
    // 删除频道
    async removeChannelFn (channelObj) {
      const index = this.userChannelList.findIndex(obj => obj.id === channelObj.id)
      this.userChannelList.splice(index, 1)
      const res = await removeTheChannelAPI({
        channelId: channelObj.id
      })
      console.log(res)
    },
    // 关闭弹出层
    colseFn () {
      this.show = false
    },
    // 首页-放大镜搜索页面
    moveSearchPageFn () {
      this.$router.push('/search')
    }
  },
  computed: {
    // 筛选出更多频道
    unCheckChannelList () {
      const newArr = this.allChannelList.filter(bigObj => {
        const index = this.userChannelList.findIndex(samllObj => {
          return samllObj.id === bigObj.id
        })
        if (index > -1) {
          return false
        } else {
          return true
        }
      })
      return newArr
    }
  }

}
</script>
<style scoped lang='less'>
.tab1 {
  padding-top: 46px;
}
// 设置 tabs 容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}
.channelPopup {
  // vw vh 是css3新出的单位，参考的是浏览器参考的百分比
  width: 100vw;
  height: 100vh;
}
</style>
