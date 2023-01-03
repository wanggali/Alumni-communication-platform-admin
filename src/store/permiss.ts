import {defineStore} from 'pinia';
import {getCurrentInfo} from "../api/user";
import {ElMessage} from "element-plus";
import {getUserRoleInfo} from "../api/role";
import {useRouter} from "vue-router";


export const usePermissStore = defineStore('permiss', {
    state: () => {
        return {
            permissionValues: []
        };
    },
    actions: {
        async getPermissionValue() {
            const router = useRouter();
            this.permissionValues = []
            const token = localStorage.getItem('acp_token')
            const result = await getUserRoleInfo(token)
            if (result.code == 0) {
                result.data.permissionVO.forEach((val: any, idx: any, array: any) => {
                    // val: 当前值
                    // idx：当前index
                    // array: Array
                    return this.permissionValues.push(val.permission.permissionValue);
                })
                localStorage.setItem('acp_permission', JSON.stringify(this.permissionValues))
            } else {
                await router.push('/login')
                ElMessage.error(result.message)
            }
        }
    }
});
