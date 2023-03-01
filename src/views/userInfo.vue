<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>基础信息</span>
            </div>
          </template>
          <div class="info">
            <div class="info-image" @click="showDialog">
              <el-avatar :size="100" :src="userStore.currentUser.userAvatar"/>
              <span class="info-edit">
								<i class="el-icon-lx-camerafill"></i>
							</span>
            </div>
            <div class="info-name">
              {{ userStore.currentUser.userName }}
              <el-tag class="ml-2" type="success" v-if="userStore.currentUser.status===1">在校</el-tag>
              <el-tag class="ml-2" type="warning" v-else>毕业</el-tag>
            </div>
            <div class="info-desc">所属学院：{{ userStore.currentUser.collegeName }}</div>
            <div class="info-desc">签名：{{ userStore.currentUser.userSign }}</div>
            <div class="info-desc">创建时间：{{ userStore.currentUser.joinTime }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>修改密码</span>
            </div>
          </template>
          <el-form label-width="90px">
            <el-form-item label="用户名："> {{ userStore.currentUser.userName }}</el-form-item>
            <el-form-item label="旧密码：">
              <el-input type="password" v-model="form.oldPassword"></el-input>
            </el-form-item>
            <el-form-item label="新密码：">
              <el-input type="password" v-model="form.newPassword"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit(userStore.currentUser.userId)">修改</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12" style="margin-top: 20px">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>用户信息编辑</span>
            </div>
          </template>
          <el-form label-width="90px">
            <el-form-item label="邮箱：">
              <el-input type="text" v-model="userStore.currentUser.email" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户名：">
              <el-input type="text" :placeholder="userStore.currentUser.userName"
                        v-model="updateUserReq.user.username"></el-input>
            </el-form-item>
            <el-form-item label="所属学院">
              <college-select @get-college-id="getCollegeId" :collegeName="userStore.currentUser.collegeName"/>
            </el-form-item>
            <el-form-item label="所属地区">
              <region-select style="width: 500px" @get-region-id="getRegionId"
                             :regionName="userStore.currentUser.regionName"/>
            </el-form-item>
            <el-form-item label="签名">
              <el-input type="text" :placeholder="userStore.currentUser.userSign"
                        v-model="updateUserReq.user.sign"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select style="width: 500px"
                         v-model="updateUserReq.user.status"
                         clearable
                         class="m-2"
                         :placeholder="userStore.currentUser.status===1?'在校':'毕业'" size="default">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="性别">
              <el-select style="width: 500px"
                         v-model="updateUserReq.userInfo.sex"
                         clearable
                         class="m-2"
                         :placeholder="userStore.currentUser.userInfo.sexType" size="default">
                <el-option
                    v-for="item in sexOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="年龄">
              <el-input type="text" :placeholder="userStore.currentUser.userInfo.age"
                        v-model="updateUserReq.userInfo.age"></el-input>
            </el-form-item>
            <el-form-item label="生日">
              <el-date-picker
                  v-model="updateUserReq.userInfo.birthday"
                  type="datetime"
                  :placeholder="userStore.currentUser.userInfo.birthday"
              />
            </el-form-item>
            <el-form-item label="电话">
              <el-input type="text" :placeholder="userStore.currentUser.userInfo.mobile"
                        v-model="updateUserReq.userInfo.mobile"></el-input>
            </el-form-item>
            <el-form-item label="qq">
              <el-input type="text" :placeholder="userStore.currentUser.userInfo.qq"
                        v-model="updateUserReq.userInfo.qq"></el-input>
            </el-form-item>
            <el-form-item label="微信号">
              <el-input type="text" :placeholder="userStore.currentUser.userInfo.wechat"
                        v-model="updateUserReq.userInfo.wechat"></el-input>
            </el-form-item>
            <el-form-item label="微博号">
              <el-input type="text" :placeholder="userStore.currentUser.userInfo.microblog"
                        v-model="updateUserReq.userInfo.microblog"></el-input>
            </el-form-item>
            <el-form-item label="地址">
              <el-input type="text" :placeholder="userStore.currentUser.userInfo.address"
                        v-model="updateUserReq.userInfo.address"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         @click="updateOnSubmit(userStore.currentUser.userId,userStore.currentUser.email)">修改
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="裁剪图片" v-model="dialogVisible" width="600px">
      <vue-cropper
          ref="cropper"
          :src="updateUserReq.user.avatar"
          :ready="cropImage"
          :zoom="cropImage"
          :cropmove="cropImage"
          style="width: 100%; height: 400px"
      ></vue-cropper>

      <template #footer>
				<span class="dialog-footer">
					<el-button class="crop-demo-btn" type="primary"
          >选择图片
						<input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
					</el-button>
					<el-button type="primary"
                     @click="saveAvatar(userStore.currentUser.userId,userStore.currentUser.email)">上传并保存</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="user">
import {reactive, ref} from 'vue';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import {useUserStore} from "../store/user";
import {updateUser, updateUserPassword} from "../api/user";
import {ElMessage, UploadUserFile} from "element-plus";
import {useRouter} from "vue-router";
import {uploadOssImg} from "../api/oss";

const userStore = useUserStore()
userStore.getUserInfo()

const form = reactive<any>({
  id: null,
  oldPassword: null,
  newPassword: null
});
const updateUserReq = reactive<any>({
  user: {
    id: null,
    rid: null,
    collegeId: null,
    username: null,
    avatar: null,
    sign: null,
    status: null
  },
  userInfo: {
    id: null,
    sex: null,
    age: null,
    birthday: null,
    mobile: null,
    qq: null,
    wechat: null,
    microblog: null,
    address: null
  }
})
const router = useRouter();
const onSubmit = async (id: number) => {
  form.id = id
  const result = await updateUserPassword(form)
  if (result.code == 0) {
    ElMessage.success('更新密码成功')
    localStorage.removeItem('acp_token')
    await router.push('/login')
  } else {
    ElMessage.error(result.message)
  }
};

const updateOnSubmit = async (id: number, email: string) => {
  updateUserReq.user.id = id
  updateUserReq.userInfo.id = id
  updateUserReq.user.email = email
  updateUserReq.userInfo.email = email
  const result = await updateUser(updateUserReq)
  if (result.code == 0) {
    ElMessage.success('更新用户信息成功')
    location.reload()
  } else {
    ElMessage.error(result.message)
  }
}

const getCollegeId = (id: bigint) => {
  updateUserReq.user.collegeId = id
}
const getRegionId = (id: bigint) => {
  updateUserReq.user.rid = id
}

const dialogVisible = ref(false);

const showDialog = () => {
  updateUserReq.user.avatar = userStore.currentUser.userAvatar
  dialogVisible.value = true;
};
const setImage = async (info: any) => {
  const file = info.target.files[0]
  const formData = new FormData();
  formData.append('file', file);
  const result = await uploadOssImg(formData)
  if (result.code == 0) {
    updateUserReq.user.avatar = result.data
    ElMessage.success('上传头像成功')
  } else {
    ElMessage.error(result.message)
  }
}
const saveAvatar = (id: number, email: string) => {
  updateOnSubmit(id, email)
}
const options = [
  {
    value: 1,
    label: '在校',
  },
  {
    value: 2,
    label: '毕业',
  }
]

const sexOptions = [
  {
    value: 1,
    label: '女',
  },
  {
    value: 2,
    label: '男',
  }
]


const cropImg = ref('');
const cropper: any = ref();
const cropImage = () => {
  cropImg.value = cropper.value.getCroppedCanvas().toDataURL();
};
</script>

<style scoped>
.info {
  text-align: center;
  padding: 35px 0;
}

.info-image {
  position: relative;
  margin: auto;
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 50px;
  overflow: hidden;
}

.info-edit {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.info-edit i {
  color: #eee;
  font-size: 25px;
}

.info-image:hover .info-edit {
  opacity: 1;
}

.info-name {
  margin: 15px 0 10px;
  font-size: 24px;
  font-weight: 500;
  color: #262626;
}

.crop-demo-btn {
  position: relative;
}

.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
