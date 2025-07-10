/**
 * 秒表模式
 * 负责秒表功能，包括开始、暂停和重置
 */

const Stopwatch = {
    // 元素引用
    element: null,
    millisecondsElement: null,
    startButton: null,
    resetButton: null,
    
    // 状态变量
    isRunning: false,
    startTime: 0,
    elapsedTime: 0,
    
    // 动画帧请求ID
    animationFrameId: null,
    
    /**
     * 初始化秒表模式
     */
    init: function() {
        // 获取DOM元素
        this.element = document.getElementById('stopwatch');
        this.millisecondsElement = this.element.querySelector('.milliseconds');
        this.startButton = document.getElementById('stopwatch-start');
        this.resetButton = document.getElementById('stopwatch-reset');
        
        // 绑定事件
        this.bindEvents();
        
        // 初始化显示
        this.updateDisplay();
    },
    
    /**
     * 绑定事件处理函数
     */
    bindEvents: function() {
        // 开始/暂停按钮
        Utils.addEvent(this.startButton, 'click', () => this.toggleStopwatch());
        
        // 重置按钮
        Utils.addEvent(this.resetButton, 'click', () => this.reset());
    },
    
    /**
     * 更新秒表显示
     */
    updateDisplay: function() {
        // 计算分钟、秒和毫秒
        const totalSeconds = Math.floor(this.elapsedTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((this.elapsedTime % 1000) / 10);
        
        // 更新主显示（分:秒）
        this.element.childNodes[0].nodeValue = Utils.formatMinutesSeconds(minutes, seconds);
        
        // 更新毫秒显示
        this.millisecondsElement.textContent = Utils.formatTwoDigits(milliseconds);
    },
    
    /**
     * 切换秒表状态（开始/暂停）
     */
    toggleStopwatch: function() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    },
    
    /**
     * 开始秒表
     */
    start: function() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        
        // 记录开始时间，考虑已经经过的时间
        this.startTime = performance.now() - this.elapsedTime;
        
        // 更新按钮文本和图标
        this.startButton.querySelector('span').textContent = '暂停';
        this.startButton.querySelector('svg use').setAttribute('href', '#pause');
        
        // 开始动画帧循环
        this.animationFrameId = requestAnimationFrame(this.update.bind(this));
    },
    
    /**
     * 暂停秒表
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
     * 重置秒表
     */
    reset: function() {
        this.pause();
        this.elapsedTime = 0;
        this.updateDisplay();
        
        // 更新按钮文本
        this.startButton.querySelector('span').textContent = '开始';
    },
    
    /**
     * 更新秒表（动画帧回调）
     */
    update: function() {
        if (!this.isRunning) return;
        
        // 计算经过的时间
        this.elapsedTime = performance.now() - this.startTime;
        
        // 更新显示
        this.updateDisplay();
        
        // 继续动画帧循环
        this.animationFrameId = requestAnimationFrame(this.update.bind(this));
    },
    
    /**
     * 激活秒表模式
     */
    activate: function() {
        Utils.toggleActive(this.element, true);
    },
    
    /**
     * 停用秒表模式
     */
    deactivate: function() {
        Utils.toggleActive(this.element, false);
        
        // 如果正在运行，暂停秒表
        if (this.isRunning) {
            this.pause();
        }
    }
};