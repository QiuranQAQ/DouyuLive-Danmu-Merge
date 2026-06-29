# Douyu Danmaku Online Assistant - Cloudflare Worker Edition

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![OBS Overlay](https://img.shields.io/badge/OBS-Overlay%20Friendly-050B14?style=for-the-badge&logo=obs-studio&logoColor=white)](#obs-overlay-guide)

A lightweight **Douyu Live Stream Danmaku Online Assistant** built with native JavaScript and WebSocket direct connection technology. Specially designed for Cloudflare Workers/Pages, this project supports **single-file deployment** without complex server configurations. Easily set up your own live danmaku monitor page and OBS overlay.

> [!NOTE]
> This project is powered by the `DouyuEx` danmaku engine and modified/optimized by Chuxiang. The frontend adopts a modern dark glassmorphism design with elegant neon background blobs and smooth micro-animations.

---

## ✨ Features

- ⚡ **Zero-Relay Direct Connection**: The browser establishes a direct WebSocket connection with the Douyu danmaku server (`wss://danmuproxy.douyu.com`). The Cloudflare Worker only serves the frontend HTML assets, keeping your Worker resource usage and bandwidth costs at zero.
- 🔄 **Intelligent Danmaku Merging (Combo)**: Automatically merges identical chat messages within a customizable time window.
  - **Heat Tier Styling**: Dynamically colors the multiplier badge depending on the combo count (Tier 1: Slate, Tier 2: Bold Purple, Tier 3: Bold Red with glowing effect).
  - **Click to Expand**: Click on any merged message row to dynamically expand a sublist showing the detailed timestamps and user info.
- 📌 **High-Heat Combo Pinning**: Popular memes (combos >= 10) are automatically pinned to a dedicated top/bottom area so you won't miss any hype moments (capped at 3 items to avoid blocking the screen).
- 🗣️ **Text-to-Speech (TTS)**: Built-in speech synthesis engine to read aloud incoming chat and gift announcements. Features built-in queuing and throttle control to prevent speech overlaps.
- 🔍 **Viewer History Lookup**: Click on any viewer's nickname to instantly open their historical chat logs on a third-party tracking site (`doseeing.com`).
- 🎨 **OBS Overlay Friendly**: 
  - Adjustable **background opacity** down to `0%` (fully transparent).
  - Clean, borderless layout with hidden scrollbars, making it a perfect browser source in OBS Studio.
- 🚀 **Auto-Connection via URL**: Connect to a live room automatically by passing a room ID in the URL, e.g., `https://your-worker.workers.dev/?room=9999` or `https://your-worker.workers.dev/9999`.

---

## 🛠️ Cloudflare Deployment Guide

You can deploy this project on either **Cloudflare Workers** or **Cloudflare Pages**.

### Option 1: Deploy on Cloudflare Workers (Copy & Paste)

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** -> **Create** -> **Create Worker**.
3. Name your worker (e.g. `douyu-danmaku`), then click **Deploy**.
4. Once deployed, click **Edit Code**.
5. Clear the default boilerplate and copy the entire contents of [`cloudflare-worker.js`](file:///e:/douyuEx-master/cloudflare-worker.js) into the editor.
6. Click **Save and Deploy**.
7. **Bind a Custom Domain (Recommended)**: Since the default `*.workers.dev` domain might be blocked or restricted in certain regions (like mainland China), we highly recommend binding your own domain under **Settings** -> **Triggers** -> **Custom Domains**.

---

### Option 2: Deploy on Cloudflare Pages (Rename & Upload)

Cloudflare Pages also supports hosting Advanced Functions. You can deploy via drag-and-drop:

1. Create a new empty folder on your computer (e.g. `my-pages-app`).
2. Copy [`cloudflare-worker.js`](file:///e:/douyuEx-master/cloudflare-worker.js) into it and **rename it to `_worker.js`**.
3. In [Cloudflare Dashboard](https://dash.cloudflare.com/), go to **Workers & Pages** -> **Create** -> **Pages** -> **Upload assets**.
4. Choose a project name, then drag and drop the folder containing your `_worker.js` file.
5. Click **Deploy site**. Once completed, you can access the page using the provided Pages subdomain.

---

### Option 3: Deploy via Wrangler CLI (For Developers)

If you prefer deploying from your local command line:

1. Install Wrangler globally and log in:
   ```bash
   npm install -g wrangler
   wrangler login
   ```
2. Deploy as a Worker:
   ```bash
   wrangler deploy cloudflare-worker.js --name douyu-danmaku
   ```

---

## 📖 Usage Instructions

### 1. Basic Connection
- Open your deployed Worker/Pages URL.
- Enter the **Douyu Room ID** in the sidebar on the left and click **连接并查看弹幕 (Connect & View Danmaku)**.
- Once connected, the status indicator will turn **green**, and the logs will start displaying live chat, gifts, and viewer entries.

### 2. Auto-Connecting via URL
You can share or bookmark a direct link to bypass manual inputs:
- **Query Parameter**: `https://<your-domain>/?room=RoomID`
- **Path Parameter**: `https://<your-domain>/RoomID`
> Opening this link will automatically trigger a WebSocket connection to the designated room.

### 3. OBS Overlay Guide
To add the live chat widget directly onto your stream overlay in OBS Studio:
1. Open the page, connect to your room, and configure your preferred filters.
2. In the settings panel, drag the **"背景不透明度 (Background Opacity)"** slider to `0%`.
3. Copy the URL from your browser address bar (ensure it includes `?room=xxxx`).
4. In OBS Studio, click the **"+"** icon under **Sources** -> choose **Browser**.
5. Paste the copied URL into the URL field.
6. Set the Width and Height to `800`x`600` (or adapt it to your layout).
7. The danmaku box will float on your stream layout with a transparent glassmorphism overlay.

---

## ⚙️ Advanced Configurations

| Setting Name (CN) | Description |
| :--- | :--- |
| **显示普通弹幕** (Show Chat) | Show regular user chat messages in the main area. |
| **显示礼物消息** (Show Gifts) | Show gift, Diamond Fan subscription, and renewal alerts. |
| **显示入场消息** (Show Entry) | Show entry notifications for users entering the stream room. |
| **合并重复弹幕** (Merge Duplicates) | Collapses identical spam messages to clean up the chat feed. |
| **合并时间窗口** (Merge Window) | The time window (1~60s) within which duplicate messages are merged. |
| **过滤机器人弹幕** (Filter Robots) | Filters out automated platform announcement bots/fake viewers. |
| **弹幕语音朗读 (TTS)** (TTS Readout) | Read aloud chat and gift messages using browser Web Speech API. |
| **背景不透明度** (Background Opacity) | Adjust background transparency (0% - 100%) for OBS layering. |
| **弹幕字号** (Font Size) | Adjust text size from 12px to 24px for readability. |
| **最大保留行数** (Max Lines) | Maximum log lines (50 - 1000) to retain in memory to prevent browser lag. |

---

## 🛠️ Technical Details

1. **Cloudflare Worker Middleware**:
   Utilizes standard ES Module worker handler to return a single HTML payload wrapped in a `Response` with `content-type: text/html;charset=UTF-8`.
2. **Douyu WebSocket Parser**:
   - The browser connects directly to Douyu WebSocket proxy ports (`wss://danmuproxy.douyu.com:8502` to `8505` at random).
   - Custom implementation of Douyu's serializing text protocol using helper encoders and decoders (`WebSocket_Packet`, `parseDouyuMsg`, `decodeDouyuVal`).
3. **Single File Asset**:
   - Styling, scripts, and layout elements are all embedded in one file, offering a zero-dependency, self-contained setup.

---

## 🤝 Acknowledgments

Some core danmaku decoding logic and UI inspirations are based on and ported from the open-source Tampermonkey extension [douyuEx](https://github.com/qianjiachun/douyuEx) created by [qianjiachun / 小淳](https://github.com/qianjiachun). Heartfelt thanks to the original author for their outstanding contribution to the Douyu web enhancement ecosystem!

---

## 📄 License

This project is licensed under the **MIT** License.

> **Disclaimer**: This tool is for personal viewing, data analytics, and educational research purposes only. Please do not use it for spamming, botting, or any behavior that violates Douyu's terms of service.
