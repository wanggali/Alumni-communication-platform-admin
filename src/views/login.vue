<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">校友交流后台管理系统</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="email">
          <el-input v-model="param.email" clearable placeholder="请输入邮箱">
            <template #prepend>
              <el-icon>
                <User/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              type="password"
              clearable
              placeholder="请输入密码"
              v-model="param.password"
              @keyup.enter="submitForm(login)"
          >
            <template #prepend>
              <el-icon>
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm(login)">登录</el-button>
        </div>
        <p class="login-tips">Tips : 欢迎来到后台管理系统！</p>
      </el-form>
    </div>
    <div class="footer">
      <a title="github" target="_blank" href="https://github.com/wanggali/Alumni-communication-platform">
        <el-popover
            placement="top-start"
            :width="200"
            trigger="hover"
            content="查看本站及源码，欢迎star"
        >
          <template #reference>
            <span class="iconfont icon-github-fill">支持项目</span>
          </template>
        </el-popover>
      </a>
      <a title="contact" target="_blank" href="https://im.qq.com/index">
        <el-popover
            placement="top-start"
            :width="200"
            trigger="hover"
            content="QQ号：2722933638"
        >
          <template #reference>
            <span class="iconfont icon-QQ">联系作者</span>
          </template>
        </el-popover>
      </a>
      <a title="info" target="_blank">
        <el-popover
            placement="top-start"
            :width="200"
            trigger="hover"
            content="本站所有资源均来源于网络，仅供学习参考，如有侵权，非常抱歉，请立即联系作者删除"
        >
          <template #reference>
            <span class="iconfont icon-toubaoshengming">免责声明</span>
          </template>
        </el-popover>
      </a>
    </div>
    <div class="footer-text">
      <span class="iconfont icon-iconfonticon-shouye">2022 校友交流后台管理系统</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue';
import {useTagsStore} from '../store/tags';
import {usePermissStore} from '../store/permiss';
import {useRouter} from 'vue-router';
import type {FormInstance, FormRules} from 'element-plus';
import {ElMessage,} from 'element-plus';
import {userAdminLogin, userLogin} from "../api/user";
import {useAnalysisStore} from "../store/analysis";

interface LoginInfo {
  email: string;
  password: string;
}

const router = useRouter();
const param = reactive<LoginInfo>({});

const rules: FormRules = {
  email: [
    {
      required: true,
      message: '请输入邮箱',
      trigger: 'blur'
    }
  ],
  password: [{required: true, message: '请输入密码', trigger: 'blur'}]
};
const analysisStore = useAnalysisStore()
const permiss = usePermissStore();
const login = ref<FormInstance>();
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid: boolean) => {
    if (valid) {
      const result = await userAdminLogin(param)
      if (result.code == 0) {
        ElMessage.success('登录成功');
        localStorage.setItem('acp_token', result.data);
        analysisStore.getAnalysisInfo()
        permiss.getPermissionValue()
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } else {
        ElMessage.error(result.message);
        return false;
      }
    } else {
      ElMessage.error('登录失败');
      return false;
    }
  });
};

const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #74EBD5;
  background-image: linear-gradient(90deg, #74EBD5 0%, #9FACE6 100%);
  background-size: 100%;
}

.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 25px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
  font-size: 20px;
}

.ms-content {
  padding: 30px 30px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.login-tips {
  font-size: 15px;
  line-height: 30px;
  color: #fff;
}

.footer {
  text-align: center;
  position: relative;
  top: 650px;
}

.footer > a {
  text-decoration: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  padding: 20px;
  color: black;
}

.footer-text {
  text-align: center;
  position: relative;
  top: 665px;
  color: black;
}
</style>
