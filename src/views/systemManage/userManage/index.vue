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
            <el-link type="primary" @click="openDialog('view', row)"
              >查看</el-link
            >
            <el-link type="primary" @click="openDialog('edit', row)"
              >编辑</el-link
            >
            <el-popconfirm title="确定删除吗？" @confirm="deletePolicy(row)">
              <template #reference>
                <el-link type="primary">删除</el-link>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </vxe-grid>
    </base-page>
    <base-dialog
      :title="dialogTitle"
      v-model="dialogIsVisible"
      @confirm="handleConfirm"
      @close="handleDialogClose"
    >
      <el-form
        :model="dialogForm"
        ref="dialogFormRef"
        label-width="auto"
        style="max-width: 600px"
      >
        <el-form-item label="账号" prop="userAccount">
          <el-input
            v-model="dialogForm.userAccount"
            :disabled="formIsDisabled"
          />
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="dialogForm.userName" :disabled="formIsDisabled" />
        </el-form-item>
        <el-form-item label="角色" prop="roleCode">
          <el-select v-model="dialogForm.roleCode" :disabled="formIsDisabled">
            <el-option value="ADMIN" label="管理员"></el-option>
            <el-option value="SUB_ADMIN" label="子管理员"></el-option>
            <el-option value="USER" label="普通用户"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </base-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'

import { useUserManageApi } from '@/api/userManage'
const formConfigItems = reactive([
  {
    type: 'input',
    key: 'userAccount',
    label: '账号'
  },
  {
    type: 'input',
    key: 'userName',
    label: '姓名'
  },
  {
    type: 'select',
    key: 'roleCode',
    label: '角色',
    options: [
      {
        label: '管理员',
        value: 'ADMIN'
      },
      {
        label: '子管理员',
        value: 'SUB_ADMIN'
      },
      {
        label: '普通用户',
        value: 'USER'
      }
    ]
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
      field: 'userAccount',
      title: '账号'
    },
    {
      field: 'userName',
      title: '姓名',
      fixed: 'left'
    },
    {
      field: 'roleName',
      title: '角色'
    },
    { title: '操作', slots: { default: 'operate' }, fixed: 'right' }
  ],
  data: []
})

const listTotal = ref(0)

const onQuery = async params => {
  try {
    const res = await useUserManageApi.getUserList(params)
    gridOptions.data = res.data
    listTotal.value = res.total
  } catch (error) {
    console.log('🚀 ~ error:', error)
  }
}

const dialogIsVisible = ref(false)
const dialogTitle = ref('')
const dialogFormRef = ref()
const formIsDisabled = ref(true)
const currentOperateType = ref('')
const dialogForm = reactive({
  userName: '',
  userAccount: '',
  roleCode: ''
})
const titleObj = {
  add: '新增用户',
  edit: '编辑用户',
  view: '查看用户'
}
const handleConfirm = async () => {
  try {
    const body = {
      ...dialogForm
    }
    let res
    if (currentOperateType.value === 'add') {
      res = await useUserManageApi.addUser(body)
    }
    if (currentOperateType.value === 'edit') {
      res = await useUserManageApi.editUser(body)
    }

    ElMessage.success(res.message)
    dialogIsVisible.value = false
  } catch (error) {
    console.log(error)
  }
}

const viewUserDetail = row => {
  dialogForm.userName = row.userName
  dialogForm.userAccount = row.userAccount
  dialogForm.roleCode = row.roleCode
}

const editUserDetail = row => {
  dialogForm.userName = row.userName
  dialogForm.userAccount = row.userAccount
  dialogForm.roleCode = row.roleCode
}

const deletePolicy = async row => {
  try {
    const body = {
      roleCode: row.roleCode
    }
    const res = await useUserManageApi.deleteUser(body)
    ElMessage.success(res.message)
  } catch (error) {
    console.log(error)
  }
}

function handleDialogClose() {
  dialogFormRef?.value.resetFields()
}

function openDialog(type, row) {
  dialogTitle.value = titleObj[type]
  currentOperateType.value = type
  dialogIsVisible.value = true
  if (type === 'view') {
    formIsDisabled.value = true
    viewUserDetail(row)
  }
  if (type === 'add') {
    formIsDisabled.value = false
  }
  if (type === 'edit') {
    formIsDisabled.value = false
    editUserDetail(row)
  }
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
