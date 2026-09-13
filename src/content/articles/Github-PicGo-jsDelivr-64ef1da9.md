---
title: "Github+PicGo+jsDelivr"
created: "2025-08-02"
description: "图床搭建 Github+PicGo+jsDelivr"
tags: ["图床"]
published: true
---



<blockquote class="blockquote-center" style="background-color: #e0f7fa
; padding: 16px; border-left: 5px solid #ccc; border-radius: 8px; text-align: center; font-style: italic; color: #333;">Life is not what you have gained, but what you have done !</blockquote>


# 🤣前言

> 在搭建博客之后，紧接着需要去寻找好用的云端图床工具了🤣，网上搜罗了一堆免费、收费的图床工具，遍布国内外众多大小作坊，现成的云端图床，限制众多，这里就不多说了，当然，自己折腾完的，也不能什么图都可以传哈，博客都折腾完了，图床看来还是有必要折腾一下下的，毕竟属于自己的才是最DIY，最nice的，😄

<aside>
💡 世上最重要的事，不在于我们在何处，而在于我们朝着什么方向走

</aside>

# 😝图床是什么**？**

<aside>
❇️ 图床用于储存图片的


- 网站、APP的所有图片都是储存在服务器，然后获得图片地址，就能把图片显示出来。一个大的网站，或者发展久了，服务器就会储存非常多的图片，也是一笔不小的经费，加上每张图片都有访问的请求，都会被占用服务器的流量或cdn流量。
  在这里推荐一个聚合图床，聚合百度、腾讯、阿里、bilibili、中关村、今日头条、网易、搜狐、58同城、小米、360等众多互联网公司的图床，减缓自己服务器的压力和节省开支，免费使用：里客云 - 聚合图床 - 图片上传工具 - 图片外链获取
- 传个人图片，并可以分享

好的解决方案：博客页面放在github，图片在阿里云 oss，虽然oss按流量收费，但是便宜又快，一个月也就几毛钱，等同免费

</aside>

# 🧐准备工作

<aside>
❇️ Github 账号


那么在正式开始之前，你需要提前准备以下东西：

一个 Github 账号

好了，就这么简单，只要你有一个 Github 账号就够了，你就能拥有一个免费的图床了，如果你还没有，那赶紧去一个吧

</aside>

# 😋**搭建过程**

### 1. 创建一个新的仓库

登录你的 Github 之后，创建一个新的仓库, 确保仓库为 `public` 其他的保持默认就好

![](https://cdn.jsdelivr.net/gh/xsoway/xsoway_pic_db@master/%E5%9B%BE%E5%BA%8A1.png)

### 2. **上传图片**

下载客户端 

[PicGo](https://molunerfinn.com/PicGo/)

![](https://cdn.jsdelivr.net/gh/xsoway/xsoway_pic_db@master/%E5%9B%BE%E5%BA%8A2.png)

### 3. Github 创建一个 token

```markdown
`Settings -> Developer settings -> Personal access tokens`，最后点击 `generate new token`

填写相关信息及勾选repo，然后点击 `Genetate token` 即可

`token` 生成，注意它只会显示一次，所以你最好把它复制下来到你的备忘录存好，方便下次使用，否则下次有需要重新新建；
```

### 4. PicGo配置

![](https://cdn.jsdelivr.net/gh/xsoway/xsoway_pic_db@master/%E5%9B%BE%E5%BA%8A3.png)

- 图床配置名：自定义名字
- 设定仓库名：github新建的仓库名 [github.com/XXX/XXX](http://github.com/XXX/XXX)      只填写 [/XXX/XXX](http://github.com/XXX/XXX)
- 设定分支名： main
- 设定token: 步聚3中的token
- 设定自定义域名：[https://cdn.jsdelivr.net/gh/XXX/XXX@main](https://cdn.jsdelivr.net/gh/xsoway/xmylog_imgs@main)    （[/XXX/XXX](http://github.com/XXX/XXX) 为仓库名）（CDN加速访问）

<aside>
💡 CDN加速访问
**使用 jsDelivr CDN 加速 Github 仓库的图片，以作为博客的图床**


sDelivr 是国外的一家优秀的公共 CDN 服务提供商，也是首个「打通中国大陆（网宿公司运营）与海外的免费 CDN 服务」。jsDelivr 有一个十分好用的功能——**它可以加速 Github 仓库的文件**。我们可以借此搭建一个免费、全球访问速度超快的图床。

**声明：静态文件主要是缓存在 jsDelivr 的 CDN 节点上，确保 GitHub 承受最小的负载，并且你还可以从 GitHub 仓库获得快速简便的静态文件托管。**

其中：

- `gh` 表示来自 Github 的仓库
- `joeyliu6/Blogger` 仓库的具体位置
- `master` 仓库的分支
  </aside>

### 5. 上传图片

![](https://cdn.jsdelivr.net/gh/xsoway/xsoway_pic_db@master/%E5%9B%BE%E5%BA%8A4.png)

### 6. 在相册中选中图片，点击复制链接，进行使用

![](https://cdn.jsdelivr.net/gh/xsoway/xsoway_pic_db@master/%E5%9B%BE%E5%BA%8A5-20250925085556603.png)

# 图床推荐

[最全的图床集合（国内外，站长必备）](https://zhuanlan.zhihu.com/p/58863378)

---

<aside>
🎒 离开乏味的皮囊，自由的灵魂在路上

</aside>