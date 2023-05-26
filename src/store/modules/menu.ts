import { defineStore } from 'pinia'

interface IMenuItemProps {
  path: string
  title: string
}

interface IMenuProps {
  noTabList: string[]
  tabItems: IMenuItemProps[]
  activeTab: string
}

export const useMenuStore = defineStore('menu', {
  state: (): IMenuProps => {
    return {
      noTabList: ['/', '/home', '/404'],
      tabItems: [],
      activeTab: ''
    }
  },
  getters: {
    menuItems: state => {
      const aa = state.tabItems.filter(tab => !state.noTabList.includes(tab.path))
      return aa
    },
    showTab: state => {
      return !state.noTabList.includes(state.activeTab)
    }
  },
  actions: {
    addTab(data: IMenuItemProps) {
      this.tabItems.push(data)
    },
    removeTab(tab: string) {
      let index = 0
      for (const item of this.tabItems) {
        if (item.path === tab) {
          break
        }
        index++
      }
      this.tabItems.splice(index, 1)
    },
    clearTab() {
      this.tabItems = []
    },
    setActiveTab(tab: string) {
      this.activeTab = tab
    }
  }
})
