<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="query.orderType" class="m-2" placeholder="排序规则" size="default" style="margin-right: 50px">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <college-select @get-college-id="getCollegeName" style="width: 180px"/>
        <region-select @get-region-id="getRegionId" style="display: inline-block; margin-left: 30px"/>
        <el-input v-model="query.userName" placeholder="请输入用户名" style="width: 150px;margin-left: 30px"/>
        <el-button icon="Search" plain @click="handleSearch" style="margin-left: 10px">搜索</el-button>
        <el-button type="danger" icon="Delete" plain @click="batchDelete">删除</el-button>
      </div>
      <el-table :data="commentData"
                border="true"
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="expand">
          <template #default="props">
            <el-table :data="props.row.replyInfo" border="true">
              <el-table-column label="id" prop="id"/>
              <el-table-column label="用户名" prop="replyUserInfo.userName"/>
              <el-table-column label="用户头像" align="center">
                <template #default="scope">
                  <el-image
                      style="width: 30%"
                      class="table-td-thumb"
                      :src="scope.row.replyUserInfo.userAvatar"
                      :z-index="10"
                      :preview-src-list="[scope.row.replyUserInfo.userAvatar]"
                      preview-teleported
                  >
                  </el-image>
                </template>
              </el-table-column>
              <el-table-column label="所属学院" prop="replyUserInfo.collegeName"/>
              <el-table-column label="所属地区" prop="replyUserInfo.regionName"/>
              <el-table-column label="回复内容" width="150" align="center">
                <template #default="scope">
                  <el-button type="success" plain size="small" @click="showMessage(scope.$index,scope.row)">查看回复
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="点赞数" prop="up"/>
              <el-table-column label="发布时间" prop="createTime"/>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55"/>
        <el-table-column label="id" prop="id"/>
        <el-table-column label="用户名" prop="userInfo.userName"/>
        <el-table-column label="用户头像" align="center">
          <template #default="scope">
            <el-image
                style="width: 40%"
                class="table-td-thumb"
                :src="scope.row.userInfo.userAvatar"
                :z-index="10"
                :preview-src-list="[scope.row.userInfo.userAvatar]"
                preview-teleported
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="所属学院" prop="userInfo.collegeName"/>
        <el-table-column label="所属地区" prop="userInfo.regionName"/>
        <el-table-column label="评论信息" width="150" align="center">
          <template #default="scope">
            <el-button type="success" plain size="small" @click="showMessage(scope.$index,scope.row)">查看评论</el-button>
          </template>
        </el-table-column>
        <el-table-column label="点赞数" prop="up"/>
        <el-table-column label="发布时间" prop="createTime"/>
        <el-table-column label="操作" width="150" align="center">
          <template #default="scope">
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

  <el-dialog v-model="dialogMessageVisible" title="评论/回复信息">

    <template #default>
      <v-md-preview :text="text"></v-md-preview>
      <v-md-preview :text="replyText"></v-md-preview>
      <span class="dialog-footer">
        <el-button @click="dialogMessageVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {deleteComment, getCommentAndReplyInfo} from "../api/commentOrReply";
import {ElMessage, ElMessageBox} from "element-plus";
import {useRoute} from "vue-router";

const route = useRoute()
const query = reactive<any>({
  pageNum: 1,
  pageSize: 10,
  did: 0,
  orderType: null,
  userName: '',
  regionId: null,
  collegeId: null
})

const pageTotal = ref<number>(0)
const commentData = ref<any[]>([])
const getCommentData = async () => {
  console.log(query)
  const result = await getCommentAndReplyInfo(query)
  console.log(result)
  if (result.code == 0) {
    commentData.value = result.data.items
    pageTotal.value = result.data.total
  } else {
    ElMessage.error(result.message)
  }
}

onMounted(() => {
  query.did = route.params.id
  getCommentData()
})

const options = [
  {
    value: 0,
    label: '发布时间正序',
  },
  {
    value: 1,
    label: '发布时间倒序',
  },
  {
    value: 2,
    label: '点赞排序',
  }
]

const handleSearch = () => {
  getCommentData()
}

const deleteIds = reactive<number>({
  ids: []
})
const handleDelete = (index: any, row: any) => {

  ElMessageBox.confirm(
      '确定要删除该评论及相关回复吗?',
      'Warning',
  )
      .then(async () => {
        deleteIds.ids.push(row.id)
        const result = await deleteComment(deleteIds)
        if (result.code == 0) {
          ElMessage.success('删除评论及回复成功')
          await getCommentData()
        } else {
          ElMessage.error(result.message)
        }
      })
}

const handleSelectionChange = (rows?: any) => {
  rows.forEach((row: any) => {
    deleteIds.ids.push(row.id)
  })
}

const batchDelete = () => {
  if (deleteIds.ids[0] == null) {
    ElMessage.warning("未选中删除评论目标")
    return;
  }
  ElMessageBox.confirm(
      '确定要批量删除该评论及回复吗?',
      'Warning',
  )
      .then(async () => {
        const result = await deleteComment(deleteIds)
        if (result.code == 0) {
          ElMessage.success("批量删除评论及相关回复成功")
          await getCommentData()
        } else {
          ElMessage.error(result.message)
        }
      })
}

const getCollegeName = (id: number) => {
  query.collegeId = id
}
const getRegionId = (id: number) => {
  query.regionId = id
}

// 分页导航
const handlePageChange = (val: number) => {
  query.pageNum = val;
  getCommentData()
};


//显示markdown
const dialogMessageVisible = ref(false)
const text = ref<string>('')
const replyText = ref<string>('')
const showMessage = (index: number, row: any) => {
  dialogMessageVisible.value = true
  text.value = row.content
  replyText.value = row.replyContent
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
