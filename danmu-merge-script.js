// ==UserScript==
// @name         斗鱼弹幕合并1.0 by超限
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  合并斗鱼网页端重复弹幕并置底。连击数一键跟风发送，黑夜白天自适应，置底自适应且不产生多余空边，强力屏蔽进场通知，修复详情重叠问题。
// @author       超限 (Modified by Assistant)
// @match        *://*.douyu.com/0*
// @match        *://*.douyu.com/1*
// @match        *://*.douyu.com/2*
// @match        *://*.douyu.com/3*
// @match        *://*.douyu.com/4*
// @match        *://*.douyu.com/5*
// @match        *://*.douyu.com/6*
// @match        *://*.douyu.com/7*
// @match        *://*.douyu.com/8*
// @match        *://*.douyu.com/9*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const settings = {
        mergeEnabled: true,
        mergeWindow: 10,       // 合并时间窗口 (秒)
        pinThreshold: 10,      // 连击置底阈值
        pinMaxCount: 3         // 置底连击最大同时显示数
    };

    // 状态存储
    let activeDanmakus = new Map();
    let chatObserver = null;

    // 加载/保存本地设置
    function loadSettings() {
        const saved = localStorage.getItem('douyu_pinner_settings');
        if (saved) {
            try {
                Object.assign(settings, JSON.parse(saved));
            } catch (e) {
                console.error("加载设置失败：", e);
            }
        }
    }

    function saveSettings() {
        localStorage.setItem('douyu_pinner_settings', JSON.stringify(settings));
    }

    // 注入自适应 CSS (白天浅色基调与黑夜深色覆盖)
    const style = document.createElement('style');
    style.innerHTML = `
        /* ======= 1. 白天模式下的连击基础色变量 ======= */
        :root, body {
            --combo-base-color: rgb(30, 41, 59);
        }

        /* ======= 2. 置底面板样式 (完全高度自适应) ======= */
        #pinned-container {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            border-top: 1.5px solid rgba(255, 119, 0, 0.88);
            z-index: 999;
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding: 6px 12px;

            /* 属性自适应高度，不产生滚动条 */
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;

            box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.08);
            transition: all 0.2s ease;
        }

        #pinned-container:empty {
            display: none !important;
        }

        /* ======= 3. 改进后的极简计数标签样式 (1.5倍大字号，跟在尾挂图后，绝不另起一行) ======= */
        .douyu-combo-badge {
            display: inline-block !important;
            font-family: Arial, Helvetica, sans-serif;
            font-style: italic;
            font-weight: 900;
            margin-left: 8px;
            user-select: none;
            transform: scale(1.0);
            text-shadow: 0 0 2px rgba(255, 117, 0, 0.3);
            cursor: pointer;

            /* 基础字号比父级弹幕字号大 1.5 倍 */
            font-size: 1.5em !important;
            line-height: 1 !important;
            vertical-align: middle !important;
        }

        @keyframes comboScale {
            0% { transform: scale(1.0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1.0); }
        }

        .combo-pop {
            animation: comboScale 0.2s ease-in-out;
        }

        /* ======= 4. 内嵌历史详情与高度/滚轮自适应 ======= */
        .douyu-combo-expansion {
            margin-top: 4px;
            padding: 6px 8px;
            background: rgba(0, 0, 0, 0.05);
            border-radius: 4px;
            border-left: 2px solid #ff7500;
            display: flex;
            flex-direction: column;
            gap: 4px;
            font-size: 11px !important;
            animation: slideDown 0.15s ease-out;
            width: 100%;
            box-sizing: border-box;
            cursor: pointer;

            /* 连击列表开启时允许鼠标滚轮查看，关闭时重绘自然回归紧凑自适应状态 */
            max-height: 130px !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
        }

        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-3px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* 精细化自定义滚动条 */
        .douyu-combo-expansion::-webkit-scrollbar {
            width: 4px !important;
        }
        .douyu-combo-expansion::-webkit-scrollbar-track {
            background: transparent !important;
        }
        .douyu-combo-expansion::-webkit-scrollbar-thumb {
            background: rgba(128, 128, 128, 0.3) !important;
            border-radius: 2px !important;
        }

        .Barrage-listItem, .pinned-danmaku-item {
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
        }

        /* ======= 历史详情单行防挤压自适应换行排版 ======= */
        .expansion-row {
            display: flex !important;
            align-items: flex-start !important;
            justify-content: flex-start !important;
            flex-wrap: wrap !important; /* 允许在空间不足时向下直接换行 */
            width: 100% !important;
            box-sizing: border-box !important;
            line-height: 1.4 !important;
            padding: 2px 0 !important;
            word-break: break-all !important;
        }

        .expansion-name {
            flex-shrink: 0 !important; /* 用户名绝不被压缩变形 */
            display: inline-block !important;
            white-space: nowrap !important;
            margin: 0 !important;
            padding: 0 !important;
            float: none !important;
            position: static !important;
        }

        .expansion-text {
            display: inline !important;
            white-space: normal !important;
            word-break: break-all !important;
            flex: 1 1 auto !important;
            margin-left: 2px !important;
        }

        /* ======= 5. 置底单项样式 (白天模式) ======= */
        .pinned-danmaku-item {
            border-left: 3px solid #ff7500 !important;
            background: rgba(121, 121, 121, 0.28);
            padding: 4px 8px !important;
            border-radius: 4px;
            margin: 2px 0;
            display: flex !important;
            flex-wrap: wrap;
            align-items: center;
        }

        /* ======= 6. 悬浮设置面板 (白天模式) ======= */
        #douyu-helper-settings-btn {
            position: fixed;
            right: 5px;
            bottom: 130px;
            width: 41.8px;
            height: 41.8px;
            background: #2cafff;
            color: white;
            border-radius: 10%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 4px 10px rgba(0,170,255,0.45);
            font-size: 18px;
            user-select: none;
            transition: transform 0.2s ease;
        }
        #douyu-helper-settings-btn:hover {
            transform: scale(1.1) rotate(30deg);
        }

        #douyu-helper-settings-panel {
            position: fixed;
            right: 70px;
            bottom: 120px;
            width: 280px;
            background: #ffffff;
            color: #1e293b;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            z-index: 10000;
            padding: 16px;
            font-family: sans-serif;
            font-size: 13px;
            display: none;
            flex-direction: column;
            gap: 12px;
        }
        .settings-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .settings-row label {
            font-weight: 500;
        }
        .settings-input {
            background: #f1f5f9;
            border: 1px solid rgba(0,0,0,0.12);
            color: #1e293b;
            border-radius: 4px;
            padding: 4px 8px;
            width: 60px;
            text-align: center;
            transition: all 0.2s;
        }
        .settings-checkbox {
            width: 16px;
            height: 16px;
            cursor: pointer;
        }

        /* ======= 7. 深度黑夜模式自适应及 CSS 变量同步覆盖 ======= */
        [data-mantine-color-scheme="dark"],
        [data-mantine-color-scheme="dark"] body,
        .douyu-helper-dark,
        .douyu-helper-dark body {
            --combo-base-color: rgb(226, 232, 240) !important; /* 暗黑背景下的浅白灰色 */
        }

        .douyu-helper-dark #pinned-container {
            background: #181c24 !important; /* 融合斗鱼官方黑夜背景色 */
            box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.3) !important;
            border-top: 1.5px solid #282e3d !important; /* 原生暗黑分割线 */
            color: #a3a6ad !important;
        }

        .douyu-helper-dark .douyu-combo-expansion {
            background: #1f2531 !important; /* 适配斗鱼黑夜卡片背景 */
            border-left: 2px solid #ff7500 !important;
        }

        .douyu-helper-dark .expansion-colon {
            color: #cbd5e1 !important;
        }

        .douyu-helper-dark .expansion-text {
            color: #0099ff !important;
        }

        .douyu-helper-dark .expansion-time {
            color: #6c7077 !important;
        }

        .douyu-helper-dark .pinned-danmaku-item {
            background: #586072 !important;
            border-left: 3px solid #ff7500 !important;
            color: #0099ff !important;
        }

        .douyu-helper-dark #douyu-helper-settings-panel {
            background: #1a1e27 !important;
            color: #cbd5e1 !important;
            border: 1px solid #2d3748 !important;
            box-shadow: 0 10px 25px rgba(0,0,0,0.4) !important;
        }

        .douyu-helper-dark .settings-input {
            background: #0f172a !important;
            border: 1px solid #2d3748 !important;
            color: #ffffff !important;
        }

        /* ======= 8. 强力屏蔽“大家都在发”浮窗模块 (CSS 级彻底隐藏且不破坏 DOM) ======= */
        .QBHotBarrage {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* ======= 9. “有X条新消息”自适应平滑动画过渡效果 ======= */
        .BarrageBuffer {
            transition: bottom 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        /* ======= 10. 强力屏蔽观众进场通知 (进房提示) ======= */
        .Barrage-userEnter,
        .Barrage-notice--enter,
        .Barrage-notice--userEnter {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* ======= 11. 强力屏蔽置底合并弹幕栏内的弹幕勋章/成就图片及文字尾巴 (Baby, Baby-image, Baby-name, is-achievement, Barrage-honorImg) ======= */
        #pinned-container .Baby,
        #pinned-container .Baby-image,
        #pinned-container .Baby-name,
        #pinned-container .is-achievement,
        #pinned-container .Barrage-honorImg {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
        }

        /* ======= 12. 强力屏蔽置底合并弹幕栏内的“广告/活动尾缀” (is-suffix, js-barrage-suffix, [data-btype]) ======= */
        #pinned-container .is-suffix,
        #pinned-container .js-barrage-suffix,
        #pinned-container [data-btype] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
        }
    `;
    document.head.appendChild(style);

    // 重复去重归一化键名
    function getCollapseKey(str) {
        return str.trim().toLowerCase().replace(/\s+/g, '').replace(/(.)\1+/gu, '$1');
    }

    // 智能动态亮度检测
    function checkNightMode() {
        const mantineTheme = document.documentElement.getAttribute("data-mantine-color-scheme");
        if (mantineTheme === "dark") {
            return true;
        } else if (mantineTheme === "light") {
            return false;
        }

        const chatList = document.getElementById('js-barrage-list') || document.querySelector('.Barrage-list') || document.querySelector('.Barrage');
        let computedBg = 'transparent';

        if (chatList) {
            computedBg = window.getComputedStyle(chatList).backgroundColor;
            let parent = chatList.parentElement;
            while (parent && (computedBg === 'rgba(0, 0, 0, 0)' || computedBg === 'transparent')) {
                computedBg = window.getComputedStyle(parent).backgroundColor;
                parent = parent.parentElement;
            }
        }

        const match = computedBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);
            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
            return luminance < 80;
        }

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true;
        }
        return false;
    }

    // 同步挂载黑夜模式 class
    function updateThemeClass() {
        const isDark = checkNightMode();
        const body = document.body;
        if (isDark) {
            body.classList.add('douyu-helper-dark');
        } else {
            body.classList.remove('douyu-helper-dark');
        }
    }

    // 动态计算合并字体的颜色
    function getComboColor(count, element) {
        if (count >= 30) {
            return "rgb(239, 68, 68)"; // 超过 30 显眼中国红
        }

        // 直接读取 CSS 原生属性变量，确保配色在换肤时完全对齐
        let baseColorStr = "rgb(30, 41, 59)"; // 白天缺省深灰色
        if (element) {
            try {
                baseColorStr = window.getComputedStyle(element).getPropertyValue('--combo-base-color') || window.getComputedStyle(element).color || baseColorStr;
            } catch (e) {}
        }

        const match = baseColorStr.match(/rgba?\s*\(\s*(\d+),\s*(\d+),\s*(\d+)/);
        const startR = match ? parseInt(match[1]) : 30;
        const startG = match ? parseInt(match[2]) : 41;
        const startB = match ? parseInt(match[3]) : 59;

        // 目标过度色：经典斗鱼橙色 (255, 117, 0)
        const targetR = 255;
        const targetG = 117;
        const targetB = 0;

        // 基于 2 到 30 的连击线性过渡比值 (0.0 到 1.0)
        const t = Math.min(1, Math.max(0, (count - 2) / 28));

        const r = Math.round(startR + t * (targetR - startR));
        const g = Math.getOwnPropertyDescriptor ? Math.round(startG + t * (targetG - startG)) : Math.round(startG + t * (targetG - startG));
        const b = Math.round(startB + t * (targetB - startB));

        return `rgb(${r}, ${g}, ${b})`;
    }

    // 更新单个计数徽章样式与数值
    function updateComboBadgeStyle(badge, count, parentContainer) {
        if (!badge) return;
        badge.textContent = "x" + count;

        // 基于宿主计算自适应色彩，杜绝黑色背景下的黑字隐形问题
        badge.style.color = getComboColor(count, parentContainer || badge);

        // 核心安全校验：若 React 重绘强行将数字节点拔除，立即将其平滑追加回原先位置
        if (!badge.isConnected && parentContainer) {
            parentContainer.appendChild(badge);
        }

        // 重启动画触发 scale 缩放效果
        badge.classList.remove("combo-pop");
        void badge.offsetWidth; // 触发 reflow
        badge.classList.add("combo-pop");
    }

    // 一键复制并发送 (仿 DouyuEx +1，绝不破坏和污染系统剪贴板)
    function sendDanmakuDirectly(text) {
        const area = document.querySelector('.ChatSend-txt') || document.querySelector('.ChatSend-textarea');
        if (!area) {
            console.error("未找到输入框");
            return;
        }

        if (area.tagName === 'TEXTAREA' || area.tagName === 'INPUT') {
            try {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    area.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype,
                    "value"
                ).set;
                nativeInputValueSetter.call(area, text);
            } catch (e) {
                area.value = text;
            }
        } else {
            area.innerText = text;
        }

        area.dispatchEvent(new Event('input', { bubbles: true }));
        area.dispatchEvent(new Event('change', { bubbles: true }));
        area.focus();

        setTimeout(() => {
            const btn = document.querySelector('.ChatSend-button') || document.querySelector('.ChatSend-btn');
            if (btn) {
                btn.removeAttribute('disabled');
                btn.classList.remove('is-disabled');
                btn.click();
            }
        }, 80);
    }

    // 事件绑定逻辑
    function bindDanmakuEvents(element, existing, text) {
        const badge = element.querySelector('.douyu-combo-badge');
        if (badge) {
            badge.addEventListener("click", (e) => {
                e.stopPropagation(); // 阻止向下传递避免折叠面板
                sendDanmakuDirectly(text); // 仅发送，不污染剪贴板
            });
        }

        element.style.cursor = 'pointer';
        element.addEventListener("click", (e) => {
            if (e.target.closest('.Barrage-nickName') || e.target.closest('.douyu-combo-expansion') || e.target.closest('.douyu-combo-badge')) {
                return;
            }
            e.stopPropagation();
            toggleInlineExpansion(element, existing);
        });
    }

    // 内嵌展开折叠逻辑
    function toggleInlineExpansion(parentElement, existing) {
        let expansion = parentElement.querySelector('.douyu-combo-expansion');
        if (expansion) {
            expansion.remove();
            updateChatListPadding();
            return;
        }

        expansion = document.createElement('div');
        expansion.className = 'douyu-combo-expansion';

        existing.details.forEach(det => {
            const row = document.createElement('div');
            row.className = 'expansion-row';

            // 创建带原生特征与 data-uid 属性的昵称，绑定特定点击响应事件 (去掉了时间显示，按发送顺序排序)
            const name = document.createElement('span');
            name.className = 'Barrage-nickName Barrage-nickName--blue js-nick expansion-name';
            name.textContent = det.nickname;
            if (det.uid) {
                name.setAttribute('data-uid', det.uid);
                name.setAttribute('title', det.nickname);

                // 核心重构：绕过 React 虚拟树，通过底层反射直接触发当前列表下该用户原生节点的点击事件，以此无缝唤起至尊或普通用户资料卡
                name.addEventListener("click", (e) => {
                    e.stopPropagation();
                    e.preventDefault();

                    // 寻找包含特定 UID 且挂载了 React 原生点击事件的所有宿主节点
                    const nativeNick = document.querySelector(`#js-barrage-list .Barrage-nickName[data-uid="${det.uid}"]`);
                    if (nativeNick) {
                        nativeNick.click(); // 直接向原生节点派发物理点击
                    } else {
                        // 全局兜底
                        const fallbackNick = document.querySelector(`.Barrage-nickName[data-uid="${det.uid}"]`);
                        if (fallbackNick) {
                            fallbackNick.click();
                        }
                    }
                });
            }

            const colon = document.createElement('span');
            colon.className = 'expansion-colon';
            colon.textContent = '：';

            const txt = document.createElement('span');
            txt.className = 'expansion-text';
            txt.textContent = det.text;

            row.appendChild(name);
            row.appendChild(colon);
            row.appendChild(txt);
            expansion.appendChild(row);
        });

        // 在详情框任意位置点击均自折叠关闭 (如果是昵称区域除外，保障原生卡片呼出)
        // 支持点击空白收起，同时保留了点击滚动条拖拽不收起的人性化体验
        expansion.addEventListener("click", (e) => {
            if (e.target.closest('.Barrage-nickName')) {
                return; // 不阻断，确保卡片顺利呼出
            }
            if (e.target.closest('.expansion-row')) {
                e.stopPropagation();
                expansion.remove();
                updateChatListPadding();
            } else {
                // 点击在详情容器背景、空白或拖拽滚动条上时只阻止冒泡（防止关闭），保障滚动条拖拽可用
                e.stopPropagation();
            }
        });

        parentElement.appendChild(expansion);
        updateChatListPadding();
    }

    // 弹幕事件监听
    function handleNewDanmaku(node) {
        // ======= 屏蔽“大家都在发” 以及 观众进场通知 =======
        if (
            node.classList.contains('QBHotBarrage') ||
            node.querySelector('.QBHotBarrage') ||
            (node.getAttribute('class') && node.getAttribute('class').includes('QBHotBarrage')) ||
            node.textContent.includes('大家都在发') ||
            node.classList.contains('Barrage-userEnter') ||
            node.querySelector('.Barrage-userEnter') ||
            node.classList.contains('Barrage-notice--enter') ||
            node.querySelector('.Barrage-notice--enter') ||
            node.classList.contains('Barrage-notice--userEnter') ||
            node.querySelector('.Barrage-notice--userEnter')
        ) {
            node.style.display = 'none';
            return;
        }

        const contentEl = node.querySelector('.Barrage-content');
        if (!contentEl) return;

        const text = contentEl.textContent.trim();
        if (!text) return;

        const nicknameEl = node.querySelector('.Barrage-nickName');
        const nickname = nicknameEl ? nicknameEl.textContent.trim() : "未知";
        // 抓取当前发送人的原生 data-uid，用于后续一键跟风详情中精准定向
        const uid = nicknameEl ? nicknameEl.getAttribute('data-uid') : "";

        const now = Date.now();
        const timeWindow = settings.mergeWindow * 1000;
        const collapseKey = getCollapseKey(text);

        const currentDetail = {
            nickname: nickname,
            uid: uid,
            text: text,
            time: new Date().toTimeString().split(' ')[0]
        };

        if (settings.mergeEnabled) {
            const existing = activeDanmakus.get(collapseKey);

            if (existing && (now - existing.timestamp <= timeWindow)) {
                // 原生滚动区保持纯净：不进行任何隐藏合并，所有弹幕在此继续滚动
                existing.count++;
                existing.timestamp = now;
                existing.details.push(currentDetail);
                if (existing.details.length > 100) existing.details.shift();

                // 连击数触发置底克隆 (仅在置底合并栏生效)
                if (existing.count >= settings.pinThreshold) {
                    if (!existing.pinned) {
                        existing.pinned = true;
                        pinDanmaku(existing, text);
                    } else {
                        updatePinnedElement(existing);
                    }
                }
                return;
            }
        }

        // 初始化
        activeDanmakus.set(collapseKey, {
            element: node,
            countBadge: null,
            count: 1,
            timestamp: now,
            pinned: false,
            pinnedElement: null,
            details: [currentDetail]
        });
    }

    // 置底克隆方法
    function pinDanmaku(existing, text) {
        const pinnedContainer = document.getElementById('pinned-container');
        if (!pinnedContainer) return;

        const originalEl = existing.element;
        if (!originalEl) return;

        // 1. 克隆未被污染过的原生弹幕节点，保持原生弹幕的干净纯洁
        const clonedEl = originalEl.cloneNode(true);
        clonedEl.classList.add("pinned-danmaku-item");

        // 彻底清除克隆体内的历史折叠框，以及强力屏蔽置底栏内的“弹幕图文尾巴”与“广告/活动尾缀”
        clonedEl.querySelectorAll('.douyu-combo-expansion, .Baby, .Baby-image, .Baby-name, .is-achievement, .Barrage-honorImg, .is-suffix, .js-barrage-suffix, [data-btype]').forEach(el => el.remove());

        // 2. 【核心修复1】先将克隆出的节点直接追加到 DOM 容器中，使其变为连接（connected）状态
        // 从而使后续 window.getComputedStyle 能够顺利且精准地读取其继承的主题颜色变量，规避首次置底时色值异常 Bug
        pinnedContainer.appendChild(clonedEl);

        // 3. 此时节点已在文档树中，进行计数标签的现制与挂载
        const badge = document.createElement("span");
        badge.className = "douyu-combo-badge combo-pop";

        // 查找克隆体的内容容器及父容器进行挂载
        const clonedContentEl = clonedEl.querySelector('.Barrage-content');
        const clonedParentContainer = clonedContentEl ? (clonedContentEl.parentElement || clonedContentEl) : clonedEl;

        // 4. 计算并赋予正确的数值与插值颜色，再行追加
        updateComboBadgeStyle(badge, existing.count, clonedParentContainer);
        clonedParentContainer.appendChild(badge);

        existing.countBadge = badge;
        existing.pinnedElement = clonedEl;
        existing.parentContainer = clonedParentContainer; // 缓存可见容器的引用

        bindDanmakuEvents(clonedEl, existing, text);

        enforcePinnedCap();
        updateChatListPadding();
    }

    function updatePinnedElement(existing) {
        if (existing.pinnedElement && existing.countBadge) {
            const clonedBadge = existing.pinnedElement.querySelector('.douyu-combo-badge');
            if (clonedBadge) {
                const clonedParent = clonedBadge.parentElement;
                updateComboBadgeStyle(clonedBadge, existing.count, clonedParent);
            }
        }
    }

    function enforcePinnedCap() {
        const pinnedContainer = document.getElementById('pinned-container');
        if (!pinnedContainer) return;

        const maxPinned = settings.pinMaxCount;
        while (pinnedContainer.childElementCount > maxPinned) {
            const oldest = pinnedContainer.firstElementChild;
            if (oldest) {
                for (let [key, item] of activeDanmakus.entries()) {
                    if (item.pinnedElement === oldest) {
                        item.pinnedElement = null;
                        item.pinned = false;
                        break;
                    }
                }
                oldest.remove();
            } else {
                break;
            }
        }
    }

    // 动态调整斗鱼原生滚动区布局边距
    function updateChatListPadding() {
        const list = document.getElementById('js-barrage-list') || document.querySelector('.Barrage-list');
        const main = document.querySelector('.Barrage-main');
        const pinned = document.getElementById('pinned-container');
        const bufferBtn = document.querySelector('.BarrageBuffer'); // 获取“有X条新消息”按钮

        if (main) {
            // 先清除任何我们可能残余设置在内层列表 ul 上的 padding
            if (list) {
                list.style.removeProperty('padding-bottom');
            }

            if (pinned && pinned.childElementCount > 0) {
                const pinnedHeight = pinned.offsetHeight;

                // 【核心修复2】直接动态重置外层容器 .Barrage-main 的 absolute bottom 值
                // 这样原生弹幕视口本身会在置底栏上方精准、绝对地截止，不产生任何多余空隙，无论是否加载 DouyuEx 表现完全一致
                main.style.setProperty('bottom', pinnedHeight + 'px', 'important');

                // 消息提示按钮位置自适应
                if (bufferBtn) {
                    bufferBtn.style.setProperty('bottom', '15px', 'important');
                }
            } else {
                // 恢复斗鱼原生设定的 bottom 距离
                main.style.removeProperty('bottom');
                if (bufferBtn) {
                    bufferBtn.style.removeProperty('bottom');
                }
            }

            // 解决因为 layout 改变导致原厂滚屏锁定的问题
            // 延迟让原生弹幕框重新向下滚动至最底部，并检测是否被置为“锁屏暂停”状态，如是则物理触发“解锁”使其恢复自动滚动
            setTimeout(() => {
                main.scrollTop = main.scrollHeight;
                const lockBtn = document.querySelector('.Barrage-toolbarLock');
                if (lockBtn) {
                    const textEl = lockBtn.querySelector('.Barrage-toolbarText');
                    // 当工具栏中的锁定文案处于“解锁”状态，代表系统已检测到偏移并锁定，点击“解锁”恢复原生的弹幕滚屏
                    if (textEl && textEl.textContent.trim() === '解锁') {
                        lockBtn.click();
                    }
                }
            }, 50);
        }
    }

    // 回收资源
    function cleanExpirations() {
        const now = Date.now();
        const timeWindow = settings.mergeWindow * 1000;

        for (const [key, item] of activeDanmakus.entries()) {
            if (now - item.timestamp > timeWindow) {
                if (item.pinnedElement) {
                    fadeAndRemove(item.pinnedElement);
                    item.pinnedElement = null;
                }
                activeDanmakus.delete(key);
            }
        }
    }

    function fadeAndRemove(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        element.style.transition = 'all 0.25s ease';
        setTimeout(() => {
            element.remove();
            updateChatListPadding();
        }, 250);
    }

    // 面板挂载
    function createPinnedContainer(listElement) {
        if (document.getElementById('pinned-container')) return;

        const container = document.querySelector('.Barrage') || document.querySelector('#js-player-barrage') || listElement.parentElement;
        if (!container) return;

        if (getComputedStyle(container).position === 'static') {
            container.style.position = 'relative';
        }

        const pinDiv = document.createElement('div');
        pinDiv.id = 'pinned-container';
        container.appendChild(pinDiv);

        updateChatListPadding();
    }

    // 精准 SPA 弹幕源监控挂载
    function setupChatObserver(list) {
        if (!list || list.dataset.observed === 'true') return;
        list.dataset.observed = 'true';
        console.log("斗鱼置底助手: 捕获到弹幕源，开始运行...");

        createPinnedContainer(list);

        chatObserver = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        handleNewDanmaku(node);
                    }
                }
            }
        });
        chatObserver.observe(list, { childList: true });

        updateThemeClass();
        updateChatListPadding();
    }

    // 针对斗鱼 SPA 架构进行的事件响应式节点捕获 (完全取消定时轮询)
    function runEventDrivenSetup() {
        const list = document.getElementById('js-barrage-list') || document.querySelector('.Barrage-list');
        if (list) {
            setupChatObserver(list);
        }

        const asideObserver = new MutationObserver(() => {
            const currentList = document.getElementById('js-barrage-list') || document.querySelector('.Barrage-list');
            if (currentList) {
                setupChatObserver(currentList);
            }
        });

        // 限制监听范围在斗鱼侧边栏，避免大范围遍历
        const asideContainer = document.querySelector('.layout-Player-aside') || document.querySelector('#js-player-barrage') || document.body;
        asideObserver.observe(asideContainer, { childList: true, subtree: true });
    }

    // 配置面板装配
    function createSettingsPanel() {
        if (document.getElementById('douyu-helper-settings-btn')) return;

        const btn = document.createElement('div');
        btn.id = 'douyu-helper-settings-btn';
        btn.textContent = '合';
        btn.title = '弹幕合并置底助手配置';
        document.body.appendChild(btn);

        const panel = document.createElement('div');
        panel.id = 'douyu-helper-settings-panel';
        panel.innerHTML = `
            <div style="font-weight: bold; font-size: 14px; color: #2cafff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; margin-bottom: 4px;">⚙️ 弹幕合并置底选项</div>

            <div class="settings-row">
                <label>开启弹幕合并</label>
                <input type="checkbox" id="set-merge-enabled" class="settings-checkbox" ${settings.mergeEnabled ? 'checked' : ''}>
            </div>

            <div class="settings-row">
                <label>合并时间窗口 (秒)</label>
                <input type="number" id="set-merge-window" class="settings-input" min="1" max="60" value="${settings.mergeWindow}">
            </div>

            <div class="settings-row">
                <label>置底连击阈值 (X)</label>
                <input type="number" id="set-pin-threshold" class="settings-input" min="2" value="${settings.pinThreshold}">
            </div>

            <div class="settings-row">
                <label>最大置底显示数</label>
                <input type="number" id="set-pin-max-count" class="settings-input" min="1" max="10" value="${settings.pinMaxCount}">
            </div>

            <button id="set-save-btn" style="background: #2cafff; border: none; color: white; border-radius: 6px; padding: 6px; font-weight: bold; cursor: pointer; margin-top: 4px;">保存设置</button>
        `;
        document.body.appendChild(panel);

        btn.onclick = () => {
            const isShown = panel.style.display === 'flex';
            panel.style.display = isShown ? 'none' : 'flex';
        };

        document.getElementById('set-save-btn').onclick = () => {
            settings.mergeEnabled = document.getElementById('set-merge-enabled').checked;
            settings.mergeWindow = parseInt(document.getElementById('set-merge-window').value) || 10;
            settings.pinThreshold = parseInt(document.getElementById('set-pin-threshold').value) || 10;
            settings.pinMaxCount = parseInt(document.getElementById('set-pin-max-count').value) || 3;

            saveSettings();
            panel.style.display = 'none';

            enforcePinnedCap();
            updateChatListPadding();
        };
    }

    function init() {
        loadSettings();
        createSettingsPanel();

        // 挂载局部的 SPA 事件捕获
        runEventDrivenSetup();

        // 1.0 秒定时回收
        setInterval(cleanExpirations, 1000);

        // 原生级的 0 延迟 Mantine 主题变动监听
        const themeObserver = new MutationObserver(() => {
            updateThemeClass();
        });

        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-mantine-color-scheme']
        });

        // 监控 SPA URL 变化触发重设（捕捉切换房间）
        const urlObserver = new MutationObserver(() => {
            runEventDrivenSetup();
        });
        urlObserver.observe(document.head, { childList: true, subtree: true });

        // 首次激活检测
        updateThemeClass();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
