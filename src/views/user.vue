<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.userName" placeholder="用户名" class="handle-input mr10"></el-input>
        <college-select style="width: 250px;margin-left: 15px" @get-college-id="getCollegeId"/>
        <region-select style="width: 250px;margin-left: 15px" @get-region-id="getRegionId"/>
        <el-button icon="Search" @click="handleSearch" plain>搜索</el-button>
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
        <el-table-column prop="userId" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="collegeName" label="所属学院"></el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="userInfo.age" label="年龄"></el-table-column>
        <el-table-column label="用户头像(查看大图)" align="center">
          <template #default="scope">
            <el-image
                class="table-td-thumb"
                :src="scope.row.userAvatar"
                :z-index="10"
                :preview-src-list="[scope.row.userAvatar]"
                preview-teleported
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag
                :type="scope.row.status === 1 ? 'success' : scope.row.isDelete === 1 ? 'danger' : ''"
            >
              <span v-if="scope.row.status === 1">在校</span>
              <span v-else>毕业</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="joinTime" label="注册时间"></el-table-column>
        <el-table-column label="操作" width="260" align="center">
          <template #default="scope">
            <el-button text type="success" :icon="Edit" @click="handleSelectRole(scope.$index, scope.row)"
                       v-permiss="7">
              分配角色
            </el-button>
            <el-button text type="warning" :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="7">
              编辑
            </el-button>
            <el-button text type="danger" :icon="Delete" @click="handleDelete(scope.$index,scope.row)" v-permiss="7">
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

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑用户信息" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="用户id">
          <el-input v-model="editOrigin.userId" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户id">
          <el-input v-model="editOrigin.email" disabled></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="editOrigin.userInfo.age"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editOrigin.status" clearable>
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="editOrigin.userName"></el-input>
        </el-form-item>
        <el-form-item label="学院">
          <college-select @get-college-id="getCollegeId" :collegeName="editOrigin.collegeName"/>
        </el-form-item>
        <el-form-item label="上传头像">
          <el-avatar @click="removeAvatar" v-if="editOrigin.userAvatar!=''" shape="square" :size="200" :fit="cover"
                     :src="editOrigin.userAvatar"/>
          <el-upload
              v-else
              :file-list="fileList"
              list-type="picture-card"
              accept="image/jpeg,image/jpg,image/png"
              :http-request="upload"
              :on-success="uploadSuccess"
              :before-upload="checkFile"
              ref="upload"
          >
            <el-icon>
              <Plus/>
            </el-icon>
            <template #file="{ file }">
              <div>
                <img class="el-upload-list__item-thumbnail" :src="file.url"/>
              </div>
              <span class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in/></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
          >
            <el-icon><Delete/></el-icon>
          </span>
        </span>
            </template>
          </el-upload>
          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="组织照片"/>
          </el-dialog>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
      </template>
    </el-dialog>
    <el-dialog title="分配角色" v-model="selectRoleVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="所属角色">
          <el-select v-model="addUserRoleReq.roleId" clearable class="m-2" placeholder="角色类型" size="default"
                     style="width: 280px">
            <el-option
                v-for="item in optionRole"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="doAddUserRole">确 定</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue';
import {ElMessage, ElMessageBox, UploadUserFile} from 'element-plus';
import {getAllOriginInfo, addToOrigin, updateToOrigin, deleteToOrigin} from "../api/origin";
import {uploadOssImg} from "../api/oss";
import OriginType from "../model/Origin";
import {useRouter} from "vue-router";
import CollegeSelect from "../components/collegeSelect.vue";
import User from "../model/User";
import UserInfo from "../model/UserInfo";
import {deleteUserInfo, getUserInfo, updateUserInfo} from "../api/user";
import RegionSelect from "../components/regionSelect.vue";
import {addUserRoleInfo, getRoleInfo} from "../api/role";

interface TableItem {
  user: User,
  userInfo: UserInfo
}

const query = reactive({
  collegeId: null,
  regionId: null,
  userName: null,
  status: null,
  pageNum: 1,
  pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getOriginInfo = async () => {
  const result = await getUserInfo(query)
  console.log(result)
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

const getCollegeId = (id: bigint) => {
  query.collegeId = id
  editOrigin.value.collegeId = id
}
const getRegionId = (id: bigint) => {
  query.regionId = id
}

/**
 * 文件上传
 */
const checkFile = (file: any) => {
  const isFileTypeValid = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
  if (!isFileTypeValid) {
    ElMessage.error('只支持上传 jpg / png / gif 格式的图片');
    return false;
  }
  const isLt1M = file.size / 1024 / 1024 < 1;
  if (!isLt1M) {
    ElMessage.error('图片大小不能超过 1M');
    return false;
  }
  return true;
}
const fileList = ref<UploadUserFile[]>([])
const upload = async (info: any) => {
  const {file} = info
  fileList.value.push(file)
  const formData = new FormData();
  formData.append('file', file);
  const result = await uploadOssImg(formData)
  if (result.code == 0) {
    editOrigin.value.userAvatar = result.data
    dialogImageUrl.value = result.data
  }
}
const uploadSuccess = () => {
  ElMessage.success('文件上传成功！！')
}
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)

const handleRemove = (file: UploadFile) => {
  fileList.value = []
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
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
      '确定要删除该用户吗?',
      'Warning',
  )
      .then(async () => {
        deleteQuery.ids?.push(row.userId)
        const result = await deleteUserInfo(deleteQuery)
        if (result.code == 0) {
          ElMessage({
            type: 'success',
            message: '删除用户成功'
          })
          await getOriginInfo()
        } else {
          ElMessage.error(result.message)
        }
      })
};

// 表格编辑时弹窗和保存
const editOrigin = ref<TableItem>({})
const editVisible = ref(false);
const removeAvatar = () => {
  editOrigin.value.userAvatar = ''
}
const handleEdit = (index: number, row: any) => {
  editOrigin.value = {...row}
  editVisible.value = true;
};
const user = reactive<User>({})
const userInfo = reactive<UserInfo>({})
const param = reactive<any>({
  user, userInfo
})
const saveEdit = async () => {
  user.id = editOrigin.value.userId
  user.collegeId = editOrigin.value.collegeId
  user.username = editOrigin.value.userName
  user.status = editOrigin.value.status
  userInfo.age = editOrigin.value.userInfo.age
  userInfo.id = editOrigin.value.userId
  user.avatar = editOrigin.value.userAvatar
  const result = await updateUserInfo(param)
  if (result.code == 0) {
    ElMessage.success('更新用户成功！')
    editVisible.value = false;
    await getOriginInfo()
  } else {
    ElMessage.error(result.message)
    editVisible.value = false;
  }
}

/**
 * 条件查询
 */
const handleSearch = async () => {
  await getOriginInfo()
}

/**
 * 多选框事件
 */
const selectionQuery = reactive<any>({
      ids: []
    }
)
const handleSelectionChange = (rows?: any) => {
  rows.forEach((row: any) => {
    selectionQuery.ids.push(row.userId)
  })
}

const batchDelete = () => {
  if (selectionQuery.ids[0] == null) {
    ElMessage.warning("未选中删除用户目标")
    return;
  }
  ElMessageBox.confirm(
      '确定要删除该用户吗?',
      'Warning',
  )
      .then(async () => {
        const result = await deleteUserInfo(selectionQuery)
        if (result.code == 0) {
          ElMessage({
            type: 'success',
            message: '批量删除用户成功'
          })
          await getOriginInfo()
        } else {
          ElMessage.error(result.message)
        }
      })
}

const options = [
  {
    value: 1,
    label: '在校',
  },
  {
    value: 2,
    label: '毕业',
  }
]

/**
 * 分配角色
 */
const selectRoleVisible = ref<boolean>(false)
const addUserRoleReq = reactive<any>({
  roleId: null,
  userId: null
})
const optionRole = ref<any[]>([])
const roleQuery = reactive({
  pageNum: 1,
  pageSize: 100
});
const handleSelectRole = (index: number, row: any) => {
  selectRoleVisible.value = true
  addUserRoleReq.userId = row.userId
  getRoleData()
}
const getRoleData = async () => {
  const result = await getRoleInfo(roleQuery)
  if (result.code == 0) {
    optionRole.value = result.data.items
  } else {
    ElMessage.error(result.message)
  }
}
const doAddUserRole = async () => {
  const result = await addUserRoleInfo(addUserRoleReq)
  if (result.code == 0) {
    ElMessage.success('分配角色成功')
    selectRoleVisible.value = false
  } else {
    ElMessage.error(result.message)
    selectRoleVisible.value = false
  }
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
