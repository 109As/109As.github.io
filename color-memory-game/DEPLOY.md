# 🎹 旋律记忆游戏 - 部署指南

## 如何让别人体验你的游戏

### 方法一：本地分享（最简单）

1. **启动本地服务器**
```bash
cd color-memory-game
python -m http.server 8080
```

2. **获取你的IP地址**
- Windows: 打开命令提示符，输入 `ipconfig`，找到 IPv4 地址
- 通常格式: `192.168.x.x`

3. **分享链接给朋友**
```
http://你的IP地址:8080
```

⚠️ 注意：需要在同一个局域网内（如家庭Wi-Fi）

---

### 方法二：部署到 GitHub Pages（推荐）

#### 步骤1：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称：`melody-memory-game`
3. 选择 "Public"（公开）
4. 点击 "Create repository"

#### 步骤2：上传代码

```bash
cd color-memory-game
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/melody-memory-game.git
git push -u origin main
```

#### 步骤3：启用 GitHub Pages

1. 进入仓库 → Settings → Pages
2. Source 选择：`main branch`
3. 点击 "Save"
4. 等待几分钟，访问：`https://你的用户名.github.io/melody-memory-game/`

---

### 方法三：部署到 Netlify（更稳定）

1. 访问 https://app.netlify.com/
2. 点击 "New site from Git"
3. 选择 GitHub，授权你的仓库
4. 配置：
   - Repository: 选择你的仓库
   - Build command: 留空（纯静态网站）
   - Publish directory: `color-memory-game`
5. 点击 "Deploy"
6. 获取免费域名（如 `your-game-name.netlify.app`）

---

## 游戏特性

### 🎵 音域配置
- **低音区（降1）**: C3 - B3（从下往上第一行）
- **中音区（标准）**: C4 - B4（从下往上第二行）  
- **高音区（升7）**: C5 - B5（从下往上第三行）

### 🎮 游戏模式
1. **记忆挑战** - 跟随播放的旋律重复
2. **纯听模式** - 只听不操作
3. **编辑模式** - 创建自定义关卡
4. **练习模式** - 自由练习

### 👤 用户系统
- 注册/登录（本地存储）
- 保存自定义关卡到账户
- 保存最高分记录

---

## 文件结构

```
color-memory-game/
├── index.html          # 主游戏页面
├── script.js           # 游戏逻辑
├── style.css           # 样式文件
├── sound-comparison.html # 音色对比页面
└── DEPLOY.md           # 部署指南（本文件）
```

---

## 技术栈

- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **音频**: Web Audio API
- **存储**: localStorage（本地存储）
- **无需服务器**: 纯静态网站

---

## 分享示例

部署完成后，你可以这样分享给朋友：

> 🎹 快来试试我做的旋律记忆游戏！
> 
> 游戏地址：https://your-username.github.io/melody-memory-game/
> 
> 玩法：
> 1. 点击开始按钮
> 2. 记住播放的旋律
> 3. 按正确顺序点击钢琴键
> 4. 挑战更高难度！
