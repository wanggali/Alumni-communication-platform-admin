# 攀枝花学院校友交流平台-服务端

#### 角色分类

1. 学校管理员
    1. 权限管理
        1. 角色管理
        2. 菜单管理
        3. 用户管理
    2. 校友组织管理
        1. 添加/删除/修改学校组织
    3. 校友讨论管理
        1. 校友帖子板块
        1. 校友问答板块
        1. 校友动态板块
    4. 首页管理
        1. 轮播图管理
        2. 公告管理
    5. 日志管理
    6. 内推管理
    7. 审核管理
2. 学院管理员
    1. 校友讨论管理
        1. 校友帖子板块
        2. 校友问答板块
        3. 校友动态板块
    2. 审核管理
3. 校友

#### 技术选型

* 后端
    * 框架：Spring Boot
    * 语言：Java8
    * 持久层：Mybatis-Plus+Mybatis
    * 权限校验：Sa-token
    * 导入excel：Easy Excel
    * 工具包：糊涂工具包
    * 验证码：tianai-captcha图形验证码
    * 文档：Swagger2
    * 缓存：Redis
    * 分布式事务锁：Radisson
    * 日期处理：joda-day
* 前端
    * 框架：Vue3.0
    * 语言：TypeScript
    * 数据持久化：Pinia
    * UI组件库：Element Plus
    * 路由：Vue Router
    * 请求：Axios
    * 文本编辑器：wangeditor文本编辑器
* 存储
    * 数据库：Mysql5.7
    * 图片存储：阿里OSS
* 部署：
    * Docker容器化

#### 

### 页面截图

![img](E:\devTool\software\Typora_img\img-1717514397566-2.png)



![img](E:\devTool\software\Typora_img\img_1-1717514411131-4.png)



![img](E:\devTool\software\Typora_img\img_2-1717514426859-6.png)



![img](E:\devTool\software\Typora_img\img_3-1717514437083-8.png)