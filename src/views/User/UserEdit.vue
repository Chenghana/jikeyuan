<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="userPlile.photo" @click="imageClickFn" />
          <!-- file 选择框 -->
          <input type="file" ref="iptFile" v-show="false" accept="image/*" @change="onFileChange" />
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="userPlile.name" @click="nameClickFn" />
      <van-cell title="生日" is-link :value="userPlile.birthday" @click="timeClickFn" />
    </van-cell-group>
    <!-- 姓名修改的弹窗 -->
    <van-dialog v-model="show" title="标题" show-cancel-button :before-close="beforeCloseFn">
      <input type="text" v-model="inputUserName" v-fofo>
    </van-dialog>
    <!-- 时间底部弹出层 -->
    <van-popup v-model="showTime" position="bottom" :style="{ height: '30%' }" round>
      <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate"
        @cancel="dateCancelFn" @confirm="confirmFn" />
    </van-popup>

  </div>
</template>

<script>
import { userinfo, unserInfoPhotoAPI, updateProfileAPI } from '@/api'
import { MyNotify } from '@/ui/Notift.js'
import { formatDate } from '@/utils/date.js'
import { mapMutations } from 'vuex'
export default {
  name: 'UserEdit',
  data () {
    return {
      userPlile: [],
      show: false, // 默认为隐藏
      showTime: false, // 展示时间
      inputUserName: '', // 修改名字的值
      minDate: new Date(1920, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(2000, 0, 1)
    }
  },
  async created () {
    const res = await userinfo()
    console.log(res)
    this.userPlile = res.data.data
  },
  methods: {
    ...mapMutations(['SET_USERPHOTO', 'SET_USERNAME']),

    // 文件改变
    async onFileChange (e) {
      console.log(e.target.files[0]) // 用户选中的文件对象
      // 创建formdata对象
      const theFd = new FormData()
      theFd.append('photo', e.target.files[0])
      const res = await unserInfoPhotoAPI(theFd)
      console.log(res)
      this.userPlile.photo = res.data.data.photo
      this.SET_USERPHOTO(res.data.data.photo)
    },
    // 图片的点击事件
    imageClickFn () {
      this.$refs.iptFile.click()
    },
    // 姓名点击事件
    nameClickFn () {
      this.show = true
      this.inputUserName = this.userPlile.name
      this.SET_USERNAME = this.inputUserName
    },
    // 姓名---确认框---关闭前回调函数
    async beforeCloseFn (action, done) {
      console.log(action)
      if (action === 'confirm') {
        //  点击了确定
        const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/
        if (reg.test(this.inputUserName) === true) {
          // 通过校验
          await updateProfileAPI({
            name: this.inputUserName
          })
          this.userPlile.name = this.inputUserName
          done()
        } else {
          MyNotify({ type: 'warning', message: '用户名只能是1-7位' })
          done(false)
        }
      } else {
        // 点击了取消
        done()
      }
    },
    // 时间---底部弹出层
    timeClickFn () {
      this.showTime = true
      this.currentDate = new Date(this.userPlile.birthday)
    },
    // 取消时间选择
    dateCancelFn () {
      this.showTime = false
    },
    async confirmFn () {
      this.showTime = false
      await updateProfileAPI({
        birthday: formatDate(this.currentDate)
      })
      this.userPlile.birthday = formatDate(this.currentDate) // 单元格同步
      this.showTime = false
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;

  .avatar {
    width: 50px;
    height: 50px;
  }
}

/deep/.van-dialog__content {
  text-align: center;

  input {
    padding: 0;
    outline: none;
    border: none;
    text-align: center;
  }
}
</style>
