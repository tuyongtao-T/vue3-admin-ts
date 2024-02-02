import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const isCollapse = ref(false)
  const foldMenu = () => {
    isCollapse.value = !isCollapse.value
  }
  return { isCollapse, foldMenu }
})
