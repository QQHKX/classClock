# 字体文件说明

此文件夹用于存放应用所需的字体文件。

## 推荐字体

应用默认使用Google Fonts提供的在线字体：

1. **Roboto Mono** - 用于数字显示
   - 等宽字体，确保数字宽度一致，避免时间跳动时的视觉抖动
   - 使用字重：Regular (400) 和 Medium (500)

2. **Inter** - 用于UI文字
   - 现代、简洁的无衬线字体，易读性高
   - 使用字重：Light (300) 和 Regular (400)

## 本地字体（可选）

如果您希望应用在离线环境下使用，或者想要更快的加载速度，可以下载字体文件并放置在此文件夹中，然后修改 `styles/variables.css` 文件中的字体引用路径。

### 获取字体文件

1. **Roboto Mono**：
   - 可从 [Google Fonts](https://fonts.google.com/specimen/Roboto+Mono) 下载
   - 需要的变体：Regular (400) 和 Medium (500)

2. **Inter**：
   - 可从 [Google Fonts](https://fonts.google.com/specimen/Inter) 下载
   - 需要的变体：Light (300) 和 Regular (400)

### 使用本地字体

下载字体后，将字体文件放在此文件夹中，然后在 `styles/variables.css` 文件中修改字体定义：

```css
:root {
    /* 字体规范 */
    --font-primary: 'Roboto Mono', monospace; /* 数字字体 - 等宽 */
    --font-ui: 'Inter', 'Helvetica Neue', sans-serif; /* UI文字字体 */
    
    /* 其他变量... */
}
```

并在 `index.html` 中添加字体声明：

```css
@font-face {
    font-family: 'Roboto Mono';
    src: url('assets/fonts/RobotoMono-Regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
}

@font-face {
    font-family: 'Roboto Mono';
    src: url('assets/fonts/RobotoMono-Medium.woff2') format('woff2');
    font-weight: 500;
    font-style: normal;
}

/* 添加Inter字体的声明... */
```