<template>
  <div class="container">
    <el-button type="primary" @click="editAddPermission" plain>添加一级菜单/按钮</el-button>
    <el-input type="text" v-model="filterText" placeholder="请输入菜单/按钮名" style="padding-top: 5px"/>
    <div class="mgb20 tree-wrapper">
      <el-tree
          ref="tree"
          :data="data"
          node-key="id"
          icon="Open"
          render-after-expand="true"
          :filter-node-method="filterNode"
      >
        <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span style="margin-left: 200px">
            <a style="margin-left: 30px" @click="openAddRegion(data)"><el-icon><Plus/></el-icon></a>
            <a style="margin-left: 10px" @click="openUpdateRegion(data)"><el-icon><EditPen/></el-icon></a>
            <a style="margin-left: 10px" @click="openRemoveRegion(data)"><el-icon><Delete/></el-icon></a>
          </span>
        </span>
        </template>
      </el-tree>
    </div>
  </div>
  <el-dialog
      v-model="dialogVisible"
      title="添加菜单"
      width="30%"
      :before-close="handleClose"
  >
    <template #footer>
      <span class="dialog-footer">
        <el-form :model="addRegionInfo" label-width="120px">
          <el-form-item label="父菜单" name="label">
            <el-input v-model="addRegionInfo.pid" disabled style="width: 280px"/>
          </el-form-item>
          <el-form-item label="菜单/按钮名" name="code">
            <el-input v-model="addRegionInfo.name" placeholder="请输入菜单/按钮名" style="width: 280px"/>
          </el-form-item>
          <el-form-item label="类型" name="parentId">
          <el-select v-model="addRegionInfo.type" clearable class="m-2" placeholder="类型" size="default"
                     style="width: 280px">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
          </el-form-item>
          <el-form-item label="权限值" name="levelId">
            <el-input v-model="addRegionInfo.permissionValue" placeholder="请输入权限值" style="width: 280px"/>
          </el-form-item>
          <el-form-item label="访问路径" name="levelId">
            <el-input v-model="addRegionInfo.path" placeholder="请输入访问路径" style="width: 280px">
              <template #prepend>/</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addInRegion()">添加</el-button>
            <el-button @click="cancel()">取消</el-button>
          </el-form-item>
        </el-form>
      </span>
    </template>
  </el-dialog>
  <el-dialog
      v-model="updDialogVisible"
      title="更新菜单"
      width="30%"
      :before-close="handleClose"
  >
    <template #footer>
      <span class="dialog-footer">
        <el-form :model="updateRegionInfo" label-width="120px">
          <el-form-item label="父菜单" name="label">
            <el-input v-model="updateRegionInfo.pid" disabled style="width: 280px"/>
          </el-form-item>
          <el-form-item label="菜单/按钮名" name="code">
            <el-input v-model="updateRegionInfo.label" placeholder="请输入菜单/按钮名" style="width: 280px"/>
          </el-form-item>
          <el-form-item label="类型" name="parentId">
          <el-select v-model="updateRegionInfo.type" clearable class="m-2" placeholder="类型" size="default"
                     style="width: 280px">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
          </el-form-item>
          <el-form-item label="权限值" name="levelId">
            <el-input v-model="updateRegionInfo.permissionValue" placeholder="请输入权限值" style="width: 280px"/>
          </el-form-item>
          <el-form-item label="访问路径" name="levelId">
            <el-input v-model="updateRegionInfo.path" placeholder="请输入访问路径" style="width: 280px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateInRegion()">添加</el-button>
            <el-button @click="cancel()">取消</el-button>
          </el-form-item>
        </el-form>
      </span>
    </template>
  </el-dialog>
  <el-dialog
      v-model="delDialogVisible"
      title="删除菜单"
      width="30%"
      :before-close="handleClose"
  >
    <em>是否确认删除该菜单</em><br><br><br>
    <small style="margin-left: 200px">ps:只能删除二级菜单、没有子菜单的菜单</small>
    <template #footer>
      <span class="dialog-footer">
            <el-button type="primary" @click="deleteInRegion()">删除</el-button>
            <el-button @click="cancel()">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, ref, reactive, watch} from 'vue';
import {ElMessage, ElTree} from 'element-plus';
import {usePermissStore} from '../store/permiss';
import {getRegionTreeInfo, addRegion, updateRegion, deleteRegion} from "../api/region";
import RegionType from "../model/Region";
import {addPermissionInfo, deletePermissionInfo, getPermissionInfo, updatePermissionInfo} from "../api/permission";

const role = ref<string>('admin');

const Tree = reactive<any>({})
/**
 * 获取地区递归数
 */
const data: Tree[] = ref<Tree[]>([])
onMounted(
    () => {
      showRegionInfo()
    }
)

/**
 * 获取地区
 */
const showRegionInfo = async () => {
  const showData = await getPermissionInfo()
  if (showData.code == 0) {
    data.value = showData.data
  } else {
    ElMessage.error(showData.message)
  }
}

//添加一级权限
interface permission {
  id: number,
  pid: number,
  name: string,
  type: number,
  permissionValue: string,
  path: string,
  label: string
}

const editAddPermission = () => {
  addRegionInfo.pid = 0
  dialogVisible.value = true
}
const options = [
  {
    value: 1,
    label: '菜单',
  },
  {
    value: 2,
    label: '按钮',
  }
]
/**
 * 关键字过滤
 */
const filterText = ref<string>('')
watch(filterText, (val) => {
  tree.value!.filter(val)
})

const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.label.includes(value)
}

/**
 * 添加地区
 */
const dialogVisible = ref<boolean>(false)
const addRegionInfo = reactive<permission>({})
const openAddRegion = (data: Tree) => {
  addRegionInfo.pid = data.id
  dialogVisible.value = true
}
const addInRegion = async () => {
  addRegionInfo.path = '/' + addRegionInfo.path
  const result = await addPermissionInfo(addRegionInfo)
  if (result.code == 0) {
    ElMessage.success('添加菜单成功！')
    dialogVisible.value = false
    addRegionInfo.name = ''
    addRegionInfo.pid = 0
    addRegionInfo.path = ''
    addRegionInfo.permissionValue = ''
    await showRegionInfo()
  } else {
    ElMessage.error(result.message)
  }
}

/**
 * 修改地区
 */
const updateRegionInfo = ref<permission>({})
const updDialogVisible = ref<boolean>()
const openUpdateRegion = (data: any) => {
  updDialogVisible.value = true
  updateRegionInfo.value = {...data}
}
const updateInRegion = async () => {
  updateRegionInfo.value.name = updateRegionInfo.value.label
  const result = await updatePermissionInfo(updateRegionInfo.value)
  if (result.code == 0) {
    ElMessage.success('修改菜单成功！')
    updDialogVisible.value = false
    await showRegionInfo()
  } else {
    ElMessage.error(result.message)
  }
}

/**
 * 删除地区
 */
const deleteRegionInfo = reactive<any>({
  ids: []
})
const delDialogVisible = ref<boolean>()
const openRemoveRegion = (data: any) => {
  delDialogVisible.value = true
  deleteRegionInfo.ids?.push(data.id)
}

const deleteInRegion = async () => {
  const result = await deletePermissionInfo(deleteRegionInfo)
  if (result.code == 0) {
    ElMessage.success('删除菜单成功！')
    delDialogVisible.value = false
    deleteRegionInfo.ids = []
    await showRegionInfo()
  } else {
    deleteRegionInfo.ids = []
    delDialogVisible.value = false
    ElMessage.error(result.message)
  }
}

const cancel = () => {
  dialogVisible.value = false
  updDialogVisible.value = false
  delDialogVisible.value = false
}
</script>

<style scoped>
.tree-wrapper {
  max-width: 1190px;
}

.label {
  font-size: 14px;
}

.dialog-footer {
  margin: 0;
  padding: 0;
}

.region-input {
  margin-bottom: 10px
}
</style>
