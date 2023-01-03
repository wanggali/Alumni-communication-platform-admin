<template>
    <el-cascader
        :options="data"
        clearable
        :props="props"
        @change="handleChange"
        style="width: 345px;"
        :placeholder="region"
    />
</template>

<script lang="ts" setup>
import {getRegionTreeInfo} from "../api/region";
import {onMounted, reactive, ref} from "vue";
import RegionType from "../model/Region";

const id = ref<bigint>(0n)
const region = ref<any>({regionName: "请选择地区"})
/**
 * 子向父组件传值
 **/
const emit = defineEmits(["get-region-id"])

/**
 * 子接受数据
 **/
const prop = defineProps<{
  regionName: {
    regionName: string
  }
}>();
region.value = prop.regionName


const props = {
  expandTrigger: 'hover',
  emitPath: false,
  value: 'id'
}

const handleChange = (value:any) => {
  id.value = value
  emit("get-region-id", id);
}

const Tree = reactive<RegionType>({})
/**
 * 获取地区递归数
 */
const data: Tree[] = ref<Tree[]>([])
onMounted(
    () => {
      showRegionInfo()
    }
)
const showRegionInfo = async () => {
  const showData = await getRegionTreeInfo()
  data.value = showData.data
}
</script>

<style scoped>

</style>
