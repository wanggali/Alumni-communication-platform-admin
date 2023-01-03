<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.content" placeholder="动态信息" class="handle-input mr10"></el-input>
        <tag @get-tag-id="getTagId" style="width: 300px;margin-left: 15px"/>
        <el-select v-model="query.sortType" clearable class="m-2" placeholder="排序规则" size="default"
                   style="margin-right: 30px;margin-left: 30px">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <el-button icon="Search" @click="handleSearch" plain style="margin-left: 30px">搜索</el-button>
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
        <el-table-column prop="tagName" label="标签名称" width="300" align="center"></el-table-column>
        <el-table-column label="动态信息" width="207" align="center">
          <template #default="scope">
            <el-button type="success" plain size="small" @click="showMessage(scope.$index,scope.row)">查看动态</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="up" label="点赞数" width="130"></el-table-column>
        <el-table-column prop="createTime" label="发布时间" width="150"></el-table-column>
        <el-table-column label="操作" width="290" align="center">
          <template #default="scope">
            <el-button plain type="danger" @click="handleDelete(scope.$index,scope.row)" v-permiss="14">
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

  <el-dialog v-model="dialogMessageVisible" title="动态信息">

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
import {deleteDiscussInfo, updateDiscussInfo} from "../api/discuss";
import Discuss from "../model/Discuss";
import {ElMessage, ElMessageBox} from "element-plus";
import {useRouter} from "vue-router";
import Question from "../model/Question";
import {deleteQuestionInfo, getQuestionInfo, updateQuestionInfo} from "../api/question";
import Dynamic from "../model/Dynamic";
import {deleteDynamicInfo, getDynamicInfo} from "../api/dynamic";
import Tag from "../components/tag.vue";

const query = reactive<any>({
  pageNum: 1,
  pageSize: 10,
  content: '',
  uid: '',
  tid: '',
  sortType: ''
})
const pageTotal = ref<number>(0)
const tableData = ref<Dynamic[]>([])
const getTableData = async () => {
  const result = await getDynamicInfo(query)
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

const getTagId = (id: bigint) => {
  query.tid = id
}
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
  text.value = row.content
}

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
      '确定要批量删除动态吗?',
      'Warning',
  )
      .then(async () => {
        const result = await deleteDynamicInfo(selectionQuery)
        if (result.code == 0) {
          ElMessage.success("批量删除动态成功")
          await getTableData()
          selectionQuery.ids = []
        } else {
          ElMessage.error(result.message)
        }
      })
}

const handleDelete = (index: number, row: any) => {
  ElMessageBox.confirm(
      '确定要删除该动态吗?',
      'Warning',
  ).then(async () => {
    selectionQuery.ids.push(row.id)
    const result = await deleteDynamicInfo(selectionQuery)
    if (result.code == 0) {
      ElMessage.success("删除该动态成功")
      await getTableData()
      selectionQuery.ids = []
    } else {
      ElMessage.error(result.message)
    }
  })
}

const options = [
  {
    value: null,
    label: '创建时间排序',
  },
  {
    value: 1,
    label: '点赞排序',
  }
]
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
