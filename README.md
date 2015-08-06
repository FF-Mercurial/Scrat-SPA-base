# Scrat SPA base

an SPA demo for [Scrat](http://scrat.io)

# 设计文档

## 功能

用于展示爬虫数据的web前端(内容暂定为[煎蛋无聊图](http://jandan.net/pic)), 另外提供赞/踩和评论功能

- UI功能
    - 精选: 根据赞/踩数量计算的热门内容,上拉/下拉随机换页(换一批)
    - 最新: 按时间倒序, 上拉更新到最新, 下拉查看更多
    - 以上两个列表页只展示第一张图片(gif显示preview)和第一行文字(如果有), 详见原型图
    - 详情页: 显示全文, 带comment-box
        - 评论列表用"查看更多"分页    
        - 评论可以赞, 按赞的数目计算"神吐槽"展示在顶部
- 其他
    - SPA模式, 有页面切换和history
    
## 界面原型图
![](https://raw.github.com/FF-Mercurial/scrat-demo-webapp-base/doc/prototypes/list.png)
![](https://raw.github.com/FF-Mercurial/scrat-demo-webapp-base/doc/prototypes/detail-content.png)
![](https://raw.github.com/FF-Mercurial/scrat-demo-webapp-base/doc/prototypes/detail-comment.png)

## 技术实现

- router&history
    - router: 采用[page.js](https://github.com/visionmedia/page.js)作为SPA router lib
    - 页面切换: 每个页面渲染出一个DOM tree, 切换页面时将主文档的内容部分(#container)替换为相应的DOM tree,
    - DOM history, 手动维护一个page map记录history页面的DOM, 达到保留现场的效果
- view rendering
    - [Handlebars.js](https://github.com/wycats/handlebars.js/) with Scrat __inline
- 组件划分
    - 每个页面作为一个特殊组件(顶级容器)
    - header: 包含标题和两个tab按钮(精选&最新)
    - framework: 公用页面框架, 包含header
    - post-bottom: 卡片底栏, 包含赞/踩/评论
    - post-preview: 预览卡片, 包含预览图片/文字和post-bottom
    - post-detail: 详情卡片, 包含全部内容和post-bottom
    - post-list: post-preview的容器, 管理post的加载
    - comment: 包含评论内容和赞/评论按钮
    - comment-box: comment的容器, 管理comment的加载, 还包含一个输入框
    - msg-bar: 浮动消息条(已经更新到最新/换了一波)

## 主要覆盖到的Scrat功能

- 资源嵌入(前端模板)
- 组件化开发(路径映射&js模块机制)
- css sprite等隐式性能优化

## 内置的基础库

- [Zepto.js](https://github.com/madrobby/zepto): DOM operations(jquery-like)
- [page.js](https://github.com/visionmedia/page.js): router for SPA
- [Handlebars.js](https://github.com/wycats/handlebars.js/): frontend template engine
