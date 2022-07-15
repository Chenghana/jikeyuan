<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon name="arrow-left" color="white" size="0.48rem" class="goback" @click="$router.back()" />
      <!-- 搜索组件 -->
      <van-search v-fofo v-model.trim="kw" placeholder="请输入搜索关键词" background="#007BFF" shape="round" @input="inputFn"
        @search="searchFn" />
    </div>
    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw.length !== 0">
      <div class="sugg-item" v-for="(str, index) in suggestList" :key="index" v-html="lightFn(str, kw)"
        @click="suggestClickFn(str)">
      </div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" />
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span class="history-item" v-for="(str, index) in history" :key="index" @click="historyClickFn(str)">{{ str
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { suggestListAPI } from '@/api/index.js'
import { getStorage, setStorage } from '@/utils/storage'
export default {
  name: 'Search',
  data () {
    return {
      kw: '', // 搜索关键字,
      timer: null, // 防抖计时器
      suggestList: [], // 联想建议列表文字的数组
      history: JSON.parse(getStorage('his')) || [] // 搜索历史
    }
  },
  methods: {
    // 输入框-当内容改变是触发事件方法
    inputFn () {
      if (this.kw.length === 0) {
        this.suggestList = []
      } else {
        clearTimeout(this.timer)
        this.timer = setTimeout(async () => {
          if (this.kw.length === 0) return
          console.log(this.kw)
          const res = await suggestListAPI({
            keywords: this.kw
          })
          console.log(res)
          this.suggestList = res.data.data.options
        }, 500)
      }
    },
    lightFn (originStr, target) {
      const reg = new RegExp(target, 'ig') // i忽略大小写，g全局拼配
      return originStr.replace(reg, (match) => {
        return `<span style="color: red">${match}</span>`
      })
    },
    moveFn (theKw) {
      // 跳转之前存储数据，存储到本地
      // 跳转到搜索页面
      setTimeout(() => {
        if (theKw.length > 0) {
          this.$router.push({
            path: `/search_result/${theKw}`
          })
        }
      }, 0)
    },
    // 输入框搜索事件
    searchFn () {
      if (this.Kw.length > 0) {
        this.history.push(this.kw)
        this.moveFn(this.kw)
      }
    },
    // 联想菜单--点击事件
    suggestClickFn (str) {
      this.history.push(str)
      this.moveFn(str)
    },
    // 历史记录跳转
    historyClickFn (str) {
      this.moveFn(str)
    }
  },
  watch: {
    history: {
      deep: true,
      handler () {
        const theSet = new Set(this.history)
        const arr = Array.from(theSet)
        setStorage('his', JSON.stringify(arr))
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;

  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }

  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}

/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;

  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
