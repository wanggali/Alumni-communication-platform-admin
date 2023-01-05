# 攀枝花学院校友交流平台后台管理-前端

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

#### 数据库设计

* 数据库名：Alumni communication platform（acp）校友交流平台

* 表名

    * 用户表（user）

      | 表名        | 字段     | 长度 | 键   | 描述                                          |
      | :---------- | -------- | ---- | ---- | --------------------------------------------- |
      | id          | bigint   | 20   | key  | id（not null）                                |
      | rid         | bigint   | 20   |      | 所属地区id                                    |
      | college_id  | bigint   | 20   |      | 所属学院id                                    |
      | admin_type  | tinyint  | 1    |      | 管理员标识(0普通用户 1学院管理员 2学校管理员) |
      | passsword   | varchar  | 255  |      | 密码（not null）                              |
      | email       | varchar  | 512  |      | 用户邮箱（not null）                          |
      | avatar      | varchar  | 1024 |      | 用户头像                                      |
      | username    | varchar  | 255  |      | 校友名称                                      |
      | sign        | varchar  | 100  |      | 用户签名                                      |
      | status      | tinyint  | 1    |      | 用户状态（1在校，2毕业）                      |
      | is_delete   | tinyint  | 1    |      | 逻辑删除（0未删除1删除）                      |
      | create_time | datetime |      |      | 创建时间                                      |
      | update_time | datatime |      |      | 更新时间                                      |
    
      
    
    * 用户信息表（user_info）
    
      | 表名        | 字段     | 长度 | 键   | 描述                     |
      | :---------- | -------- | ---- | ---- | ------------------------ |
      | id          | bigint   | 20   | key  | 校友id                   |
      | sex         | tinyint  | 2    |      | 校友性别（1女，2男）     |
      | age         | tinyint  | 3    |      | 校友年龄                 |
      | birthday    | datetime |      |      | 校友生日                 |
      | mobile      | varchar  | 11   |      | 手机号                   |
      | qq          | varchar  | 20   |      | 校友qq                   |
      | wechat      | varchat  | 20   |      | 微信号                   |
      | microblog   | varchat  | 20   |      | 微博号                   |
      | address     | varchar  | 50   |      | 地址                     |
      | company     | varchar  | 50   |      | 公司名称                 |
      | is_delete   | tinyint  | 1    |      | 逻辑删除（0未删除1删除） |
      | create_time | datetime |      |      | 创建时间                 |
      | update_time | datatime |      |      | 更新时间                 |
    
      
    
    * 用户权限表（user_role）
    
      | 表名        | 字段     | 长度 | 键   | 描述                     |
      | :---------- | -------- | ---- | ---- | ------------------------ |
      | id          | bigint   | 20   | key  | id                       |
      | role_id     | bigint   | 20   |      | 权限id                   |
      | user_id     | bigint   | 20   |      | 用户id                   |
      | is_delete   | tinyint  | 1    |      | 逻辑删除（0未删除1删除） |
      | create_time | datetime |      |      | 创建时间                 |
      | update_time | datatime |      |      | 更新时间                 |
    
      
    
    * 地区表（region）
    
      | 表名        | 字段     | 长度 | 键   | 描述                     |
      | ----------- | -------- | ---- | ---- | ------------------------ |
      | id          | bigint   | 20   | key  | 主键                     |
      | code        | bigint   | 20   |      | 行政区编码               |
      | lable       | varchar  | 255  |      | 地区                     |
      | parent_id   | bigint   | 20   |      | 父id                     |
      | level_id    | varchar  | 32   |      | 级别                     |
      | is_delete   | tinyint  | 1    |      | 逻辑删除（0未删除1删除） |
      | create_time | datetime |      |      | 创建时间                 |
      | update_time | datatime |      |      | 更新时间                 |
    
      
    
    * 学院表（college）
    
      | 表名        | 字段     | 长度 | 键   | 描述                     |
      | ----------- | -------- | ---- | ---- | ------------------------ |
      | id          | bigint   | 20   | key  | 主键                     |
      | name        | varchar  | 10   |      | 学院名称                 |
      | is_delete   | tinyint  | 1    |      | 逻辑删除（0未删除1删除） |
      | create_time | datetime |      |      | 创建时间                 |
      | update_time | datatime |      |      | 更新时间                 |
    
    * 组织表（origin）
    
      | 表名        | 字段     | 长度 | 键   | 描述                     |
      | ----------- | -------- | ---- | ---- | ------------------------ |
      | id          | bigint   | 20   | key  | 主键                     |
      | cid         | bigint   | 20   |      | 所属学院                 |
      | uid         | bigint   | 20   |      | 创建人                   |
      | name        | varchar  | 255  |      | 组织名称                 |
      | avatar      | varchar  | 1024 |      | 组织头像                 |
      | is_delete   | tinyint  | 1    |      | 逻辑删除（0未删除1删除） |
      | create_time | datetime |      |      | 创建时间                 |
      | update_time | datatime |      |      | 更新时间                 |
      |             |          |      |      |                          |
    
    * 组织用户表（origin_user）
    
      | 表名        | 字段     | 长度 | 键   | 描述                     |
      | ----------- | -------- | ---- | ---- | ------------------------ |
      | id          | bigint   | 20   | key  | 主键                     |
      | oid         | bigint   | 20   |      | 组织id                   |
      | uid         | bigint   | 20   |      | 用户id                   |
      | is_delete   | tinyint  | 1    |      | 逻辑删除（0未删除1删除） |
      | create_time | datetime |      |      | 创建时间                 |
      | update_time | datatime |      |      | 更新时间                 |
      |             |          |      |      |                          |
    
    * 帖子表（discuss）
    
      | 表名        | 字段     | 长度 | 键   | 描述                                    |
      | ----------- | -------- | ---- | ---- | :-------------------------------------- |
      | id          | bigint   | 20   | key  | 主键                                    |
      | uid         | bigint   | 20   |      | 用户id                                  |
      | tid         | bigint   | 20   |      | 标签id                                  |
      | title       | varchar  | 200  |      | 文章标题                                |
      | message     | text     |      |      | 文章内容                                |
      | cover       | varchar  | 1024 |      | 文章封面                                |
      | up          | int      | 20   |      | 点赞数                                  |
      | down        | int      | 20   |      | 踩次数                                  |
      | is_audit    | tinyint  | 1    |      | 是否审核通过（0审核中，1通过，2未通过） |
      | is_delete   | tinyint  | 1    |      | 逻辑删除（0未删除1删除）                |
      | create_time | datetime |      |      | 创建时间                                |
      | update_time | datatime |      |      | 更新时间                                |
    
      
    
    * 评论表（comment）
    
      | 表名        | 字段     | 长度 | 键   | 描述                     |
      | ----------- | -------- | ---- | ---- | ------------------------ |
      | id          | bigint   | 20   | key  | 主键                     |
      | uid         | bigint   | 20   |      | 用户id                   |
      | did         | bigint   | 20   |      | 帖子id                   |
      | content     | varchar  | 500  |      | 评论内容                 |
      | up          | int      | 20   |      | 点赞数                   |
      | is_delete   | tinyint  | 1    |      | 逻辑删除（0未删除1删除） |
      | create_time | datetime |      |      | 创建时间                 |
      | update_time | datatime |      |      | 更新时间                 |
    
    * 回复表（reply）
    
      | 表名          | 字段     | 长度 | 键   | 描述                     |
      | ------------- | -------- | ---- | ---- | :----------------------- |
      | id            | bigint   | 20   | key  | 主键                     |
      | uid           | bigint   | 20   |      | 被回复人id               |
      | cid           | bigint   | 20   |      | 评论id                   |
      | did           | bigint   | 20   |      | 帖子id                   |
      | reply_id      | bigint   | 20   |      | 回复人id                 |
      | reply_content | varchar  | 500  |      | 回复内容                 |
      | up            | int      | 20   |      | 点赞数                   |
      | is_delete     | tinyint  | 1    |      | 逻辑删除（0未删除1删除） |
      | create_time   | datetime |      |      | 创建时间                 |
      | update_time   | datatime |      |      | 更新时间                 |
    
      
    
    * 问题表（question）
    
      | 表名        | 字段     | 长度 | 键   | 描述                                    |
      | ----------- | -------- | ---- | ---- | :-------------------------------------- |
      | id          | bigint   | 20   | key  | 主键                                    |
      | uid         | bigint   | 20   |      | 用户id                                  |
      | title       | varchar  | 100  |      | 问题标题                                |
      | content     | text     |      |      | 问题内容                                |
      | tid         | bigint   | 20   |      | 标签id                                  |
      | is_audit    | tinyint  | 1    |      | 是否审核通过（0审核中，1通过，2未通过） |
      | is_delete   | tinyint  | 1    |      | 逻辑删除（0未删除1删除）                |
      | create_time | datetime |      |      | 创建时间                                |
      | update_time | datatime |      |      | 更新时间                                |
    
      
    
    * 回答表（answer）
    
      | 表名           | 字段     | 长度 | 键   | 描述                       |
      | -------------- | -------- | ---- | ---- | :------------------------- |
      | id             | bigint   | 20   | key  | 主键                       |
      | uid            | bigint   | 20   |      | 被回复人id                 |
      | qid            | bigint   | 20   |      | 问题id                     |
      | answer_id      | bigint   | 20   |      | 回复人id                   |
      | answer_content | varchar  | 500  |      | 回复内容                   |
      | is_adopt       | tinyint  | 1    |      | 是否采纳（0未采纳，1采纳） |
      | is_delete      | tinyint  | 1    |      | 逻辑删除（0未删除1删除）   |
      | create_time    | datetime |      |      | 创建时间                   |
      | update_time    | datatime |      |      | 更新时间                   |
    
      
    
    * 动态表（dynamic）
    
      | 表名        | 字段     | 长度 | 键   | 描述                     |
      | ----------- | -------- | ---- | ---- | :----------------------- |
      | id          | bigint   | 20   | key  | 主键                     |
      | uid         | bigint   | 20   |      | 用户id                   |
      | tid         | bigint   | 20   |      | 标签id                   |
      | content     | text     |      |      | 动态内容                 |
      | up          | int      | 20   |      | 点赞数                   |
      | is_delete   | tinyint  | 1    |      | 逻辑删除（0未删除1删除） |
      | create_time | datetime |      |      | 创建时间                 |
      | update_time | datatime |      |      | 更新时间                 |
    
    * 标签表（tag）
    
      | 表名        | 字段     | 长度 | 键   | 描述                     |
      | ----------- | -------- | ---- | ---- | :----------------------- |
      | id          | bigint   | 20   | key  | 主键                     |
      | name        | varchar  | 20   |      | 标签名                   |
      | is_delete   | tinyint  | 1    |      | 逻辑删除（0未删除1删除） |
      | create_time | datetime |      |      | 创建时间                 |
      | update_time | datatime |      |      | 更新时间                 |
    
      
    
    * 内推表（push）
    
      | 表名             | 字段     | 长度 | 键   | 描述                                    |
      | ---------------- | -------- | ---- | ---- | :-------------------------------------- |
      | id               | bigint   | 20   | key  | 主键                                    |
      | company_name     | varchar  | 20   |      | 公司名称                                |
      | company_position | varchar  | 20   |      | 公司职位                                |
      | company_region   | varchar  | 20   |      | 公司地点                                |
      | company_salary   | varchar  | 10   |      | 薪资                                    |
      | position_info    | text     |      |      | 职位描述                                |
      | position_num     | int      | 20   |      | 职位数量                                |
      | push_url         | varchar  | 255  |      | 内推链接                                |
      | uid              | bigint   | 20   |      | 内推人                                  |
      | is_audit         | tinyint  | 1    |      | 是否审核通过（0审核中，1通过，2未通过） |
      | is_delete        | tinyint  | 1    |      | 逻辑删除（0未删除1删除）                |
      | create_time      | datetime |      |      | 创建时间                                |
      | update_time      | datatime |      |      | 更新时间                                |
    
      
    
    * 公告表（notice）
    
      | 表名        | 字段     | 长度 | 键   | 描述                     |
      | ----------- | -------- | ---- | ---- | ------------------------ |
      | id          | bigint   | 20   | key  | 主键                     |
      | content     | varchar  | 255  |      | 公告内容                 |
      | is_delete   | tinyint  | 1    |      | 逻辑删除（0未删除1删除） |
      | create_time | datetime |      |      | 创建时间                 |
      | update_time | datatime |      |      | 更新时间                 |
    
      
    
    * 角色表（role）
    
      | 表名        | 字段     | 长度 | 键   | 描述                     |
      | ----------- | -------- | ---- | ---- | ------------------------ |
      | id          | bigint   | 20   | key  | 主键                     |
      | role_name   | varchar  | 20   |      | 角色名称                 |
      | role_value  | char     | 5    |      | 角色值                   |
      | is_delete   | tinyint  | 1    |      | 逻辑删除（0未删除1删除） |
      | create_time | datetime |      |      | 创建时间                 |
      | update_time | datatime |      |      | 更新时间                 |
    
      
    
    * 菜单表（permission）
    
      | 表名             | 字段     | 长度 | 键   | 描述                     |
      | ---------------- | -------- | ---- | ---- | ------------------------ |
      | id               | bigint   | 20   | key  | 主键                     |
      | pid              | bigint   | 20   |      | 所属上级                 |
      | name             | varchar  | 20   |      | 名称                     |
      | type             | tinyint  | 3    |      | 类型（1菜单2按钮）       |
      | permission_value | varchar  | 50   |      | 权限值                   |
      | path             | varchar  | 100  |      | 访问路径                 |
      | state            | tinyint  | 1    |      | 状态（1禁用）            |
      | is_delete        | tinyint  | 1    |      | 逻辑删除（0未删除1删除） |
      | create_time      | datetime |      |      | 创建时间                 |
      | update_time      | datatime |      |      | 更新时间                 |
    
    * 权限菜单表（role_permission）
    
      | 表名          | 字段     | 长度 | 键   | 描述                     |
      | ------------- | -------- | ---- | ---- | ------------------------ |
      | id            | bigint   | 20   | key  | 主键                     |
      | role_id       | bigint   | 20   |      | 角色id                   |
      | permission_id | bigint   | 20   |      | 菜单id                   |
      | is_delete     | tinyint  | 1    |      | 逻辑删除（0未删除1删除） |
      | create_time   | datetime |      |      | 创建时间                 |
      | update_time   | datatime |      |      | 更新时间                 |
    
      
    
    * 轮播图表（banner）
    
      | 表名        | 字段     | 长度 | 键   | 描述                     |
      | ----------- | -------- | ---- | ---- | ------------------------ |
      | id          | bigint   | 20   | key  | 主键                     |
      | name        | varchar  | 10   |      | 图片名称                 |
      | image_url   | varchar  | 1024 |      | 图片地址                 |
      | is_delete   | tinyint  | 1    |      | 逻辑删除（0未删除1删除） |
      | create_time | datetime |      |      | 创建时间                 |
      | update_time | datatime |      |      | 更新时间                 |
    

#### 后台模块开发

1. 前后端搭建✅
2. 地区管理（后端）✅
    1. 分级显示所有地区✅
    2. 新增一二三级地区✅
    3. 删除一二三级地区✅
    4. 修改一二三级地区✅
3. 地区管理（前端）
    1. 利用树形结构展示地区✅
    2. 进行增删改地区操作✅
4. 组织管理（后端）
    1. 整合阿里OSS文件上传✅
    2. 增删改组织✅
    3. 分页查询✅
5. 组织管理（前端)
    1. 表格形式展现✅
    2. 增删改组织✅
6. 组织用户管理（后端）
    1. 增删查组织用户✅
7. 组织用户管理（前端）
    1. 表格形式展现✅
    2. 增删组织用户✅
8. 帖子管理（后端）
    1. 发帖✅
    2. 修改贴✅
    3. 删除贴✅
    4. 分页显示帖子
9. 评论管理（后端）✅
10. 学院管理（后端）✅
11. 回复管理（后端）✅
12. 标签管理（后端）✅
13. 学院管理（前端）✅
14. 帖子管理（前端）✅
15. 问题管理（后端）✅
16. 问题管理（前端）✅
17. 动态管理（前端）✅
18. 动态管理（后端）✅
19. 内推管理（后端）✅
20. 内推管理（前端）✅
21. 公告管理（后端）✅
22. 公告管理（前端）✅
23. 轮播图管理（后端）✅
24. 轮播图管理（前端）✅
25. 用户管理（前后端） ✅
26. 权限管理（前后端）✅
