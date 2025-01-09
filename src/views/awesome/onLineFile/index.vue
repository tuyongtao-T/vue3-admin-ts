<template>
  <div class="onLineFile">
    <div class="full-container" id="vscode" ref="vscodeRef">
      <div class="left">
        <div class="resize-slide"></div>
        <div class="resize-line"></div>
        <div class="real-box">
          <el-button class="operate-btn" type="primary" @click="openFolder"
            >打开文件夹</el-button
          >
          <div class="file-list">
            <el-tree
              :data="data"
              :highlight-current="true"
              :props="defaultProps"
              @node-click="handleNodeClick"
            >
            </el-tree>
          </div>
        </div>
      </div>
      <div class="right">
        <el-button
          class="fullScreen-btn"
          @click="toggle"
          type="primary"
          size="small"
          icon="FullScreen"
        ></el-button>
        <pre
          id="editableContent"
          class="codeContainer"
          @keydown="handleKeydown"
          :contenteditable="isFile"
        ><code v-html="fileText"></code></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark-reasonable.min.css'
import { useFullscreen } from '@vueuse/core'

const vscodeRef = ref(null)

const { toggle } = useFullscreen(vscodeRef)

const data = ref([])
const fileText = ref('')
const currentHandle = ref({})
const vscodeNode = ref(null)
const isFile = computed(() => {
  const res = currentHandle.value instanceof FileSystemFileHandle
  return res
})

onMounted(() => {
  docHandle()
  vscodeNode.value = document.getElementById('vscode')
})
onBeforeUnmount(() => {
  removeDocHandle()
  vscodeNode.value = null
})

const handleNodeClick = async data => {
  try {
    if (data.kind === 'directory') {
      return
    }
    currentHandle.value = data
    const file = await data.getFile()
    const reader = new FileReader()
    reader.onload = e => {
      fileText.value = hljs.highlight('javascript', e.target.result).value
    }
    reader.readAsText(file)
  } catch (error) {
    console.log(error)
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
    data.value.push(handle)
  } catch (err) {
    console.log(err)
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

async function writeFile(fileHandle, content) {
  try {
    // 请求写权限
    const writable = await fileHandle.createWritable()
    // 写入数据
    await writable.write(content)
    // 关闭流以保存更改
    await writable.close()
    ElMessage({
      message: '保存成功',
      type: 'success',
      plain: true
    })
  } catch (error) {
    console.error('写入文件时发生错误:', error)
  }
}

function handleKeydown(e) {
  if (event.key === 'Tab') {
    event.preventDefault() // 阻止默认的 Tab 行为

    // 创建一个制表符
    const tabNode = document.createTextNode('\u00A0\u00A0\u00A0\u00A0') // 4 个空格

    // 获取当前的选区
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.insertNode(tabNode)
      // 移动光标到制表符之后
      range.setStartAfter(tabNode)
      range.setEndAfter(tabNode)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }
}

function handleCtrl() {
  if (
    (event.ctrlKey || event.metaKey) &&
    (event.key === 's' || event.key === 'S')
  ) {
    event.preventDefault()
    if (!isFile.value) {
      return
    }
    const editNode = document.getElementById('editableContent')
    const originalContentHtml = editNode.innerHTML
    const originalContent = originalContentHtml.replace(/<\/?[^>]+(>|$)/g, '')
    writeFile(currentHandle.value, originalContent)
  }
}
function docHandle() {
  document.addEventListener('keydown', handleCtrl)
}
function removeDocHandle() {
  document.removeEventListener('keydown', handleCtrl)
}
</script>

<style lang="scss" scoped>
.onLineFile {
  .full-container {
    display: flex;
    justify-content: flex-start;
    $resize: 5px;
    $leftBgColor: #181818;

    .left {
      position: relative;
      background-color: $leftBgColor;

      .resize-slide {
        width: 200px;
        height: calc(100vh - 115px);
        overflow: scroll;
        cursor: ew-resize;
        cursor: col-resize;
        resize: horizontal;
        opacity: 0;
      }

      .resize-line {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        border-right: $resize solid $leftBgColor;
      }

      .resize-slide:hover ~ .resize-line,
      .resize-slide:active ~ .resize-line {
        border-left-color: rgb(64 158 255);
      }

      .real-box {
        position: absolute;
        inset: 0;
        right: $resize;
        transition-duration: 0.3s;
        transition-property: width;

        .operate-btn {
          position: absolute;
          top: 10px;
          right: 20px;
          left: 20px;
        }

        .file-list {
          position: absolute;
          inset: 0;
          top: 44px;
          overflow: auto;
        }
      }

      .resize-slide::-webkit-scrollbar {
        width: 200px;
        height: inherit;
      }

      /* :deep(.el-tree-node__expand-icon) {
      font-size: 18px;
    } */

      :deep(.el-tree-node__content) {
        height: 40px;
        font-size: 20px;
        color: rgb(235 228 228);
        background-color: $leftBgColor;
      }

      :deep(.el-tree-node__content:hover) {
        background-color: #37373e;
      }

      :deep(.el-tree-node:focus > .el-tree-node__content) {
        background-color: rgb(0 95 204 / 0.5);
        outline: rgb(0 95 204);
      }

      :deep(.el-tree) {
        --el-tree-node-content-height: 40px !important;
        --el-tree-node-hover-bg-color: var(--el-fill-color-light);
        --el-tree-text-color: var(--el-text-color-regular);
        --el-tree-expand-icon-color: var(--el-text-color-placeholder);

        position: relative;
        font-size: 16px;
        color: #ccc;
        cursor: default;
        background: $leftBgColor;
      }
    }

    .right {
      position: relative;
      flex: 1;
      padding: 20px;
      color: #abb2bf;
      background-color: #1f1f1f;

      .codeContainer {
        height: calc(100vh - 156px);
        overflow: auto;
        outline: none;
      }

      .codeContainer::-webkit-scrollbar {
        width: 2px;
      }

      .fullScreen-btn {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
}
</style>
