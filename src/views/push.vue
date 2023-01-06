<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.companyName" placeholder="公司名称" class="handle-input mr10"></el-input>
        <el-input v-model="query.companyPosition" placeholder="公司职位" class="handle-input mr10"></el-input>
        <el-input v-model="query.companyRegion" placeholder="公司地点" class="handle-input mr10"></el-input>
        <el-input v-model="query.companySalary" placeholder="最低薪水" class="handle-input mr10" style="width: 200px;"></el-input>
        <el-select v-model="query.sortType" class="m-2" placeholder="排序规则" size="default" style="margin-top: 10px">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <el-select v-model="query.isAudit" clearable class="m-2" placeholder="过滤规则" size="default"
                   style="margin-top: 10px;margin-left: 30px">
          <el-option
              v-for="item in auditOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <el-button icon="Search" @click="handleSearch" plain style="margin-top: 10px;margin-left: 30px">搜索</el-button>
        <el-button type="danger" icon="Delete" @click="batchDelete" plain style="margin-top: 10px">删除</el-button>
      </div>
      <el-table
          :data="tableData"
          border
          stripe
          class="table"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          header-cell-class-name="table-header">
        <el-table-column fixed  type="selection" width="55"/>
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="companyName" label="公司名称" width="100" align="center"></el-table-column>
        <el-table-column prop="companyPosition" label="公司职位" width="100" align="center"></el-table-column>
        <el-table-column prop="companyRegion" label="公司地点" width="100" align="center"></el-table-column>
        <el-table-column prop="positionInfo" label="职位信息" width="100"></el-table-column>
        <el-table-column prop="positionNum" label="职位数量" width="100"></el-table-column>
        <el-table-column prop="userInfo.userName" label="内推人" width="150"></el-table-column>
        <el-table-column label="审批情况" align="center">
          <template #default="scope">
            <el-tag
                :type="scope.row.isAudit === 0 ? 'info' : scope.row.isAudit === 1 ?'success': 'danger'"
            >
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间" width="100"></el-table-column>
        <el-table-column prop="pushUrl" label="内推链接" width="300"></el-table-column>
        <el-table-column label="操作" width="230" align="center" fixed="right">
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
                title="审批内推信息">
              <template #reference>
                <el-button v-permiss="21">审核</el-button>
              </template>
            </el-popconfirm>
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
import {deletePushInfo, getPushInfo, updatePushInfo} from "../api/push";

const query = reactive<any>({
  pageNum: 1,
  pageSize: 10,
  companyName:null,
  companyPosition:null,
  companyRegion:null,
  companySalary:null,
  isAudit:null,
  sortType:null
})
const pageTotal = ref<number>(0)
const tableData = ref<any[]>([])
const getTableData = async () => {
  const result = await getPushInfo(query)
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

const options = [
  {
    value: 1,
    label: '薪水',
  },
  {
    value: null,
    label: '创建时间',
  },
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
    ElMessage.warning("未选中删除内推目标")
    return;
  }
  ElMessageBox.confirm(
      '确定要批量删除内推吗?',
      'Warning',
  )
      .then(async () => {
        const result = await deletePushInfo(selectionQuery)
        if (result.code == 0) {
          ElMessage.success("批量删除内推成功")
          await getTableData()
          selectionQuery.ids = []
        } else {
          ElMessage.error(result.message)
        }
      })
}

const handleDelete = (index: number, row: any) => {
  ElMessageBox.confirm(
      '确定要删除该内推吗?',
      'Warning',
  ).then(async () => {
    selectionQuery.ids.push(row.id)
    const result = await deletePushInfo(selectionQuery)
    if (result.code == 0) {
      ElMessage.success("删除该内推成功")
      await getTableData()
      selectionQuery.ids = []
    } else {
      ElMessage.error(result.message)
    }
  })
}
interface updateReq{
  id:number,
  companyName:string,
  companyPosition:string,
  companyRegion:string,
  companySalary:string,
  positionInfo:string,
  positionNum:number,
  pushUrl:string,
  uid:number,
  isAudit:number
}
const updateQuery = ref<updateReq>({})
const confirmEvent = async (row: any) => {
  if (row.isAudit == 1) {
    ElMessage.warning("审核状态当前已通过，无需重新审核")
    return;
  }
  updateQuery.value = {...row}
  updateQuery.value.isAudit = 1
  const result = await updatePushInfo(updateQuery.value)
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
  const result = await updatePushInfo(updateQuery.value)
  if (result.code == 0) {
    ElMessage.success("审核状态更改成功")
    await getTableData()
  } else {
    ElMessage.error(result.message)
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
