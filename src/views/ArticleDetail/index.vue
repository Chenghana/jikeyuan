<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <van-loading color="#1989fa" class="loading" v-if="this.artOjb.title === undefined">文章疯狂加载ing...</van-loading>
    <div>
      <!-- 文章信息区域 -->
      <div class="article-container">
        <!-- 文章标题 -->
        <h1 class="art-title">{{ artOjb.title }}</h1>

        <!-- 用户信息 -->
        <van-cell center :title="artOjb.aut_name" label="3天前">
          <template #icon>
            <img :src="artOjb.aut_photo" alt="" class="avatar">
          </template>
          <template #default>
            <div>
              <van-button type="info" size="mini" v-if="artOjb.is_followed === true" @click="followedFn()">已关注
              </van-button>
              <van-button icon="plus" type="info" size="mini" plain v-else @click="followedFn()">关注</van-button>
            </div>
          </template>
        </van-cell>

        <!-- 分割线 -->
        <van-divider></van-divider>

        <!-- 文章内容 -->
        <div class="
                        art-content" v-html="artOjb.content">
        </div>

        <!-- 分割线 -->
        <van-divider>End</van-divider>

        <!-- 点赞 -->
        <div class="like-box">
          <van-button icon="good-job" type="danger" size="small" v-if="artOjb.attitude === 1" @click="likeFn(true)">已点赞
          </van-button>
          <van-button icon="good-job-o" type="danger" plain size="small" v-else @click="likeFn(false)">点赞</van-button>
        </div>
      </div>
      <!-- 文章评论评论组件 -->
      <div>
        <CommentList></CommentList>
      </div>
    </div>
  </div>
</template>

<script>
import { detailAPI, userFollowedAPI, userUnFollowedAPI, unlikeArticleAPI, likeArticleAPI } from '@/api'
import { timeAgo } from '@/utils/date.js'
import CommentList from './CommentList.vue'
export default {
  name: 'Detail',
  data () {
    return {
      artOjb: {},
      iscollected: ''
    }
  },
  async created () {
    const res = await detailAPI({
      artId: this.$route.query.art_id
    })
    console.log('文章详细数据', res)
    this.artOjb = res.data.data
    this.iscollected = res.data.data.is_collected
    console.log('是否收藏文章', this.iscollected)
    console.log('artObj', this.artOjb)
  },
  methods: {
    // 时间间隔
    formateDate: timeAgo,
    // 取关或者关注作者
    async followedFn () {
      this.artOjb.is_followed = !this.artOjb.is_followed
      if (this.artOjb.is_followed !== true) {
        const res = await userUnFollowedAPI({
          userId: this.artOjb.aut_id
        })
        console.log('userid', this.artOjb.aut_id)
        console.log('取关成功', res)
      } else {
        // 用户点击关注按钮
        // 业务--已关注
        // 调接口--关注
        // 页面-----显示已关注按钮
        const res = await userFollowedAPI({
          userId: this.artOjb.aut_id
        })
        console.log('userid', this.artOjb.aut_id)
        console.log('关注成功', res)
      }
    },
    // 点赞文章或取消点赞
    async likeFn (bool) {
      if (bool === true) {
        // 如果like === -1 则使喜欢状态改变为 - 1
        // 喜欢按钮变为
        this.artOjb.attitude = 0
        const res = await unlikeArticleAPI({
          artId: this.artOjb.art_id
        })
        console.log(res)
      } else {
        this.artOjb.attitude = 1
        const res = await likeArticleAPI({
          artId: this.artOjb.art_id
        })
        console.log(res)
      }
    }

  },
  components: {
    CommentList
  }
}
</script>

<style scoped lang="less">
.article-container {
  padding: 10px;
  margin-top: 46px;
}

.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;

  /deep/ img {
    width: 100%;
  }

  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;

  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}

.loading {
  margin-top: 50px;
  text-align: center;
}
</style>
