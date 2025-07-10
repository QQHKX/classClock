/**
 * 工具函数集合
 * 包含格式化时间、DOM操作和全屏控制等通用功能
 */

const Utils = {
    /**
     * 格式化数字为两位数字符串
     * @param {number} num - 要格式化的数字
     * @returns {string} - 格式化后的两位数字字符串
     */
    formatTwoDigits: function(num) {
        return num.toString().padStart(2, '0');
    },
    
    /**
     * 格式化时间为HH:MM:SS格式
     * @param {Date} date - 日期对象
     * @returns {string} - 格式化后的时间字符串
     */
    formatTime: function(date) {
        const hours = this.formatTwoDigits(date.getHours());
        const minutes = this.formatTwoDigits(date.getMinutes());
        const seconds = this.formatTwoDigits(date.getSeconds());
        return `${hours}:${minutes}:${seconds}`;
    },
    
    /**
     * 格式化分钟和秒为MM:SS格式
     * @param {number} minutes - 分钟数
     * @param {number} seconds - 秒数
     * @returns {string} - 格式化后的时间字符串
     */
    formatMinutesSeconds: function(minutes, seconds) {
        return `${this.formatTwoDigits(minutes)}:${this.formatTwoDigits(seconds)}`;
    },
    
    /**
     * 格式化小时、分钟和秒为HH:MM:SS格式
     * @param {number} hours - 小时数
     * @param {number} minutes - 分钟数
     * @param {number} seconds - 秒数
     * @returns {string} - 格式化后的时间字符串
     */
    formatHoursMinutesSeconds: function(hours, minutes, seconds) {
        return `${this.formatTwoDigits(hours)}:${this.formatTwoDigits(minutes)}:${this.formatTwoDigits(seconds)}`;
    },
    
    /**
     * 格式化毫秒为两位数
     * @param {number} milliseconds - 毫秒数
     * @returns {string} - 格式化后的毫秒字符串
     */
    formatMilliseconds: function(milliseconds) {
        return this.formatTwoDigits(Math.floor(milliseconds / 10));
    },
    
    /**
     * 切换元素的激活状态
     * @param {HTMLElement} element - 要切换状态的元素
     * @param {boolean} isActive - 是否激活
     */
    toggleActive: function(element, isActive) {
        if (isActive) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    },
    
    /**
     * 切换全屏模式
     * @returns {Promise} - 全屏操作的Promise
     */
    toggleFullscreen: function() {
        if (!document.fullscreenElement) {
            // 进入全屏模式
            return document.documentElement.requestFullscreen().catch(err => {
                console.error(`全屏请求失败: ${err.message}`);
            });
        } else {
            // 退出全屏模式
            return document.exitFullscreen();
        }
    },
    
    /**
     * 播放音效
     * @param {string} audioId - 音频元素的ID
     */
    playSound: function(audioId) {
        const audio = document.getElementById(audioId);
        if (audio) {
            // 重置音频到开始位置并播放
            audio.currentTime = 0;
            audio.play().catch(err => {
                console.error(`音频播放失败: ${err.message}`);
            });
        }
    },
    
    /**
     * 设置自动隐藏计时器
     * @param {Function} callback - 计时器回调函数
     * @param {number} delay - 延迟时间（毫秒）
     * @returns {number} - 计时器ID
     */
    setAutoHideTimer: function(callback, delay) {
        return setTimeout(callback, delay);
    },
    
    /**
     * 清除自动隐藏计时器
     * @param {number} timerId - 计时器ID
     */
    clearAutoHideTimer: function(timerId) {
        if (timerId) {
            clearTimeout(timerId);
        }
    },
    
    /**
     * 添加事件监听器
     * @param {HTMLElement} element - 要添加监听器的元素
     * @param {string} event - 事件类型
     * @param {Function} handler - 事件处理函数
     */
    addEvent: function(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
        }
    },
    
    /**
     * 移除事件监听器
     * @param {HTMLElement} element - 要移除监听器的元素
     * @param {string} event - 事件类型
     * @param {Function} handler - 事件处理函数
     */
    removeEvent: function(element, event, handler) {
        if (element) {
            element.removeEventListener(event, handler);
        }
    }
};