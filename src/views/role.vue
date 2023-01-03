<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-button icon="Plus" @click="handleAddRole" plain>添加角色</el-button>
        <el-button type="danger" icon="Delete" @click="batchDelete" plain>删除</el-button>
      </div>
      <el-table
          :data="tableData"
          border
          stripe
          class="table"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          header-cell-class-name="table-header">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleValue" label="角色编码"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="260" align="center">
          <template #default="scope">
            <el-button text type="success" :icon="Edit" @click="handleAddPermission(scope.$index, scope.row)">
              分配权限
            </el-button>
            <el-button text type="warning" :icon="Edit" @click="handleEdit(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button text type="danger" :icon="Delete" @click="handleDelete(scope.$index,scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="query.pageNum"
            :page-size="query.pageSize"
            :total="pageTotal"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
  </div>

  <el-dialog title="添加角色" v-model="editVisible" width="30%">
    <el-form label-width="70px">
      <el-form-item label="角色名称">
        <el-input v-model="addRoleReq.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input v-model="addRoleReq.roleValue"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveAddRole">确 定</el-button>
				</span>
    </template>
  </el-dialog>
  <el-dialog title="编辑角色" v-model="updateVisible" width="30%">
    <el-form label-width="70px">
      <el-form-item label="角色id">
        <el-input v-model="editRoleReq.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="角色名称">
        <el-input v-model="editRoleReq.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input v-model="editRoleReq.roleValue"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
				<span class="dialog-footer">
					<el-button @click="updateVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveUpdateRole">确 定</el-button>
				</span>
    </template>
  </el-dialog>
  <el-dialog title="分配权限" v-model="addPermissionVisible" width="30%">
    <el-tree
        ref="tree"
        :data="data"
        node-key="id"
        icon="Open"
        show-checkbox
        :default-checked-keys="defaultCheckKey"
        render-after-expand="true"
        :filter-node-method="filterNode"
    >
    </el-tree>
    <template #footer>
				<span class="dialog-footer">
					<el-button @click="addPermissionVisible = false">取 消</el-button>
					<el-button type="primary" @click="savePermissionRole">确 定</el-button>
				</span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue';
import {ElMessage, ElMessageBox, ElTree, UploadUserFile} from 'element-plus';
import {getAllOriginInfo, addToOrigin, updateToOrigin, deleteToOrigin} from "../api/origin";
import {uploadOssImg} from "../api/oss";
import OriginType from "../model/Origin";
import {useRouter} from "vue-router";
import CollegeSelect from "../components/collegeSelect.vue";
import User from "../model/User";
import UserInfo from "../model/UserInfo";
import {deleteUserInfo, getUserInfo, updateUserInfo} from "../api/user";
import RegionSelect from "../components/regionSelect.vue";
import {addRoleInfo, deleteRoleInfo, getRoleInfo, updateRoleInfo} from "../api/role";
import {addRoleToPermission, getPermissionInfo, showRoleToPermission} from "../api/permission";
import {Tree} from "element-plus/es/components/tree-v2/src/types";

const query = reactive({
  pageNum: 1,
  pageSize: 10
});
const tableData = ref<any[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getOriginInfo = async () => {
  const result = await getRoleInfo(query)
  if (result.code == 0) {
    tableData.value = result.data.items
    pageTotal.value = result.data.total
  } else {
    ElMessage.error(result.message)
  }
}
onMounted(() => {
  getOriginInfo()
})

/**
 * 添加角色
 */
interface roleReq {
  id: bigint,
  roleName: string,
  roleValue: string
}

const addRoleReq = reactive<roleReq>({})
const editVisible = ref<boolean>(false)
const handleAddRole = () => {
  editVisible.value = true
}
const saveAddRole = async () => {
  const result = await addRoleInfo(addRoleReq)
  if (result.code == 0) {
    ElMessage.success('添加角色成功')
    editVisible.value = false
    await getOriginInfo()
  } else {
    ElMessage.error(result.message)
    editVisible.value = false
  }
}
//编辑角色
const editRoleReq = ref<roleReq>({})
const updateVisible = ref<boolean>(false)
const handleEdit = (index: any, row: any) => {
  updateVisible.value = true
  editRoleReq.value = {...row}
}
const saveUpdateRole = async () => {
  const result = await updateRoleInfo(editRoleReq.value)
  if (result.code == 0) {
    ElMessage.success('更新角色成功')
    updateVisible.value = false
    await getOriginInfo()
  } else {
    ElMessage.error(result.message)
    updateVisible.value = false
  }
}
//分配权限
const treeRef = ref<InstanceType<typeof ElTree>>()
const addPermissionVisible = ref<boolean>(false)
const handleAddPermission = (index: any, row: any) => {
  addPermissionVisible.value = true
  addRoleToPermissionReq.roleId = row.id
  showPermissionInfo()
  showRolePermission()
}
const data: Tree[] = ref<Tree[]>([])
const showPermissionInfo = async () => {
  const showData = await getPermissionInfo()
  if (showData.code == 0) {
    data.value = showData.data
  } else {
    ElMessage.error(showData.message)
  }
}
const tree = ref<InstanceType<typeof ElTree>>();
const addRoleToPermissionReq = reactive<any>({
  roleId: null,
  permissionId: null
})
const savePermissionRole = async () => {
  addRoleToPermissionReq.permissionId = tree.value!.getCheckedKeys(false)
  const result = await addRoleToPermission(addRoleToPermissionReq)
  if (result.code == 0) {
    ElMessage.success('添加角色权限成功')
    addPermissionVisible.value = false
  } else {
    ElMessage.error(result.message)
    addPermissionVisible.value = false
  }
}
const defaultCheckKey = ref<number[]>([])
const showRolePermission = async () => {
  defaultCheckKey.value = []
  const result = await showRoleToPermission(addRoleToPermissionReq.roleId)
  console.log(result)
  if (result.code == 0) {
    defaultCheckKey.value = result.data.permissionIds
  } else {
    ElMessage.error(result.message)
  }
}
// 分页导航
const handlePageChange = (val: number) => {
  query.pageNum = val;
  getOriginInfo();
};

// 删除操作
const deleteQuery = reactive<any>({
  ids: []
})
const handleDelete = (index: number, row: any) => {
  ElMessageBox.confirm(
      '确定要删除该角色吗?',
      'Warning',
  )
      .then(async () => {
        deleteQuery.ids?.push(row.id)
        const result = await deleteRoleInfo(deleteQuery)
        if (result.code == 0) {
          ElMessage({
            type: 'success',
            message: '删除角色成功'
          })
          await getOriginInfo()
        } else {
          ElMessage.error(result.message)
        }
      })
};
/**
 * 多选框事件
 */
const selectionQuery = reactive<any>({
      ids: []
    }
)
const handleSelectionChange = (rows?: any) => {
  rows.forEach((row: any) => {
    selectionQuery.ids.push(row.id)
  })
}

const batchDelete = () => {
  if (selectionQuery.ids[0] == null) {
    ElMessage.warning("未选中删除角色目标")
    return;
  }
  ElMessageBox.confirm(
      '确定要删除该角色吗?',
      'Warning',
  )
      .then(async () => {
        const result = await deleteRoleInfo(selectionQuery)
        if (result.code == 0) {
          ElMessage({
            type: 'success',
            message: '批量删除角色成功'
          })
          await getOriginInfo()
        } else {
          ElMessage.error(result.message)
        }
      })
}
</script>

<style scoped>
.handle-box {
  margin-bottom: 30px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
}

.table {
  width: 100%;
  font-size: 14px;
}

.mr10 {
  margin-right: 10px;
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
