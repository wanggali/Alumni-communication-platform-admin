<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.userName" placeholder="用户名" class="handle-input mr10"></el-input>
        <el-input v-model="query.originName" placeholder="组织名" class="handle-input mr10"></el-input>
        <el-input v-model="query.collegeName" placeholder="学院名" class="handle-input mr10"
                  style="width: 278px;"></el-input>
        <el-button icon="Search" @click="handleSearch" plain>搜索</el-button>
        <el-button type="primary" icon="Plus" @click="openAddOrigin" plain>新增</el-button>
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
        <el-table-column prop="originName" label="组织名"></el-table-column>
        <el-table-column prop="userName" label="创建人"></el-table-column>
        <el-table-column prop="collegeName" label="所属学院"></el-table-column>
        <el-table-column label="组织头像(查看大图)" align="center">
          <template #default="scope">
            <el-image
                class="table-td-thumb"
                :src="scope.row.avatar"
                :z-index="10"
                :preview-src-list="[scope.row.avatar]"
                preview-teleported
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag
                :type="scope.row.isDelete === 0 ? 'success' : scope.row.isDelete === 1 ? 'danger' : ''"
            >
              正常
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间"></el-table-column>
        <el-table-column label="操作" width="260" align="center">
          <template #default="scope">
            <el-button text type="warning" :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
              编辑
            </el-button>
            <el-button text type="danger" :icon="Delete" @click="handleDelete(scope.$index,scope.row)" v-permiss="16">
              删除
            </el-button>
            <el-button text type="success" @click="goOriginUser(scope.$index, scope.row)" v-permiss="17">
              组织列表
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

    <el-dialog title="添加组织" v-model="addVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="addOrigin.name"></el-input>
        </el-form-item>
        <el-form-item label="地区">
          <college-select @get-college-id="getCollegeId"/>
        </el-form-item>
        <el-form-item label="用户id">
          <el-input v-model="addOrigin.uid"></el-input>
        </el-form-item>
        <el-form-item label="上传头像">
          <el-upload
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
					<el-button @click="addVisible = false">取 消</el-button>
					<el-button type="primary" @click="addOriginInfo">确 定</el-button>
				</span>
      </template>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="组织名">
          <el-input v-model="editOrigin.name"></el-input>
        </el-form-item>
        <el-form-item label="学院">
          <college-select @get-college-id="getCollegeId" :collegeName="editOrigin.collegeName"/>
        </el-form-item>
        <el-form-item label="用户id">
          <el-input v-model="editOrigin.uid" disabled></el-input>
        </el-form-item>
        <el-form-item label="上传头像">
          <el-avatar @click="removeAvatar" v-if="editOrigin.avatar!=''" shape="square" :size="200" :fit="cover"
                     :src="editOrigin.avatar"/>
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


interface TableItem {
  id: bigint;
  cid: bigint;
  uid: bigint;
  collegeName: string;
  userName: string;
  originName: string;
  avatar: string;
  isDelete: number;
  createTime: string
}

const query = reactive({
  collegeName: '',
  originName: '',
  userName: '',
  pageNum: 1,
  pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getOriginInfo = async () => {
  const result = await getAllOriginInfo(query)
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
 * 新增操作
 */
const addVisible = ref<boolean>(false)
const addOrigin = reactive<OriginType>({})
const openAddOrigin = () => {
  addOrigin.name = ''
  addVisible.value = true
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
    addOrigin.avatar = result.data
    editOrigin.value.avatar = result.data
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
/**
 * 获取学院id
 **/
const getCollegeId = (id: bigint) => {
  addOrigin.cid = id
  editOrigin.value.cid = id
}

/**
 *添加组织
 */
const addOriginInfo = async () => {
  const result = await addToOrigin(addOrigin)
  if (result.code == 0) {
    ElMessage.success('添加组织成功！')
    addVisible.value = false
    await getOriginInfo()
  } else {
    ElMessage.error(result.message)
    addVisible.value = false
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
      '确定要删除该组织吗?',
      'Warning',
  )
      .then(async () => {
        deleteQuery.ids?.push(row.id)
        const result = await deleteToOrigin(deleteQuery)
        if (result.code == 0) {
          ElMessage({
            type: 'success',
            message: '删除组织成功'
          })
          await getOriginInfo()
        } else {
          ElMessage.error(result.message)
        }
      })
};

// 表格编辑时弹窗和保存
const editOrigin = ref<OriginType>({})
const editVisible = ref(false);
const removeAvatar = () => {
  editOrigin.value.avatar = ''
}
const handleEdit = (index: number, row: any) => {
  editOrigin.value = {...row}
  editOrigin.value.name = row.originName
  editVisible.value = true;
};
const saveEdit = async () => {
  const result = await updateToOrigin(editOrigin.value)
  if (result.code == 0) {
    ElMessage.success('更新组织成功！')
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
 * 跳转路由到组织列表
 */
const router = useRouter();
const goOriginUser = (index: number, row: any) => {
  console.log(index, row)
  router.push({path: `/originUser/${row?.id}`})
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
    selectionQuery.ids.push(row.id)
  })
}

const batchDelete = () => {
  if (selectionQuery.ids[0] == null) {
    ElMessage.warning("未选中删除学院目标")
    return;
  }
  ElMessageBox.confirm(
      '确定要删除该组织吗?',
      'Warning',
  )
      .then(async () => {
        const result = await deleteToOrigin(selectionQuery)
        if (result.code == 0) {
          ElMessage({
            type: 'success',
            message: '批量删除组织成功'
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
