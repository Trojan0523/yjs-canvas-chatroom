# OAuth 集成设置指南

本文档提供了如何为应用程序设置 GitHub 和 Google OAuth 认证的详细步骤。

## 前提条件

1. 已安装 Node.js 和 npm
2. 已设置 PostgreSQL 数据库
3. 已克隆并安装项目依赖

## 步骤 1: 创建 OAuth 应用

### GitHub OAuth 应用设置

1. 登录 GitHub 账号并访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "New OAuth App" 按钮
3. 填写应用程序信息:
   - **Application name**: `Simple CRDT Chatroom Canvas` (或您喜欢的名称)
   - **Homepage URL**: `http://localhost:3000`
   - **Application description**: (可选) 填写应用程序描述
   - **Authorization callback URL**: `http://localhost:3000/api/auth/github/callback`
4. 点击 "Register application" 按钮
5. 创建后，您会获得 Client ID 和 Client Secret
6. 保存这些凭据，稍后将用于环境配置

### Google OAuth 应用设置

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 导航至 "API 和服务" > "凭据"
4. 点击 "创建凭据" 并选择 "OAuth 客户端 ID"
5. 如果这是首次设置，您需要配置同意屏幕
   - 选择 "外部" 用户类型
   - 填写必要的应用信息
   - 添加范围 (email 和 profile)
6. 设置 OAuth 客户端:
   - **应用类型**: Web 应用
   - **名称**: `Simple CRDT Chatroom Canvas` (或您喜欢的名称)
   - **已获授权的重定向 URI**: `http://localhost:3000/api/auth/google/callback`
7. 点击 "创建" 按钮
8. 保存生成的 Client ID 和 Client Secret

## 步骤 2: 配置环境变量

1. 复制项目根目录下的 `.env.example` 文件为 `.env`:

```bash
cp server/.env.example server/.env
```

2. 编辑 `.env` 文件，填入您在前面步骤中获取的 OAuth 凭据:

```
# GitHub OAuth 配置
GITHUB_CLIENT_ID=您的GitHub客户端ID
GITHUB_CLIENT_SECRET=您的GitHub客户端密钥
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

# Google OAuth 配置
GOOGLE_CLIENT_ID=您的Google客户端ID
GOOGLE_CLIENT_SECRET=您的Google客户端密钥
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# 前端 URL (用于重定向)
FRONTEND_URL=http://localhost:3000
```

## 步骤 3: 运行数据库迁移

运行以下命令应用数据库迁移，添加 OAuth 相关字段:

```bash
cd server
npm run migration:run
```

## 步骤 4: 启动应用

1. 启动后端服务:

```bash
cd server
npm run start:dev
```

2. 在另一个终端启动前端开发服务器:

```bash
cd client
npm run dev
```

3. 访问 `http://localhost:3000` 并测试 OAuth 登录功能

## 故障排除

如果 OAuth 登录不成功，请检查:

1. 环境变量是否正确配置
2. 回调 URL 是否与 OAuth 提供商设置匹配
3. 服务器日志中的错误信息
4. 网络请求中的错误响应

## 生产环境注意事项

对于生产环境，请确保:

1. 使用 HTTPS 协议
2. 更新回调 URL 为生产域名
3. 确保 OAuth 提供商配置中也更新了回调 URL
4. 使用安全的随机密钥作为 JWT_SECRET
5. 根据需要调整 JWT_EXPIRES_IN 值
