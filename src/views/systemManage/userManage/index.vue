<template>
  <div class="user-manage">
    <base-page
      :form-config-items="formConfigItems"
      label-width="60px"
    ></base-page>
  </div>
</template>

<script setup>
const formConfigItems = reactive([
  {
    type: 'input',
    key: 'school',
    label: '学校',
    default: '西南第一学习,'
  },
  {
    type: 'input',
    key: 'name',
    label: '姓名',
    placeholder: '请输入中文名称'
  },
  {
    type: 'select',
    key: 'sex',
    label: '性别',
    options: [
      {
        label: '男',
        value: 0
      },
      {
        label: '女',
        value: 1
      }
    ]
  },
  {
    type: 'input',
    key: 'age',
    label: '年龄'
  },
  {
    type: 'input',
    key: 'grade',
    label: '年级'
  },
  {
    type: 'datetime',
    detailType: 'date',
    key: 'startDate',
    label: '日期',
    placeholder: '请选择入学日期'
  }
])
</script>

<style scoped></style>
