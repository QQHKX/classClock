/**
 * 倒计时模式
 * 负责倒计时功能，包括设置时间、开始、暂停和重置
 */

const Countdown = {
    // 元素引用
    element: null,
    minutesElement: null,
    secondsElement: null,
    modal: null,
    startButton: null,
    resetButton: null,
    confirmButton: null,
    presetButtons: null,
    
    // 状态变量
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    remainingSeconds: 0,
    isRunning: false,
    isWarning: false,
    
    // 动画帧请求ID
    animationFrameId: null,
    
    // 上次更新时间戳
    lastTimestamp: 0,
    
    /**
     * 初始化倒计时模式
     */
    init: function() {
        // 获取DOM元素
        this.element = document.getElementById('countdown');
        this.minutesElement = document.getElementById('countdown-minutes');
        this.secondsElement = document.getElementById('countdown-seconds');
        this.modal = document.getElementById('countdown-modal');
        this.startButton = document.getElementById('countdown-start');
        this.resetButton = document.getElementById('countdown-reset');
        this.confirmButton = document.getElementById('countdown-confirm');
        this.presetButtons = document.querySelectorAll('.preset-btn');
        
        // 绑定事件
        this.bindEvents();
        
        // 初始化显示
        this.updateDisplay();
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
                this.setTime(minutes, seconds);
            });
        });
        
        // 分钟和秒的加减按钮
        const timeButtons = document.querySelectorAll('.time-btn');
        timeButtons.forEach(button => {
            Utils.addEvent(button, 'click', () => {
                const action = button.dataset.action;
                const target = button.dataset.target;
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
        this.closeModal();
        this.updateDisplay();
    },
    
    /**
     * 调整时间（增加或减少分钟/秒）
     * @param {string} action - 'plus' 或 'minus'
     * @param {string} target - 'minutes' 或 'seconds'
     */
    adjustTime: function(action, target) {
        if (target === 'minutes') {
            if (action === 'plus') {
                this.minutes = Math.min(99, this.minutes + 1);
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
     * @param {number} minutes - 分钟数
     * @param {number} seconds - 秒数
     */
    setTime: function(minutes, seconds) {
        this.minutes = minutes;
        this.seconds = seconds;
        this.totalSeconds = minutes * 60 + seconds;
        this.remainingSeconds = this.totalSeconds;
        
        // 更新模态框中的显示
        this.minutesElement.textContent = Utils.formatTwoDigits(minutes);
        this.secondsElement.textContent = Utils.formatTwoDigits(seconds);
        
        // 更新主显示
        this.updateDisplay();
    },
    
    /**
     * 更新倒计时显示
     */
    updateDisplay: function() {
        const displayMinutes = Math.floor(this.remainingSeconds / 60);
        const displaySeconds = this.remainingSeconds % 60;
        
        this.element.textContent = Utils.formatMinutesSeconds(displayMinutes, displaySeconds);
        
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
        const elapsed = (timestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = timestamp;
        
        // 更新剩余时间
        this.remainingSeconds = Math.max(0, this.remainingSeconds - elapsed);
        
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