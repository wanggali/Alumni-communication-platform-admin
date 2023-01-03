<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height: 252px">
          <div class="user-info">
            <el-avatar :size="120" :src="userStore.currentUser.userAvatar"/>
            <div class="user-info-cont">
              <div class="user-info-name">{{ userStore.currentUser.userName }}</div>
            </div>
          </div>
          <div class="user-info-list">
            签名：
            <span>{{ userStore.currentUser.userSign }}</span><br/>
            注册时间：
            <span>{{ userStore.currentUser.joinTime }}</span><br/>

          </div>
        </el-card>
        <el-card shadow="hover" style="height: 252px">
          <template #header>
            <div class="clearfix">
              <span>最近一周交流详情</span>
            </div>
          </template>
          帖子数
          <el-progress
              :percentage="(totalWeek.discussCount/(totalWeek.discussCount+totalWeek.questionCount+totalWeek.dynamicCount))*100"
              color="#42b983"></el-progress>
          问题数
          <el-progress
              :percentage="(totalWeek.questionCount/(totalWeek.discussCount+totalWeek.questionCount+totalWeek.dynamicCount))*100"
              color="#f1e05a"></el-progress>
          动态数
          <el-progress
              :percentage="(totalWeek.dynamicCount/(totalWeek.discussCount+totalWeek.questionCount+totalWeek.dynamicCount))*100"></el-progress>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <el-icon class="grid-con-icon">
                  <User/>
                </el-icon>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ totalData.user }}</div>
                  <div>用户总数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <el-icon class="grid-con-icon">
                  <Star/>
                </el-icon>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ totalData.origin }}</div>
                  <div>组织总数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-3">
                <el-icon class="grid-con-icon">
                  <House/>
                </el-icon>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ totalData.college }}</div>
                  <div>入驻学院数</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
         <el-card shadow="hover">
           <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
         </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="20">
        <el-card shadow="hover">
          <schart ref="line" class="schart" canvasId="line" :options="options1"></schart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="dashboard">
import {useUserStore} from "../store/user";
import {onMounted, ref} from "vue";
import {getAnalysisComment, getAnalysisTotal, getAnalysisUp, getAnalysisWeek} from "../api/analysis";
import Schart from 'vue-schart';
import {useAnalysisStore} from "../store/analysis";

const userStore = useUserStore()
userStore.getUserInfo()

const analysisStore = useAnalysisStore()

onMounted(() => {
  getTotal()
  getInWeek()
})
const totalData = ref<any>({})
const getTotal = async () => {
  const result = await getAnalysisTotal()
  if (result.code == 0) {
    totalData.value = {...result.data}
  }
}

const totalWeek = ref<any>({})
const getInWeek = async () => {
  const result = await getAnalysisWeek()
  if (result.code == 0) {
    totalWeek.value = {...result.data}
  }
}

const options = {
  type: 'bar',
  title: {
    text: '最近一周点赞数'
  },
  xRorate: 25,
  labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  datasets: [
    {
      label: '评论数',
      data: analysisStore.analysisCount.comment
    },
    {
      label: '回答数',
      data: analysisStore.analysisCount.answer
    },
  ]
};

const options1 = {
  type: 'line',
  title: {
    text: '最近一周评论数'
  },
  xRorate: 25,
  labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  datasets: [
    {
      label: '帖子点赞数',
      data: analysisStore.analysisUpCount.discuss
    },
    {
      label: '问题点赞数',
      data: analysisStore.analysisUpCount.question
    },
    {
      label: '动态点赞数',
      data: analysisStore.analysisUpCount.dynamic
    },
  ]
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
  height: 150px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>
