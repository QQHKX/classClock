/**
 * 时钟模式
 * 负责显示当前时间，使用requestAnimationFrame实现高效更新
 */

const Clock = {
    // 元素引用
    element: null,
    modal: null,
    confirmButton: null,
    themeButtons: null,
    
    // 动画帧请求ID
    animationFrameId: null,
    

    
    /**
     * 初始化时钟模式
     * @returns {Promise<void>} 返回Promise，表示初始化完成
     */
    init: async function() {
        this.element = document.getElementById('clock');
        this.modal = document.getElementById('clock-settings-modal');
        this.confirmButton = document.getElementById('clock-settings-confirm');
        this.themeButtons = document.querySelectorAll('.theme-btn');
        
        // 绑定事件
        this.bindEvents();
        
        // 初始化时立即更新一次时间
        this.updateTime();
        
        // 初始化主题管理器
        await ThemeManager.init();
    },
    
    /**
     * 绑定事件处理函数
     * @returns {void} 无返回值
     */
    bindEvents: function() {
        // 双击时钟显示打开设置模态框
        Utils.addEvent(this.element, 'dblclick', () => {
            this.openModal();
        });
        
        // 确认按钮
        Utils.addEvent(this.confirmButton, 'click', () => this.confirmSettings());
        
        // 主题按钮
        this.themeButtons.forEach(button => {
            Utils.addEvent(button, 'click', async () => {
                const theme = button.dataset.theme;
                await ThemeManager.selectTheme(theme);
            });
        });
    },
    
    /**
     * 打开设置模态框
     * @returns {void} 无返回值
     */
    openModal: function() {
        Utils.toggleActive(this.modal, true);
        
        // 更新主题选择状态
        ThemeManager.updateThemeSelection();
    },
    
    /**
     * 关闭设置模态框
     * @returns {void} 无返回值
     */
    closeModal: function() {
        Utils.toggleActive(this.modal, false);
    },
    
    /**
     * 确认设置并关闭模态框
     * @returns {void} 无返回值
     */
    confirmSettings: function() {
        this.closeModal();
    },
     

    
    /**
     * 更新时间显示
     * @returns {void} 无返回值
     */
    updateTime: function() {
        const now = new Date();
        const timeString = Utils.formatTime(now);
        
        // 更新DOM
        if (this.element) {
            this.element.textContent = timeString;
        }
        
        // 使用requestAnimationFrame持续更新
        this.animationFrameId = requestAnimationFrame(() => this.updateTime());
    },
    
    /**
     * 激活时钟模式
     * @returns {void} 无返回值
     */
    activate: function() {
        // 确保时钟元素可见
        Utils.toggleActive(this.element, true);
        
        // 开始更新时间
        if (!this.animationFrameId) {
            this.updateTime();
        }
    },
    
    /**
     * 停用时钟模式
     * @returns {void} 无返回值
     */
    deactivate: function() {
        // 隐藏时钟元素
        Utils.toggleActive(this.element, false);
        
        // 停止更新时间
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
    }
};