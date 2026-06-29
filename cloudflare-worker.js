export default {
  async fetch(request, env, ctx) {
    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  }
};

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>斗鱼弹幕在线助手-魔改DouyuEx by超限</title>
  <!-- Google Fonts Outfit & Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      --panel-bg: rgba(30, 41, 59, 0.7);
      --panel-border: rgba(255, 255, 255, 0.08);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #6366f1;
      --accent-hover: #4f46e5;
      --accent-success: #10b981;
      --accent-danger: #ef4444;
      --font-outfit: 'Outfit', 'Inter', -apple-system, sans-serif;
      --font-inter: 'Inter', -apple-system, sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-inter);
      background: var(--bg-gradient);
      color: var(--text-main);
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Background decorative blobs */
    .bg-blobs {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: -1;
      overflow: hidden;
      pointer-events: none;
    }

    .bg-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      opacity: 0.15;
    }

    .blob-1 {
      top: -10%;
      left: 10%;
      width: 500px;
      height: 500px;
      background: #4f46e5;
    }

    .blob-2 {
      bottom: -10%;
      right: 10%;
      width: 600px;
      height: 600px;
      background: #06b6d4;
    }

    /* App Container */
    .app-container {
      display: flex;
      height: 100%;
      width: 100%;
      padding: 20px;
      gap: 20px;
      box-sizing: border-box;
      overflow: hidden;
    }

    /* Sidebar Panel */
    .sidebar {
      width: 320px;
      flex-shrink: 0;
      background: var(--panel-bg);
      border: 1px solid var(--panel-border);
      backdrop-filter: blur(16px);
      border-radius: 24px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-logo {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-outfit);
      font-weight: 700;
      font-size: 20px;
      color: #fff;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    }

    .brand-title {
      font-family: var(--font-outfit);
      font-weight: 700;
      font-size: 20px;
      background: linear-gradient(to right, #f8fafc, #cbd5e1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .input-field {
      width: 100%;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 12px 16px;
      color: var(--text-main);
      font-size: 14px;
      font-family: var(--font-inter);
      transition: all 0.2s ease;
    }

    .input-field:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25);
    }

    .btn {
      width: 100%;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 14px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      font-family: var(--font-inter);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn:hover {
      background: var(--accent-hover);
      transform: translateY(-1px);
    }

    .btn:active {
      transform: translateY(1px);
    }

    .btn-disconnect {
      background: var(--accent-danger);
    }

    .btn-disconnect:hover {
      background: #dc2626;
    }

    .divider {
      height: 1px;
      background: var(--panel-border);
    }

    /* Switch Option */
    .option-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 0;
    }

    .option-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .option-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-main);
    }

    .option-desc {
      font-size: 11px;
      color: var(--text-muted);
    }

    /* CSS Switch */
    .switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.1);
      transition: .3s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .3s;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    input:checked + .slider {
      background-color: var(--accent-success);
    }

    input:checked + .slider:before {
      transform: translateX(20px);
    }

    /* Range Slider */
    .range-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .range-input {
      flex: 1;
      accent-color: var(--accent);
      cursor: pointer;
    }

    .range-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--accent);
      min-width: 32px;
      text-align: right;
    }

    /* Column Panels */
    .column-panel {
      background: var(--panel-bg);
      border: 1px solid var(--panel-border);
      backdrop-filter: blur(16px);
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
      position: relative;
    }

    .chat-section {
      flex: 2.5;
      min-width: 300px;
    }

    .right-section {
      flex: 1.2;
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-width: 250px;
    }

    .gift-section, .entry-section {
      flex: 1;
      min-height: 0;
    }

    .panel-column-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--accent);
    }

    .chat-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--panel-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(15, 23, 42, 0.2);
    }

    .status-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-danger);
      box-shadow: 0 0 8px var(--accent-danger);
      transition: all 0.3s ease;
    }

    .status-dot.connected {
      background: var(--accent-success);
      box-shadow: 0 0 8px var(--accent-success);
    }

    .status-dot.connecting {
      background: var(--accent);
      box-shadow: 0 0 8px var(--accent);
      animation: pulse 1.5s infinite alternate;
    }

    @keyframes pulse {
      0% { opacity: 0.4; }
      100% { opacity: 1; }
    }

    .status-text {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-main);
    }

    .room-info {
      font-size: 14px;
      color: var(--text-muted);
    }

    .chat-log {
      flex: 1;
      padding: 20px 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      position: relative; /* Ensure it is the offsetParent */
      font-size: 14px;
      transform: translateZ(0);
      will-change: scroll-position;
    }

    /* Custom Scrollbar */
    .chat-log::-webkit-scrollbar {
      width: 8px;
    }

    .chat-log::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.02);
      border-radius: 4px;
    }

    .chat-log::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.25);
      border-radius: 4px;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .chat-log::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.45);
    }

    /* Scroll Lock Alert Button */
    .scroll-lock-alert {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(40px);
      background: var(--accent);
      color: white;
      padding: 8px 18px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 10;
      opacity: 0;
      pointer-events: none;
    }

    .scroll-lock-alert.active {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    /* Danmaku Item Style */
    .danmaku-item {
      display: flex;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 6px;
      line-height: 22px;
      font-size: inherit;
      transition: transform 0.2s ease-out, background-color 0.3s ease, border-left-color 0.3s ease;
      transform-origin: left center;
      word-break: break-all;
      animation: fadeIn 0.25s ease-out forwards;
      padding: 6px 12px;
      border-radius: 12px;
      border-left: 3px solid transparent;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .danmaku-item.bump {
      animation: bumpAnim 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes bumpAnim {
      0% { transform: scale(1); }
      50% { transform: scale(1.06); }
      100% { transform: scale(1); }
    }

    .dm-time {
      font-size: 11px;
      color: var(--text-muted);
      font-family: var(--font-outfit);
      margin-right: 4px;
    }

    /* User Badge */
    .dm-badge {
      font-size: 10px;
      font-weight: 600;
      color: #fff;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      padding: 0px 6px;
      border-radius: 4px;
      height: 18px;
      display: inline-flex;
      align-items: center;
      margin-right: 2px;
      align-self: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .dm-level {
      font-size: 10px;
      font-family: var(--font-outfit);
      color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.2);
      padding: 0 4px;
      border-radius: 4px;
      height: 18px;
      display: inline-flex;
      align-items: center;
      align-self: center;
    }

    .dm-username {
      font-weight: 600;
      color: #cbd5e1;
      cursor: pointer;
    }

    .dm-username:hover {
      color: #fff;
      text-decoration: underline;
    }

    .dm-content {
      color: var(--text-main);
    }

    /* Danmaku Colors */
    .col-red { color: #f87171 !important; }
    .col-blue { color: #60a5fa !important; }
    .col-green { color: #34d399 !important; }
    .col-orange { color: #fb923c !important; }
    .col-purple { color: #c084fc !important; }
    .col-pink { color: #f472b6 !important; }

    /* Multiplier Badge */
    .multiplier-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.05em;
      font-weight: 800;
      color: #ffffff;
      padding: 2px 6px;
      border-radius: 8px;
      margin-left: 8px;
      align-self: center;
      animation: popBadge 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      user-select: none;
    }

    .multiplier-badge.pop-active {
      animation: badgePop 0.2s ease-in-out;
    }

    @keyframes badgePop {
      0% { transform: scale(1.0); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1.0); }
    }

    @keyframes popBadge {
      0% { transform: scale(0.6); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    .dm-system {
      color: #fbbf24;
      font-style: italic;
      font-weight: 500;
    }

    /* Gift & Entry styling */
    .dm-gift {
      color: #f43f5e !important;
      font-weight: 600;
    }
    
    .dm-entry {
      color: #38bdf8 !important;
      font-style: italic;
    }

    .gift-icon {
      height: 20px;
      width: auto;
      vertical-align: middle;
      margin-left: 6px;
      display: inline-block;
    }

    /* Merged Danmaku Click-to-Expand Sublist */
    .danmaku-item.has-merged {
      cursor: pointer;
      position: relative;
      transition: background-color 0.3s ease, border-left-color 0.3s ease, transform 0.2s ease;
    }

    .danmaku-item.has-merged:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }

    .danmaku-sublist {
      width: 100%;
      margin-top: 8px;
      padding-left: 16px;
      border-left: 2px solid var(--accent);
      display: none;
      flex-direction: column;
      gap: 6px;
      font-size: 0.9em;
      color: var(--text-muted);
      cursor: default;
    }

    .danmaku-sublist.active {
      display: flex;
    }

    .sub-item {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
      line-height: 18px;
    }

    .sub-item .dm-time {
      margin-right: 0;
      font-size: 10px;
    }

    /* Merge Flash Animation */
    @keyframes merge-flash {
      0% { background-color: rgba(99, 102, 241, 0.4); }
      100% { background-color: transparent; }
    }
    .merge-flash-active {
      animation: merge-flash 0.3s ease-out;
    }

    /* Heat Tier Styling */
    .badge-tier-1 {
      background: rgba(148, 163, 184, 0.2) !important;
      color: #cbd5e1 !important;
      border: none !important;
    }
    .badge-tier-2 {
      background: rgba(99, 102, 241, 0.25) !important;
      color: #818cf8 !important;
      border: none !important;
    }
    .badge-tier-3 {
      background: linear-gradient(135deg, #f97316 0%, #ef4444 100%) !important;
      color: #fff !important;
      border: none !important;
      box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
    }
    .text-bold {
      font-weight: bold !important;
    }
    .row-high-heat {
      background-color: rgba(239, 68, 68, 0.08) !important;
      border-left: 3px solid #ef4444 !important;
    }



    .pinned-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 10px 24px 20px 24px;
      background: rgba(99, 102, 241, 0.05);
      border-top: 1px dashed rgba(255, 255, 255, 0.1);
      font-size: 14px;
    }
    .pinned-container:empty {
      display: none;
    }

    /* Footer / Bottom Info */
    .footer-bar {
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: var(--text-muted);
      padding: 0 10px;
    }

    .footer-bar a {
      color: var(--accent);
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-bar a:hover {
      color: var(--accent-hover);
    }
  </style>
</head>
<body>
  <div class="bg-blobs">
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>
  </div>

  <div class="app-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="brand">
        <div class="brand-logo">Dm</div>
        <div class="brand-title">斗鱼弹幕助手 by超限</div>
      </div>

      <div class="divider"></div>

      <!-- Connection Form -->
      <div class="form-group">
        <label class="form-label" for="room-id">斗鱼直播房间号</label>
        <input type="text" id="room-id" class="input-field" placeholder="例如: 9999" value="">
      </div>

      <button id="connect-btn" class="btn">
        <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
        </svg>
        <span>连接并查看弹幕</span>
      </button>

      <div class="divider"></div>

      <!-- Settings Panel -->
      <div class="form-group" style="gap: 16px; overflow-y: auto; max-height: calc(100vh - 280px); padding-right: 4px;">
        <label class="form-label">功能选项</label>
        
        <!-- Option: Show Chat -->
        <div class="option-item">
          <div class="option-info">
            <span class="option-title">显示普通弹幕</span>
            <span class="option-desc">显示观众的聊天消息</span>
          </div>
          <label class="switch">
            <input type="checkbox" id="opt-show-chat" checked>
            <span class="slider"></span>
          </label>
        </div>

        <!-- Option: Show Gifts -->
        <div class="option-item">
          <div class="option-info">
            <span class="option-title">显示礼物消息</span>
            <span class="option-desc">显示送礼、开通钻粉等动态</span>
          </div>
          <label class="switch">
            <input type="checkbox" id="opt-show-gifts" checked>
            <span class="slider"></span>
          </label>
        </div>

        <!-- Option: Show Entries -->
        <div class="option-item">
          <div class="option-info">
            <span class="option-title">显示入场消息</span>
            <span class="option-desc">显示观众进入直播间的提醒</span>
          </div>
          <label class="switch">
            <input type="checkbox" id="opt-show-entry" checked>
            <span class="slider"></span>
          </label>
        </div>

        <!-- Option: Merge Duplicates -->
        <div class="option-item">
          <div class="option-info">
            <span class="option-title">合并重复弹幕</span>
            <span class="option-desc">激进合并相同字符不同字数弹幕</span>
          </div>
          <label class="switch">
            <input type="checkbox" id="opt-merge" checked>
            <span class="slider"></span>
          </label>
        </div>

        <!-- Option: Time Window -->
        <div class="form-group" style="margin-top: 2px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="option-title" style="font-size: 13px;">合并时间窗口</span>
            <span id="merge-window-val" class="range-value">10秒</span>
          </div>
          <div class="range-group">
            <input type="range" id="opt-window" class="range-input" min="1" max="60" value="10">
          </div>
        </div>

        <!-- Option: Filter Robot -->
        <div class="option-item">
          <div class="option-info">
            <span class="option-title">过滤机器人弹幕</span>
            <span class="option-desc">仅保留带用户标识的真实消息</span>
          </div>
          <label class="switch">
            <input type="checkbox" id="opt-filter-robot" checked>
            <span class="slider"></span>
          </label>
        </div>

        <!-- Option: TTS -->
        <div class="option-item">
          <div class="option-info">
            <span class="option-title">弹幕语音朗读 (TTS)</span>
            <span class="option-desc">自动朗读接收到的聊天和礼物</span>
          </div>
          <label class="switch">
            <input type="checkbox" id="opt-tts">
            <span class="slider"></span>
          </label>
        </div>

        <!-- Option: Background Opacity -->
        <div class="form-group" style="margin-top: 2px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="option-title" style="font-size: 13px;">背景不透明度</span>
            <span id="opacity-val" class="range-value">100%</span>
          </div>
          <div class="range-group">
            <input type="range" id="opt-opacity" class="range-input" min="0" max="100" value="100">
          </div>
        </div>

        <!-- Option: Font Size -->
        <div class="form-group" style="margin-top: 2px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="option-title" style="font-size: 13px;">弹幕字号</span>
            <span id="font-size-val" class="range-value">14px</span>
          </div>
          <div class="range-group">
            <input type="range" id="opt-font-size" class="range-input" min="12" max="24" value="14">
          </div>
        </div>

        <!-- Option: Max Lines -->
        <div class="form-group" style="margin-top: 2px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="option-title" style="font-size: 13px;">最大保留行数</span>
            <span id="max-lines-val" class="range-value">300行</span>
          </div>
          <div class="range-group">
            <input type="range" id="opt-max-lines" class="range-input" min="50" max="1000" step="50" value="300">
          </div>
        </div>

        <div class="divider" style="margin: 8px 0;"></div>
        <label class="form-label" style="margin-bottom: 4px; display: block;">高级过滤规则</label>
        
        <!-- Option: Block Keywords -->
        <div class="form-group" style="margin-top: 2px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="option-title" style="font-size: 13px;">屏蔽关键字 (逗号/换行分隔)</span>
          </div>
          <textarea id="opt-block-keywords" class="input-field" rows="2" style="resize: vertical; font-size: 12px; padding: 8px; font-family: var(--font-inter);" placeholder="例如: 剧透, 广告, 刷屏"></textarea>
        </div>

        <!-- Option: Block Regex -->
        <div class="form-group" style="margin-top: 2px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="option-title" style="font-size: 13px;">屏蔽正则规则 (每行一条)</span>
          </div>
          <textarea id="opt-block-regex" class="input-field" rows="2" style="resize: vertical; font-size: 12px; padding: 8px; font-family: var(--font-inter);" placeholder="例如: ^\d+$ (过滤纯数字)"></textarea>
        </div>

        <!-- Option: Block Users/UIDs -->
        <div class="form-group" style="margin-top: 2px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="option-title" style="font-size: 13px;">屏蔽用户昵称/UID (逗号/换行分隔)</span>
          </div>
          <textarea id="opt-block-users" class="input-field" rows="2" style="resize: vertical; font-size: 12px; padding: 8px; font-family: var(--font-inter);" placeholder="例如: 黑粉昵称, 1234567"></textarea>
        </div>

        <!-- Option: Min User Level -->
        <div class="form-group" style="margin-top: 2px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="option-title" style="font-size: 13px;">最低显示用户等级</span>
            <span id="min-level-val" class="range-value">1级</span>
          </div>
          <div class="range-group">
            <input type="range" id="opt-min-level" class="range-input" min="1" max="120" value="1">
          </div>
        </div>

        <!-- Option: Block No Badge -->
        <div class="option-item">
          <div class="option-info">
            <span class="option-title">屏蔽无粉丝牌发言</span>
            <span class="option-desc">仅显示带当前直播间粉丝牌的发言</span>
          </div>
          <label class="switch">
            <input type="checkbox" id="opt-block-nobadge">
            <span class="slider"></span>
          </label>
        </div>

      </div>

      <div class="divider"></div>

      <!-- Quick Actions -->
      <div style="display: flex; gap: 10px; margin-top: auto;">
        <button id="clear-btn" class="btn" style="background: rgba(255,255,255,0.06); color: var(--text-muted); border: 1px solid rgba(255,255,255,0.08); padding: 10px 0;">
          清空屏幕
        </button>
        <button id="scroll-toggle-btn" class="btn" style="background: rgba(255,255,255,0.06); color: var(--text-muted); border: 1px solid rgba(255,255,255,0.08); padding: 10px 0; flex: 1;">
          暂停滚动
        </button>
      </div>

    </div>

    <!-- Chat Column (flex: 2.5) -->
    <div class="chat-section column-panel">
      <div class="chat-header" style="display: flex; align-items: center; justify-content: space-between;">
        <span class="panel-column-title">弹幕消息</span>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="status-container">
            <div id="status-dot" class="status-dot"></div>
            <span id="status-text" class="status-text">未连接</span>
          </div>
          <div class="room-info" id="room-info"></div>
        </div>
      </div>

      <div class="chat-log" id="chat-log">
        <div class="danmaku-item">
          <span class="dm-time">系统提示</span>
          <span class="dm-content dm-system">请输入房间号并点击连接以接收实时弹幕...</span>
        </div>
      </div>

      <div class="pinned-container" id="pinned-container"></div>

      <div class="scroll-lock-alert" id="scroll-lock-alert">
        <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24">
          <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
        </svg>
        <span>有新弹幕 (点击滚动到底部)</span>
      </div>
    </div>

    <!-- Right Column (flex: 1.2) -->
    <div class="right-section">
      <!-- Gift Column -->
      <div class="gift-section column-panel">
        <div class="chat-header">
          <span class="panel-column-title">礼物动态</span>
        </div>
        <div class="chat-log" id="gift-log">
          <div class="danmaku-item">
            <span class="dm-time">系统</span>
            <span class="dm-content dm-system">等待礼物接收...</span>
          </div>
        </div>
      </div>

      <!-- Entry Column -->
      <div class="entry-section column-panel">
        <div class="chat-header">
          <span class="panel-column-title">观众入场</span>
        </div>
        <div class="chat-log" id="entry-log">
          <div class="danmaku-item">
            <span class="dm-time">系统</span>
            <span class="dm-content dm-system">等待入场消息...</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    console.log("Douyu Danmaku Assistant Script Booting...");
    // Config & Globals
    let socket = null;
    let keepAliveTimer = null;
    let activeRoom = "";
    let autoScroll = true;
    let activeDanmakus = new Map(); // key: collapsedKey -> { element, countBadge, count, timestamp, details }
    let activeGifts = new Map();    // key: nickname_gfid -> { element, contentSpan, count, timestamp }
    const encoder = new TextEncoder();
    const decoder = new TextDecoder("utf-8");



    // TTS variables
    let ttsQueue = [];
    let ttsSpeaking = false;

    // Gift configurations
    let giftConfig = {};
    const giftFallback = {
      "192": "荧光棒",
      "193": "弱鸡",
      "195": "飞机",
      "196": "火箭",
      "520": "办卡",
      "1005": "超级火箭",
      "197": "超级火箭",
      "20025": "鱼丸",
      "20026": "星空卡",
      "20002": "赞",
      "20297": "能量水晶",
      "9999": "办卡"
    };

    // UI Nodes
    const roomIdInput = document.getElementById("room-id");
    const connectBtn = document.getElementById("connect-btn");
    const chatLog = document.getElementById("chat-log");
    const pinnedContainer = document.getElementById("pinned-container");
    const giftLog = document.getElementById("gift-log");
    const entryLog = document.getElementById("entry-log");
    const statusDot = document.getElementById("status-dot");
    const statusText = document.getElementById("status-text");
    const roomInfo = document.getElementById("room-info");
    const clearBtn = document.getElementById("clear-btn");
    const scrollToggleBtn = document.getElementById("scroll-toggle-btn");
    const scrollLockAlert = document.getElementById("scroll-lock-alert");

    // Options
    const optShowChat = document.getElementById("opt-show-chat");
    const optShowGifts = document.getElementById("opt-show-gifts");
    const optShowEntry = document.getElementById("opt-show-entry");
    const optMerge = document.getElementById("opt-merge");
    const optWindow = document.getElementById("opt-window");
    const mergeWindowVal = document.getElementById("merge-window-val");
    const optFilterRobot = document.getElementById("opt-filter-robot");
    const optTts = document.getElementById("opt-tts");
    const optOpacity = document.getElementById("opt-opacity");
    const opacityVal = document.getElementById("opacity-val");
    const optFontSize = document.getElementById("opt-font-size");
    const fontSizeVal = document.getElementById("font-size-val");
    const optMaxLines = document.getElementById("opt-max-lines");
    const maxLinesVal = document.getElementById("max-lines-val");

    // New Filter selectors
    const optBlockKeywords = document.getElementById("opt-block-keywords");
    const optBlockRegex = document.getElementById("opt-block-regex");
    const optBlockUsers = document.getElementById("opt-block-users");
    const optMinLevel = document.getElementById("opt-min-level");
    const minLevelVal = document.getElementById("min-level-val");
    const optBlockNobadge = document.getElementById("opt-block-nobadge");

    // Initialize Settings UI values
    if (optWindow) {
      optWindow.addEventListener("input", () => {
        if (mergeWindowVal) mergeWindowVal.textContent = optWindow.value + "秒";
      });
    }
    if (optFontSize) {
      optFontSize.addEventListener("input", () => {
        if (fontSizeVal) fontSizeVal.textContent = optFontSize.value + "px";
        if (chatLog) chatLog.style.fontSize = optFontSize.value + "px";
        if (pinnedContainer) pinnedContainer.style.fontSize = optFontSize.value + "px";
        if (giftLog) giftLog.style.fontSize = optFontSize.value + "px";
        if (entryLog) entryLog.style.fontSize = optFontSize.value + "px";
      });
    }
    function trimLogs() {
      if (!optMaxLines) return;
      const maxLines = parseInt(optMaxLines.value);
      
      // Trim chatLog
      if (chatLog) {
        while (chatLog.childElementCount > maxLines) {
          const oldest = chatLog.firstElementChild;
          if (oldest) {
            const oldestKey = oldest.dataset.key;
            if (oldestKey) {
              const mapped = activeDanmakus.get(oldestKey);
              if (mapped && mapped.element === oldest) {
                activeDanmakus.delete(oldestKey);
              }
            }
            oldest.remove();
          } else {
            break;
          }
        }
      }

      // Trim giftLog
      if (giftLog) {
        while (giftLog.childElementCount > maxLines) {
          const oldest = giftLog.firstElementChild;
          if (oldest) {
            const oldestKey = oldest.dataset.key;
            if (oldestKey) {
              const mapped = activeGifts.get(oldestKey);
              if (mapped && mapped.element === oldest) {
                activeGifts.delete(oldestKey);
              }
            }
            oldest.remove();
          } else {
            break;
          }
        }
      }

      // Trim entryLog
      if (entryLog) {
        while (entryLog.childElementCount > maxLines) {
          const oldest = entryLog.firstElementChild;
          if (oldest) {
            oldest.remove();
          } else {
            break;
          }
        }
      }
    }

    if (optMaxLines) {
      optMaxLines.addEventListener("input", () => {
        if (maxLinesVal) maxLinesVal.textContent = optMaxLines.value + "行";
        trimLogs();
      });
    }
    if (optMinLevel) {
      optMinLevel.addEventListener("input", () => {
        if (minLevelVal) minLevelVal.textContent = optMinLevel.value + "级";
      });
    }
    if (optOpacity) {
      optOpacity.addEventListener("input", () => {
        if (opacityVal) opacityVal.textContent = optOpacity.value + "%";
        updateOpacity();
      });
    }
    if (optTts) {
      optTts.addEventListener("change", () => {
        if (!optTts.checked) {
          window.speechSynthesis.cancel();
          ttsQueue = [];
          ttsSpeaking = false;
        }
      });
    }

    // Auto-scroll handler & scroll lock detection for Chat Log
    let lastScrollTop = chatLog ? chatLog.scrollTop : 0;
    if (chatLog) {
      chatLog.addEventListener("scroll", () => {
        const currentScrollTop = chatLog.scrollTop;
        const threshold = 50;
        const isAtBottom = chatLog.scrollHeight - currentScrollTop - chatLog.clientHeight <= threshold;
        
        if (isAtBottom) {
          autoScroll = true;
          if (scrollLockAlert) scrollLockAlert.classList.remove("active");
        } else {
          // Only disable autoScroll if the user is scrolling UP
          if (currentScrollTop < lastScrollTop) {
            autoScroll = false;
          }
        }
        lastScrollTop = currentScrollTop;
      });
    }

    if (scrollLockAlert) {
      scrollLockAlert.addEventListener("click", () => {
        scrollToBottom(true);
      });
    }

    if (scrollToggleBtn) {
      scrollToggleBtn.addEventListener("click", () => {
        if (autoScroll) {
          autoScroll = false;
          scrollToggleBtn.textContent = "恢复滚动";
          scrollToggleBtn.style.background = "rgba(99, 102, 241, 0.15)";
          scrollToggleBtn.style.color = "var(--accent)";
        } else {
          scrollToBottom(true);
          scrollToggleBtn.textContent = "暂停滚动";
          scrollToggleBtn.style.background = "rgba(255,255,255,0.06)";
          scrollToggleBtn.style.color = "var(--text-muted)";
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (chatLog) chatLog.innerHTML = "";
        if (pinnedContainer) pinnedContainer.innerHTML = "";
        if (giftLog) giftLog.innerHTML = "";
        if (entryLog) entryLog.innerHTML = "";
        activeDanmakus.clear();
        activeGifts.clear();
        addSystemLog("屏幕已清空。");
      });
    }

    // Save & Load settings logic
    function saveSettings() {
      const settings = {
        showChat: optShowChat ? optShowChat.checked : true,
        showGifts: optShowGifts ? optShowGifts.checked : true,
        showEntry: optShowEntry ? optShowEntry.checked : true,
        merge: optMerge ? optMerge.checked : true,
        window: optWindow ? optWindow.value : "10",
        filterRobot: optFilterRobot ? optFilterRobot.checked : true,
        tts: optTts ? optTts.checked : false,
        opacity: optOpacity ? optOpacity.value : "100",
        fontSize: optFontSize ? optFontSize.value : "14",
        maxLines: optMaxLines ? optMaxLines.value : "300",
        blockKeywords: optBlockKeywords ? optBlockKeywords.value : "",
        blockRegex: optBlockRegex ? optBlockRegex.value : "",
        blockUsers: optBlockUsers ? optBlockUsers.value : "",
        minLevel: optMinLevel ? optMinLevel.value : "1",
        blockNobadge: optBlockNobadge ? optBlockNobadge.checked : false
      };
      localStorage.setItem("DouyuAssistant_Settings", JSON.stringify(settings));
    }

    function loadSettings() {
      const saved = localStorage.getItem("DouyuAssistant_Settings");
      if (!saved) return;
      try {
        const settings = JSON.parse(saved);
        if (settings.showChat !== undefined && optShowChat) optShowChat.checked = settings.showChat;
        if (settings.showGifts !== undefined && optShowGifts) optShowGifts.checked = settings.showGifts;
        if (settings.showEntry !== undefined && optShowEntry) optShowEntry.checked = settings.showEntry;
        if (settings.merge !== undefined && optMerge) optMerge.checked = settings.merge;
        if (settings.window !== undefined && optWindow) {
          optWindow.value = settings.window;
          if (mergeWindowVal) mergeWindowVal.textContent = settings.window + "秒";
        }
        if (settings.filterRobot !== undefined && optFilterRobot) optFilterRobot.checked = settings.filterRobot;
        if (settings.tts !== undefined && optTts) optTts.checked = settings.tts;
        if (settings.opacity !== undefined && optOpacity) {
          optOpacity.value = settings.opacity;
          if (opacityVal) opacityVal.textContent = settings.opacity + "%";
        }
        if (settings.fontSize !== undefined && optFontSize) {
          optFontSize.value = settings.fontSize;
          if (fontSizeVal) fontSizeVal.textContent = settings.fontSize + "px";
        }
        if (settings.maxLines !== undefined && optMaxLines) {
          optMaxLines.value = settings.maxLines;
          if (maxLinesVal) maxLinesVal.textContent = settings.maxLines + "行";
        }
        if (settings.blockKeywords !== undefined && optBlockKeywords) optBlockKeywords.value = settings.blockKeywords;
        if (settings.blockRegex !== undefined && optBlockRegex) optBlockRegex.value = settings.blockRegex;
        if (settings.blockUsers !== undefined && optBlockUsers) optBlockUsers.value = settings.blockUsers;
        if (settings.minLevel !== undefined && optMinLevel) {
          optMinLevel.value = settings.minLevel;
          if (minLevelVal) minLevelVal.textContent = settings.minLevel + "级";
        }
        if (settings.blockNobadge !== undefined && optBlockNobadge) optBlockNobadge.checked = settings.blockNobadge;
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }

    // Auto-save listeners for all inputs
    const allInputsToSave = [
      optShowChat, optShowGifts, optShowEntry, optMerge, optWindow,
      optFilterRobot, optTts, optOpacity, optFontSize, optMaxLines,
      optBlockKeywords, optBlockRegex, optBlockUsers, optMinLevel, optBlockNobadge
    ];
    allInputsToSave.forEach(input => {
      if (input) {
        input.addEventListener("change", saveSettings);
        if (input.type === "range" || input.tagName === "TEXTAREA") {
          input.addEventListener("input", saveSettings);
        }
      }
    });

    // Parse URL room parameters & Initialize
    window.addEventListener("DOMContentLoaded", () => {
      loadSettings();
      if (chatLog && optFontSize) chatLog.style.fontSize = optFontSize.value + "px";
      if (pinnedContainer && optFontSize) pinnedContainer.style.fontSize = optFontSize.value + "px";
      if (giftLog && optFontSize) giftLog.style.fontSize = optFontSize.value + "px";
      if (entryLog && optFontSize) entryLog.style.fontSize = optFontSize.value + "px";
      updateOpacity();
      fetchGiftConfig();

      const urlParams = new URLSearchParams(window.location.search);
      const rid = urlParams.get("room") || window.location.pathname.split("/").pop();
      if (rid && /^[0-9]+$/.test(rid)) {
        if (roomIdInput) roomIdInput.value = rid;
        connectToRoom(rid);
      }
    });

    if (connectBtn) {
      connectBtn.addEventListener("click", () => {
        console.log("Connect button clicked!");
        const rid = roomIdInput ? roomIdInput.value.trim() : "";
        console.log("Room ID entered:", rid);
        if (!rid) {
          alert("请输入有效的直播房间号！");
          return;
        }
        if (socket) {
          console.log("Disconnecting socket...");
          disconnect();
        } else {
          console.log("Connecting to room:", rid);
          connectToRoom(rid);
        }
      });
    }

    // Douyu Packet Encoding
    function WebSocket_Packet(str) {
      const bytesArr = encoder.encode(str);
      const packetLength = bytesArr.length + 9;
      const buffer = new Uint8Array(12 + bytesArr.length + 1);
      const view = new DataView(buffer.buffer);
      view.setUint32(0, packetLength, true);
      view.setUint32(4, packetLength, true);
      view.setUint32(8, 689, true); // Client MSG_TYPE
      buffer.set(bytesArr, 12);
      buffer[12 + bytesArr.length] = 0; // null terminator
      return buffer;
    }

    // Douyu value unescaping
    function decodeDouyuVal(str) {
      return str.replace(/@S/g, "/").replace(/@A/g, "@");
    }

    // Douyu key-value string parsing
    function parseDouyuMsg(str) {
      const obj = {};
      const parts = str.split("/");
      for (const part of parts) {
        if (!part) continue;
        const idx = part.indexOf("@=");
        if (idx === -1) continue;
        const key = part.substring(0, idx);
        const val = part.substring(idx + 2);
        obj[key] = decodeDouyuVal(val);
      }
      return obj;
    }

    // UI Log helpers
    function addSystemLog(text) {
      const el = document.createElement("div");
      el.className = "danmaku-item";
      el.innerHTML = \`<span class="dm-time">\${formatTime(new Date())}</span><span class="dm-content dm-system">\${text}</span>\`;
      chatLog.appendChild(el);
      scrollToBottom();
    }

    function formatTime(date) {
      return date.toTimeString().split(' ')[0];
    }

    function scrollToBottom(force = false) {
      if (autoScroll || force) {
        chatLog.scrollTop = chatLog.scrollHeight;
        autoScroll = true;
        scrollLockAlert.classList.remove("active");
      }
    }

    // Connection Control
    function updateStatus(state, msg) {
      statusDot.className = "status-dot " + state;
      statusText.textContent = msg;
    }

    function connectToRoom(rid) {
      activeRoom = rid;
      const port = Math.floor(Math.random() * 4) + 8502; // wss://danmuproxy.douyu.com:8502-8505
      const url = \`wss://danmuproxy.douyu.com:\${port}\`;
      
      updateStatus("connecting", "正在连接...");
      addSystemLog(\`正在建立连接至 \${url}...\`);

      try {
        socket = new WebSocket(url);
        socket.binaryType = "arraybuffer";

        socket.onopen = () => {
          updateStatus("connected", "已连接");
          roomInfo.textContent = \`房间号: \${rid}\`;
          addSystemLog("连接成功！发送握手及订阅包...");
          
          // Login and join group
          socket.send(WebSocket_Packet(\`type@=loginreq/roomid@=\${rid}/\`));
          socket.send(WebSocket_Packet(\`type@=joingroup/rid@=\${rid}/gid@=-9999/\`));

          // Set keepalive heartbeat (every 40 seconds)
          if (keepAliveTimer) clearInterval(keepAliveTimer);
          keepAliveTimer = setInterval(() => {
            if (socket && socket.readyState === WebSocket.OPEN) {
              socket.send(WebSocket_Packet("type@=mrkl/"));
            }
          }, 40000);

          connectBtn.innerHTML = \`
            <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M8,11H16V13H8V11Z"/>
            </svg>
            <span>断开连接</span>
          \`;
          connectBtn.classList.add("btn-disconnect");
        };

        socket.onmessage = (e) => {
          const view = new DataView(e.data);
          let offset = 0;
          while (offset < e.data.byteLength) {
            if (offset + 12 > e.data.byteLength) break;
            const packetLength = view.getUint32(offset, true);
            const totalLength = packetLength + 4;
            if (offset + totalLength > e.data.byteLength) break;

            if (packetLength >= 9) {
              const payloadBytes = new Uint8Array(e.data, offset + 12, packetLength - 9);
              const text = decoder.decode(payloadBytes);
              processRawMessage(text);
            }
            offset += totalLength;
          }
        };

        socket.onerror = (err) => {
          console.error("WebSocket Error:", err);
          addSystemLog("连接发生错误！");
        };

        socket.onclose = () => {
          updateStatus("disconnected", "连接断开");
          if (roomInfo) roomInfo.textContent = "";
          addSystemLog("连接已关闭。");
          cleanup();
        };

      } catch (err) {
        console.error(err);
        updateStatus("disconnected", "连接失败");
        addSystemLog(\`连接失败: \${err.message}\`);
        cleanup();
      }
    }

    function disconnect() {
      if (socket) {
        socket.onclose = null;
        socket.onerror = null;
        socket.onmessage = null;
        try {
          socket.close();
        } catch (e) {
          // ignore
        }
        socket = null;
      }
      updateStatus("disconnected", "连接断开");
      if (roomInfo) roomInfo.textContent = "";
      addSystemLog("连接已关闭。");
      cleanup();
    }

    function cleanup() {
      socket = null;
      if (keepAliveTimer) {
        clearInterval(keepAliveTimer);
        keepAliveTimer = null;
      }
      activeRoom = "";
      activeDanmakus.clear();
      activeGifts.clear();
      connectBtn.innerHTML = \`
        <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
        </svg>
        <span>连接并查看弹幕</span>
      \`;
      connectBtn.classList.remove("btn-disconnect");
    }

    // String repeat collapsing normalizer
    function getCollapseKey(str) {
      return str.trim().toLowerCase().replace(/\\s+/g, '').replace(/(.)\\1+/gu, '$1');
    }

    // Background opacity updater
    function updateOpacity() {
      const opacity = optOpacity.value / 100;
      if (opacity === 1) {
        document.body.style.background = 'var(--bg-gradient)';
        const blobs = document.querySelector('.bg-blobs');
        if (blobs) blobs.style.opacity = '1';
      } else {
        document.body.style.background = 'rgba(15, 23, 42, ' + opacity + ')';
        const blobs = document.querySelector('.bg-blobs');
        if (blobs) blobs.style.opacity = opacity.toString();
      }
      
      document.querySelectorAll('.sidebar, .column-panel').forEach(el => {
        el.style.background = 'rgba(30, 41, 59, ' + (opacity * 0.7) + ')';
      });
    }

    // TTS speaker with queue control
    function speakMessage(text) {
      if (!optTts.checked) {
        ttsQueue = [];
        return;
      }
      if (ttsQueue.length >= 5) {
        ttsQueue.shift();
      }
      ttsQueue.push(text);
      processTtsQueue();
    }

    function processTtsQueue() {
      if (ttsSpeaking || ttsQueue.length === 0) return;
      ttsSpeaking = true;
      const text = ttsQueue.shift();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        ttsSpeaking = false;
        processTtsQueue();
      };
      utterance.onerror = () => {
        ttsSpeaking = false;
        processTtsQueue();
      };
      window.speechSynthesis.speak(utterance);
    }

    // Gift configurations fetching
    async function fetchGiftConfig() {
      try {
        const res = await fetch('https://webconf.douyucdn.cn/resource/common/prop_gift_list/prop_gift_config.json');
        let text = await res.text();
        const startIdx = text.indexOf('(');
        const endIdx = text.lastIndexOf(')');
        if (startIdx !== -1 && endIdx !== -1) {
          text = text.substring(startIdx + 1, endIdx);
        }
        const obj = JSON.parse(text);
        if (obj && obj.data) {
          for (const [id, item] of Object.entries(obj.data)) {
            giftConfig[id] = {
              name: item.name,
              bimg: item.bimg || ""
            };
          }
        }
      } catch (err) {
        console.error('Failed to fetch gift config, using local fallback', err);
      }
    }

    function getGiftInfo(gfid) {
      const conf = giftConfig[gfid];
      if (conf) {
        return {
          name: conf.name,
          bimg: conf.bimg || ""
        };
      }
      return {
        name: giftFallback[gfid] || ('礼物(ID:' + gfid + ')'),
        bimg: ""
      };
    }



    // User click listener to query historical danmaku
    function addUserClickListener(element, uid) {
      if (!uid) return;
      element.title = "点击查看历史弹幕 (UID: " + uid + ")";
      element.addEventListener("click", (e) => {
        e.stopPropagation();
        window.open("https://www.doseeing.com/data/fan/" + uid + "?type=chat&dt=0", "_blank");
      });
    }

    // Dynamic heat levels & styles for merged danmakus
    function updateHeatLevel(element, countBadge, count) {
      if (!countBadge) return;
      // Reset classes
      countBadge.classList.remove("badge-tier-1", "badge-tier-2", "badge-tier-3");
      element.classList.remove("row-high-heat");
      
      const contentSpan = element.querySelector(".dm-content");
      if (contentSpan) {
        contentSpan.classList.remove("text-bold");
      }

      if (count >= 2 && count <= 5) {
        countBadge.classList.add("badge-tier-1");
      } else if (count >= 6 && count <= 20) {
        countBadge.classList.add("badge-tier-2");
        if (contentSpan) {
          contentSpan.classList.add("text-bold");
        }
      } else if (count > 20) {
        countBadge.classList.add("badge-tier-3");
        element.classList.add("row-high-heat");
        if (contentSpan) {
          contentSpan.classList.add("text-bold");
        }
      }
    }

    // Helper to create sub-item inside merged danmaku
    function createSubItem(detail) {
      const subEl = document.createElement('div');
      subEl.className = 'sub-item';
      
      const timeSpan = document.createElement('span');
      timeSpan.className = 'dm-time';
      timeSpan.textContent = detail.time;
      subEl.appendChild(timeSpan);
      
      if (detail.badge) {
        const badgeSpan = document.createElement('span');
        badgeSpan.className = 'dm-badge';
        badgeSpan.textContent = detail.badge;
        subEl.appendChild(badgeSpan);
      }
      
      if (detail.level) {
        const levelSpan = document.createElement('span');
        levelSpan.className = 'dm-level';
        levelSpan.textContent = 'L' + detail.level;
        subEl.appendChild(levelSpan);
      }
      
      const userSpan = document.createElement('span');
      userSpan.className = 'dm-username';
      userSpan.textContent = detail.nickname + '：';
      addUserClickListener(userSpan, detail.uid);
      subEl.appendChild(userSpan);
      
      const contentSpan = document.createElement('span');
      contentSpan.className = 'dm-content ' + (detail.colorClass || '');
      contentSpan.textContent = detail.text;
      subEl.appendChild(contentSpan);
      
      return subEl;
    }

    // Rendering functions for Gifts, Diamond Fans, and Entries
    function renderGift(msg) {
      const nickname = msg.nn || '未知';
      const gfid = msg.gfid || '';
      const countVal = parseInt(msg.hits || msg.gfcnt || '1');
      const giftInfo = getGiftInfo(gfid);
      const giftName = giftInfo.name;
      const now = Date.now();
      const timeWindow = parseInt(optWindow.value);

      // Check if merge is enabled and we have a recent duplicate gift for the same user
      const giftKey = nickname + '_' + gfid;
      if (optMerge.checked) {
        const existing = activeGifts.get(giftKey);
        if (existing && (now - existing.timestamp <= timeWindow * 1000)) {
          if (msg.hits) {
            const hitsVal = parseInt(msg.hits);
            if (hitsVal > existing.count) {
              existing.count = hitsVal;
            }
          } else {
            existing.count += parseInt(msg.gfcnt || '1');
          }
          existing.timestamp = now;
          existing.contentSpan.textContent = '送出了 ' + existing.count + ' 个 ' + giftName;
          if (giftInfo.bimg) {
            const giftImg = document.createElement('img');
            giftImg.src = giftInfo.bimg;
            giftImg.className = 'gift-icon';
            existing.contentSpan.appendChild(giftImg);
          }

          // Trigger bump animation
          existing.element.classList.remove("bump");
          void existing.element.offsetWidth;
          existing.element.classList.add("bump");
          
          if (optTts.checked) {
            speakMessage(nickname + '送出了' + existing.count + '个' + giftName);
          }
          return;
        }
      }

      const el = document.createElement('div');
      el.className = 'danmaku-item';
      el.dataset.key = giftKey; // store key for cleanup

      const timeSpan = document.createElement('span');
      timeSpan.className = 'dm-time';
      timeSpan.textContent = formatTime(new Date());
      el.appendChild(timeSpan);

      const userSpan = document.createElement('span');
      userSpan.className = 'dm-username';
      userSpan.textContent = nickname + ' ';
      addUserClickListener(userSpan, msg.uid);
      el.appendChild(userSpan);

      const contentSpan = document.createElement('span');
      contentSpan.className = 'dm-gift';
      contentSpan.textContent = '送出了 ' + countVal + ' 个 ' + giftName;
      if (giftInfo.bimg) {
        const giftImg = document.createElement('img');
        giftImg.src = giftInfo.bimg;
        giftImg.className = 'gift-icon';
        contentSpan.appendChild(giftImg);
      }
      el.appendChild(contentSpan);

      giftLog.appendChild(el);

      if (optMerge.checked) {
        activeGifts.set(giftKey, {
          element: el,
          contentSpan: contentSpan,
          count: countVal,
          timestamp: now
        });
      }

      // Cleanup oldest lines
      const maxLines = parseInt(optMaxLines.value);
      while (giftLog.childElementCount > maxLines) {
        const oldest = giftLog.firstElementChild;
        const oldestKey = oldest.dataset.key;
        if (oldestKey) {
          const mapped = activeGifts.get(oldestKey);
          if (mapped && mapped.element === oldest) {
            activeGifts.delete(oldestKey);
          }
        }
        oldest.remove();
      }

      giftLog.scrollTop = giftLog.scrollHeight;

      if (optTts.checked) {
        speakMessage(nickname + '送出了' + countVal + '个' + giftName);
      }
    }

    function renderDiamondFans(msg) {
      const nickname = msg.nn || msg.nick || msg.nk || '未知';
      const action = msg.type === 'dfobc' ? '开通钻粉' : '续费钻粉';
      
      const el = document.createElement('div');
      el.className = 'danmaku-item';
      
      const timeSpan = document.createElement('span');
      timeSpan.className = 'dm-time';
      timeSpan.textContent = formatTime(new Date());
      el.appendChild(timeSpan);
      
      const userSpan = document.createElement('span');
      userSpan.className = 'dm-username';
      userSpan.textContent = nickname + ' ';
      addUserClickListener(userSpan, msg.uid);
      el.appendChild(userSpan);
      
      const contentSpan = document.createElement('span');
      contentSpan.className = 'dm-gift';
      contentSpan.textContent = action;
      el.appendChild(contentSpan);
      
      giftLog.appendChild(el);
      
      // Cleanup oldest lines
      const maxLines = parseInt(optMaxLines.value);
      while (giftLog.childElementCount > maxLines) {
        giftLog.firstElementChild.remove();
      }
      
      giftLog.scrollTop = giftLog.scrollHeight;
      
      if (optTts.checked) {
        speakMessage('感谢' + nickname + action);
      }
    }

    function renderEntry(msg) {
      const nickname = msg.nn || '未知';
      const level = msg.level || '0';
      
      // User blacklist filter
      if (optBlockUsers && optBlockUsers.value.trim()) {
        const cleaned = optBlockUsers.value.replace(new RegExp(String.fromCharCode(10), 'g'), ',')
                                           .replace(new RegExp(String.fromCharCode(13), 'g'), ',')
                                           .replace(/，/g, ',');
        const userList = cleaned.split(',').map(u => u.trim()).filter(Boolean);
        const hasUser = userList.some(user => {
          return nickname.toLowerCase() === user.toLowerCase() || (msg.uid && msg.uid.toString() === user);
        });
        if (hasUser) return;
      }
      
      const el = document.createElement('div');
      el.className = 'danmaku-item';
      
      const timeSpan = document.createElement('span');
      timeSpan.className = 'dm-time';
      timeSpan.textContent = formatTime(new Date());
      el.appendChild(timeSpan);
      
      const levelSpan = document.createElement('span');
      levelSpan.className = 'dm-level';
      levelSpan.textContent = 'L' + level;
      el.appendChild(levelSpan);
      
      const welcomeSpan = document.createElement('span');
      welcomeSpan.className = 'dm-entry';
      welcomeSpan.textContent = ' 欢迎 ';
      el.appendChild(welcomeSpan);

      const userSpan = document.createElement('span');
      userSpan.className = 'dm-username';
      userSpan.textContent = nickname;
      addUserClickListener(userSpan, msg.uid);
      el.appendChild(userSpan);

      const contentSpan = document.createElement('span');
      contentSpan.className = 'dm-entry';
      contentSpan.textContent = ' 进入了直播间';
      el.appendChild(contentSpan);
      
      entryLog.appendChild(el);
      
      // Cleanup oldest lines
      const maxLines = parseInt(optMaxLines.value);
      while (entryLog.childElementCount > maxLines) {
        entryLog.firstElementChild.remove();
      }
      
      entryLog.scrollTop = entryLog.scrollHeight;
    }

    // Danmaku Parsing and Rendering
    function processRawMessage(payload) {
      if (!payload.startsWith("type@=")) return;
      const msg = parseDouyuMsg(payload);
      
      if (msg.type === "chatmsg") {
        if (optShowChat.checked) {
          renderDanmaku(msg);
        }
      } else if (msg.type === "dgb") {
        if (optShowGifts.checked) {
          renderGift(msg);
        }
      } else if (msg.type === "dfobc" || msg.type === "dfrbc") {
        if (optShowGifts.checked) {
          renderDiamondFans(msg);
        }
      } else if (msg.type === "uenter") {
        if (optShowEntry.checked) {
          renderEntry(msg);
        }
      }
    }

    function getDanmakuColorClass(col) {
      switch (col) {
        case "1": return "col-red";
        case "2": return "col-blue";
        case "3": return "col-green";
        case "4": return "col-orange";
        case "5": return "col-purple";
        case "6": return "col-pink";
        default: return "";
      }
    }

    function renderDanmaku(msg) {
      const nickname = msg.nn || "未知";
      const text = msg.txt || "";
      const colorClass = getDanmakuColorClass(msg.col);
      const isRobot = !msg.dms;

      // Filter robot danmaku
      if (optFilterRobot.checked && isRobot) {
        return;
      }

      // 1. 最低用户等级过滤
      if (optMinLevel) {
        const minLevel = parseInt(optMinLevel.value || "1");
        const userLevel = parseInt(msg.level || "0");
        if (userLevel < minLevel) {
          return;
        }
      }

      // 2. 屏蔽无粉丝牌弹幕
      if (optBlockNobadge && optBlockNobadge.checked && !msg.bnn) {
        return;
      }

      // 3. 关键字过滤
      if (optBlockKeywords) {
        const keywordsStr = optBlockKeywords.value.trim();
        if (keywordsStr) {
          const cleaned = keywordsStr.replace(new RegExp(String.fromCharCode(10), 'g'), ',')
                                     .replace(new RegExp(String.fromCharCode(13), 'g'), ',')
                                     .replace(/，/g, ',');
          const kwList = cleaned.split(',').map(k => k.trim()).filter(Boolean);
          const lowerText = text.toLowerCase();
          const hasKeyword = kwList.some(kw => lowerText.includes(kw.toLowerCase()));
          if (hasKeyword) {
            return;
          }
        }
      }

      // 4. 正则表达式过滤
      if (optBlockRegex) {
        const regexStr = optBlockRegex.value.trim();
        if (regexStr) {
          const regexLines = regexStr.split(String.fromCharCode(10)).map(r => r.trim()).filter(Boolean);
          for (const line of regexLines) {
            try {
              const rx = new RegExp(line);
              if (rx.test(text)) {
                return;
              }
            } catch (e) {
              // 忽略非法正则规则
            }
          }
        }
      }

      // 5. 屏蔽用户昵称/UID过滤
      if (optBlockUsers) {
        const usersStr = optBlockUsers.value.trim();
        if (usersStr) {
          const cleaned = usersStr.replace(new RegExp(String.fromCharCode(10), 'g'), ',')
                                  .replace(new RegExp(String.fromCharCode(13), 'g'), ',')
                                  .replace(/，/g, ',');
          const userList = cleaned.split(',').map(u => u.trim()).filter(Boolean);
          const hasUser = userList.some(user => {
            return nickname.toLowerCase() === user.toLowerCase() || (msg.uid && msg.uid.toString() === user);
          });
          if (hasUser) {
            return;
          }
        }
      }

      const now = Date.now();
      const timeWindow = parseInt(optWindow.value);
      const collapseKey = getCollapseKey(text);

      const currentDetail = {
        time: formatTime(new Date()),
        nickname: nickname,
        badge: msg.bnn ? (msg.bnn + " " + msg.bl) : null,
        level: msg.level || null,
        text: text,
        colorClass: colorClass,
        uid: msg.uid || null
      };

      if (optMerge.checked) {
        const existing = activeDanmakus.get(collapseKey);
        
        if (existing && (now - existing.timestamp <= timeWindow * 1000)) {
          existing.count++;
          existing.timestamp = now;
          existing.details.push(currentDetail);
          if (existing.details.length > 100) {
            existing.details.shift();
          }

          let element = existing.element;
          if (element) {
            if (existing.count === 2) {
              // First Merge Conversion: transform the original element into a merged element in place
              element.classList.add("has-merged");
              element.dataset.mergeCount = 2;

              const multiplierSpan = document.createElement("span");
              multiplierSpan.className = "multiplier-badge pop-active";
              multiplierSpan.textContent = "X2";
              element.appendChild(multiplierSpan);
              existing.countBadge = multiplierSpan;

              const sublist = document.createElement("div");
              sublist.className = "danmaku-sublist";
              element.appendChild(sublist);

              element.addEventListener("click", (e) => {
                if (e.target.closest('.danmaku-sublist')) {
                  return;
                }
                const isActive = sublist.classList.toggle("active");
                if (isActive) {
                  // Dynamically render details to avoid heavy DOM tree
                  sublist.innerHTML = "";
                  existing.details.forEach(det => {
                    sublist.appendChild(createSubItem(det));
                  });
                } else {
                  // Collapse and free DOM nodes
                  sublist.innerHTML = "";
                }
              });

              updateHeatLevel(element, multiplierSpan, 2);
            } else {
              // Subsequent Merges: count > 2, update in place
              element.dataset.mergeCount = existing.count;
              if (existing.countBadge) {
                existing.countBadge.textContent = "X" + existing.count;
                updateHeatLevel(element, existing.countBadge, existing.count);
                
                // Trigger pop animation
                existing.countBadge.classList.remove("pop-active");
                void existing.countBadge.offsetWidth;
                existing.countBadge.classList.add("pop-active");
              }

              const sublist = element.querySelector(".danmaku-sublist");
              if (sublist && sublist.classList.contains("active")) {
                sublist.appendChild(createSubItem(currentDetail));
              }
            }

            // Position Control & Scroll Lock Check
            if (autoScroll) {
              if (existing.count >= 10) {
                existing.pinned = true;
                existing.pinTimestamp = now;
                if (!pinnedContainer.contains(element)) {
                  element.remove();
                  pinnedContainer.appendChild(element);

                  // Safety cap: keep at most 3 pinned combos to prevent taking over the screen
                  while (pinnedContainer.childElementCount > 3) {
                    const oldestPinned = pinnedContainer.firstElementChild;
                    const oldestKey = oldestPinned.dataset.key;
                    if (oldestKey) {
                      const mapped = activeDanmakus.get(oldestKey);
                      if (mapped) {
                        mapped.pinned = false;
                      }
                    }
                    oldestPinned.remove();
                    chatLog.appendChild(oldestPinned);
                  }
                } else {
                  // Already pinned: move to bottom of pinned container
                  pinnedContainer.appendChild(element);
                }
              } else {
                // Bring to Bottom: always sink to the bottom of main log if autoScroll is enabled
                if (!chatLog.contains(element) || element !== chatLog.lastElementChild) {
                  element.remove();
                  chatLog.appendChild(element);
                }
              }

              // Trigger merge flash animation
              element.classList.remove("merge-flash-active");
              void element.offsetWidth; // trigger reflow
              element.classList.add("merge-flash-active");

              // Scroll to bottom
              chatLog.scrollTop = chatLog.scrollHeight;
            } else {
              // Silent update when autoScroll is false: do not move element, do not flash, show scroll lock
              scrollLockAlert.classList.add("active");
            }
          }

          // Cleanup oldest lines
          const maxLines = parseInt(optMaxLines.value);
          while (chatLog.childElementCount > maxLines) {
            const oldest = chatLog.firstElementChild;
            const oldestKey = oldest.dataset.key;
            if (oldestKey) {
              const mapped = activeDanmakus.get(oldestKey);
              if (mapped && mapped.element === oldest) {
                activeDanmakus.delete(oldestKey);
              }
            }
            oldest.remove();
          }

          // TTS
          if (optTts.checked) {
            speakMessage(text);
          }
          return;
        }
      }

      // Default (Count = 1) or Merging is disabled
      const elRaw = document.createElement("div");
      elRaw.className = "danmaku-item";
      elRaw.dataset.key = collapseKey;

      const timeSpan = document.createElement("span");
      timeSpan.className = "dm-time";
      timeSpan.textContent = formatTime(new Date());
      elRaw.appendChild(timeSpan);

      if (msg.bnn) {
        const badgeSpan = document.createElement("span");
        badgeSpan.className = "dm-badge";
        badgeSpan.textContent = msg.bnn + " " + msg.bl;
        elRaw.appendChild(badgeSpan);
      }

      if (msg.level) {
        const levelSpan = document.createElement("span");
        levelSpan.className = "dm-level";
        levelSpan.textContent = "L" + msg.level;
        elRaw.appendChild(levelSpan);
      }

      const userSpan = document.createElement("span");
      userSpan.className = "dm-username";
      userSpan.textContent = nickname + "：";
      addUserClickListener(userSpan, msg.uid);
      elRaw.appendChild(userSpan);

      const contentSpan = document.createElement("span");
      contentSpan.className = "dm-content " + colorClass;
      contentSpan.textContent = text;
      elRaw.appendChild(contentSpan);

      chatLog.appendChild(elRaw);

      // Cleanup oldest lines in chatLog
      const maxLines = parseInt(optMaxLines.value);
      while (chatLog.childElementCount > maxLines) {
        const oldest = chatLog.firstElementChild;
        const oldestKey = oldest.dataset.key;
        if (oldestKey) {
          const mapped = activeDanmakus.get(oldestKey);
          if (mapped && mapped.element === oldest) {
            activeDanmakus.delete(oldestKey);
          }
        }
        oldest.remove();
      }

      // Scrolling
      if (autoScroll) {
        chatLog.scrollTop = chatLog.scrollHeight;
      } else {
        scrollLockAlert.classList.add("active");
      }

      if (optMerge.checked) {
        activeDanmakus.set(collapseKey, {
          element: elRaw,
          countBadge: null,
          count: 1,
          timestamp: now,
          details: [currentDetail]
        });
      }

      // TTS
      if (optTts.checked) {
        speakMessage(text);
      }
    }

    // Periodically clean up expired danmaku references in map to settle combos and avoid memory leaks
    setInterval(() => {
      const now = Date.now();
      const timeWindow = parseInt(optWindow.value);
      for (const [key, item] of activeDanmakus.entries()) {
        if (now - item.timestamp > timeWindow * 1000) {
          if (item.pinned) {
            if (item.element) {
              item.element.remove();
            }
          }
          activeDanmakus.delete(key);
        }
      }
    }, 1000);
  </script>
</body>
</html>
`;
