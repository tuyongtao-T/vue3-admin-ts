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
        <!-- 代码文件 -->
        <pre
          v-if="currentContainerType === 0"
          id="editableContent"
          class="codeContainer"
          @keydown="handleKeydown"
          contenteditable="true"
        ><code v-html="fileText"></code></pre>
        <!-- 图片 -->
        <div class="imgContainer" v-if="currentContainerType === 1">
          <img :src="imgSrc" />
        </div>
        <!-- pdf、视频、音频 -->
        <iframe
          v-if="currentContainerType === 2"
          :src="iframeSrc"
          class="iframeContainer"
          frameborder="0"
        ></iframe>
        <div v-if="currentContainerType === 3" class="mask"></div>
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

const defaultProps = reactive({
  children: 'children',
  label: 'name'
})
const data = ref([])

const currentWriteHandle = ref({})
const fileText = ref('')

/**
 * @description 容器类型
 * 0：可编辑的text
 * 1: 图片
 * 2: 视频、音频、PDF
 * 3: 其他
 */
const currentContainerType = ref(3)
const imgSrc = ref('')
const iframeSrc = ref('')

const isFile = ref(false)
const handleNodeClick = async data => {
  try {
    if (data.kind === 'directory') {
      currentContainerType.value = 3
      isFile.value = false
      return
    }
    isFile.value = true
    const file = await data.getFile()
    let fileType = file.type
    if (fileType.includes('image')) {
      currentContainerType.value = 1
      imgSrc.value = URL.createObjectURL(file)
      return
    } else if (
      fileType.includes('pdf') ||
      fileType.includes('audio') ||
      fileType.includes('video')
    ) {
      currentContainerType.value = 2
      iframeSrc.value = URL.createObjectURL(file)
      return
    } else {
      currentContainerType.value = 0
      currentWriteHandle.value = data
      const filename = file.name
      const reader = new FileReader()
      reader.onload = e => {
        fileText.value = hljs.highlight(
          getLanguageByExtension(filename),
          e.target.result
        ).value
      }
      reader.readAsText(file)
    }
  } catch (error) {
    console.log(error)
  }
}

function getLanguageByExtension(filename) {
  const extension = filename.split('.').pop()
  switch (extension) {
    case 'jsx':
      return 'javascript' // Highlight.js 处理 JSX 通常使用 JavaScript
    case 'js':
      return 'javascript'
    case 'json':
      return 'json'
    case 'vue':
      return 'javascript'
    default:
      return 'javascript' // 让 Highlight.js 自动检测
  }
}

/**
 * @description 打开文件夹
 */
const openFolder = async () => {
  console.log('openFolder')
  try {
    // 句柄
    const handle = await showDirectoryPicker()
    await processHandle(handle)
    sortFileFolder(handle)
    data.value.push(handle)
  } catch (err) {
    console.log(err)
  }
}

function sortFileFolder(fileHandle) {
  fileHandle.children.sort((a, b) => {
    // 先按类型排序，目录在前
    if (a.kind === 'directory' && b.kind !== 'directory') {
      return -1
    }
    if (a.kind !== 'directory' && b.kind === 'directory') {
      return 1
    }

    // 如果类型相同，再按名称排序，以 . 开头的在前
    if (a.name.startsWith('.') && !b.name.startsWith('.')) {
      return -1
    }
    if (!a.name.startsWith('.') && b.name.startsWith('.')) {
      return 1
    }

    // 最后按名称的字母顺序排序
    return a.name.localeCompare(b.name)
  })
}
async function processHandle(handle) {
  if (handle.kind === 'file') {
    return
  }
  if (handle.name === 'node_modules') {
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

/**
 * @description 监听保存事件
 */
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
/**
 * @description 写入文件
 * @param fileHandle 文件句柄
 * @param content 需要写入的内容
 */
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

function handleCtrl(event) {
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
    writeFile(currentWriteHandle.value, originalContent)
  }
}

function docHandle() {
  document.addEventListener('keydown', handleCtrl)
}
function removeDocHandle() {
  document.removeEventListener('keydown', handleCtrl)
}

const vscodeNode = ref(null)
onMounted(() => {
  docHandle()
  vscodeNode.value = document.getElementById('vscode')
})
onBeforeUnmount(() => {
  removeDocHandle()
  vscodeNode.value = null
})
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
        height: 32px;
        font-size: 16px;
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
        width: 100%;
        height: calc(100vh - 156px);
        overflow: auto;
        overflow-x: scroll;
        outline: none;
      }

      .codeContainer::-webkit-scrollbar {
        width: 2px;
      }

      .fullScreen-btn {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 99999;
      }

      .imgContainer {
        position: absolute;
        inset: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: #1f1f1f;
      }

      .iframeContainer {
        position: absolute;
        inset: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: #1f1f1f;
      }

      .mask {
        position: absolute;
        inset: 0;
      }
    }
  }
}
</style>
