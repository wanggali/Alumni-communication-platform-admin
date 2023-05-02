<template>
  <el-select v-model="value"
             :placeholder="tagName"
             clearable
             @change="handleChange"
             style="width: 500px">
    <el-option
        v-for="item in tagInfo"
        :key="item.id"
        :label="item.name"
        :value="item.id"
    />
  </el-select>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {getAllTag} from "../api/tag";
import Tag from "../model/Tag";

onMounted(() => {
  tagValues()
})
const value = ref<string>('')
/**
 * 获取全部标签
 */
const tagInfo = ref<Tag>({})
const tagValues = async () => {
  const result = await getAllTag()
  if (result.code == 0) {
    tagInfo.value = result.data
  }
}

/**
 * 子向父组件传值
 **/
const emit = defineEmits(["get-tag-id"])

/**
 * 子接受数据
 **/
const id = ref<number>(0)
const tagName = ref<string>('')
const prop = defineProps<{
  tagName: string
}>();
tagName.value = prop.tagName

const handleChange = (value: any) => {
  id.value = value
  emit("get-tag-id", id);
}
</script>

<style scoped>

</style>

