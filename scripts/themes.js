/**
 * 主题管理模块
 * 负责处理所有主题相关的功能，包括主题切换、特效管理等
 */

const ThemeManager = {
    // 当前主题
    currentTheme: 'minimal',
    
    // 已加载的主题CSS文件缓存
    loadedThemes: new Set(['minimal']), // 极简主题默认已加载
    
    // 主题CSS文件映射
    themeFiles: {
        'light': 'styles/themes/dark.css',
        'colorful': 'styles/themes/colorful.css'
        // 'minimal' 主题使用内联样式，无需加载文件
    },
    

    
    /**
     * 初始化主题管理器
     * @returns {Promise<void>} 返回Promise，表示初始化完成
     */
    init: async function() {
        // 加载保存的主题
        await this.loadTheme();
    },
    
    /**
     * 选择主题
     * @param {string} theme - 主题名称
     * @returns {Promise<void>} 返回Promise，表示主题应用完成
     */
    selectTheme: async function(theme) {
        try {
            await this.applyTheme(theme);
            this.currentTheme = theme;
            this.saveTheme();
            this.updateThemeSelection();
        } catch (error) {
            console.error('主题选择失败:', error);
            this.fallbackToMinimal();
        }
    },
    
    /**
     * 更新主题选择状态
     * @returns {void} 无返回值
     */
    updateThemeSelection: function() {
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(button => {
            const isActive = button.dataset.theme === this.currentTheme;
            Utils.toggleActive(button, isActive);
        });
    },
    
    /**
     * 应用主题
     * @param {string} theme - 主题名称
     * @returns {Promise<void>} 返回Promise，表示主题应用完成
     */
    applyTheme: async function(theme) {
        // 验证主题名称
        if (!['minimal', 'light', 'colorful'].includes(theme)) {
            throw new Error(`无效的主题名称: ${theme}`);
        }
        
        // 如果不是极简主题且未加载过，则加载CSS文件
        if (theme !== 'minimal' && !this.loadedThemes.has(theme)) {
            try {
                await this.loadThemeCSS(theme);
            } catch (error) {
                console.error(`主题 '${theme}' 加载失败:`, error);
                throw error;
            }
        }
        
        // 移除所有主题类
        document.body.classList.remove('theme-minimal', 'theme-light', 'theme-colorful');
        
        // 添加新主题类
        document.body.classList.add(`theme-${theme}`);
        

        
        console.log(`主题已切换到: ${theme}`);
    },
    
    /**
     * 动态加载主题CSS文件
     * @param {string} theme - 主题名称
     * @returns {Promise<void>} 返回Promise，表示CSS加载完成
     */
    loadThemeCSS: function(theme) {
        return new Promise((resolve, reject) => {
            // 检查主题文件是否存在
            if (!this.themeFiles[theme]) {
                reject(new Error(`未找到主题 '${theme}' 的CSS文件配置`));
                return;
            }
            
            // 创建link元素
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = this.themeFiles[theme];
            link.id = `theme-${theme}-css`;
            
            // 设置加载成功回调
            link.onload = () => {
                this.loadedThemes.add(theme);
                console.log(`主题CSS文件 '${theme}' 加载成功`);
                resolve();
            };
            
            // 设置加载失败回调
            link.onerror = () => {
                reject(new Error(`主题CSS文件 '${theme}' 加载失败`));
            };
            
            // 添加到head中
            document.head.appendChild(link);
        });
    },
    
    /**
     * 回退到极简主题
     * @returns {void} 无返回值
     */
    fallbackToMinimal: function() {
        // 移除所有主题类
        document.body.classList.remove('theme-minimal', 'theme-light', 'theme-colorful');
        // 添加极简主题类
        document.body.classList.add('theme-minimal');
        // 更新当前主题
        this.currentTheme = 'minimal';
        // 停止星空特效

        // 更新UI状态
        this.updateThemeSelection();
        console.log('已回退到极简主题');
    },
    
    /**
     * 保存主题到本地存储
     * @returns {void} 无返回值
     */
    saveTheme: function() {
        try {
            localStorage.setItem('clockTheme', this.currentTheme);
        } catch (e) {
            console.warn('无法保存主题设置:', e);
        }
    },
    
    /**
     * 从本地存储加载主题
     * @returns {Promise<void>} 返回Promise，表示主题加载完成
     */
    loadTheme: async function() {
        try {
            const savedTheme = localStorage.getItem('clockTheme');
            if (savedTheme && ['minimal', 'light', 'colorful'].includes(savedTheme)) {
                await this.selectTheme(savedTheme);
            } else {
                // 如果没有保存的主题，应用默认的极简主题
                await this.selectTheme('minimal');
            }
        } catch (e) {
            console.warn('无法加载主题设置:', e);
            // 出错时也应用默认主题
            this.fallbackToMinimal();
        }
    },
    
    /**
     * 创建流星效果（星空主题专用）
     * @returns {void} 无返回值
     */

};