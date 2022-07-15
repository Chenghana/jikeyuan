<template>
  <div>
    <van-nav-bar title="头条登录" />
    <van-form @submit="onSubmit">
      <van-field required v-model="user.mobile" name="mobile" label="手机号" placeholder="请输入手机号"
        :rules="[{ required: true, message: '请输入11位手机号', pattern: /^1[3456789]\d{9}$/ }]" />
      <van-field required v-model="user.code" type="password" name="code" label="密码" placeholder="密码请输入6位"
        :rules="[{ required: true, message: '请填写密码', pattern: /^\d{6}$/ }]" />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit" :loading="isLoading" loading-text="加载中..."
          :disabled="isLoading">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { loginAPI } from '@/api'
import { MyNotify } from '@/ui/Notift'
import { setToken } from '@/utils/token.js'
import { setStorage } from '@/utils/storage.js'
export default {
  data () {
    return {
      user: {
        mobile: '',
        code: '' // 密码 246810 后台规定
      },
      isLoading: false // 登录按钮的加载状态
    }
  },
  methods: {
    async onSubmit () {
      this.isLoading = true
      try {
        const res = await loginAPI(this.user)
        console.log(res)
        MyNotify({ type: 'success ', message: '登录成功' })
        setToken(res.data.data.token)
        setStorage('refresh_token', res.data.data.refresh_token)
        // 跳转一定写在最后，而且尽量要延迟操作
        this.$router.replace({
          path: this.$route.query.path || 'layout/home'
        })
      } catch (error) {
        MyNotify({ type: 'danger', message: '账号或密码错误' })
        console.dir(error)
      }
      this.isLoading = false
    }

  }
}
</script>
<style scoped lang='less'>
// .van-nav-bar{
//   background-color: #007bff;
// }
//  .nav-bar-title-text-color{
//     color:white ;
//   }
</style>
