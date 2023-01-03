<template>
  <div class="container">
    <el-button type="success" @click="openAddCollege(data)" plain>添加学院</el-button>
    <el-input style="width: 90%;margin-left: 10px" type="text" v-model="filterText" placeholder="请输入学院名称"/>
    <div class="mgb20 tree-wrapper">
      <el-tree
          ref="tree"
          :data="data"
          empty-text="数据为空"
          node-key="id"
          icon="LocationInformation"
          :filter-node-method="filterNode"
      >
        <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ data.name }}</span>
          <span style="margin-left: 200px">
            <a style="margin-left: 10px" @click="openUpdateCollege(data)"><el-icon><EditPen/></el-icon></a>
            <a style="margin-left: 10px" @click="openRemoveCollege(data)"><el-icon><Delete/></el-icon></a>
          </span>
        </span>
        </template>
      </el-tree>
    </div>
  </div>
  <el-dialog
      v-model="dialogVisible"
      title="添加学院"
      width="30%"
      :before-close="handleClose"
  >
    <template #default>
      <span class="dialog-footer">
        <el-form :model="addCollegeInfo" label-width="120px">
          <el-form-item label="学院名称" name="name">
            <el-input v-model="addCollegeInfo.name" placeholder="请输入学院名称" style="width: 280px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doAddCollege">添加</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </span>
    </template>
  </el-dialog>
  <el-dialog
      v-model="updDialogVisible"
      title="更新学院"
      width="30%"
      :before-close="handleClose"
  >
    <template #default>
      <span class="dialog-footer">
        <el-form :model="updateCollegeInfo" label-width="120px">
          <el-form-item label="id" name="id">
            <el-input v-model="updateCollegeInfo.id" disabled style="width: 280px"/>
          </el-form-item>
          <el-form-item label="学院名称" name="name">
            <el-input v-model="updateCollegeInfo.name" placeholder="请输入学院名称" style="width: 280px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateInCollege()">更新</el-button>
            <el-button @click="cancel()">取消</el-button>
          </el-form-item>
        </el-form>
      </span>
    </template>
  </el-dialog>
  <el-dialog
      v-model="delDialogVisible"
      title="删除学院"
      width="30%"
      :before-close="handleClose"
  >
    <em>是否确认删除该学院</em><br><br><br>
    <template #footer>
      <span class="dialog-footer">
            <el-button type="primary" @click="deleteInCollege()">删除</el-button>
            <el-button @click="cancel()">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, ref, reactive, watch} from 'vue';
import {ElMessage, ElTree} from 'element-plus';
import {usePermissStore} from '../store/permiss';
import {getRegionTreeInfo, addRegion, updateRegion, deleteRegion} from "../api/region";
import RegionType from "../model/Region";
import {addCollege, deleteCollege, getCollegeInfo, updateCollege} from "../api/college";
import College from "../model/College";

const role = ref<string>('admin');

/**
 * 获取学院递归数
 */
const data: College[] = ref<College[]>([])

onMounted(() => {
  collegeValues()
})
const value = ref<string>('')
const query = reactive<any>({
  pageNum: 1,
  pageSize: 20,
  name: ''
})
/**
 * 获取全部学院
 */
const collegeValues = async () => {
  const result = await getCollegeInfo(query)
  if (result.code == 0) {
    data.value = result.data.items
  }else {
    ElMessage.error(result.message)
  }
}

/**
 * 关键字过滤
 */
const filterText = ref<string>('')
watch(filterText, (val) => {
  tree.value!.filter(val)
})

const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.name.includes(value)
}
/**
 * 添加地区
 */
const dialogVisible = ref<boolean>(false)
const addCollegeInfo = reactive<College>({})
const openAddCollege = (data: College) => {
  dialogVisible.value = true
  addCollegeInfo.name = data.name
}
const doAddCollege = async () => {
  const result = await addCollege(addCollegeInfo)
  if (result.code == 0) {
    ElMessage.success('添加学院成功！')
    dialogVisible.value = false
    await collegeValues()
  } else {
    ElMessage.error(result.message)
  }
}

/**
 * 修改地区
 */
const updateCollegeInfo = reactive<College>({})
const updDialogVisible = ref<boolean>()
const openUpdateCollege = (data) => {
  updateCollegeInfo.id = data.id
  updateCollegeInfo.name = data.name
  updDialogVisible.value = true
}
const updateInCollege = async () => {
  const result = await updateCollege(updateCollegeInfo)
  if (result.code == 0) {
    ElMessage.success('修改学院成功！')
    updDialogVisible.value = false
    await collegeValues()
  } else {
    ElMessage.error(result.message)
  }
}

/**
 * 删除地区
 */
const deleteCollegeInfo = reactive<any>({
  ids: []
})
const delDialogVisible = ref<boolean>()
const openRemoveCollege = (data:any) => {
  deleteCollegeInfo.ids.push(data.id)
  delDialogVisible.value = true
}

const deleteInCollege = async () => {
  const result = await deleteCollege(deleteCollegeInfo)
  if (result.code == 0) {
    ElMessage.success('删除学院成功！')
    delDialogVisible.value = false
    await collegeValues()
  } else {
    ElMessage.error(result.message)
  }
}

const cancel = () => {
  dialogVisible.value = false
  updDialogVisible.value = false
  delDialogVisible.value = false
}
</script>

<style scoped>
.tree-wrapper {
  max-width: 1190px;
}

.label {
  font-size: 14px;
}

.dialog-footer {
  margin: 0;
  padding: 0;
}

.region-input {
  margin-bottom: 10px
}
</style>
