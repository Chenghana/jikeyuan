// 统一封装接口方法
import request from '@/utils/request.js'
import { getStorage } from '@/utils/storage.js'

// 获取所有频道
export const getAllChannelsAPI = () => {
  return request({
    url: '/v1_0/channels',
    method: 'GET'
  })
}
// 获取登录注册
export const loginAPI = ({ mobile, code }) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: {
      mobile,
      code
    }
  })
}
// 频道-更新覆盖频道
export const updateChannelsAPI = ({ channels }) => request({
  url: '/v1_0/user/channels',
  method: 'PUT',
  data: {
    channels // 用户已选频道数组
  }

})

// 获取用户选择的频道
// 用户没有登录，默认返回后台设置的默认频道列表
export const getUserChannelsAPI = () => request({
  url: '/v1_0/user/channels'
})

// 获取文章列表
export const getAllArticleListAPI = ({ channel_id, timestamp }) => request({
  url: '/v1_0/articles',
  params: { // params 这里的参数，axios会帮你拼接在URL？后面（查询字符串）
    channel_id,
    timestamp
  }
})

// 频道-删除用户指定的频道
export const removeTheChannelAPI = ({ channelId }) => request({
  url: `/v1_0/user/channels/${channelId}`,
  method: 'DELETE'
})

// 对文章反馈-----不感兴趣
export const dislikeArticleAPI = ({ artId }) => request({
  url: '/v1_0/article/dislikes',
  method: 'POST',
  data: {
    target: artId
  }
})

// 文章--反馈辣鸡内容

export const reportArticleAPI = ({ artId, type }) => request({
  url: '/v1_0/article/reports',
  method: 'POST',
  data: {
    target: artId,
    type: type,
    remark: '如果你想写，可以在逻辑页面判断一下，如果点击类型'
  }

})
// 文章-获取详情
export const detailAPI = ({ artId }) => request({
  url: `/v1_0/articles/${artId}`
})

// 文章--搜索的联想菜单

export const suggestListAPI = ({ keywords }) => request({
  url: '/v1_0/suggestion',
  params: {
    q: keywords
  }
})
// 搜索 - 结果列表
export const searchResultListAPI = ({ page = 1, per_page = 10, q }) => {
  return request({
    url: '/v1_0/search',
    method: 'GET',
    params: {
      page,
      per_page,
      q
    }
  })
}

// 用户---关注
export const userFollowedAPI = ({ userId }) => request({
  url: '/v1_0/user/followings',
  methods: 'POST',
  data: {
    target: userId
  }
})

// 用户---取消关注

export const userUnFollowedAPI = ({ userId }) => request({
  url: `/v1_0/user/followings/${userId}`,
  method: 'DELETE'
})

// 文章点赞
export const likeArticleAPI = ({ artId }) => request({
  url: '/v1_0/article/likings',
  method: 'POST',
  data: {
    target: artId
  }
})
// 文章取消点赞
export const unlikeArticleAPI = ({ artId }) => request({
  url: `/v1_0/article/likings/${artId}`,
  method: 'DELETE'
})
// 评论 - 获取列表
// offset第一页时, 不用在params携带(axios发现值为null会自动忽略此参数)
export const commentListAPI = ({ artId, offset = null, limit = 10 }) => {
  return request({
    url: '/v1_0/comments',
    params: {
      type: 'a',
      source: artId,
      offset,
      limit
    }
  })
}

// 评论 - 喜欢
export const commentLikingAPI = ({ comId }) => {
  return request({
    url: '/v1_0/comment/likings',
    method: 'POST',
    data: {
      target: comId
    }
  })
}
// 评论-取消喜欢
export const commentDisLikingAPI = ({ comId }) => {
  return request({
    url: `/v1_0/comment/likings/${comId}`,
    method: 'DELETE'
  })
}

// 评论 - 发布
export const sendCommentAPI = ({ id, content, art_id = null }) => {
  const obj = {
    target: id,
    content
  }
  if (art_id !== null) {
    obj.art_id = art_id
  }
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: obj
  })
}

// 对文章收藏
export const collectionAPI = ({ artId }) => request({
  url: '/v1_0/article/collections',
  method: 'POST',
  data: {
    target: artId
  }
})
// 对文章取消收藏
export const uncollectionAPI = ({ artId }) => request({
  url: `/v1_0/article/collections/${artId}`,
  method: 'DELETE'
})

// 获取--用户资料
export const userProfileAPI = () => request({
  url: '/v1_0/user'
})

// 获取用户资料
export const userinfo = () => request({
  url: '/v1_0/user/profile'
})

// 用户更新头像
export const unserInfoPhotoAPI = (fd) => request({
  url: '/v1_0/user/photo',
  method: 'PATCH',
  data: fd // fd传进来的是表单对象
})

// 用户 - 更新基本资料
export const updateProfileAPI = (dataObj) => {
  const obj = {
    name: '',
    gender: 0,
    birthday: '',
    intro: ''
  }
  for (const prop in obj) {
    if (dataObj[prop] === undefined) {
      delete obj[prop]
    } else {
      obj[prop] = dataObj[prop]
    }
  }
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data: obj
  })
}

// 用户--刷新token
export const getNewTokenAPI = () => request({
  url: '/v1_0/authorizations',
  method: 'PUT',
  headers: {
    Authorization: 'Bearer' + getStorage('refresh_token')
  }
})
