<template>
  <div class="base-page">
    <header class="base-form-box">
      <el-form
        ref="formElRef"
        :model="formData"
        :rules="rules"
        :label-width="labelWidth"
      >
        <el-row :gutter="20" class="flex-wrap">
          <el-col
            v-for="item in currentRenderFormItems"
            :key="item.key"
            :xs="24"
            :sm="24 / cols"
            class="flex-center"
          >
            <el-form-item
              style="flex-grow: 1"
              :label="item.label"
              :prop="item.key"
            >
              <el-input
                v-if="item.type === 'input'"
                v-model.trim="formData[item.key]"
                :disabled="item.disabled"
                :placeholder="item.placeholder || '请输入'"
                clearable
              />
              <el-cascader
                v-if="item.type === 'cascader'"
                v-model="formData[item.key]"
                style="width: 100%"
                :options="item.options"
                :props="item.props"
                :placeholder="item.placeholder || '请选择'"
                :disabled="item.disabled"
                :show-all-levels="item.isShowAllLevel"
                filterable
                clearable
                @change="changeOptions($event, item)"
              />
              <el-select
                v-if="item.type === 'select'"
                v-model="formData[item.key]"
                style="width: 100%"
                :disabled="item.disabled"
                :multiple="item.multiple"
                :multiple-limit="item.multipleLimit"
                clearable
                :remote="item.remote || false"
                :remote-method="item.remoteMethod"
                :loading="item.loading"
                remote-show-suffix
                filterable
                :placeholder="item.placeholder || '请选择'"
                @change="changeOptions($event, item)"
              >
                <el-option
                  v-for="option in item.options"
                  :key="option[item?.labelKey || 'label']"
                  :label="option[item?.labelKey || 'label']"
                  :value="option[item?.valueKey || 'value']"
                />
              </el-select>
              <el-date-picker
                v-if="item.type === 'datetime'"
                v-model="formData[item.key]"
                style="width: 100%"
                :disabled="item.disabled"
                type="datetime"
                :placeholder="item.placeholder || '开始日期'"
                value-format="x"
              />
              <el-date-picker
                v-if="item.type === 'dateRange'"
                v-model="formData[item.key]"
                type="daterange"
                :disabled="item.disabled"
                :start-placeholder="item.placeholder || '开始日期'"
                :end-placeholder="item.endPlaceholder || '结束日期'"
                :default-time="item.defaultTime || null"
                value-format="x"
              />
              <el-date-picker
                v-if="item.type === 'dateTimeRange'"
                v-model="formData[item.key]"
                type="datetimerange"
                :disabled="item.disabled"
                :start-placeholder="item.placeholder || '开始日期'"
                :end-placeholder="item.endPlaceholder || '结束日期'"
                :default-time="item.defaultTime || null"
                value-format="x"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24 / cols" :offset="operateColOffset">
            <el-form-item class="t-form-btn-wrap" labelWidth="0">
              <div class="flex flex-justify-around">
                <el-button @click="resetFormData"> 重置 </el-button>
                <el-button type="primary" @click="handleQuery">
                  查询
                </el-button>
                <el-button
                  v-if="isNeedExtendIcon"
                  type="primary"
                  link
                  @click="changeFormView"
                >
                  {{ !isExpand ? '展开' : '收起' }}
                  <el-icon class="el-icon--right">
                    <ArrowDown v-if="!isExpand" />
                    <ArrowUp v-else />
                  </el-icon>
                </el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>
    <div v-if="$slots.btnGroups" class="t-btn-groups">
      <slot name="btnGroups" />
    </div>
    <main class="t-table-box">
      <div class="table-container">
        <slot />
      </div>
    </main>
    <footer v-if="isNeedPagination" class="t-pagination-box">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </footer>
  </div>
</template>

<script setup lang="ts">
interface FormConfigItem {
  /**
   * @description: 表单项类型
   */
  type:
    | 'input'
    | 'select'
    | 'cascader'
    | 'datetime'
    | 'dateRange'
    | 'dateTimeRange'
  /**
   * @description: 表单项key
   */
  key: string
  placeholder?: string
  label?: string
  disabled?: boolean
  /**
   * @description: 默认值
   */
  defaultValue?: any
  // select
  // TODO-ts类型校验
  /**
   * @description: 下拉框数据
   */
  options?: any
  /**
   * @description: 下拉框value对应的key
   */
  valueKey?: string
  /**
   * @description: 下拉框label对应的key
   */
  labelKey?: string
  /**
   * @description: 是否多选
   */
  multiple?: boolean
  /**
   * @description: 多选限制
   */
  multipleLimit?: number
  /**
   * @description: change事件触发的自定义回调
   */
  callback?: Function
  /**
   * @description: change事件触发的回调
   */
  change?: Function
  /**
   * @description: 多级联动时的，第一个受影响的key值
   */
  nextKey?: string
  /**
   * @description: 多级联动时的，第二个受影响的key值
   */
  next2Key?: string
  // cascader
  /**
   * @description: 级联选择器的props
   */
  props?: Object
  /**
   * @description: 是否展示所有层级
   */
  isShowAllLevel?: boolean
  // date-picker
  /**
   * @description: 日期选择器的默认时间
   */
  endPlaceholder?: string
  defaultTime?: any
  /**
   * @description: 是否远程搜索
   */
  remote?: boolean
  /**
   * @description: 远程搜索是否在加载
   */
  loading?: boolean
  /**
   * @description: 远程搜索的回调
   */
  remoteMethod?: Function
}
const emit = defineEmits(['query'])
defineExpose({
  resetFormData,
  resetFormItemData,
  getQueryParamsData,
  setDefaultValue,
  handleQuery
})
const props = defineProps({
  /**
   * @description 表单配置项
   */
  formConfigItems: {
    type: Array<FormConfigItem>,
    required: true
  },
  /**
   * @description 表单配置项的规则
   */
  rules: {
    type: Object
  },
  /**
   * @description 表单配置项的标签宽度
   */
  labelWidth: {
    type: String,
    default: '0px'
  },
  /**
   * @description 每行的列数
   */
  cols: {
    type: Number,
    default: 4
  },
  /**
   * @description 展示的最大表单数
   */
  rowViews: {
    type: Number,
    default: 3
  },
  /**
   * @description 分页器总条数
   */
  total: {
    type: Number,
    default: 0
    // required: true,
  },
  /**
   * @description 重置后是否自动查询
   */
  resetIsQuery: {
    type: Boolean,
    default: true
  },
  /**
   * @description 是否需要分页器
   */
  isNeedPagination: {
    type: Boolean,
    default: true
  }
})
const isExpand = ref(true)
const isNeedExtendIcon = ref(false)
const operateColOffset = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const formData: any = reactive({})
const extendedFormItems: Array<FormConfigItem> = [] // 展开的form项
const foldFormItems: Array<FormConfigItem> = [] // 折叠的form项
const currentRenderFormItems = shallowRef<Array<FormConfigItem>>([]) // 渲染的form项
// eslint-disable-next-line vue/no-setup-props-destructure
const formItemsClone = props.formConfigItems // 这个数据是避免更改父组件传来的prop

const initComponentState = function (): void {
  // 判断当前数据对应的初始状态
  judgeInitState()
  // 初始化form子项
  initFormItems()
  // 初始化form查询时的键值
  initFormData()
  // 设置查询按钮的位置
  setOperateColOffset()
}

initComponentState()

onMounted(() => {
  query()
})

function handleSizeChange(params: number) {
  pageSize.value = params
  currentPage.value = 1
  query()
}

function handleCurrentChange(params: number) {
  currentPage.value = params
  query()
}

function handleQuery() {
  currentPage.value = 1
  query()
}

const formElRef = ref()
function query() {
  if (!props.rules) {
    emit('query', {
      ...formData,
      currentPage: currentPage.value,
      pageSize: props.isNeedPagination ? pageSize.value : 99999999
    })
  } else {
    formElRef.value.validate((valid: any) => {
      console.log('valid', valid)
      if (valid) {
        emit('query', {
          ...formData,
          currentPage: currentPage.value,
          pageSize: props.isNeedPagination ? pageSize.value : 99999999
        })
      } else {
        console.log('error submit!')
        return false
      }
    })
  }
}
// 做监听 如果有规则的form 并且需要初始化查询 需要等接口的数据拿到后  有新的数据 重新发起请求
watch(
  () => formData,
  () => {
    if (props.rules) {
      formElRef.value.validate((valid: any) => {
        console.log('valid', valid)
        if (valid) {
          emit('query', {
            ...formData,
            currentPage: currentPage.value,
            pageSize: props.isNeedPagination ? pageSize.value : 99999999
          })
        } else {
          console.log('error submit!')
          return false
        }
      })
    }
  },
  {
    deep: true
  }
)
function resetFormData() {
  const keys = Object.keys(formData)
  for (let i = 0; i < keys.length; i++) {
    // TODO  如果有默认值时需要做更改
    formData[keys[i]] = null
  }
  // 重置自动查询
  handleQuery()
}
/** 重置某一项 */
function resetFormItemData(key: string) {
  const keys = Object.keys(formData)
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === key) {
      formData[keys[i]] = null
      break
    }
  }
}
function getQueryParamsData() {
  return {
    ...formData,
    currentPage: currentPage.value,
    pageSize: pageSize.value
  }
}
function judgeInitState() {
  isNeedExtendIcon.value = (formItemsClone.length > props.rowViews) as boolean
}
function initFormItems() {
  const extendedFormItemsLength = formItemsClone.length
  for (let i = 0; i < extendedFormItemsLength; i++) {
    extendedFormItems.push(formItemsClone[i])
  }
  if (isNeedExtendIcon.value) {
    const foldFormItemsLength = props.rowViews
    for (let i = 0; i < foldFormItemsLength; i++) {
      foldFormItems.push(formItemsClone[i])
    }
  }
  currentRenderFormItems.value = extendedFormItems
}

function initFormData() {
  props.formConfigItems.forEach(item => {
    formData[item.key] = item.defaultValue || null
  })
}
function setOperateColOffset() {
  if (props.cols > currentRenderFormItems.value.length) {
    operateColOffset.value =
      (props.cols - currentRenderFormItems.value.length - 1) * (24 / props.cols)
  } else {
    const reset = currentRenderFormItems.value.length % props.cols
    operateColOffset.value = (props.cols - reset - 1) * (24 / props.cols)
  }
}

function changeFormView() {
  isExpand.value = !isExpand.value
  setCurrentRenderFormItems()
  setOperateColOffset()
}
function setCurrentRenderFormItems() {
  currentRenderFormItems.value = isExpand.value
    ? extendedFormItems
    : foldFormItems
}

function changeOptions(value: any, item: FormConfigItem) {
  // 直接对 v-model 赋值无法触发 select 的 change方法
  // TODO 暂时没有该需求
  if (item.change) {
    if (item.nextKey) {
      formData[item.nextKey] = null
    }
    if (item.next2Key) {
      formData[item.next2Key] = null
    }
    item.change(formData[item.key])
  }
  if (item?.callback) {
    item.callback(value, item.key)
  }
}
interface DefaultOptions {
  key: string
  default: any
}

function setDefaultValue(setting: DefaultOptions) {
  formData[setting.key] = setting.default
}
</script>

<style scoped lang="scss">
.base-page {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .base-form-box {
    position: relative;
    padding: 10px;
    margin-bottom: $primary-padding;
    background-color: $primary-bg-color;
    border: 1px solid #eaeaea;

    :deep(.el-date-editor) {
      display: inline-flex;
    }

    .t-form {
      background-color: antiquewhite;

      .flex-wrap {
        display: flex;
        flex-wrap: wrap;

        .flex-center {
          display: flex;
        }
      }

      .t-form-btn-wrap {
        -webkit-box-flex: 1;
        flex: 1;
        text-align: right;

        .el-button {
          letter-spacing: 2px;
        }

        .el-input,
        .el-select {
          display: block;
          width: 100%;
        }

        .el-date-editor.el-input,
        .el-date-editor.el-input__inner {
          width: 100%;
        }
      }
    }

    :deep(.el-form-item--small) {
      margin-bottom: 12px;
    }

    :deep(.el-form-item__content) {
      justify-content: flex-end;
    }
  }

  .t-btn-groups {
    padding: 10px;
    text-align: left;
    background-color: $primary-bg-color;
    border: 1px solid #eaeaea;
    border-bottom: none;
  }

  .t-table-box {
    position: relative;
    display: flow-root;
    flex: 1;
    background-color: $primary-bg-color;
    border: 1px solid #eaeaea;
    border-bottom: none;

    .table-container {
      position: absolute;
      inset: 0;
      border-radius: 4px;
    }

    :deep(.el-table th.el-table__cell) {
      background-color: #f1f4f9;
    }
  }

  .t-pagination-box {
    display: flex;
    justify-content: flex-end;
    padding: $primary-padding;
    background-color: $primary-bg-color;
  }
}
</style>
