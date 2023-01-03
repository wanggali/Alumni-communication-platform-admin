import {defineStore} from 'pinia';
import {getCurrentInfo} from "../api/user";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import {getAnalysisComment, getAnalysisUp} from "../api/analysis";

export const useAnalysisStore = defineStore('analysis', {
    state: () => {
        return {
            analysisCount: {},
            analysisUpCount: {}
        };
    },
    getters: {},
    actions: {
        async getAnalysisInfo() {
            const result = await getAnalysisComment()
            const resultUp = await getAnalysisUp()
            if (result.code == 0) {
                this.analysisCount = {...result.data}
                this.analysisUpCount = {...resultUp.data}
            }
        }
    },
    persist: {
        // 开启持久化
        enabled: true,
        // 选择存储方式和内容
        strategies: [
            {storage: localStorage, paths: ['analysisCount', 'analysisUpCount']}
        ]
    }
});
