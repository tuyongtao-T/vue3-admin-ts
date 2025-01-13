<template>
  <div class="dialog-container">
    <el-dialog
      class="base-dialog"
      :title="title"
      :width="width"
      v-model="visible"
      v-bind="$attrs"
      :close="handleClose"
      @open="handleOpen"
      :close-on-click-modal="false"
    >
      <div class="overflow-auto" :style="{ maxHeight: maxHeight }">
        <slot></slot>
      </div>
      <template #footer v-if="showFooter">
        <span class="dialog-footer">
          <el-button v-if="showCancelButton" @click="handleClose">{{
            cancelText
          }}</el-button>
          <el-button
            v-if="showConfirmButton"
            type="primary"
            @click="handleConfirm"
            >{{ confirmText }}</el-button
          >
          <el-popconfirm
            v-if="showPopConfirm"
            :title="popConfirmTitle"
            @confirm="handleConfirm"
            :width="200"
            @cancel="handleClose"
          >
            <template #reference>
              <el-button type="primary">{{ confirmText }}</el-button>
            </template>
          </el-popconfirm>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '提示'
  },
  width: {
    type: [String, Number],
    default: '40%'
  },
  maxHeight: {
    type: [String, Number],
    default: '60vh'
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  showCancelButton: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  showConfirmButton: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: '确认'
  },
  showPopConfirm: {
    type: Boolean,
    default: false
  },
  popConfirmTitle: {
    type: String,
    default: '确认要进行这个操作？'
  }
})
const emit = defineEmits(['open', 'close', 'confirm'])
const visible = defineModel()

/** 打开弹窗 */
const handleOpen = () => emit('open')

/** 关闭弹窗 */
const handleClose = () => {
  visible.value = false
  emit('close')
}

/** 点击确定 */
const handleConfirm = () => emit('confirm')
</script>

<style scoped lang="scss">
.dialog-container {
  :deep(.el-dialog__body) {
    padding: 0 20px;
  }
}
</style>
