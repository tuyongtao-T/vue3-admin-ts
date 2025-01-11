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
              :data="fileTreeData"
              :highlight-current="true"
              :props="treeProps"
              @node-click="handleNodeClick"
            ></el-tree>
          </div>
        </div>
      </div>
      <div class="right">
        <el-button
          class="fullScreen-btn"
          @click="toggleFullscreen"
          type="primary"
          size="small"
          icon="FullScreen"
        ></el-button>
        <pre
          v-if="currentContainerType === 0"
          id="editableContent"
          class="codeContainer"
          @keydown="handleKeydown"
          contenteditable="true"
        >
          <code v-html="fileContent"></code>
        </pre>
        <div class="imgContainer" v-if="currentContainerType === 1">
          <img :src="imageSource" />
        </div>
        <iframe
          v-if="currentContainerType === 2"
          :src="iframeSource"
          class="iframeContainer"
          frameborder="0"
        ></iframe>
        <div v-if="currentContainerType === 3" class="mask"></div>
        <div
          v-if="currentContainerType === 4"
          class="excelContainer"
          v-html="excelContent"
        ></div>
        <div
          v-if="currentContainerType === 5"
          class="wordContainer"
          v-html="wordContent"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark-reasonable.min.css'
import { useFullscreen } from '@vueuse/core'
import * as XLSX from 'xlsx'
import mammoth from 'mammoth'

const vscodeRef = ref(null)
const { toggle: toggleFullscreen } = useFullscreen(vscodeRef)

const treeProps = reactive({
  children: 'children',
  label: 'name'
})
const fileTreeData = ref([])

const currentFileHandle = ref({})
const fileContent = ref('')

const currentContainerType = ref(3)
const imageSource = ref('')
const iframeSource = ref('')
const excelContent = ref('')
const wordContent = ref('')

const isFileSelected = ref(false)

const handleNodeClick = async nodeData => {
  try {
    if (nodeData.kind === 'directory') {
      resetContainerType()
      return
    }
    isFileSelected.value = true
    const file = await nodeData.getFile()
    displayFileContent(file, nodeData)
  } catch (error) {
    console.error(error)
  }
}

const resetContainerType = () => {
  currentContainerType.value = 3
  isFileSelected.value = false
}

const displayFileContent = (file, nodeData) => {
  const fileType = file.type
  if (fileType.includes('image')) {
    currentContainerType.value = 1
    imageSource.value = URL.createObjectURL(file)
  } else if (
    fileType.includes('pdf') ||
    fileType.includes('audio') ||
    fileType.includes('video')
  ) {
    currentContainerType.value = 2
    iframeSource.value = URL.createObjectURL(file)
  } else if (
    fileType.includes('excel') ||
    file.name.endsWith('.xlsx') ||
    file.name.endsWith('.xls')
  ) {
    currentContainerType.value = 4
    readExcelFile(file)
  } else if (
    fileType.includes('word') ||
    file.name.endsWith('.docx') ||
    file.name.endsWith('.doc')
  ) {
    currentContainerType.value = 5
    readWordFile(file)
  } else {
    currentContainerType.value = 0
    currentFileHandle.value = nodeData
    readFileContent(file)
  }
}

const readFileContent = file => {
  const reader = new FileReader()
  reader.onload = e => {
    fileContent.value = hljs.highlightAuto(e.target.result).value
  }
  reader.readAsText(file)
}

const readExcelFile = file => {
  const reader = new FileReader()
  reader.onload = e => {
    const data = new Uint8Array(e.target.result)
    const workbook = XLSX.read(data, { type: 'array' })
    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]
    const htmlContent = XLSX.utils.sheet_to_html(worksheet)

    // 添加默认样式
    const styledHtmlContent = `
      <style>
        .excel-table-container {
          overflow-x: auto;
          background-color: black; /* 容器背景色为黑色 */
          padding: 10px; /* 添加内边距以避免表格紧贴容器边缘 */
        }
        table {
          width: 100%;
          border-collapse: collapse;
          color: white; /* 表格文字颜色为白色 */
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          height: 40px; /* 设置行高 */
          color: black; /* 单元格文字颜色为黑色 */
          background-color: white; /* 单元格背景颜色为白色 */
          white-space: nowrap; /* 禁止单元格内容换行 */
        }
        th {
          background-color: #4CAF50; /* 表头背景颜色 */
          color: white; /* 表头文字颜色 */
        }
        tr:nth-child(even) {
          background-color: #f2f2f2; /* 偶数行背景颜色 */
        }
        tr:hover {
          background-color: #ddd; /* 鼠标悬停行背景颜色 */
        }
        /* 添加鼠标悬停时整行的颜色效果 */
        tr:hover th, tr:hover td {
          background-color: #b0c4de; /* 悬停时整行背景颜色 */
        }
      </style>
      <div class="excel-table-container">
        ${htmlContent}
      </div>
    `

    excelContent.value = styledHtmlContent
  }
  reader.readAsArrayBuffer(file)
}

const readWordFile = file => {
  const reader = new FileReader()
  reader.onload = event => {
    mammoth
      .convertToHtml({ arrayBuffer: event.target.result })
      .then(result => {
        wordContent.value = result.value // 设置解析后的 HTML 内容
      })
      .catch(err => {
        console.error(err)
      })
  }
  reader.readAsArrayBuffer(file) // 读取文件为 ArrayBuffer
}

const openFolder = async () => {
  try {
    const handle = await showDirectoryPicker()
    await processDirectoryHandle(handle)
    sortFileTree(handle)
    fileTreeData.value.push(handle)
  } catch (err) {
    console.error(err)
  }
}

const sortFileTree = fileHandle => {
  fileHandle.children.sort((a, b) => {
    if (a.kind === 'directory' && b.kind !== 'directory') return -1
    if (a.kind !== 'directory' && b.kind === 'directory') return 1
    if (a.name.startsWith('.') && !b.name.startsWith('.')) return -1
    if (!a.name.startsWith('.') && b.name.startsWith('.')) return 1
    return a.name.localeCompare(b.name)
  })
}

const processDirectoryHandle = async handle => {
  if (handle.kind === 'file' || handle.name === 'node_modules') return
  const entries = await handle.entries()
  handle.children = []
  for await (const [key, subHandle] of entries) {
    handle.children.push(subHandle)
    await processDirectoryHandle(subHandle)
  }
}

const handleKeydown = e => {
  if (e.key === 'Tab') {
    e.preventDefault()
    insertTabCharacter()
  }
}

const insertTabCharacter = () => {
  const tabNode = document.createTextNode('\u00A0\u00A0\u00A0\u00A0')
  const selection = window.getSelection()
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    range.insertNode(tabNode)
    range.setStartAfter(tabNode)
    range.setEndAfter(tabNode)
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

const writeFile = async (fileHandle, content) => {
  try {
    const writable = await fileHandle.createWritable()
    await writable.write(content)
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

const handleCtrlSave = event => {
  if (
    (event.ctrlKey || event.metaKey) &&
    (event.key === 's' || event.key === 'S')
  ) {
    event.preventDefault()
    if (!isFileSelected.value) return
    const editNode = document.getElementById('editableContent')
    const originalContentHtml = editNode.innerHTML
    const originalContent = originalContentHtml.replace(/<\/?[^>]+(>|$)/g, '')
    writeFile(currentFileHandle.value, originalContent)
  }
}

const addKeyboardEventListener = () => {
  document.addEventListener('keydown', handleCtrlSave)
}

const removeKeyboardEventListener = () => {
  document.removeEventListener('keydown', handleCtrlSave)
}

onMounted(() => {
  addKeyboardEventListener()
})

onBeforeUnmount(() => {
  removeKeyboardEventListener()
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

      .wordContainer,
      .excelContainer {
        position: absolute;
        inset: 0;
        z-index: 2;
        width: 100%;
        height: 100%;
        overflow: scroll;
      }
    }
  }
}
</style>
