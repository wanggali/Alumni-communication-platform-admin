<template>
  <el-steps :space="200" :active="active" simple>
    <el-step title="帖子内容" :icon="Edit"/>
    <el-step title="帖子信息" :icon="Edit"/>
    <el-step title="发布帖子" :icon="UploadFilled"/>
  </el-steps>

  <Content @show-message="showMessage"/>

  <div class="discuss-info">
    <el-form
        label-width="100px"
        :model="addDiscuss"
        style="max-width: 460px"
        class="el-form"
    >
      <el-form-item label="用户id" placeholder="用户id">
        <el-input v-model="addDiscuss.uid"/>
      </el-form-item>
      <el-form-item label="标签名">
        <tag @get-tag-id="getTagId"/>
      </el-form-item>
      <el-form-item label="标题名" placeholder="标题名">
        <el-input v-model="addDiscuss.title"/>
      </el-form-item>
      <el-form-item label="文章封面">
        <upload-aliyun :file="fileList" @get-aliyun-url="getALiYunUrl"/>
      </el-form-item>
      <el-form-item>
				<span>
					<el-button type="primary" @click="saveEdit">发 布</el-button>
				</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch, reactive} from "vue";
import {useRouter} from "vue-router";
import Content from "../components/content.vue";
import {ElMessage, UploadUserFile} from "element-plus";
import Discuss from "../model/Discuss";
import Tag from "../components/tag.vue";
import UploadAliyun from "../components/uploadAliyun.vue";
import {addDiscussInfo} from "../api/discuss";

const router = useRouter()
const active = ref<number>(1)
const message = ref<string>('')

const showMessage = (text:string) => {
  addDiscuss.message = text
}

watch(message, (val) => {
  if (val != '') {
    active.value = 2
  } else {
    active.value = 1
  }
})

const addDiscuss = reactive<Discuss>({})
const getTagId = (id:bigint) => {
  addDiscuss.tid = id
}
const fileList = ref<UploadUserFile[]>([])
const getALiYunUrl = (url:string) => {
  addDiscuss.cover = url
  active.value = 3
}

/**
 * 发布帖子
 */
const saveEdit = async () => {
  if (addDiscuss.title == '' &&
      addDiscuss.cover == '' &&
      addDiscuss.message == '' &&
      addDiscuss.uid < 0 &&
      addDiscuss.tid < 0) {
    ElMessage.warning("帖子有信息错误")
    return
  }
  const result = await addDiscussInfo(addDiscuss);
  if (result.code == 0) {
    ElMessage.success("发布帖子成功")
    location.reload()
  } else {
    ElMessage.error(result.message)
  }
}
</script>

<style scoped>
.discuss-info {
  margin-top: 30px;
  background: white;
  border-radius: 4px;
  height: 100%;
}

.el-form {
  position: relative;
  top: 70px;
  left: 300px;
}
</style>
