<template>
  <el-select v-model="value"
             clearable
             :placeholder="collegeName"
             @change="handleChange"
             style="width: 500px">
    <el-option
        v-for="item in collegeInfo"
        :key="item.id"
        :label="item.name"
        :value="item.id"
    />
  </el-select>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import {getCollegeInfo} from "../api/college";
import College from "../model/College";

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
const collegeInfo = ref<College>({})
const collegeValues = async () => {
  const result = await getCollegeInfo(query)
  if (result.code == 0) {
    collegeInfo.value = result.data.items
  }
}

/**
 * 子向父组件传值
 **/
const emit = defineEmits(["get-college-id"])

/**
 * 子接受数据
 **/
const id = ref<number>(0)
const collegeName = ref<string>('')
const prop = defineProps<{
  collegeName: string
}>();
collegeName.value = prop.collegeName

const handleChange = (value: any) => {
  id.value = value
  emit("get-college-id", id);
}
</script>

<style scoped>

</style>
