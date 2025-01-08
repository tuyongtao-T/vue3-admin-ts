<template>
  <div class="onLineFile">
    <div class="left">
      <el-button type="primary" style="width: 100%" @click="openFolder"
        >打开文件夹</el-button
      >
      <el-tree
        :data="data"
        :highlight-current="true"
        :props="defaultProps"
        @node-click="handleNodeClick"
      >
      </el-tree>
    </div>
    <div class="right">
      <pre><code v-html="fileText"></code></pre>
    </div>
  </div>
</template>

<script setup>
import hljs from 'highlight.js'
import 'highlight.js/styles/default.css'

const data = ref([])
const fileText = ref('')
const handleNodeClick = async data => {
  try {
    const file = await data.getFile()
    const reader = new FileReader()
    reader.onload = e => {
      console.log('🚀 ~ openFolder ~ e.target.result:', e.target.result)
      fileText.value = hljs.highlight('javascript', e.target.result).value
    }
    reader.readAsText(file)
  } catch (error) {
    console.log('🚀 ~ handleNodeClick ~ error:', error)
  }
}
const defaultProps = reactive({
  children: 'children',
  label: 'name'
})
const openFolder = async () => {
  try {
    // 句柄
    const handle = await showDirectoryPicker()
    await processHandle(handle)
    console.log('🚀 ~ openFolder ~ handle:', handle)
    data.value.push(handle)
  } catch (err) {
    console.log('🚀 ~ openFolder ~ err:', err)
  }
}
async function processHandle(handle) {
  if (handle.kind === 'file') {
    return
  }
  // entires 异步迭代器
  const entries = await handle.entries()
  handle.children = []
  for await (const [key, subHandle] of entries) {
    handle.children.push(subHandle)
    await processHandle(subHandle)
  }
}
</script>

<style lang="scss" scoped>
.onLineFile {
  display: flex;
  justify-content: flex-start;
  background: white;

  .left {
    width: 200px;

    :deep(.el-tree-node__expand-icon) {
      font-size: 18px;
    }

    :deep(.el-tree-node__content) {
      height: 40px;
      font-size: 20px;
    }
  }

  .right {
    flex: 1;
    padding: 20px;
    background-color: aliceblue;
  }
}
</style>
