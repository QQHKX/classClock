/**
 * 倒计时功能模块
 * 负责倒计时功能，包括设置时间、开始、暂停和重置
 */

const Countdown = {
    // 元素引用
    element: null,          // 倒计时显示元素
    modal: null,            // 设置模态框
    hoursElement: null,     // 小时设置元素
    minutesElement: null,   // 分钟设置元素
    secondsElement: null,   // 秒设置元素
    startButton: null,      // 开始/暂停按钮
    resetButton: null,      // 重置按钮
    confirmButton: null,    // 确认设置按钮
    presetButtons: null,    // 预设按钮集合
    
    // 状态变量
    hours: 0,               // 设置的小时数
    minutes: 0,             // 设置的分钟数
    seconds: 0,             // 设置的秒数
    totalSeconds: 0,        // 总秒数
    remainingSeconds: 0,    // 剩余秒数
    isRunning: false,       // 是否正在运行
    isWarning: false,       // 是否处于警告状态
    
    // 动画帧请求ID
    animationFrameId: null,
    
    // 上次更新时间戳
    lastTimestamp: 0,
    
    /**
     * 初始化倒计时功能
     */
    init: function() {
        // 获取DOM元素
        this.element = document.getElementById('countdown');
        this.modal = document.getElementById('countdown-modal');
        this.hoursElement = document.getElementById('countdown-hours');
        this.minutesElement = document.getElementById('countdown-minutes');
        this.secondsElement = document.getElementById('countdown-seconds');
        this.startButton = document.getElementById('countdown-start');
        this.resetButton = document.getElementById('countdown-reset');
        this.confirmButton = document.getElementById('countdown-confirm');
        this.presetButtons = document.querySelectorAll('.preset-btn');
        
        // 绑定事件
        this.bindEvents();
        
        // 设置默认时间
        this.setTime(0, 5, 0);
    },
    
    /**
     * 绑定事件处理函数
     */
    bindEvents: function() {
        // 点击倒计时显示打开设置模态框
        Utils.addEvent(this.element, 'click', () => {
            if (!this.isRunning) {
                this.openModal();
            }
        });
        
        // 开始/暂停按钮
        Utils.addEvent(this.startButton, 'click', () => this.toggleCountdown());
        
        // 重置按钮
        Utils.addEvent(this.resetButton, 'click', () => this.reset());
        
        // 确认按钮
        Utils.addEvent(this.confirmButton, 'click', () => this.confirmSettings());
        
        // 预设按钮
        this.presetButtons.forEach(button => {
            Utils.addEvent(button, 'click', () => {
                const minutes = parseInt(button.dataset.minutes, 10) || 0;
                const seconds = parseInt(button.dataset.seconds, 10) || 0;
                this.setTime(0, minutes, seconds);
            });
        });
        
        // 小时、分钟和秒的加减按钮
        const timeButtons = document.querySelectorAll('.time-btn');
        timeButtons.forEach(button => {
            Utils.addEvent(button, 'click', () => {
                const action = button.dataset.action;
                const target = button.dataset.target; // 'hours', 'minutes' 或 'seconds'
                this.adjustTime(action, target);
            });
        });
    },
    
    /**
     * 打开设置模态框
     */
    openModal: function() {
        Utils.toggleActive(this.modal, true);
        
        // 更新模态框中的时间显示
        this.minutesElement.textContent = Utils.formatTwoDigits(this.minutes);
        this.secondsElement.textContent = Utils.formatTwoDigits(this.seconds);
    },
    
    /**
     * 关闭设置模态框
     */
    closeModal: function() {
        Utils.toggleActive(this.modal, false);
    },
    
    /**
     * 确认设置并关闭模态框
     */
    confirmSettings: function() {
        // 获取当前设置的时间值
        const hours = parseInt(this.hoursElement.textContent, 10) || 0;
        const minutes = parseInt(this.minutesElement.textContent, 10) || 0;
        const seconds = parseInt(this.secondsElement.textContent, 10) || 0;
        
        // 应用设置的时间
        this.setTime(hours, minutes, seconds);
        
        // 关闭模态框
        this.closeModal();
    },
    
    /**
     * 调整时间（增加或减少小时/分钟/秒）
     * @param {string} action - 'plus' 或 'minus'
     * @param {string} target - 'hours', 'minutes' 或 'seconds'
     */
    adjustTime: function(action, target) {
        if (target === 'hours') {
            if (action === 'plus') {
                this.hours = Math.min(99, this.hours + 1);
            } else if (action === 'minus') {
                this.hours = Math.max(0, this.hours - 1);
            }
            this.hoursElement.textContent = Utils.formatTwoDigits(this.hours);
        } else if (target === 'minutes') {
            if (action === 'plus') {
                this.minutes = Math.min(59, this.minutes + 1);
            } else if (action === 'minus') {
                this.minutes = Math.max(0, this.minutes - 1);
            }
            this.minutesElement.textContent = Utils.formatTwoDigits(this.minutes);
        } else if (target === 'seconds') {
            if (action === 'plus') {
                this.seconds = Math.min(59, this.seconds + 1);
            } else if (action === 'minus') {
                this.seconds = Math.max(0, this.seconds - 1);
            }
            this.secondsElement.textContent = Utils.formatTwoDigits(this.seconds);
        }
    },
    
    /**
     * 设置倒计时时间
     * @param {number} hours - 小时数
     * @param {number} minutes - 分钟数
     * @param {number} seconds - 秒数
     */
    setTime: function(hours, minutes, seconds) {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
        this.totalSeconds = hours * 3600 + minutes * 60 + seconds;
        this.remainingSeconds = this.totalSeconds;
        
        // 更新模态框中的显示
        this.hoursElement.textContent = Utils.formatTwoDigits(hours);
        this.minutesElement.textContent = Utils.formatTwoDigits(minutes);
        this.secondsElement.textContent = Utils.formatTwoDigits(seconds);
        
        // 更新主显示
        this.updateDisplay();
    },
    
    /**
     * 更新倒计时显示
     */
    updateDisplay: function() {
        // 计算小时、分钟和秒
        const displayHours = Math.floor(this.remainingSeconds / 3600);
        const displayMinutes = Math.floor((this.remainingSeconds % 3600) / 60);
        const displaySeconds = Math.floor(this.remainingSeconds % 60);
        
        // 格式化显示
        if (displayHours > 0) {
            // 如果有小时，显示小时:分钟:秒格式
            this.element.textContent = Utils.formatHoursMinutesSeconds(displayHours, displayMinutes, displaySeconds);
        } else {
            // 否则只显示分钟:秒格式
            this.element.textContent = Utils.formatMinutesSeconds(displayMinutes, displaySeconds);
        }
        
        // 检查是否进入警告状态（剩余10秒或以下）
        if (this.remainingSeconds <= 10 && this.remainingSeconds > 0) {
            if (!this.isWarning) {
                this.element.classList.add('warning');
                this.isWarning = true;
            }
        } else if (this.isWarning) {
            this.element.classList.remove('warning');
            this.isWarning = false;
        }
    },
    
    /**
     * 切换倒计时状态（开始/暂停）
     */
    toggleCountdown: function() {
        if (this.remainingSeconds <= 0) {
            // 如果倒计时已结束，重置并打开设置模态框
            this.reset();
            this.openModal();
            return;
        }
        
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    },
    
    /**
     * 开始倒计时
     */
    start: function() {
        if (this.remainingSeconds <= 0 || this.isRunning) return;
        
        this.isRunning = true;
        
        // 使用performance.now()获取高精度时间戳
        this.lastTimestamp = performance.now();
        
        // 更新按钮文本和图标
        this.startButton.querySelector('span').textContent = '暂停';
        this.startButton.querySelector('svg use').setAttribute('href', '#pause');
        
        // 开始动画帧循环
        this.animationFrameId = requestAnimationFrame(this.update.bind(this));
    },
    
    /**
     * 暂停倒计时
     */
    pause: function() {
        this.isRunning = false;
        
        // 更新按钮文本和图标
        this.startButton.querySelector('span').textContent = '继续';
        this.startButton.querySelector('svg use').setAttribute('href', '#play');
        
        // 停止动画帧循环
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    },
    
    /**
     * 重置倒计时
     */
    reset: function() {
        this.pause();
        this.remainingSeconds = this.totalSeconds;
        this.updateDisplay();
        
        // 更新按钮文本
        this.startButton.querySelector('span').textContent = '开始';
        
        // 移除警告状态
        if (this.isWarning) {
            this.element.classList.remove('warning');
            this.isWarning = false;
        }
    },
    
    /**
     * 更新倒计时（动画帧回调）
     * @param {number} timestamp - 当前时间戳
     */
    update: function(timestamp) {
        if (!this.isRunning) return;
        
        // 计算经过的时间（秒）
        const elapsedSeconds = (timestamp - this.lastTimestamp) / 1000;
        
        // 更新剩余时间，不需要保留小数精度
        this.remainingSeconds = Math.max(0, this.remainingSeconds - elapsedSeconds);
        this.lastTimestamp = timestamp;
        
        // 更新显示
        this.updateDisplay();
        
        // 检查是否结束
        if (this.remainingSeconds <= 0) {
            this.finish();
            return;
        }
        
        // 继续动画帧循环
        this.animationFrameId = requestAnimationFrame(this.update.bind(this));
    },
    
    /**
     * 倒计时结束处理
     */
    finish: function() {
        this.isRunning = false;
        this.remainingSeconds = 0;
        
        // 播放结束音效
        Utils.playSound('ding-sound');
        
        // 添加闪烁动画
        this.element.style.animation = 'blink 1s 2';
        
        // 动画结束后重置
        setTimeout(() => {
            this.element.style.animation = '';
            this.reset();
            this.openModal();
        }, 2000);
        
        // 更新按钮文本
        this.startButton.querySelector('span').textContent = '开始';
        this.startButton.querySelector('svg use').setAttribute('href', '#play');
    },
    
    /**
     * 激活倒计时模式
     */
    activate: function() {
        Utils.toggleActive(this.element, true);
    },
    
    /**
     * 停用倒计时模式
     */
    deactivate: function() {
        Utils.toggleActive(this.element, false);
        
        // 如果正在运行，暂停倒计时
        if (this.isRunning) {
            this.pause();
        }
        
        // 确保模态框关闭
        this.closeModal();
    }
};