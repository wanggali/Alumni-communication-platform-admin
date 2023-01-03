import {createApp} from 'vue'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import router from './router'
import {usePermissStore} from './store/permiss'
import 'element-plus/dist/index.css'
import './assets/css/icon.css'
import piniaPluginPersist from "pinia-plugin-persist";
// 引入v-md-editor组件
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';

VMdPreview.use(vuepressTheme);
const app = createApp(App)

app.use(router)
app.use(createPinia().use(piniaPluginPersist))
app.use(VMdPreview)
app.use(ElementPlus, {
    locale: zhCn,
})
// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
/**
 * 钩子函数有四个参数 mounted(el, binding, vnode, prevNode)
 el：指令绑定到的元素。这可用于直接操作DOM
 binding：一个对象，拥有以下属性（arg和value比较常用）
 instance：使用指令的组件实例。
 value：传递给指令的值。例如，在 v-my-directive="1 + 1" 中，该值为 2。
 oldValue：先前的值，仅在 beforeUpdate 和 updated 中可用。值是否已更改都可用。
 arg：参数传递给指令 (如果有)。例如在 v-my-directive:foo 中，arg 为 "foo"。
 modifiers：包含修饰符 (如果有) 的对象。例如在 v-my-directive.foo.bar 中，修饰符对象为 {foo: true，bar: true}。
 dir：一个对象，在注册指令时作为参数传递。
 vnode：上面作为 el 参数收到的真实 DOM 元素的蓝图
 prevNode：上一个虚拟节点，仅在 beforeUpdate 和 updated 钩子中可用

 自定义权限指令
 */
const permiss = usePermissStore()
permiss.getPermissionValue()
app.directive('permiss', {
    mounted(el, binding) {
        if (!permiss.permissionValues.includes(String(binding.value))) {
            el['hidden'] = true;
        }
    }
})

app.mount('#app')
