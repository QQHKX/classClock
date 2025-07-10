/**
 * 时钟模式
 * 负责显示当前时间，使用requestAnimationFrame实现高效更新
 */

const Clock = {
    // 元素引用
    element: null,
    
    // 动画帧请求ID
    animationFrameId: null,
    
    /**
     * 初始化时钟模式
     */
    init: function() {
        this.element = document.getElementById('clock');
        
        // 初始化时立即更新一次时间
        this.updateTime();
    },
    
    /**
     * 更新时间显示
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