// 封装中间件函数插件  自定义组件  v-fofo
const directiveObj = {
  install (Vue) {
    Vue.directive('fofo', {
      // el代表指令所在标签
      // 指令所在标签，被插入到真实dom时触发，如果标签用display：none隐藏再出现，不会触发inserted的
      inserted (el) {
        // dom.nodename 拿到标签名字
        if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
          // 如果直接是input标签/textarea标签
          el.focus()
        } else {
          // 指令在van-search组件身上, 获取的是组件根标签div, 而input在标签内
          const inp = el.querySelector('input')
          const textArea = el.querySelector('textarea')
          // 如果找到了
          if (inp || textArea) {
            inp && inp.focus()
            textArea && textArea.focus()
          } else {
            // 本身也不是, 子标签里也没有
            console.error('请把v-fofo用在输入框标签上')
          }
        }
      },
      update (el) {
        // dom.nodename 拿到标签名字
        if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
          // 如果直接是input标签/textarea标签
          el.focus()
        } else {
          // 指令在van-search组件身上, 获取的是组件根标签div, 而input在标签内
          const inp = el.querySelector('input')
          const textArea = el.querySelector('textarea')
          // 如果找到了
          if (inp || textArea) {
            inp && inp.focus()
            textArea && textArea.focus()
          } else {
            // 本身也不是, 子标签里也没有
            console.error('请把v-fofo用在输入框标签上')
          }
        }
      }
    })
  }
}

export default directiveObj
