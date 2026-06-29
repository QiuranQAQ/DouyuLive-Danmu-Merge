# 斗鱼弹幕在线助手 - Cloudflare Worker 极简部署版

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
[![OBS Overlay](https://img.shields.io/badge/OBS-Overlay%20Friendly-050B14?style=for-the-badge&logo=obs-studio&logoColor=white)](#obs-串流看板使用指南)

基于原生 JavaScript 与 WebSocket 直连技术实现的**斗鱼直播弹幕在线助手**。该版本专为 Cloudflare Workers 设计，采用**单文件部署**方式，无需复杂的服务器配置，一键即可拥有专属的弹幕监控网页与 OBS 串流看板。

> [!NOTE]
> 本项目由 `DouyuEx` 弹幕引擎驱动，由超限魔改优化。前端采用现代玻璃拟态（Glassmorphism）暗黑风设计，配合优雅的霓虹背景斑块及平滑过渡动画，给您极致的视觉与操作体验。

---

## ✨ 核心特性

- ⚡ **零中转直连**：浏览器端直接通过 WebSocket 建立与斗鱼弹幕服务器（`wss://danmuproxy.douyu.com`）的物理连接，Cloudflare Worker 仅负责分发前端静态页面，安全、快速且不占用 Worker 额度或服务器带宽。
- 🔄 **智能弹幕合并（Combo）**：在设定的时间窗口内，自动对相同字符但不同重复字数的刷屏弹幕进行合并。
  - **热度分级**：根据合并数量自动调整徽章颜色（Tier 1: 灰色, Tier 2: 紫色加粗, Tier 3: 红色高亮并高能置顶）。
  - **点击展开**：点击合并的弹幕，可动态展开子列表查看详细发送人员及精确时间。
- 📌 **高能弹幕置顶（Combo Pinned）**：合计数超过 10 次的“高能弹幕”将自动置顶于滚动区顶部专属区域，防止热门梗在飞速滚动的弹幕中被遗漏（上限 3 条，防占屏）。
- 🗣️ **语音朗读 (TTS)**：内置文字转语音引擎，支持开启弹幕与礼物自动语音播报，自带队列缓冲与上限限流，防止朗读冲突与爆音。
- 🔍 **用户历史查询**：点击任何弹幕中的用户昵称，即可一键在新标签页中查询该用户在直播间的历史弹幕数据。
- 🎨 **OBS 串流无缝兼容**：
  - 支持调节**背景不透明度**至 `0%`（全透明）。
  - 隐藏滚动条，专为 OBS 浏览器源设计，作为直播间弹幕看板极为清爽。
- 🚀 **极简启动与传参**：支持 URL 参数直接读取房间号进行自动连接，例如 `https://your-worker.workers.dev/?room=9999` 或 `https://your-worker.workers.dev/9999`。

---

## 🛠️ Cloudflare 部署指南

本项目支持部署在 **Cloudflare Workers** 或 **Cloudflare Pages**。

### 选项一：部署至 Cloudflare Workers（控制台直接粘贴）

1. 登录你的 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2. 点击左侧导航栏的 **Workers & Pages (Workers 和 Pages)** -> **Create (创建)** -> **Create Worker (创建 Worker)**。
3. 给你的 Worker 起一个名字（例如 `douyu-danmaku`），点击 **Deploy (部署)**。
4. 部署成功后，点击 **Edit Code (编辑代码)** 按钮。
5. 清空编辑器中的默认代码，将本项目中的 [`cloudflare-worker.js`](file:///e:/douyuEx-master/cloudflare-worker.js) 的全部内容复制并粘贴进去。
6. 点击右上角的 **Deploy (部署)** 并发布。
7. **绑定自定义域（建议）**：由于 `*.workers.dev` 域名在国内部分网络环境下访问受限，建议在 Worker 的 **Settings (设置)** -> **Triggers (触发器)** -> **Custom Domains (自定义域)** 中绑定您自己的域名，绑定后即可顺畅访问。

---

### 选项二：部署至 Cloudflare Pages（改名上传）

Cloudflare Pages 同样支持运行 Advanced Functions。你可以通过以下步骤极速部署：

1. 本地新建一个空文件夹（例如 `my-pages-app`）。
2. 将项目中的 [`cloudflare-worker.js`](file:///e:/douyuEx-master/cloudflare-worker.js) 复制到该文件夹中，并**重命名为 `_worker.js`**。
3. 打开 [Cloudflare Dashboard](https://dash.cloudflare.com/)，选择 **Workers & Pages** -> **Create** -> **Pages** -> **Upload assets (上传资源)**。
4. 给你的 Pages 项目起一个名字，然后将刚才包含 `_worker.js` 的文件夹拖拽上传。
5. 点击 **Deploy site (部署站点)**。部署完成后即可直接通过 Pages 分配的域名进行访问。

---

### 选项三：本地使用 Wrangler CLI 部署（适合开发者）

如果你习惯命令行开发与部署：

1. 本地初始化 Wrangler：
   ```bash
   npm install -g wrangler
   wrangler login
   ```
2. 部署为 Workers：
   ```bash
   wrangler deploy cloudflare-worker.js --name douyu-danmaku
   ```

---

## 📖 使用与配置说明

### 1. 基础连接
- 访问部署好的 Worker 页面。
- 在左侧侧边栏输入 **斗鱼直播房间号**，点击 **连接并查看弹幕** 按钮。
- 连接成功后，状态指示灯将变为**绿色常亮**，右侧区域即可实时接收普通弹幕、礼物动态以及观众进场消息。

### 2. URL 自动连接（免输入）
如果你希望为特定直播间生成直达链接，可以在 Worker URL 后添加参数：
- **参数形式**：`https://<你的Worker域名>/?room=房间号`
- **路径形式**：`https://<你的Worker域名>/房间号`
> 打开页面后系统会自动尝试连接该房间，免去手动输入步骤。

### 3. OBS 串流/看板使用指南
如果你是主播或导播，想将该页面作为 OBS 的弹幕看板：
1. **获取链接**：访问并连接到指定的房间，配置好你所需要的过滤规则（如“过滤机器人弹幕”）。
2. **透明化背景**：在左侧面板将 **“背景不透明度”** 滑块拉至 `0%`。
3. **复制 URL**：复制浏览器地址栏的完整 URL（包含 `?room=xxxx`）。
4. **添加 OBS 浏览器源**：
   - 打开 OBS Studio -> 点击 **“来源”** 窗口的 **“+”** 号 -> 选择 **“浏览器”**。
   - 在 URL 栏中粘贴刚刚复制的链接。
   - 宽度和高度建议设为 `800` × `600` 或根据你的画面版式微调。
   - **完成**！弹幕框将以完美的透明磨砂质感和无滚动条状态悬浮于你的直播画面之上。

---

## ⚙️ 进阶功能选项配置

| 选项名称 | 说明 |
| :--- | :--- |
| **显示普通弹幕** | 开启后显示普通观众发送的聊天弹幕。 |
| **显示礼物消息** | 开启后显示观众送礼、开通或续费钻粉等动态。支持动态叠加连击。 |
| **显示入场消息** | 开启后显示观众进入直播间的提醒（右下角独立区域）。 |
| **合并重复弹幕** | 激进合并相同字符不同字数的刷屏弹幕，大幅降低高弹幕直播间的视觉刷屏感。 |
| **合并时间窗口** | 相同弹幕在此时间段（1~60秒）内会被计入 Combo 合并。 |
| **过滤机器人弹幕** | 自动过滤没有携带任何用户标识（如粉丝牌、等级等）的系统机器人与协议号弹幕。 |
| **弹幕语音朗读 (TTS)** | 开启后实时将弹幕文本转换为语音播报（基于浏览器内建 SpeechSynthesis API）。 |
| **背景不透明度** | 支持 0% 到 100% 调节，方便用于 OBS 半透明或全透明叠加。 |
| **弹幕字号** | 12px ~ 24px 自由调整，适配各种分辨率显示器。 |
| **最大保留行数** | 50 ~ 1000 行限制。当消息数量超过限制时，自动清理旧消息，保护低端设备不卡顿。 |

---

## 🛠️ 技术实现

1. **Cloudflare Worker 托管**：
   利用 `ES Module` 格式的 Worker 入口，返回一个经过精心排版的 `Response` 对象，其 Content-Type 为 `text/html;charset=UTF-8`。
2. **斗鱼 WebSocket 协议解析**：
   - 网页端直接向斗鱼 WebSocket 代理服务器发送 TCP-like 封包结构（长度 + 消息类型 + 原始数据）。
   - 自主实现了斗鱼专有的 `@=` 和 `/` 序列化文本协议的 JavaScript 解密和组包（`WebSocket_Packet`、`parseDouyuMsg`、`decodeDouyuVal`）。
3. **页面零外部依赖**：
   - UI 所有的 CSS 样式、SVG 图标、以及业务 JS 逻辑全部打包在单个 HTML 文件内，做到了**真正的开箱即用，单文件发布**。

---

## 🤝 致谢

本项目的部分核心弹幕解析逻辑与设计灵感参考并二次开发自开源项目 [douyuEx](https://github.com/qianjiachun/douyuEx) （作者：[qianjiachun / 小淳](https://github.com/qianjiachun)）。在此对原作者的优秀作品与开源精神致以诚挚的感谢！

---

## 📄 许可协议

本项目基于 **MIT** 协议开源，欢迎自由分发、修改与商业使用。

> **声明**：本项目仅供日常观看、弹幕分析及学术参考研究使用，请勿用于任何恶意刷屏、薅羊毛、网络攻击等违反斗鱼平台服务协议的用途。
