# 图标文件说明

此文件夹用于存放应用所需的图标文件。

## 当前实现

应用目前使用内联SVG图标，通过SVG Sprites技术在HTML中直接定义图标，无需外部图标文件。这种方法的优点是：

1. 减少HTTP请求
2. 允许通过CSS控制图标颜色
3. 确保图标在任何尺寸下都清晰显示

## 使用的图标

应用使用的图标基于 [Feather Icons](https://feathericons.com/) 风格，包括：

- `play` - 开始/继续按钮
- `pause` - 暂停按钮
- `rotate-cw` - 重置按钮
- `maximize` / `minimize` - 全屏/退出全屏按钮
- `plus` - 增加时间按钮
- `minus` - 减少时间按钮

## 自定义图标（可选）

如果您想使用外部图标文件而不是内联SVG，可以：

1. 从 [Feather Icons](https://feathericons.com/) 下载所需图标的SVG文件
2. 将SVG文件放置在此文件夹中
3. 修改 `index.html` 文件，将内联SVG替换为外部SVG引用

例如，将：

```html
<svg class="feather"><use href="#play"/></svg>
```

替换为：

```html
<img src="assets/icons/play.svg" alt="Play" class="feather">
```

然后在CSS中添加适当的样式以确保图标显示正确。

## 其他图标库

如果您想使用不同风格的图标，以下是一些推荐的图标库：

1. [Material Icons](https://material.io/resources/icons/)
2. [Font Awesome](https://fontawesome.com/)
3. [Ionicons](https://ionicons.com/)
4. [Heroicons](https://heroicons.com/)

请确保选择的图标与应用的极简设计理念相符。