<template>
  <div class="sidebar">
    <el-menu
        class="sidebar-el-menu"
        :default-active="onRoutes"
        :collapse="sidebar.collapse"
        background-color="#324157"
        text-color="#bfcbd9"
        active-text-color="#20a0ff"
        unique-opened
        router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-sub-menu :index="item.index" :key="item.index" v-permiss="item.permiss">
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-sub-menu
                  v-if="subItem.subs"
                  :index="subItem.index"
                  :key="subItem.index"
                  v-permiss="item.permiss"
              >
                <template #title>{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                  {{ threeItem.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="subItem.index" v-permiss="item.permiss">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index" v-permiss="item.permiss">
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from 'vue';
import {useSidebarStore} from '../store/sidebar';
import {useRoute, useRouter} from 'vue-router';

const items = [
  {
    icon: 'Odometer',
    index: '/dashboard',
    title: '系统首页',
    permiss: '24'
  },
  {
    icon: 'Pointer',
    index: '/notice',
    title: '公告管理',
    permiss: '1'
  },
  {
    icon: 'View',
    index: '/banner',
    title: '轮播图管理',
    permiss: '2'
  },
  {
    icon: 'search',
    index: '/region',
    title: '地区管理',
    permiss: '3'
  },
  {
    icon: 'discount',
    index: '/college',
    title: '学院管理',
    permiss: '4'
  },
  {
    icon: 'House',
    index: '/origin',
    title: '组织管理',
    permiss: '5'
  },
  {
    icon: 'PictureRounded',
    index: '/tag',
    title: '标签管理',
    permiss: '6'
  },
  {
    icon: 'User',
    index: '/user',
    title: '用户管理',
    permiss: '7'
  },
  {
    icon: 'ChatDotRound',
    title: '帖子管理',
    permiss: '10',
    subs: [
      {
        index: '/addDiscuss',
        title: '添加帖子',
        permiss: '9'
      },
      {
        index: '/discuss',
        title: '帖子信息',
        permiss: '10'
      }
    ]
  },
  {
    icon: 'ChatDotSquare',
    title: '问题管理',
    permiss: '13',
    subs: [
      {
        index: '/addQuestion',
        title: '添加问题',
        permiss: '12'
      },
      {
        index: '/question',
        title: '问题信息',
        permiss: '13'
      }
    ]
  },
  {
    icon: 'ChatLineSquare',
    title: '动态管理',
    permiss: '16',
    subs: [
      {
        index: '/addDynamic',
        title: '添加动态',
        permiss: '15'
      },
      {
        index: '/dynamic',
        title: '动态信息',
        permiss: '16'
      }
    ]
  },
  {
    icon: 'Open',
    title: '权限管理',
    permiss: '17',
    subs: [
      {
        index: '/role',
        title: '角色管理',
        permiss: '18'
      },
      {
        index: '/permission',
        title: '菜单管理',
        permiss: '19'
      }
    ]
  },
  {
    icon: 'CoffeeCup',
    index: '/donate',
    title: '关于作者',
    permiss: '20'
  }
];

const route = useRoute();

const onRoutes = computed(() => {
  return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
</style>
