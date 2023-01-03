<template>
  <div>
    <div class="handle-box">
      <el-button type="primary" icon="Plus" @click="openAddOrigin" plain>新增公告</el-button>
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
        <el-table-column label="公告内容">
          <template #default="scope">
            <el-button type="success" plain size="small" @click="showMessage(scope.$index,scope.row)">查看帖子</el-button>
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

  <el-dialog v-model="dialogMessageVisible" title="公告信息">

    <template #default>
      <v-md-preview :text="text"></v-md-preview>
      <span class="dialog-footer">
        <el-button @click="dialogMessageVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog title="发布公告" v-model="addVisible" width="75%">
    <el-form label-width="70px">
      <el-form-item label="公告内容">
        <Content @show-message="getText"/>
      </el-form-item>
    </el-form>
    <template #footer>
				<span class="dialog-footer">
					<el-button @click="addVisible = false">取 消</el-button>
					<el-button type="primary" @click="addDoNotice">确 定</el-button>
				</span>
    </template>
  </el-dialog>

  <el-dialog title="修改公告" v-model="editVisible" width="75%">
    <el-form label-width="70px">
      <el-form-item label="id">
        <el-input v-model="editNotice.id" disabled/>
      </el-form-item>
      <el-form-item label="公告内容">
        <Content @show-message="getText" :text="editNotice.content"/>
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
import {ref, reactive, onMounted} from 'vue';
import {ElMessage, ElMessageBox, UploadUserFile} from 'element-plus';
import {getAllOriginInfo, addToOrigin, updateToOrigin, deleteToOrigin} from "../api/origin";
import {uploadOssImg} from "../api/oss";
import OriginType from "../model/Origin";
import {useRouter} from "vue-router";
import CollegeSelect from "../components/collegeSelect.vue";
import Notice from "../model/Notice";
import {addNoticeInfo, deleteNoticeInfo, getNoticeInfo, updateNoticeInfo} from "../api/notice";

const query = reactive({
  pageNum: 1,
  pageSize: 10
});
const tableData = ref<Notice[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getOriginInfo = async () => {
  const result = await getNoticeInfo(query)
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
const addNotice = reactive<Notice>({})
const openAddOrigin = () => {
  addNotice.content = ''
  addVisible.value = true
}
const addDoNotice = async () => {
  const result = await addNoticeInfo(addNotice)
  if (result.code == 0) {
    ElMessage.success('发布公告成功！')
    addVisible.value = false
    await getOriginInfo()
  } else {
    ElMessage.error(result.message)
    addVisible.value = false
  }
}

//显示markdown帖子
const dialogMessageVisible = ref(false)
const text = ref<string>('')
const showMessage = (index: number, row: any) => {
  dialogMessageVisible.value = true
  text.value = row.content
}
const getText = (text: string) => {
  addNotice.content = text
  editNotice.value.content = text
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
      '确定要删除该公告吗?',
      'Warning',
  )
      .then(async () => {
        deleteQuery.ids?.push(row.id)
        const result = await deleteNoticeInfo(deleteQuery)
        if (result.code == 0) {
          ElMessage({
            type: 'success',
            message: '删除公告成功'
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
const editNotice = ref<Notice>({})
const editVisible = ref(false);
const handleEdit = (index: number, row: any) => {
  editNotice.value = {...row}
  editVisible.value = true;
};
const saveEdit = async () => {
  const result = await updateNoticeInfo(editNotice.value)
  if (result.code == 0) {
    ElMessage.success('更新公告成功！')
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
    ElMessage.warning("未选中删除公告目标")
    return;
  }
  ElMessageBox.confirm(
      '确定要删除该公告吗?',
      'Warning',
  )
      .then(async () => {
        const result = await deleteNoticeInfo(selectionQuery)
        if (result.code == 0) {
          ElMessage({
            type: 'success',
            message: '批量删除公告成功'
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
