<template>
  <el-button plain type="success" :icon="Pointer" @click="openAddTag">添加标签</el-button>
  <div class="tagName">
    <el-row :gutter="12">
      <el-col :span="8" v-for="(item,index) in tagData.value" :key="index">
        <el-card shadow="hover" class="tag">
          {{ item.name }}
          <el-button type="primary" circle :icon="Edit" style="margin-left: 35%;"
                     @click="openUpdateTag(item)"></el-button>
          <el-button type="danger" circle :icon="Delete" @click="openDeleteTag(item)"></el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>

  <el-dialog v-model="addDialogVisible" title="添加标签" width="30%" center>
    <template #default>
      <el-form :model="addTagInfo">
        <el-form-item label="标签名">
          <el-input v-model="addTagInfo.name"/>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="add2Tag">
          添加
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="updateDialogVisible" title="更新标签" width="30%" center>
    <template #default>
      <el-form :model="updateTagInfo">
        <el-form-item label="id">
          <el-input v-model="updateTagInfo.id" disabled/>
        </el-form-item>
        <el-form-item label="标签名">
          <el-input v-model="updateTagInfo.name"/>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="update2Tag">
          更新
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="deleteDialogVisible" title="删除标签" width="30%" center>
    <em>是否确认删除该标签</em><br><br><br>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="delete2Tag">
          删除
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import Tag from "../model/Tag";
import {Pointer, Edit, Delete} from '@element-plus/icons-vue';
import {onMounted, reactive, ref} from "vue";
import {getAllTag, addTag, updateTag, deleteTag} from "../api/tag";
import {ElMessage} from "element-plus";

onMounted(() => {
  getTagData()
})
const tagData = reactive<Tag>({})
const getTagData = async () => {
  const result = await getAllTag()
  if (result.code == 0) {
    tagData.value = result.data
  }
}
/**
 * 添加标签
 */
const addTagInfo = ref<Tag>({})
const addDialogVisible = ref(false)
const openAddTag = () => {
  addDialogVisible.value = true
}
const add2Tag = async () => {
  const result = await addTag(addTagInfo.value)
  if (result.code == 0) {
    ElMessage.success('添加标签成功！')
    addDialogVisible.value = false
    await getTagData()
  } else {
    ElMessage.error(result.message)
    addDialogVisible.value = false
  }
}

/**
 * 更新标签
 */
const updateTagInfo = ref<Tag>({})
const updateDialogVisible = ref(false)
const openUpdateTag = (data: Tag) => {
  updateTagInfo.value = {...data}
  updateDialogVisible.value = true
}
const update2Tag = async () => {
  const result = await updateTag(updateTagInfo.value)
  if (result.code == 0) {
    ElMessage.success('更新标签成功！')
    updateDialogVisible.value = false
    await getTagData()
  } else {
    ElMessage.error(result.message)
    updateDialogVisible.value = false
  }
}

/**
 * 删除标签
 */
const deleteDialogVisible = ref<boolean>(false)
const deleteInfo = reactive<any>({
  ids: []
})

const openDeleteTag = (data: Tag) => {
  deleteDialogVisible.value = true
  deleteInfo.ids.push(data.id)
}
const delete2Tag = async () => {
  const result = await deleteTag(deleteInfo)
  if (result.code == 0) {
    ElMessage.success('删除标签成功！')
    deleteDialogVisible.value = false
    await getTagData()
  } else {
    ElMessage.error(result.message)
    deleteDialogVisible.value = false
  }
}
</script>

<style scoped>
.tagName {
  margin-top: 15px;
}

.tag {
  background-color: #8EC5FC;
  background-image: linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%);
  font-size: 16px;
  margin-top: 15px;
}

.dialog-footer {
  margin: 0;
  padding: 0;
}
</style>
