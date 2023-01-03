import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
import {usePermissStore} from '../store/permiss'
import Home from "../views/home.vue";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: '系统首页',
                    permiss: '23'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/dashboard.vue")
            },
            {
                path: "/notice",
                name: "notice",
                meta: {
                    title: '公告管理',
                    permiss: '1'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/notice.vue")
            },
            {
                path: "/banner",
                name: "banner",
                meta: {
                    title: '轮播图管理',
                    permiss: '2'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/banner.vue")
            },
            {
                path: "/region",
                name: "region",
                meta: {
                    title: '地区管理',
                    permiss: '3'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/region.vue")
            },
            {
                path: "/origin",
                name: "origin",
                meta: {
                    title: '组织管理',
                    permiss: '5'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/origin.vue"),

            },
            {
                path: "/originUser/:id",
                name: "originUser",
                meta: {
                    title: '组织用户管理',
                    permiss: '25'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/originUser.vue"),

            },
            {
                path: "/college",
                name: "college",
                meta: {
                    title: '学院管理',
                    permiss: '4'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/college.vue"),
            },
            {
                path: "/tag",
                name: "tag",
                meta: {
                    title: '标签管理',
                    permiss: '6'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/tag.vue"),
            },
            {
                path: "/addDiscuss",
                name: "addDiscuss",
                meta: {
                    title: '添加帖子',
                    permiss: '9'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/addDiscuss.vue"),
            },
            {
                path: "/discuss",
                name: "discuss",
                meta: {
                    title: '帖子信息',
                    permiss: '10'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/discuss.vue"),
            },
            {
                path: "/commentOrReply/:id",
                name: "commentOrReply",
                meta: {
                    title: '评论/回复',
                    permiss: '26'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/commentOrReply.vue"),
            },
            {
                path: "/addQuestion",
                name: "addQuestion",
                meta: {
                    title: '添加问题',
                    permiss: '12'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/addQuestion.vue"),
            },
            {
                path: "/question",
                name: "question",
                meta: {
                    title: '问题信息',
                    permiss: '13'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/question.vue"),
            },
            {
                path: "/answer/:id",
                name: "answer",
                meta: {
                    title: '回答',
                    permiss: '27'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/answer.vue"),
            },
            {
                path: "/addDynamic",
                name: "addDynamic",
                meta: {
                    title: '添加动态',
                    permiss: '15'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/addDynamic.vue"),
            },
            {
                path: "/dynamic",
                name: "dynamic",
                meta: {
                    title: '动态信息',
                    permiss: '16'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/dynamic.vue"),
            },
            {
                path: "/donate",
                name: "donate",
                meta: {
                    title: '关于作者',
                    permiss: '20'
                },
                component: () => import ( /* webpackChunkName: "donate" */ "../views/donate.vue")
            },
            {
                path: "/user",
                name: "user",
                meta: {
                    title: '用户管理',
                    permiss: '7'
                },
                component: () => import ( /* webpackChunkName: "permission" */ "../views/user.vue")
            },
            {
                path: "/permission",
                name: "permission",
                meta: {
                    title: '权限管理',
                    permiss: '19'
                },
                component: () => import ( /* webpackChunkName: "permission" */ "../views/permission.vue")
            },
            {
                path: '/userInfo',
                name: 'userInfo',
                meta: {
                    title: '个人中心'
                },
                component: () => import (/* webpackChunkName: "user" */ '../views/userInfo.vue')
            },
            {
                path: '/role',
                name: 'role',
                meta: {
                    title: '角色管理',
                    permiss: '18'
                },
                component: () => import (/* webpackChunkName: "user" */ '../views/role.vue')
            }
        ]
    },
    {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import ( /* webpackChunkName: "login" */ "../views/login.vue")
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限'
        },
        component: () => import (/* webpackChunkName: "403" */ '../views/403.vue')
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | 校友交流后台管理`;
    const token = localStorage.getItem('acp_token');
    const permission = JSON.parse(<string>localStorage.getItem('acp_permission'))
    if (!token && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permiss && !permission.includes(to.meta.permiss)) {
        // 如果没有权限，则进入403
        next('/403');
    } else {
        next();
    }
});

export default router;
