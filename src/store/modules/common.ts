import { defineStore } from 'pinia'

interface ICommonProps {
  title: string
}

export const useCommonStore = defineStore('common', {
  // 推荐使用 完整类型推断的箭头函数
  state: (): ICommonProps => {
    return {
      title: ''
    }
  },
  actions: {
    updateTitle() {
      this.title = '这是一个页面'
    }
  }
})
