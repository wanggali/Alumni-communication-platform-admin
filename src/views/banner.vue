<template>
  <div>
    <div class="handle-box">
      <el-button type="primary" icon="Plus" @click="openAddOrigin" plain>新增轮播图</el-button>
      <el-button type="danger" icon="Delete" @click="batchDelete" plain>删除</el-button>
    </div>
    <div class="container">
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
        <el-table-column prop="name" label="名字" width="150" align="center"></el-table-column>
        <el-table-column label="轮播图头像(查看大图)" align="center">
          <template #default="scope">
            <el-image
                class="table-td-thumb"
                :src="scope.row.imageUrl"
                :z-index="10"
                :preview-src-list="[scope.row.imageUrl]"
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
        <el-table-column prop="createTime" label="发布时间"></el-table-column>
        <el-table-column label="操作" width="260" align="center">
          <template #default="scope">
            <el-button text type="warning" :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
              编辑
            </el-button>
            <el-button text type="danger" :icon="Delete" @click="handleDelete(scope.$index,scope.row)" v-permiss="16">
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

  <el-dialog title="发布轮播图" v-model="addVisible" width="30%">
    <el-form label-width="70px">
      <el-form-item label="名称">
        <el-input v-model="addNotice.name"/>
      </el-form-item>
      <el-form-item label="轮播图">
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
      </el-form-item>
    </el-form>
    <template #footer>
				<span class="dialog-footer">
					<el-button @click="addVisible = false">取 消</el-button>
					<el-button type="primary" @click="addDoNotice">确 定</el-button>
				</span>
    </template>
  </el-dialog>

  <el-dialog title="编辑轮播图" v-model="editVisible" width="30%">
    <el-form label-width="70px">
      <el-form-item label="id">
        <el-input v-model="editNotice.id" disabled/>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="editNotice.name"/>
      </el-form-item>
      <el-form-item label="公告内容">
        <el-avatar @click="removeAvatar" v-if="editNotice.imageUrl!=''" shape="square" :size="200" :fit="cover"
                   :src="editNotice.imageUrl"/>
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
      </el-form-item>
    </el-form>
    <template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';
import {ElMessage, ElMessageBox, UploadUserFile} from 'element-plus';
import Notice from "../model/Notice";
import {addNoticeInfo, deleteNoticeInfo, getNoticeInfo, updateNoticeInfo} from "../api/notice";
import Banner from "../model/Banner";
import {addBannerInfo, deleteBannerInfo, getBannerInfo, updateBannerInfo} from "../api/banner";
import UploadAliyun from "../components/uploadAliyun.vue";
import {uploadOssImg} from "../api/oss";

const query = reactive({
  pageNum: 1,
  pageSize: 10
});
const tableData = ref<Banner[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getOriginInfo = async () => {
  const result = await getBannerInfo(query)
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
const addNotice = reactive<Banner>({})
const openAddOrigin = () => {
  addNotice.name = ''
  addNotice.imageUrl = ''
  addVisible.value = true
}
const addDoNotice = async () => {
  const result = await addBannerInfo(addNotice)
  if (result.code == 0) {
    ElMessage.success('添加轮播图成功！')
    addVisible.value = false
    await getOriginInfo()
  } else {
    ElMessage.error(result.message)
    addVisible.value = false
  }
}

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
      '确定要删除该轮播图吗?',
      'Warning',
  )
      .then(async () => {
        deleteQuery.ids?.push(row.id)
        const result = await deleteBannerInfo(deleteQuery)
        if (result.code == 0) {
          ElMessage({
            type: 'success',
            message: '删除轮播图成功'
          })
          await getOriginInfo()
        } else {
          ElMessage({
            type: 'error',
            message: result.message
          })
        }
      })
};

// 表格编辑时弹窗和保存
const editNotice = ref<Banner>({})
const editVisible = ref(false);
const handleEdit = (index: number, row: any) => {
  editNotice.value = {...row}
  editVisible.value = true;
};
const removeAvatar = () => {
  editNotice.value.imageUrl = ''
}
const saveEdit = async () => {
  const result = await updateBannerInfo(editNotice.value)
  if (result.code == 0) {
    ElMessage.success('更新轮播图成功！')
    editVisible.value = false;
    await getOriginInfo()
  } else {
    ElMessage.error(result.message)
    editVisible.value = false;
  }
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
    ElMessage.warning("未选中删除轮播图目标")
    return;
  }
  ElMessageBox.confirm(
      '确定要删除该轮播图吗?',
      'Warning',
  )
      .then(async () => {
        const result = await deleteBannerInfo(selectionQuery)
        if (result.code == 0) {
          ElMessage({
            type: 'success',
            message: '批量删除轮播图成功'
          })
          await getOriginInfo()
        } else {
          ElMessage({
            type: 'error',
            message: result.message
          })
        }
      })
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
    addNotice.imageUrl = result.data
    editNotice.value.imageUrl = result.data
  }
}
const uploadSuccess = () => {
  ElMessage.success('文件上传成功！！')
}
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
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
