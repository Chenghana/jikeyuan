<template>
  <div>
    <!-- 一条文章单元格 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ artObj.title }}</span>
          <!-- 单图 -->
          <img v-if="artObj.cover.type === 1" class="thumb" alt="" v-lazy="artObj.cover.images[0]">
        </div>
        <!-- 多图 -->
        <div class="thumb-box" v-if="artObj.cover.type > 1">
          <img class="thumb" v-for="(imgUrl, index) in artObj.cover.images" :key="index" :src="imgUrl" alt="">

        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{ artObj.aut_name }}</span>
            <span>{{ artObj.comm_count }}评论</span>
            <span>{{ formatTime(artObj.pubdate) }}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross" @click.stop="show = true" v-if="isShow" />
        </div>
      </template>
    </van-cell>
    <!-- 反馈面板 -->
    <van-action-sheet v-model="show" :actions="actions" @select="onSelect" @cancel="cancelFn" get-container="body"
      :cancel-text="bottomText" @close="closeFn" />
  </div>
</template>

<script>
import { timeAgo } from '@/utils/date.js'
import { firstActions, secondActions } from '@/api/report.js'
export default {
  props: {
    artObj: Object, // 文章的对象
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      show: false, // 反馈面板显示与隐藏
      actions: firstActions, // 反馈面板选项的数组
      bottomText: '取消'
    }
  },
  methods: {
    formatTime: timeAgo,
    // 反馈面板--选择选择事件
    onSelect (action, index) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      console.log(action, index)
      if (action.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.bottomText = '返回'
      } else if (action.name === '不感兴趣') {
        this.$emit('disLikeEV', this.artObj.art_id)
        // 无论成功或失败，都会隐藏
        this.show = false
      } else {
        this.$emit('reportEV', this.artObj.art_id, action.value)
      }
    },
    cancelFn () {
      if (this.bottomText === '返回') {
        this.show = true
        this.actions = firstActions
        this.bottomText = '取消'
      }
    },
    // 关闭面板触发事件
    closeFn () {
      this.actions = firstActions
      this.bottomText = '取消'
    }
  }

}
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;

  &:first-child {
    margin-left: 0;
  }
}

/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
