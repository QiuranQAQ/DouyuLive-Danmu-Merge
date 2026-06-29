export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/room-info")) {
      const room = url.searchParams.get("room");
      if (!room || !/^\d+$/.test(room)) {
        return new Response(JSON.stringify({ error: 1, msg: "Invalid room" }), {
          headers: {
            "content-type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
      try {
        const targetUrl = `http://open.douyucdn.cn/api/RoomApi/room/${room}`;
        const res = await fetch(targetUrl);
        const data = await res.json();
        return new Response(JSON.stringify(data), {
          headers: {
            "content-type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: 2, msg: e.message }), {
          headers: {
            "content-type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
    }

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
      background: linear-gradient(to right, #818cf8, #6366f1);
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
      align-items: center;
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
      color: #ffb938ff;
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

    /* Merged Danmaku Styling */
    .danmaku-item.has-merged {
      cursor: pointer;
      position: relative;
      transition: background-color 0.3s ease, border-left-color 0.3s ease, transform 0.2s ease;
    }

    .danmaku-item.has-merged:hover {
      background-color: rgba(255, 255, 255, 0.05);
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
      box-shadow: 0 0 4px rgba(99, 102, 241, 0.2);
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

    .gift-highlight {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%) !important;
      border-left: 3px solid #f59e0b !important;
      box-shadow: 0 0 8px rgba(245, 158, 11, 0.2);
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

    /* Light Theme Styling Override */
    body.theme-light {
      --bg-gradient: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      --panel-bg: rgba(255, 255, 255, 0.75);
      --panel-border: rgba(15, 23, 42, 0.08);
      --text-main: #0f172a;
      --text-muted: #64748b;
      --accent: #4f46e5;
      --accent-hover: #4338ca;
    }

    body.theme-light .bg-blob.blob-1 {
      background: #c7d2fe;
    }

    body.theme-light .bg-blob.blob-2 {
      background: #c5f2f7;
    }

    body.theme-light .input-field {
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(15, 23, 42, 0.12);
      color: #0f172a;
    }

    body.theme-light .input-field:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.15);
    }

    body.theme-light .dm-username {
      color: #00a2ffff;       
    }

    body.theme-light .dm-username:hover {
      color: #0f172a;
    }

    body.theme-light .dm-content {
      color: #1e293b;
    }

    body.theme-light .chat-header {
      background: rgba(15, 23, 42, 0.03);
    }

    body.theme-light .badge-tier-1 {
      background: rgba(100, 116, 139, 0.1) !important;
      color: #475569 !important;
    }

    body.theme-light .badge-tier-2 {
      background: rgba(79, 70, 229, 0.1) !important;
      color: #4f46e5 !important;
    }

    body.theme-light .row-high-heat {
      background-color: rgba(239, 68, 68, 0.05) !important;
    }

    body.theme-light .gift-highlight {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(239, 68, 68, 0.08) 100%) !important;
    }

    body.theme-light .chat-log::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.02);
    }

    body.theme-light .chat-log::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.5);
    }

    body.theme-light .chat-log::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.25);
    }

    /* Header Dropdowns */
    .header-dropdown {
      position: absolute;
      top: 60px;
      right: 20px;
      width: 290px;
      background: var(--panel-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--panel-border);
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      z-index: 100;
      display: flex;
      flex-direction: column;
      animation: dropdownFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      max-height: calc(100% - 80px);
      overflow: hidden;
    }
    
    @keyframes dropdownFadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .dropdown-header {
      padding: 12px 16px;
      border-bottom: 1px solid var(--panel-border);
      font-size: 13px;
      font-weight: 600;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .dropdown-body {
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* Header Buttons */
    .header-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      border-radius: 8px;
      transition: all 0.2s ease;
    }
    .header-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--text-main);
    }
    body.theme-light .header-btn:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    /* Foreground Combo Details Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }

    .modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }

    .modal-content {
      background: var(--panel-bg);
      backdrop-filter: blur(24px);
      border: 1px solid var(--panel-border);
      border-radius: 20px;
      width: 800px;
      max-width: 90%;
      max-height: 70vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
      transform: translateY(20px);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-overlay.active .modal-content {
      transform: translateY(0);
    }

    .modal-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--panel-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--accent);
      font-family: var(--font-outfit);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 85%;
    }

    .modal-close-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 24px;
      cursor: pointer;
      line-height: 1;
      transition: color 0.2s;
    }

    .modal-close-btn:hover {
      color: var(--text-main);
    }

    .modal-body {
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
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
        <div class="brand-title">斗鱼弹幕助手1.0 by超限</div>
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

      <!-- Theme Switch Option -->
      <div class="form-group">
        <label class="form-label">系统设置</label>
        <div class="option-item">
          <div class="option-info">
            <span class="option-title">白天模式</span>
            <span class="option-desc">切换浅色/深色主题</span>
          </div>
          <label class="switch">
            <input type="checkbox" id="opt-theme-light">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Quick Actions -->
      <div style="display: flex; gap: 10px; margin-top: auto;">
        <button id="clear-btn" class="btn" style="background: rgba(255,255,255,0.06); color: var(--text-muted); border: 1px solid rgba(255,255,255,0.08); padding: 10px 0; flex: 1;">
          清空屏幕
        </button>
      </div>
    </div>

    <!-- Chat Column (flex: 2.5) -->
    <div class="chat-section column-panel">
      <div class="chat-header" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="panel-column-title">弹幕消息</span>
          <button id="danmu-settings-btn" class="header-btn" title="弹幕设置">
            <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.47,5.34 14.86,5.08L14.47,2.42C14.43,2.18 14.22,2 13.97,2H9.97C9.72,2 9.51,2.18 9.47,2.42L9.08,5.08C8.47,5.34 7.9,5.66 7.38,6.05L4.89,5.05C4.67,4.96 4.4,5.05 4.28,5.27L2.28,8.73C2.16,8.95 2.21,9.22 2.4,9.37L4.51,11C4.47,11.34 4.45,11.67 4.45,12C4.45,12.33 4.47,12.65 4.51,12.97L2.4,14.63C2.21,14.78 2.16,15.05 2.28,15.27L4.28,18.73C4.4,18.95 4.67,19.04 4.89,18.95L7.38,17.95C7.9,18.34 8.47,18.66 9.08,18.92L9.47,21.58C9.51,21.82 9.72,22 9.97,22H13.97C14.22,22 14.43,21.82 14.47,21.58L14.86,18.92C15.47,18.66 16.04,18.34 16.56,17.95L19.05,18.95C19.27,19.04 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>
          </button>
          <button id="danmu-filter-btn" class="header-btn" title="过滤设置">
            <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24"><path d="M14.76,20.83L17.6,18L14.76,15.17L16.17,13.76L19,16.59L21.83,13.76L23.24,15.17L20.41,18L23.24,20.83L21.83,22.24L19,19.41L16.17,22.24L14.76,20.83M12,12C12,13.25 11.5,14.39 10.69,15.24L10.66,15.26L10.64,15.28C9.53,16.5 8.16,17.63 6.64,18.57C6.26,18.8 5.79,18.69 5.56,18.31C5.33,17.93 5.44,17.46 5.82,17.23C7.16,16.4 8.37,15.4 9.35,14.32C8.5,13.67 8,12.89 8,12C8,10.25 9.75,9 12,9C12.57,9 13.11,9.08 13.6,9.25C13.06,9.9 12.63,10.65 12.35,11.47C12.13,11.64 12,11.81 12,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22C12.39,22 12.78,21.96 13.16,21.89C13.06,21.28 13.06,20.66 13.16,20.05C12.78,20.08 12.39,20.1 12,20.1A8.1,8.1 0 0,1 4,12C4,7.53 7.58,3.9 12,3.9C16.42,3.9 20,7.53 20,12C20,12.39 19.97,12.78 19.9,13.16C20.5,13.06 21.13,13.06 21.74,13.16C21.9,12.78 22,12.39 22,12A10,10 0 0,0 12,2Z"/></svg>
          </button>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div class="status-container">
            <div id="status-dot" class="status-dot"></div>
            <span id="status-text" class="status-text">未连接</span>
          </div>
          <span id="noble-count" class="noble-count" style="display: none; text-align: center; font-size: 13px; font-weight: 600; color: #CCB88F; background: rgba(204, 184, 143, 0.1); border-radius: 4px; padding: 2px 6px; font-family: var(--font-outfit);"></span>
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

      <!-- Danmaku Settings Dropdown Overlay -->
      <div id="danmu-settings-dropdown" class="header-dropdown" style="display: none;">
        <div class="dropdown-header">
          <span>弹幕设置</span>
        </div>
        <div class="dropdown-body">
          <div class="option-item">
            <div class="option-info">
              <span class="option-title">显示普通弹幕</span>
            </div>
            <label class="switch">
              <input type="checkbox" id="opt-show-chat" checked>
              <span class="slider"></span>
            </label>
          </div>
          <div class="option-item">
            <div class="option-info">
              <span class="option-title">合并重复弹幕</span>
            </div>
            <label class="switch">
              <input type="checkbox" id="opt-merge" checked>
              <span class="slider"></span>
            </label>
          </div>
          <div class="form-group">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="option-title" style="font-size: 13px;">合并时间窗口</span>
              <span id="merge-window-val" class="range-value">10秒</span>
            </div>
            <div class="range-group">
              <input type="range" id="opt-window" class="range-input" min="1" max="60" value="10">
            </div>
          </div>
          <div class="option-item">
            <div class="option-info">
              <span class="option-title">过滤机器人弹幕</span>
            </div>
            <label class="switch">
              <input type="checkbox" id="opt-filter-robot" checked>
              <span class="slider"></span>
            </label>
          </div>
          <div class="option-item">
            <div class="option-info">
              <span class="option-title">语音朗读 (TTS)</span>
            </div>
            <label class="switch">
              <input type="checkbox" id="opt-tts">
              <span class="slider"></span>
            </label>
          </div>
          <div class="form-group">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="option-title" style="font-size: 13px;">弹幕字号</span>
              <span id="font-size-val" class="range-value">18px</span>
            </div>
            <div class="range-group">
              <input type="range" id="opt-font-size" class="range-input" min="12" max="30" value="18">
            </div>
          </div>
          <div class="form-group">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="option-title" style="font-size: 13px;">最大保留行数</span>
              <span id="max-lines-val" class="range-value">100行</span>
            </div>
            <div class="range-group">
              <input type="range" id="opt-max-lines" class="range-input" min="50" max="1000" step="50" value="100">
            </div>
          </div>
          <div class="form-group">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="option-title" style="font-size: 13px;">弹幕置底连击阈值 (X)</span>
              <input type="number" id="opt-pin-threshold" class="input-field" style="width: 70px; padding: 4px 8px; font-size: 12px; height: auto;" min="2" value="10">
            </div>
          </div>
          <div class="form-group">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="option-title" style="font-size: 13px;">置底连击最大显示数</span>
              <input type="number" id="opt-pin-max-count" class="input-field" style="width: 70px; padding: 4px 8px; font-size: 12px; height: auto;" min="1" max="20" value="3">
            </div>
          </div>
          <div class="form-group">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="option-title" style="font-size: 13px;">最低显示用户等级</span>
              <span id="min-level-val" class="range-value">1级</span>
            </div>
            <div class="range-group">
              <input type="range" id="opt-min-level" class="range-input" min="1" max="120" value="1">
            </div>
          </div>
          <div class="option-item">
            <div class="option-info">
              <span class="option-title">屏蔽无粉丝牌发言</span>
            </div>
            <label class="switch">
              <input type="checkbox" id="opt-block-nobadge">
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Danmaku Filter Dropdown Overlay -->
      <div id="danmu-filter-dropdown" class="header-dropdown" style="display: none;">
        <div class="dropdown-header">
          <span>弹幕过滤</span>
        </div>
        <div class="dropdown-body">
          <div class="form-group">
            <span class="option-title" style="font-size: 13px;">屏蔽关键字 (逗号/换行分隔)</span>
            <textarea id="opt-block-keywords" class="input-field" rows="3" style="resize: vertical; font-size: 12px; padding: 8px; font-family: var(--font-inter); margin-top: 4px;" placeholder="例如: 剧透, 广告, 刷屏"></textarea>
          </div>
          <div class="form-group">
            <span class="option-title" style="font-size: 13px;">屏蔽用户昵称/UID (逗号/换行分隔)</span>
            <textarea id="opt-block-users" class="input-field" rows="3" style="resize: vertical; font-size: 12px; padding: 8px; font-family: var(--font-inter); margin-top: 4px;" placeholder="例如: 黑粉昵称, 1234567"></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column (flex: 1.2) -->
    <div class="right-section">
      <!-- Gift Column -->
      <div class="gift-section column-panel">
        <div class="chat-header" style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="panel-column-title">礼物动态</span>
            <button id="gift-filter-btn" class="header-btn" title="过滤礼物">
              <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24"><path d="M14.76,20.83L17.6,18L14.76,15.17L16.17,13.76L19,16.59L21.83,13.76L23.24,15.17L20.41,18L23.24,20.83L21.83,22.24L19,19.41L16.17,22.24L14.76,20.83M12,12C12,13.25 11.5,14.39 10.69,15.24L10.66,15.26L10.64,15.28C9.53,16.5 8.16,17.63 6.64,18.57C6.26,18.8 5.79,18.69 5.56,18.31C5.33,17.93 5.44,17.46 5.82,17.23C7.16,16.4 8.37,15.4 9.35,14.32C8.5,13.67 8,12.89 8,12C8,10.25 9.75,9 12,9C12.57,9 13.11,9.08 13.6,9.25C13.06,9.9 12.63,10.65 12.35,11.47C12.13,11.64 12,11.81 12,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22C12.39,22 12.78,21.96 13.16,21.89C13.06,21.28 13.06,20.66 13.16,20.05C12.78,20.08 12.39,20.1 12,20.1A8.1,8.1 0 0,1 4,12C4,7.53 7.58,3.9 12,3.9C16.42,3.9 20,7.53 20,12C20,12.39 19.97,12.78 19.9,13.16C20.5,13.06 21.13,13.06 21.74,13.16C21.9,12.78 22,12.39 22,12A10,10 0 0,0 12,2Z"/></svg>
            </button>
          </div>
          <label class="switch" style="transform: scale(0.8); margin-right: -4px;">
            <input type="checkbox" id="opt-show-gifts" checked>
            <span class="slider"></span>
          </label>
        </div>
        <div class="chat-log" id="gift-log">
          <div class="danmaku-item">
            <span class="dm-time">系统</span>
            <span class="dm-content dm-system">等待礼物接收...</span>
          </div>
        </div>
        <div class="scroll-lock-alert" id="gift-scroll-lock-alert">
          <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24">
            <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
          </svg>
          <span>有新礼物 (点击滚动到底部)</span>
        </div>

        <!-- Gift Filter Dropdown Overlay -->
        <div id="gift-filter-dropdown" class="header-dropdown" style="display: none;">
          <div class="dropdown-header">
            <span>礼物过滤</span>
          </div>
          <div class="dropdown-body">
            <div class="form-group">
              <span class="option-title" style="font-size: 13px;">屏蔽礼物名称 (逗号/换行分隔)</span>
              <textarea id="opt-block-gifts" class="input-field" rows="3" style="resize: vertical; font-size: 12px; padding: 8px; font-family: var(--font-inter); margin-top: 4px;" placeholder="例如: 赞, 弱鸡, 辣眼睛"></textarea>
            </div>
            <div class="form-group">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="option-title" style="font-size: 13px;">高亮礼物价值阈值 (元)</span>
                <input type="number" id="opt-gift-highlight" class="input-field" style="width: 70px; padding: 4px 8px; font-size: 12px; height: auto;" min="0" value="10">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Entry Column -->
      <div class="entry-section column-panel">
        <div class="chat-header" style="display: flex; align-items: center; justify-content: space-between;">
          <span class="panel-column-title">观众入场</span>
          <label class="switch" style="transform: scale(0.8); margin-right: -4px;">
            <input type="checkbox" id="opt-show-entry" checked>
            <span class="slider"></span>
          </label>
        </div>
        <div class="chat-log" id="entry-log">
          <div class="danmaku-item">
            <span class="dm-time">系统</span>
            <span class="dm-content dm-system">等待入场消息...</span>
          </div>
        </div>
        <div class="scroll-lock-alert" id="entry-scroll-lock-alert">
          <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24">
            <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
          </svg>
          <span>有新入场 (点击滚动到底部)</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Foreground Combo Details Modal -->
  <div id="combo-modal" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <span class="modal-title">连击详情</span>
        <button id="close-combo-modal" class="modal-close-btn">&times;</button>
      </div>
      <div class="modal-body" id="combo-modal-body"></div>
    </div>
  </div>

  <script>
    console.log("Douyu Danmaku Assistant Script Booting...");
    // Config & Globals
    let socket = null;
    let keepAliveTimer = null;
    let activeRoom = "";
    let autoScroll = true;
    let giftAutoScroll = true;
    let entryAutoScroll = true;
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
    const onlineCount = document.getElementById("online-count");
    const roomInfo = document.getElementById("room-info");
    const clearBtn = document.getElementById("clear-btn");
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
    const optFontSize = document.getElementById("opt-font-size");
    const fontSizeVal = document.getElementById("font-size-val");
    const optMaxLines = document.getElementById("opt-max-lines");
    const maxLinesVal = document.getElementById("max-lines-val");
    const optThemeLight = document.getElementById("opt-theme-light");
    const optPinMaxCount = document.getElementById("opt-pin-max-count");

    // New Filter selectors
    const optBlockKeywords = document.getElementById("opt-block-keywords");
    const optBlockGifts = document.getElementById("opt-block-gifts");
    const optBlockUsers = document.getElementById("opt-block-users");
    const optMinLevel = document.getElementById("opt-min-level");
    const minLevelVal = document.getElementById("min-level-val");
    const optBlockNobadge = document.getElementById("opt-block-nobadge");

    // Custom thresholds
    const optGiftHighlight = document.getElementById("opt-gift-highlight");
    const optPinThreshold = document.getElementById("opt-pin-threshold");

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
    if (optThemeLight) {
      optThemeLight.addEventListener("change", () => {
        updateTheme();
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

    // Gift scroll auto-scroll handler & scroll lock
    let lastGiftScrollTop = giftLog ? giftLog.scrollTop : 0;
    if (giftLog) {
      giftLog.addEventListener("scroll", () => {
        const currentScrollTop = giftLog.scrollTop;
        const threshold = 50;
        const isAtBottom = giftLog.scrollHeight - currentScrollTop - giftLog.clientHeight <= threshold;
        if (isAtBottom) {
          giftAutoScroll = true;
          const alertEl = document.getElementById("gift-scroll-lock-alert");
          if (alertEl) alertEl.classList.remove("active");
        } else {
          if (currentScrollTop < lastGiftScrollTop) {
            giftAutoScroll = false;
          }
        }
        lastGiftScrollTop = currentScrollTop;
      });
    }
    const giftScrollLockAlert = document.getElementById("gift-scroll-lock-alert");
    if (giftScrollLockAlert) {
      giftScrollLockAlert.addEventListener("click", () => {
        if (giftLog) giftLog.scrollTop = giftLog.scrollHeight;
        giftAutoScroll = true;
        giftScrollLockAlert.classList.remove("active");
      });
    }

    // Entry scroll auto-scroll handler & scroll lock
    let lastEntryScrollTop = entryLog ? entryLog.scrollTop : 0;
    if (entryLog) {
      entryLog.addEventListener("scroll", () => {
        const currentScrollTop = entryLog.scrollTop;
        const threshold = 50;
        const isAtBottom = entryLog.scrollHeight - currentScrollTop - entryLog.clientHeight <= threshold;
        if (isAtBottom) {
          entryAutoScroll = true;
          const alertEl = document.getElementById("entry-scroll-lock-alert");
          if (alertEl) alertEl.classList.remove("active");
        } else {
          if (currentScrollTop < lastEntryScrollTop) {
            entryAutoScroll = false;
          }
        }
        lastEntryScrollTop = currentScrollTop;
      });
    }
    const entryScrollLockAlert = document.getElementById("entry-scroll-lock-alert");
    if (entryScrollLockAlert) {
      entryScrollLockAlert.addEventListener("click", () => {
        if (entryLog) entryLog.scrollTop = entryLog.scrollHeight;
        entryAutoScroll = true;
        entryScrollLockAlert.classList.remove("active");
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
        fontSize: optFontSize ? optFontSize.value : "18",
        maxLines: optMaxLines ? optMaxLines.value : "100",
        blockKeywords: optBlockKeywords ? optBlockKeywords.value : "",
        blockGifts: optBlockGifts ? optBlockGifts.value : "",
        blockUsers: optBlockUsers ? optBlockUsers.value : "",
        minLevel: optMinLevel ? optMinLevel.value : "1",
        blockNobadge: optBlockNobadge ? optBlockNobadge.checked : false,
        giftHighlight: optGiftHighlight ? optGiftHighlight.value : "10",
        pinThreshold: optPinThreshold ? optPinThreshold.value : "10",
        pinMaxCount: optPinMaxCount ? optPinMaxCount.value : "3",
        themeLight: optThemeLight ? optThemeLight.checked : false
      };
      localStorage.setItem("DouyuAssistant_Settings", JSON.stringify(settings));
    }

    function loadSettings() {
      const saved = localStorage.getItem("DouyuAssistant_Settings");
      if (!saved) {
        // Explicitly load new defaults if no settings exist yet
        if (optFontSize) {
          optFontSize.value = "18";
          if (fontSizeVal) fontSizeVal.textContent = "18px";
        }
        if (optMaxLines) {
          optMaxLines.value = "100";
          if (maxLinesVal) maxLinesVal.textContent = "100行";
        }
        if (optPinMaxCount) {
          optPinMaxCount.value = "3";
        }
        return;
      }
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
        if (settings.fontSize !== undefined && optFontSize) {
          optFontSize.value = settings.fontSize;
          if (fontSizeVal) fontSizeVal.textContent = settings.fontSize + "px";
        }
        if (settings.maxLines !== undefined && optMaxLines) {
          optMaxLines.value = settings.maxLines;
          if (maxLinesVal) maxLinesVal.textContent = settings.maxLines + "行";
        }
        if (settings.blockKeywords !== undefined && optBlockKeywords) optBlockKeywords.value = settings.blockKeywords;
        if (settings.blockGifts !== undefined && optBlockGifts) optBlockGifts.value = settings.blockGifts;
        if (settings.blockUsers !== undefined && optBlockUsers) optBlockUsers.value = settings.blockUsers;
        if (settings.minLevel !== undefined && optMinLevel) {
          optMinLevel.value = settings.minLevel;
          if (minLevelVal) minLevelVal.textContent = settings.minLevel + "级";
        }
        if (settings.blockNobadge !== undefined && optBlockNobadge) optBlockNobadge.checked = settings.blockNobadge;
        if (settings.giftHighlight !== undefined && optGiftHighlight) optGiftHighlight.value = settings.giftHighlight;
        if (settings.pinThreshold !== undefined && optPinThreshold) optPinThreshold.value = settings.pinThreshold;
        if (settings.pinMaxCount !== undefined && optPinMaxCount) optPinMaxCount.value = settings.pinMaxCount;
        if (settings.themeLight !== undefined && optThemeLight) optThemeLight.checked = settings.themeLight;
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }

    if (optMinLevel) {
      optMinLevel.addEventListener("input", () => {
        if (minLevelVal) minLevelVal.textContent = optMinLevel.value + "级";
      });
    }

    function updateTheme() {
      if (optThemeLight && optThemeLight.checked) {
        document.body.classList.add("theme-light");
      } else {
        document.body.classList.remove("theme-light");
      }
    }

    // Auto-save listeners for all inputs
    const allInputsToSave = [
      optShowChat, optShowGifts, optShowEntry, optMerge, optWindow,
      optFilterRobot, optTts, optFontSize, optMaxLines,
      optBlockKeywords, optBlockGifts, optBlockUsers, optMinLevel, optBlockNobadge,
      optGiftHighlight, optPinThreshold, optPinMaxCount, optThemeLight
    ];
    allInputsToSave.forEach(input => {
      if (input) {
        input.addEventListener("change", saveSettings);
        if (input.type === "range" || input.tagName === "TEXTAREA" || input.type === "number") {
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
      updateTheme();
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

    let roomInfoTimer = null;

    async function updateRoomInfo(rid) {
      if (!rid || rid !== activeRoom) return;
      try {
        const res = await fetch(\`/api/room-info?room=\${rid}\`);
        const data = await res.json();
        if (data && data.error === 0 && data.data) {
          const online = data.data.online || data.data.hn || 0;
          if (onlineCount) {
            onlineCount.textContent = online;
            onlineCount.style.display = "inline-block";
          }
          if (data.data.gift) {
            data.data.gift.forEach(g => {
              giftConfig[g.id] = {
                name: g.name,
                bimg: g.himg || g.mimg || "",
                price: g.pc ? parseFloat(g.pc) : 0
              };
            });
          }
        }
      } catch (e) {
        console.error("Failed to update room info:", e);
      }
    }

    function connectToRoom(rid) {
      activeRoom = rid;
      const port = Math.floor(Math.random() * 4) + 8502; // wss://danmuproxy.douyu.com:8502-8505
      const url = \`wss://danmuproxy.douyu.com:\${port}\`;
      
      updateStatus("connecting", "正在连接...");
      addSystemLog(\`正在建立连接至 \${url}...\`);

      if (roomInfoTimer) clearInterval(roomInfoTimer);
      updateRoomInfo(rid);
      roomInfoTimer = setInterval(() => {
        updateRoomInfo(rid);
      }, 30000);

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
          if (roomInfoTimer) {
            clearInterval(roomInfoTimer);
            roomInfoTimer = null;
          }
          if (onlineCount) {
            onlineCount.style.display = "none";
            onlineCount.textContent = "";
          }
          updateStatus("disconnected", "连接断开");
          if (roomInfo) roomInfo.textContent = "";
          addSystemLog("连接已关闭。");
          cleanup();
        };

      } catch (err) {
        console.error(err);
        if (roomInfoTimer) {
          clearInterval(roomInfoTimer);
          roomInfoTimer = null;
        }
        if (onlineCount) {
          onlineCount.style.display = "none";
          onlineCount.textContent = "";
        }
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
      if (roomInfoTimer) {
        clearInterval(roomInfoTimer);
        roomInfoTimer = null;
      }
      if (onlineCount) {
        onlineCount.style.display = "none";
        onlineCount.textContent = "";
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
      if (roomInfoTimer) {
        clearInterval(roomInfoTimer);
        roomInfoTimer = null;
      }
      if (onlineCount) {
        onlineCount.style.display = "none";
        onlineCount.textContent = "";
      }
      activeRoom = "";
      activeDanmakus.clear();
      activeGifts.clear();
      if (connectBtn) {
        connectBtn.innerHTML = \`
          <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
          </svg>
          <span>连接并查看弹幕</span>
        \`;
        connectBtn.classList.remove("btn-disconnect");
      }
    }

    // String repeat collapsing normalizer
    function getCollapseKey(str) {
      return str.trim().toLowerCase().replace(/\\s+/g, '').replace(/(.)\\1+/gu, '$1');
    }

    // Toggle dropdowns and modal helper functions
    function setupDropdownToggle(btnId, dropdownId) {
      const btn = document.getElementById(btnId);
      const dropdown = document.getElementById(dropdownId);
      if (!btn || !dropdown) return;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        // Close other dropdowns
        document.querySelectorAll(".header-dropdown").forEach(d => {
          if (d !== dropdown) d.style.display = "none";
        });
        const isShown = dropdown.style.display === "block";
        dropdown.style.display = isShown ? "none" : "block";
      });
    }

    setupDropdownToggle("danmu-settings-btn", "danmu-settings-dropdown");
    setupDropdownToggle("danmu-filter-btn", "danmu-filter-dropdown");
    setupDropdownToggle("gift-filter-btn", "gift-filter-dropdown");

    // Close dropdowns when clicking outside
    window.addEventListener("click", (e) => {
      document.querySelectorAll(".header-dropdown").forEach(d => {
        if (!d.contains(e.target)) {
          d.style.display = "none";
        }
      });
    });

    // Foreground Combo Details Modal Logic
    const comboModal = document.getElementById("combo-modal");
    const closeComboBtn = document.getElementById("close-combo-modal");
    if (closeComboBtn) {
      closeComboBtn.addEventListener("click", () => {
        if (comboModal) comboModal.classList.remove("active");
      });
    }
    if (comboModal) {
      comboModal.addEventListener("click", (e) => {
        if (e.target === comboModal) {
          comboModal.classList.remove("active");
        }
      });
    }

    function showComboModal(text, details, count) {
      const modal = document.getElementById("combo-modal");
      const modalBody = document.getElementById("combo-modal-body");
      const modalTitle = modal.querySelector(".modal-title");
      if (!modal || !modalBody) return;

      modalTitle.textContent = \`"\${text}" 连击详情 (共 \${count} 次)\`;
      modalBody.innerHTML = "";
      
      details.forEach(det => {
        modalBody.appendChild(createSubItem(det));
      });

      modal.classList.add("active");
    }

    // Format Noble count (贵宾数)
    function formatNobleCount(vn) {
      const n = Number(vn);
      if (isNaN(n)) return vn;
      if (n >= 10000) {
        const wan = n / 10000;
        if (Number.isInteger(wan)) return wan + "万";
        return parseFloat(wan.toFixed(1)) + "万";
      }
      return String(n);
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

      // Gift blocking filter
      if (optBlockGifts && optBlockGifts.value.trim()) {
        const giftBlockedList = optBlockGifts.value.split(/[\\n,，]/).map(g => g.trim().toLowerCase()).filter(Boolean);
        if (giftBlockedList.includes(giftName.toLowerCase())) {
          return;
        }
      }

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

          // Re-evaluate highlighting upon merging
          const highlightThreshold = parseFloat(optGiftHighlight ? optGiftHighlight.value : "10");
          const totalValue = (giftInfo.price || 0) * existing.count;
          if (totalValue >= highlightThreshold && highlightThreshold >= 0) {
            existing.element.classList.add("gift-highlight");
          } else {
            existing.element.classList.remove("gift-highlight");
          }

          // Trigger bump animation
          existing.element.classList.remove("bump");
          void existing.element.offsetWidth;
          existing.element.classList.add("bump");
          
          if (giftAutoScroll) {
            giftLog.scrollTop = giftLog.scrollHeight;
          } else {
            const alertEl = document.getElementById("gift-scroll-lock-alert");
            if (alertEl) alertEl.classList.add("active");
          }
          
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
      el.appendChild(contentSpan);

      // Evaluate highlighting
      const highlightThreshold = parseFloat(optGiftHighlight ? optGiftHighlight.value : "10");
      const totalValue = (giftInfo.price || 0) * countVal;
      if (totalValue >= highlightThreshold && highlightThreshold >= 0) {
        el.classList.add("gift-highlight");
      }

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

      if (giftAutoScroll) {
        giftLog.scrollTop = giftLog.scrollHeight;
      } else {
        const alertEl = document.getElementById("gift-scroll-lock-alert");
        if (alertEl) alertEl.classList.add("active");
      }

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
      
      if (giftAutoScroll) {
        giftLog.scrollTop = giftLog.scrollHeight;
      } else {
        const alertEl = document.getElementById("gift-scroll-lock-alert");
        if (alertEl) alertEl.classList.add("active");
      }
      
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
      
      if (entryAutoScroll) {
        entryLog.scrollTop = entryLog.scrollHeight;
      } else {
        const alertEl = document.getElementById("entry-scroll-lock-alert");
        if (alertEl) alertEl.classList.add("active");
      }
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
      } else if (msg.type === "oni") {
        const vn = msg.vn;
        if (vn) {
          const nobleCount = document.getElementById("noble-count");
          if (nobleCount) {
            nobleCount.textContent = "贵宾: " + formatNobleCount(vn);
            nobleCount.style.display = "inline-block";
          }
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

              element.addEventListener("click", (e) => {
                if (e.target.closest('.dm-username')) {
                  return;
                }
                e.stopPropagation();
                showComboModal(text, existing.details, existing.count);
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
            }

            // Position Control & Scroll Lock Check
            if (autoScroll) {
              const pinThreshold = parseInt(optPinThreshold ? optPinThreshold.value : "10");
              if (existing.count >= pinThreshold) {
                existing.pinned = true;
                existing.pinTimestamp = now;
                if (!pinnedContainer.contains(element)) {
                  element.remove();
                  pinnedContainer.appendChild(element);

                  // Safety cap: keep at most opt-pin-max-count pinned combos
                  const maxPinned = parseInt(optPinMaxCount ? optPinMaxCount.value : "5") || 3;
                  while (pinnedContainer.childElementCount > maxPinned) {
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
