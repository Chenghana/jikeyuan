<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" offset="50"
        :immediate-check="false">
        <article-item v-for="item in list" :key="item.art_id" :artObj="item" @disLikeEV="disLikeFn" @reportEV="reprotFn"
          @click.native="itemClickFn(item.art_id)"></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '../../../components/ArticleItem.vue'
import { getAllArticleListAPI, dislikeArticleAPI, reportArticleAPI } from '@/api'
import { MyNotify } from '@/ui/Notift.js'

export default {
  name: 'ArticleList',
  props: {
    // list: Array, // 文章
    channel_id: Number
  },
  data () {
    return {
      list: [],
      loading: false, // 底部加载状态
      finished: false, // 数据是否全部加载完成
      theTime: new Date().getTime,
      isLoading: false // 顶部加载状态

    }
  },
  components: {
    ArticleItem
  },
  async created () {
    this.getArticleList()
  },
  methods: {
    // 专门发请求的方法
    async getArticleList () {
      const res = await getAllArticleListAPI({
        channel_id: this.channel_id,
        timestamp: this.theTime
      })
      console.log(res)
      this.list = [...this.list, ...res.data.data.results]
      this.theTime = res.data.data.pre_timestamp
      this.loading = false
      if (res.data.data.pre_timestamp === null) {
        this.finished = true
      }
      // 顶部加载状态为false
      this.isLoading = false
    },
    // 底部，上拉加载
    async onLoad () {
      if (this.list.length === 0) return
      this.getArticleList()
    },
    async onRefresh () {
      this.list = []
      this.theTime = new Date().getTime()
      this.getArticleList()
    },
    // 反馈-不感兴趣
    async disLikeFn (id) {
      try {
        await dislikeArticleAPI({ artId: id })
        MyNotify({ type: 'success', message: '反馈成功' })
      } catch (error) {

      }
    },
    // 反馈垃圾内容
    async reprotFn (id, value) {
      await reportArticleAPI({
        artId: id,
        type: value
      })
      MyNotify({ type: 'success', message: '举报成功' })
    },
    itemClickFn (id) {
      this.$router.push({
        path: `/detail?art_id=${id}`
      })
    }
  }
}
</script>
<style scoped lang='less'>
</style>
