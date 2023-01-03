<template>
  <div class="container">
    <md-editor class="mgb20" v-model="text" height="400px" @on-upload-img="onUploadImg"/>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {ElMessage} from "element-plus";

const onUploadImg = (files: any) => {
  ElMessage.info("暂不支持上传图片功能")
};

const text = ref<string>('')

/**
 * 子向父组件传值
 **/
const emit = defineEmits(["show-message"])

watch(text, () => {
  emit("show-message", text.value)
})

/**
 * 父传子
 */
const prop = defineProps<{
  text: string
}>();
text.value = prop.text
</script>

<style scoped>

</style>
