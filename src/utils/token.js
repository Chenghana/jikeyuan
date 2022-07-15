// 此文件-》封装3个方法-》专门用于操作token的
// 封装目的：代码分层，更方便更清晰，以后修改更方便
const key = 'jikeyuan'

// 设置
export const setToken = (token) => {
  localStorage.setItem(key, token)
}
// 获取token
export const getToken = () => localStorage.getItem(key)

// 删除token
export const removeToken = () => {
  localStorage.removeItem(key)
}
