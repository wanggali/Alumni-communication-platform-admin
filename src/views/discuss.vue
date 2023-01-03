<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.title" placeholder="标题名称" class="handle-input mr10"></el-input>
        <el-select v-model="query.sortType" class="m-2" placeholder="排序规则" size="default" style="margin-left: 15px">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <el-select v-model="query.isAuditType" clearable class="m-2" placeholder="过滤规则" size="default"
                   style="margin-right: 30px;margin-left: 30px">
          <el-option
              v-for="item in auditOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
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
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="tagName" label="标签名称" width="100" align="center"></el-table-column>
        <el-table-column prop="title" label="帖子标题" width="170" align="center"></el-table-column>
        <el-table-column label="帖子信息" width="150" align="center">
          <template #default="scope">
            <el-button type="success" plain size="small" @click="showMessage(scope.$index,scope.row)">查看帖子</el-button>
          </template>
        </el-table-column>
        <el-table-column label="帖子封面(查看大图)" align="center">
          <template #default="scope">
            <el-image
                class="table-td-thumb"
                :src="scope.row.cover"
                :z-index="10"
                :preview-src-list="[scope.row.cover]"
                preview-teleported
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="up" label="点赞数"></el-table-column>
        <el-table-column prop="down" label="踩数"></el-table-column>
        <el-table-column label="审批情况" align="center">
          <template #default="scope">
            <el-tag
                :type="scope.row.isAudit === 0 ? 'info' : scope.row.isAudit === 1 ?'success': 'danger'"
            >
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间" width="100"></el-table-column>
        <el-table-column label="操作" width="230" align="center">
          <template #default="scope">
            <el-button  plain type="danger" @click="handleDelete(scope.$index,scope.row)" v-permiss="8">
              删除
            </el-button>
            <el-popconfirm
                confirm-button-text="通过"
                cancel-button-text="拒绝"
                icon-color="#626AEF"
                :icon="InfoFilled"
                @confirm="confirmEvent(scope.row)"
                @cancel="cancelEvent(scope.row)"
                title="审批帖子">
              <template #reference>
                <el-button v-permiss="21">审核</el-button>
              </template>
            </el-popconfirm>
            <el-button plain type="success" @click="handleCommentAndReply(scope.$index,scope.row)" v-permiss="8">
              评论
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

  <el-dialog v-model="dialogMessageVisible" title="帖子信息">

    <template #default>
      <v-md-preview :text="text"></v-md-preview>
      <span class="dialog-footer">
        <el-button @click="dialogMessageVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import {deleteDiscussInfo, getDiscussInfo, updateDiscussInfo} from "../api/discuss";
import Discuss from "../model/Discuss";
import {ElMessage, ElMessageBox} from "element-plus";
import {useRouter} from "vue-router";
import CollegeSelect from "../components/collegeSelect.vue";
import RegionSelect from "../components/regionSelect.vue";
import {usePermissStore} from "../store/permiss";

const query = reactive<any>({
  pageNum: 1,
  pageSize: 10,
  title: '',
  sortType: null,
  isAuditType: ''
})
const pageTotal = ref<number>(0)
const tableData = ref<Discuss[]>([])
const getTableData = async () => {
  const result = await getDiscussInfo(query)
  if (result.code == 0) {
    tableData.value = result.data.items
    pageTotal.value = result.data.total
  } else {
    ElMessage.error(result.message)
  }
}
onMounted(() => {
  getTableData()
})

const selectionQuery = reactive<any>({
      ids: []
    }
)
const handleSelectionChange = (rows?: any) => {
  rows.forEach((row: any) => {
    selectionQuery.ids.push(row.id)
  })
}

// 分页导航
const handlePageChange = (val: number) => {
  query.pageNum = val;
  getTableData()
};

//显示markdown帖子
const dialogMessageVisible = ref(false)
const text = ref<string>('')
const showMessage = (index: number, row: any) => {
  dialogMessageVisible.value = true
  text.value = row.message
}

const options = [
  {
    value: 2,
    label: '点赞排序',
  },
  {
    value: 3,
    label: '踩排序',
  },
  {
    value: null,
    label: '发布时间排序',
  }
]

const auditOptions = [
  {
    value: 0,
    label: '未审批',
  },
  {
    value: 1,
    label: '审批通过',
  },
  {
    value: 2,
    label: '审批拒绝',
  }
]

//搜素
const handleSearch = () => {
  getTableData()
}

//删除
const batchDelete = () => {
  if (selectionQuery.ids[0] == null) {
    ElMessage.warning("未选中删除帖子目标")
    return;
  }
  ElMessageBox.confirm(
      '确定要批量删除帖子吗?',
      'Warning',
  )
      .then(async () => {
        const result = await deleteDiscussInfo(selectionQuery)
        if (result.code == 0) {
          ElMessage.success("批量删除帖子成功")
          await getTableData()
          selectionQuery.ids = []
        } else {
          ElMessage.error(result.message)
        }
      })
}

const handleDelete = (index: number, row: any) => {
  ElMessageBox.confirm(
      '确定要删除该帖子吗?',
      'Warning',
  ).then(async () => {
    selectionQuery.ids.push(row.id)
    const result = await deleteDiscussInfo(selectionQuery)
    if (result.code == 0) {
      ElMessage.success("删除该帖子成功")
      await getTableData()
      selectionQuery.ids = []
    } else {
      ElMessage.error(result.message)
    }
  })
}
const updateQuery = ref<Discuss>({})
const confirmEvent = async (row: any) => {
  if (row.isAudit == 1) {
    ElMessage.warning("审核状态当前已通过，无需重新审核")
    return;
  }
  updateQuery.value = {...row}
  updateQuery.value.isAudit = 1
  const result = await updateDiscussInfo(updateQuery.value)
  if (result.code == 0) {
    ElMessage.success("审核状态更改成功")
    await getTableData()
  } else {
    ElMessage.error(result.message)
  }
}

const cancelEvent = async (row: any) => {
  if (row.isAudit == 2) {
    ElMessage.warning("审核状态当前已拒绝，无需重新审核")
    return;
  }
  updateQuery.value = {...row}
  updateQuery.value.isAudit = 2
  const result = await updateDiscussInfo(updateQuery.value)
  if (result.code == 0) {
    ElMessage.success("审核状态更改成功")
    await getTableData()
  } else {
    ElMessage.error(result.message)
  }
}
const router = useRouter();
const handleCommentAndReply = (index: number, row: any) => {
  router.push({path: `/commentOrReply/${row?.id}`})
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
