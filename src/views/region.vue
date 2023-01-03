<template>
  <div class="container">
    <el-input type="text" v-model="filterText" placeholder="请输入地区"/>
    <div class="mgb20 tree-wrapper">
      <el-tree
          ref="tree"
          :data="data"
          node-key="id"
          icon="LocationInformation"
          render-after-expand="true"
          :filter-node-method="filterNode"
      >
        <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span style="margin-left: 200px">
            <a style="margin-left: 30px" @click="openAddRegion(data)"><el-icon><Plus/></el-icon></a>
            <a style="margin-left: 10px" @click="openUpdateRegion(data)"><el-icon><EditPen/></el-icon></a>
            <a style="margin-left: 10px" @click="openRemoveRegion(data)"><el-icon><Delete/></el-icon></a>
          </span>
        </span>
        </template>
      </el-tree>
    </div>
  </div>
  <el-dialog
      v-model="dialogVisible"
      title="添加地区"
      width="30%"
      :before-close="handleClose"
  >
    <template #footer>
      <span class="dialog-footer">
        <el-form :model="addRegionInfo" label-width="120px">
          <el-form-item  label="地区" name="label">
            <el-input v-model="addRegionInfo.label" placeholder="请输入地区编码" style="width: 280px"/>
          </el-form-item>
          <el-form-item label="地区行政编码" name="code">
            <el-input v-model="addRegionInfo.code" placeholder="请输入地区名字" style="width: 280px"/>
          </el-form-item>
          <el-form-item label="父id" name="parentId">
             <el-input v-model="addRegionInfo.parentId" style="width: 280px" disabled/>
          </el-form-item>
          <el-form-item label="级别" name="levelId">
            <el-input v-model="addRegionInfo.levelId" style="width: 280px" disabled/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addInRegion()">添加</el-button>
            <el-button @click="cancel()">取消</el-button>
          </el-form-item>
        </el-form>
      </span>
    </template>
  </el-dialog>
  <el-dialog
      v-model="updDialogVisible"
      title="更新地区"
      width="30%"
      :before-close="handleClose"
  >
    <template #footer>
      <span class="dialog-footer">
        <el-form :model="updateRegionInfo" label-width="120px">
          <el-form-item  label="地区" name="label">
            <el-input v-model="updateRegionInfo.label" placeholder="请输入地区编码" style="width: 280px"/>
          </el-form-item>
          <el-form-item label="地区行政编码" name="code">
            <el-input v-model="updateRegionInfo.code" placeholder="请输入地区名字" style="width: 280px"/>
          </el-form-item>
          <el-form-item label="父id" name="parentId">
             <el-input v-model="updateRegionInfo.parentId" style="width: 280px" disabled/>
          </el-form-item>
          <el-form-item label="级别" name="levelId">
            <el-input v-model="updateRegionInfo.levelId" style="width: 280px" disabled/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateInRegion()">更新</el-button>
            <el-button @click="cancel()">取消</el-button>
          </el-form-item>
        </el-form>
      </span>
    </template>
  </el-dialog>
  <el-dialog
      v-model="delDialogVisible"
      title="删除地区"
      width="30%"
      :before-close="handleClose"
  >
    <em>是否确认删除该地区</em><br><br><br>
    <small style="margin-left: 200px">ps:只能删除三级地区、没有子地区的地区</small>
    <template #footer>
      <span class="dialog-footer">
            <el-button type="primary" @click="deleteInRegion()">删除</el-button>
            <el-button @click="cancel()">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, ref, reactive, watch} from 'vue';
import {ElMessage, ElTree} from 'element-plus';
import {usePermissStore} from '../store/permiss';
import {getRegionTreeInfo,addRegion,updateRegion,deleteRegion} from "../api/region";
import RegionType from "../model/Region";

const role = ref<string>('admin');

const Tree = reactive<RegionType>()
/**
 * 获取地区递归数
 */
const data: Tree[] = ref<Tree[]>([])
onMounted(
    ()=>{
      showRegionInfo()
    }
)

/**
 * 获取地区
 */
const showRegionInfo=async () => {
  const showData = await getRegionTreeInfo()
  data.value = showData.data
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
  return data.label.includes(value)
}

/**
 * 添加地区
 */
const dialogVisible = ref<boolean>(false)
const addRegionInfo = reactive<RegionType>({})
const openAddRegion = (data: Tree) => {
  addRegionInfo.label=''
  addRegionInfo.code=''
  dialogVisible.value = true
  addRegionInfo.parentId = data.id
  if (data.levelId == '0') {
    addRegionInfo.levelId = '1'
  } else if (data.levelId == '1') {
    addRegionInfo.levelId = '2'
  } else {
    addRegionInfo.levelId = '3'
  }
}
const addInRegion = async () => {
  const result=await addRegion(addRegionInfo)
  if (result.code==0){
    ElMessage.success('添加地区成功！')
    dialogVisible.value = false
    await showRegionInfo()
  }else {
    ElMessage.error(result.message)
  }
}

/**
 * 修改地区
 */
const updateRegionInfo = reactive<RegionType>({})
const updDialogVisible=ref<boolean>()
const openUpdateRegion=(data)=>{
  updateRegionInfo.code=data.code
  updateRegionInfo.label=data.label
  updateRegionInfo.id=data.id
  updateRegionInfo.levelId=data.id
  updateRegionInfo.parentId=data.id
  updDialogVisible.value=true
}
const updateInRegion=async ()=>{
  const result=await updateRegion(updateRegionInfo)
  console.log(result)
  if (result.code==0){
    ElMessage.success('修改地区成功！')
    updDialogVisible.value = false
    await showRegionInfo()
  }else {
    ElMessage.error(result.message)
  }
}

/**
 * 删除地区
 */
const deleteRegionInfo = reactive<RegionType>({})
const delDialogVisible=ref<boolean>()
const openRemoveRegion=(data)=>{
    deleteRegionInfo.id=data.id
    deleteRegionInfo.levelId=data.levelId
    delDialogVisible.value=true
}

const deleteInRegion=async ()=>{
  const result = await deleteRegion(deleteRegionInfo)
  if (result.code==0){
    ElMessage.success('删除地区成功！')
    delDialogVisible.value = false
    await showRegionInfo()
  }else {
    ElMessage.error(result.message)
  }
}

const cancel = () => {
  dialogVisible.value = false
  updDialogVisible.value=false
  delDialogVisible.value=false
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
