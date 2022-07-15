<!--
* @description  参数1
* @fileName  index
* @author userName
* @date 2022-06-20 16:32:37
* @version V1.0.0
!-->

  <template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="$store.state.userPhoto" alt="" class="avatar">
        </template>
        <template #title>
          <span class="username">{{ $store.state.username }}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{ userProfile.art_count }}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{ userProfile.follow_count }}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{ userProfile.fans_count }}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link to="/userEdit" />
      <van-cell icon="chat-o" title="小思同学" is-link to="/Chat" />
      <van-cell icon="warning-o" title="退出登录" @click="quitFn" is-link />
    </van-cell-group>
  </div>
</template>

<script>
import { userProfileAPI } from '@/api/index.js'
import { Dialog } from 'vant'
import { removeToken } from '@/utils/token.js'
import { mapMutations } from 'vuex'
export default {
  name: 'index',
  data () {
    return {
      userProfile: []
    }
  },
  async created () { // 实例被创建之后执行代码
    const res = await userProfileAPI()
    console.log('用户信息', res)
    this.userProfile = res.data.data
    console.log(' this.userProfile', this.userProfile)
    this.SET_USERPHOTO(this.userProfile.photo)
    this.SET_USERNAME(this.userProfile.name)
  },
  methods: {
    ...mapMutations(['SET_USERPHOTO', 'SET_USERNAME']),
    // 退出登录
    quitFn () {
      Dialog.confirm({
        title: '提示',
        message: '这就走了不爱我了吗'
      })
        .then(() => {
          // on confirm  用户点击了确认选项
          // 思路：清除本地token，并且跳转
          // 清除本地token
          removeToken()
          this.$router.replace('/login')
        })
        .catch(() => {
          // on cancel    用户取消
        })
    }
  }

}
</script>
<style scoped lang='less'>
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;

    .van-cell {
      background: #007bff;
      color: white;

      &::after {
        display: none;
      }

      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }

      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }

  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;

    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>
