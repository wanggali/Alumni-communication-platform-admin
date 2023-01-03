<template>
  <el-upload
      :file-list="fileList"
      list-type="picture-card"
      accept="image/jpeg,image/jpg,image/png"
      :http-request="upload"
      :on-success="uploadSuccess"
      :before-upload="checkFile"
      ref="upload"
  >
    <el-icon>
      <Plus/>
    </el-icon>
    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="file.url"/>
      </div>
      <span class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in/></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
          >
            <el-icon><Delete/></el-icon>
          </span>
        </span>
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {ElMessage, UploadUserFile} from "element-plus";
import {uploadOssImg} from "../api/oss";

/**
 * 子接受数据
 **/
const fileList = ref<UploadUserFile[]>([])
const prop = defineProps<{
  file: UploadUserFile[]
}>();
fileList.value = prop.file

/**
 * 子传父
 */
const emit = defineEmits(["get-aliyun-url"])


const upload = async (info: any) => {
  const {file} = info
  fileList.value.push(file)
  const formData = new FormData();
  formData.append('file', file);
  const result = await uploadOssImg(formData)
  if (result.code == 0) {
    emit('get-aliyun-url', result.data)
  }
}
const uploadSuccess = () => {
  ElMessage.success('文件上传成功！！')
}
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)

const handleRemove = (file: UploadFile) => {
  fileList.value = []
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
</script>

<style scoped>

</style>
