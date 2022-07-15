<template>
  <div>
    <!-- 评论列表 -->
    <div class="cmt-list"
         :class="isShowCmtInput?'art-cmt-container-1':'art-cmt-container-2'">
      <van-list v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
                :immediate-check="false">

        <!-- 评论的 Item 项 -->
        <div class="cmt-item"
             v-for="obj in commentArr"
             :key="obj.com_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="obj.aut_photo"
                   alt=""
                   class="avatar">
              <span class="uname">{{obj.aut_name}}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon name="like"
                        size="16"
                        color="red"
                        v-if="obj.is_liking === true"
                        @click="likeFn(true,obj)" />
              <van-icon name="like-o"
                        size="16"
                        color="gray"
                        v-else
                        @click="likeFn(false,obj)" />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            {{obj.content}}
          </div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{timeAgo(obj.pubdate)}}</div>
        </div>
      </van-list>

    </div>
    <!-- 发表评论 -->
    <div>
      <!-- 底部添加评论区域 - 1 -->
      <div class="add-cmt-box van-hairline--top"
           v-if="isShowCmtInput===true">
        <van-icon name="arrow-left"
                  size="0.48rem"
                  @click="$router.back()" />
        <div class="ipt-cmt-div"
             @click="toggleShowFn">发表评论</div>
        <div class="icon-box">
          <van-badge :content="totalCount===0 ?'':totalCount"
                     max="99">
            <van-icon name="comment-o"
                      size="0.53333334rem"
                      @click="commentClickFn" />
          </van-badge>
          <div>
            <!-- 收藏 -->
            <van-icon name="star"
                      size="0.53333334rem"
                      @click="collected()"
                      v-if="iscollected===true" />
            <!-- 未收藏 -->
            <van-icon name="star-o"
                      size="0.53333334rem"
                      @click="collected()"
                      v-else />

          </div>
          <van-icon name="share-o"
                    size="0.53333334rem" />
        </div>
      </div>

      <!-- 底部添加评论区域 - 2 -->
      <div class="cmt-box van-hairline--top"
           v-else>
        <textarea placeholder="友善评论、理性发言、阳光心灵"
                  v-fofo
                  @blur="blurFn"
                  v-model="comText"></textarea>
        <van-button type="default"
                    :disabled="this.comText==='' ? true:false"
                    @click="sendFn">发布</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { detailAPI, commentListAPI, commentDisLikingAPI, commentLikingAPI, sendCommentAPI, collectionAPI, uncollectionAPI } from '@/api'
import { timeAgo } from '@/utils/date.js'
export default {
  data () {
    return {
      offset: null,
      commentArr: [], // 评论列表
      isShowCmtInput: true, // 底部显示高低控制
      totalCount: 0, // 评论的总数
      comText: '', // 发布评论内容
      loading: false,
      finished: false,
      lastId: null, // 分页
      iscollected: ''
    }
  },
  async created () {
    this.getCommentListFn()
    const res = await detailAPI({
      artId: this.$route.query.art_id
    })
    this.iscollected = res.data.data.is_collected
    console.log('iscollected的值', this.iscollected)
  },
  methods: {
    // 获取评论列表的数据
    async getCommentListFn () {
      const res = await commentListAPI({
        artId: this.$route.query.art_id
      })
      console.log('评论列表数据', res)
      this.commentArr = res.data.data.results
      this.totalCount = res.data.data.total_count
      this.lastId = res.data.data.last_id
    },
    // 时间截止
    timeAgo,
    // 喜欢评论取消喜欢评论
    async likeFn (bool, obj) {
      if (bool === true) {
        // 用户点在了红心上
        // 显示->灰色的心
        obj.is_liking = false
        await commentDisLikingAPI({
          comId: obj.com_id
        })
      } else {
        // 用户点在了灰心上
        obj.is_liking = true
        await commentLikingAPI({
          comId: obj.com_id
        })
      }
    },
    // 显示评论输入框
    toggleShowFn () {
      this.isShowCmtInput = false
    },
    // 评论按钮的点击事件----滑动到第一条评论
    commentClickFn () {
      // 设置  window.scrollTo(x, y)
      const articleHeight = document.querySelector('.article-container').scrollHeight
      console.log('文章高度', articleHeight)
      window.scrollTo(0, articleHeight - 100)
    },
    // 发布按钮---点击事件
    async sendFn () {
      console.log(this.comText)
      // 把评论加入到列表里
      const res = await sendCommentAPI({
        id: this.$route.query.art_id,
        content: this.comText
      })
      console.log(res)
      this.commentArr.unshift(res.data.data.new_obj)
      this.totalCount++
      this.comText = ''
    },
    // 输入框--失去焦点
    blurFn () {
      setTimeout(() => {
        this.isShowCmtInput = true
      }, 0)
    },
    // 加载更多
    async onLoad () {
      if (this.commentArr.length > 0) {
        const res = await commentListAPI({
          artId: this.$route.query.art_id,
          offset: this.lastId
        })
        console.log(res)
        this.commentArr = [...this.commentArr, ...res.data.data.results]
        this.totalCount = res.data.data.total_count
        this.lastId = res.data.data.last_id
        if (res.data.data.last_id === null) {
          // 没有下一页了
          this.finished = true
        }
        this.loading = false
      } else {
        this.loading = false
      }
    },
    // 收藏取消收藏
    async collected () {
      if (this.iscollected !== true) { // 收藏
        this.iscollected = true
        const res = await collectionAPI({
          artId: this.$route.query.art_id
        })
        console.log(res)
      } else {
        this.iscollected = false
        const res = await uncollectionAPI({
          artId: this.$route.query.art_id
        })
        console.log(res)
      }
    }
  }

}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
