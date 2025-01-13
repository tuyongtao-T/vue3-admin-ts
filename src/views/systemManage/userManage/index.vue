<template>
  <div class="user-manage">
    <base-page
      :form-config-items="formConfigItems"
      label-width="60px"
      :total="listTotal"
      @query="onQuery"
    >
      <vxe-grid v-bind="gridOptions" style="height: 100%">
        <template #toolbar_buttons>
          <div class="vxe-titles">
            <el-button type="primary" @click="openDialog('add')"
              >新建</el-button
            >
          </div>
        </template>
        <template #operate="{ row }">
          <el-space wrap>
            <el-link type="primary">查看</el-link>
            <el-link type="primary">编辑</el-link>
            <el-popconfirm title="确定删除吗？" @onConfirm="deletePolicy(row)">
              <template #reference>
                <el-link type="primary">删除</el-link>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </vxe-grid>
    </base-page>
    <base-dialog :title="dialogTitle" v-model="dialogIsVisible">
      <el-form :model="dialogForm" label-width="auto" style="max-width: 600px">
        <el-form-item label="userName">
          <el-input v-model="dialogForm.userName" />
        </el-form-item>
      </el-form>
    </base-dialog>
  </div>
</template>

<script setup>
const formConfigItems = reactive([
  {
    type: 'input',
    key: 'userName',
    label: '名字'
  },
  {
    type: 'input',
    key: 'userAccount',
    label: '账号'
  },
  {
    type: 'select',
    key: 'roleCode',
    label: '角色',
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
    type: 'cascader',
    key: 'orgCode',
    label: '组织'
  }
])

const gridOptions = reactive({
  id: '$userManageColumnConfig',
  border: true,
  height: 'auto',
  columnConfig: {
    resizable: true
  },
  resizeConfig: {
    refreshDelay: 250
  },
  animation: false,
  // showOverflow: true,
  loading: false,
  customConfig: {
    storage: true
  },
  rowConfig: {
    keyField: 'id',
    isHover: true
  },
  align: 'left',
  toolbarConfig: {
    slots: {
      buttons: 'toolbar_buttons'
    },
    custom: true,
    zoom: true
  },
  columns: [
    {
      field: 'userName',
      title: '名字',
      fixed: 'left'
    },
    {
      field: 'userAccount',
      title: '账号'
    },
    {
      field: 'userAccount2',
      title: '账号2'
    },
    { title: '操作', slots: { default: 'operate' }, fixed: 'right' }
  ],
  data: []
})

const listTotal = ref(0)

const onQuery = async params => {
  const res = {
    data: [
      {
        school: '西南第一学习',
        userName: '小图',
        sex: '男',
        age: 26,
        grade: '二年级',
        startDate: '2023-11-22'
      },
      {
        school: '西南第一学习',
        userName: '小2图',
        sex: '男',
        age: 26,
        grade: '二年级',
        startDate: '2023-11-22'
      },
      {
        school: '西南ddss第一学习',
        userName: '小2图',
        sex: '男',
        age: 26,
        grade: '二年级',
        startDate: '2023-11-22'
      }
    ],
    total: 5
  }
  const random = Math.floor(Math.random() * 20)
  gridOptions.data = res.data
  listTotal.value = random
}

const dialogIsVisible = ref(false)
const dialogTitle = ref('')
const dialogForm = reactive({
  userName: ''
})
const titleObj = {
  add: '新增用户',
  edit: '编辑用户',
  view: '查看用户'
}

function openDialog(type) {
  dialogTitle.value = titleObj[type]
  dialogIsVisible.value = true
}
</script>

<style lang="scss" scoped>
.vxe-titles {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  margin: 0 20px;
}
</style>
