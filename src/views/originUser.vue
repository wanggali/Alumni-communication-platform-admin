<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.userName" placeholder="用户名" class="handle-input mr10"></el-input>
        <el-input v-model="query.regionName" placeholder="地区名" class="handle-input mr10"></el-input>
        <el-button icon="Search" @click="handleSearch" plain>搜索</el-button>
        <el-button type="primary" icon="Plus" @click="openAddOriginUser" plain>新增</el-button>
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
        <el-table-column label="用户id">
          <template #default="scope">
            {{ scope.row.userInfo.userId }}
          </template>
        </el-table-column>
        <el-table-column label="用户名称">
          <template #default="scope">
            {{ scope.row.userInfo.userName }}
          </template>
        </el-table-column>
        <el-table-column label="用户地区">
          <template #default="scope">
            {{ scope.row.userInfo.regionName }}
          </template>
        </el-table-column>
        <el-table-column label="用户签名">
          <template #default="scope">
            {{ scope.row.userInfo.userSign }}
          </template>
        </el-table-column>
        <el-table-column prop="uid" label="用户手机">
          <template #default="scope">
            {{ scope.row.userInfo.mobile }}
          </template>
        </el-table-column>
        <el-table-column prop="uid" label="用户邮箱">
          <template #default="scope">
            {{ scope.row.userInfo.email }}
          </template>
        </el-table-column>
        <el-table-column prop="uid" label="加入时间">
          <template #default="scope">
            {{ scope.row.userInfo.joinTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
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

  <el-dialog title="添加组织" v-model="addVisible" width="30%">
    <el-form label-width="70px">
      <el-form-item label="用户id">
        <el-input v-model="addOriginUser.uid"></el-input>
      </el-form-item>
      <el-form-item label="组织id">
        <el-input v-model="addOriginUser.oid" disabled></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
				<span class="dialog-footer">
					<el-button @click="addVisible = false">取 消</el-button>
					<el-button type="primary" @click="addOriginToUser">确 定</el-button>
				</span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {addOriginUserInfo, deleteOriginUserInfo, getAllOriginUserInfo} from "../api/originUser";
import OriginUserType from "../model/OriginUser";
import {ElMessage, ElMessageBox} from "element-plus";
import {deleteToOrigin} from "../api/origin";

interface queryPage {
  oid: number,
  pageNum: number,
  pageSize: number,
  userName: string,
  regionName: string
}

const tableData = ref<OriginUserType>([])
const query = reactive<queryPage>({
  oid: null,
  pageNum: 1,
  pageSize: 10,
  userName: '',
  regionName: ''
});
const route = useRoute()
onMounted(() => {
  showAllOriginUser()
})
/**
 * 获取组织用户信息
 */
const pageTotal = ref<number>()
const showAllOriginUser = async () => {
  query.oid = Number(route.params?.id)
  if (query.oid < 0) {
    return;
  }
  const result = await getAllOriginUserInfo(query)
  if (result.code == 0) {
    pageTotal.value = result.data.total
    tableData.value = result.data.items
  } else {
    ElMessage.error(result.message)
  }
}

// 分页导航
const handlePageChange = (val: number) => {
  query.pageNum = val;
  showAllOriginUser();
};

/**
 * 过滤名字
 */
const handleSearch = () => {
  showAllOriginUser()
}

/**
 * 添加组织成员
 */
const addVisible = ref<boolean>(false)
const addOriginUser = reactive<any>({
  oid: '',
  uid: ''
})
const openAddOriginUser = () => {
  addOriginUser.uid = ''
  addOriginUser.oid = route.params?.id[0]
  addVisible.value = true
}
const addOriginToUser = async () => {
  const result = await addOriginUserInfo(addOriginUser)
  if (result.code == 0) {
    ElMessage({
      type: 'success',
      message: '添加组织用户成功'
    })
    addVisible.value = false
    await showAllOriginUser()
  } else {
    ElMessage.error(result.message)
    addVisible.value = false
  }
}

/**
 * 删除操作
 **/
const deleteQuery = reactive<any>({
  ids: [],
  oid: '',
  uid: []
})
const handleDelete = (index: number, row: any) => {
  ElMessageBox.confirm(
      '确定要删除该组织用户吗?',
      'Warning',
  )
      .then(async () => {
        deleteQuery.ids?.push(row.id)
        const result = await deleteOriginUserInfo(deleteQuery)
        if (result.code == 0) {
          ElMessage({
            type: 'success',
            message: '删除组织用户成功'
          })
          await showAllOriginUser()
        } else {
          ElMessage.error(result.message)
        }
      })
};


/**
 * 多选框事件
 */
const selectionQuery = reactive<any>({
      ids: [],
      oid: '',
      uid: []
    }
)
const handleSelectionChange = (rows?: any) => {
  rows.forEach((row: any) => {
    selectionQuery.ids?.push(row.id)
  })
}

const batchDelete = () => {
  ElMessageBox.confirm(
      '确定要删除该组织成员吗?',
      'Warning',
  )
      .then(async () => {
        const result = await deleteOriginUserInfo(selectionQuery)
        if (result.code == 0) {
          ElMessage({
            type: 'success',
            message: '批量删除组织成功'
          })
          await showAllOriginUser()
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
