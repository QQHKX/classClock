/**
 * 主应用逻辑
 * 负责初始化各个模式、管理模式切换和控制中心显示
 */

const App = {
    // 元素引用
    appElement: null,
    hudElement: null,
    modeButtons: null,
    fullscreenButtons: null,
    
    // 当前模式
    currentMode: 'clock',
    
    // 模式对象引用
    modes: {
        clock: Clock,
        countdown: Countdown,
        stopwatch: Stopwatch
    },
    
    // 自动隐藏计时器ID
    autoHideTimerId: null,
    
    // 自动隐藏延迟（毫秒）
    autoHideDelay: 8000,
    
    /**
     * 初始化应用
     * @returns {Promise<void>} 返回Promise，表示应用初始化完成
     */
    init: async function() {
        // 获取DOM元素
        this.appElement = document.getElementById('app');
        this.hudElement = document.getElementById('hud');
        this.modeButtons = document.querySelectorAll('.mode-btn');
        this.fullscreenButtons = document.querySelectorAll('#fullscreen-btn, #countdown-fullscreen, #stopwatch-fullscreen');
        
        // 预加载音频资源
        this.preloadAudioResources();
        
        // 初始化各个模式（时钟模式需要异步加载主题）
        await Clock.init();
        Countdown.init();
        Stopwatch.init();
        
        // 绑定事件
        this.bindEvents();
        
        // 激活默认模式
        this.switchMode(this.currentMode);
    },
    
    /**
     * 预加载音频资源
     * @returns {void} 无返回值
     */
    preloadAudioResources: function() {
        // 预加载倒计时结束音效
        Utils.audioCache.preloadAudio('ding.mp3', 'ding-sound')
            .then(() => {
                console.log('音频资源预加载完成');
            })
            .catch(error => {
                console.error('音频资源预加载失败:', error);
            });
    },
    
    /**
     * 绑定事件处理函数
     * @returns {void} 无返回值
     */
    bindEvents: function() {
        // 点击屏幕显示控制中心
        Utils.addEvent(this.appElement, 'click', (e) => {
            // 如果点击的是控制中心内的元素，不处理
            if (e.target.closest('#hud') && !e.target.closest('#time-display')) {
                this.resetAutoHideTimer();
                return;
            }
            
            // 如果控制中心已显示，且点击的是时间显示区域，则隐藏控制中心
            if (this.hudElement.classList.contains('active') && e.target.closest('#time-display')) {
                this.hideHUD();
                return;
            }
            
            // 否则显示控制中心
            this.showHUD();
        });
        
        // 模式切换按钮
        this.modeButtons.forEach(button => {
            Utils.addEvent(button, 'click', () => {
                const mode = button.dataset.mode;
                this.switchMode(mode);
                this.resetAutoHideTimer();
            });
        });
        
        // 全屏切换按钮
        this.fullscreenButtons.forEach(button => {
            Utils.addEvent(button, 'click', () => {
                Utils.toggleFullscreen();
                this.resetAutoHideTimer();
            });
        });
        
        // 监听全屏变化，更新按钮图标
        document.addEventListener('fullscreenchange', () => {
            this.updateFullscreenButtons();
        });
    },
    
    /**
     * 切换应用模式
     * @param {string} mode - 模式名称（'clock', 'countdown', 'stopwatch'）
     * @returns {void} 无返回值
     */
    switchMode: function(mode) {
        if (!this.modes[mode] || mode === this.currentMode) return;
        
        // 停用当前模式
        if (this.modes[this.currentMode]) {
            this.modes[this.currentMode].deactivate();
        }
        
        // 更新当前模式
        this.currentMode = mode;
        
        // 激活新模式
        this.modes[mode].activate();
        
        // 更新模式按钮状态
        this.updateModeButtons();
        
        // 更新控制栏
        this.updateControlBar();
    },
    
    /**
     * 更新模式按钮状态
     * @returns {void} 无返回值
     */
    updateModeButtons: function() {
        this.modeButtons.forEach(button => {
            const isActive = button.dataset.mode === this.currentMode;
            Utils.toggleActive(button, isActive);
        });
    },
    
    /**
     * 更新控制栏显示
     * @returns {void} 无返回值
     */
    updateControlBar: function() {
        const controls = document.querySelectorAll('.controls');
        controls.forEach(control => {
            const id = control.id;
            const isActive = id === `${this.currentMode}-controls`;
            Utils.toggleActive(control, isActive);
        });
    },
    
    /**
     * 更新全屏按钮图标
     * @returns {void} 无返回值
     */
    updateFullscreenButtons: function() {
        const isFullscreen = !!document.fullscreenElement;
        const iconId = isFullscreen ? '#minimize' : '#maximize';
        
        this.fullscreenButtons.forEach(button => {
            const iconElement = button.querySelector('svg use');
            if (iconElement) {
                iconElement.setAttribute('href', iconId);
            }
        });
    },
    
    /**
     * 显示控制中心 (HUD)
     * @returns {void} 无返回值
     */
    showHUD: function() {
        Utils.toggleActive(this.hudElement, true);
        this.resetAutoHideTimer();
    },
    
    /**
     * 隐藏控制中心 (HUD)
     * @returns {void} 无返回值
     */
    hideHUD: function() {
        Utils.toggleActive(this.hudElement, false);
        Utils.clearAutoHideTimer(this.autoHideTimerId);
        this.autoHideTimerId = null;
    },
    
    /**
     * 重置自动隐藏计时器
     * @returns {void} 无返回值
     */
    resetAutoHideTimer: function() {
        Utils.clearAutoHideTimer(this.autoHideTimerId);
        this.autoHideTimerId = Utils.setAutoHideTimer(() => {
            this.hideHUD();
        }, this.autoHideDelay);
    }
};

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await App.init();
        console.log('应用初始化完成');
    } catch (error) {
        console.error('应用初始化失败:', error);
    }
});