import {defineStore} from 'pinia';
import {getCurrentInfo} from "../api/user";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            currentUser: {}
        };
    },
    getters: {},
    actions: {
        async getUserInfo() {
            const router = useRouter();
            const token = localStorage.getItem('acp_token')
            const result = await getCurrentInfo(token)
            if (result.code == 0) {
                this.currentUser = result.data
            } else {
                await router.push('/login')
                localStorage.removeItem('acp_token')
                localStorage.removeItem('user')
                localStorage.removeItem('acp_permission')
                localStorage.removeItem('analysis')
                ElMessage.error(result.message)
            }
        }
    },
    persist: {
        // 开启持久化
        enabled: true,
        // 选择存储方式和内容
        strategies: [
            {storage: localStorage, paths: ['currentUser']}
        ]
    }
});
