---
title: "ghostty终端工具,主题,配置文件设置备份"
created: "2025-07-30"
description: "ghostty终端工具,主题,配置文件设置备份"
tags: ["配置文件"]
category: "终端工具"
published: true
---



<blockquote class="blockquote-center" style="background-color: #e0f7fa
; padding: 16px; border-left: 5px solid #ccc; border-radius: 8px; text-align: center; font-style: italic; color: #333;">Life is not what you have gained, but what you have done !</blockquote>
```yaml
# This is the configuration file for Ghostty.
#
# This template file has been automatically created at the following
# path since Ghostty couldn't find any existing config files on your system:
#
#   [本机路径已隐藏] Support/com.mitchellh.ghostty/config
#
# The template does not set any default options, since Ghostty ships
# with sensible defaults for all options. Users should only need to set
# options that they want to change from the default.
#
# Run `ghostty +show-config --default --docs` to view a list of
# all available config options and their default values.
#
# Additionally, each config option is also explained in detail
# on Ghostty's website, at https://ghostty.org/docs/config.

# Config syntax crash course
# ==========================
# # The config file consists of simple key-value pairs,
# # separated by equals signs.
# font-family = Iosevka
# window-padding-x = 2
#
# # Spacing around the equals sign does not matter.
# # All of these are identical:
# key=value
# key= value
# key =value
# key = value
#
# # Any line beginning with a # is a comment. It's not possible to put
# # a comment after a config option, since it would be interpreted as a
# # part of the value. For example, this will have a value of "#123abc":
# background = #123abc
#
# # Empty values are used to reset config keys to default.
# key =
#
# # Some config options have unique syntaxes for their value,
# # which is explained in the docs for that config option.
# # Just for example:
# resize-overlay-duration = 4s 200ms



# 字体设置
font-family = BlexMono Nerd Font Mono
font-size = 16

# 主题和样式
theme = Gruvbox Dark Hard
cursor-style = block
adjust-cell-height = 35%


# 鼠标相关
mouse-hide-while-typing = true
mouse-scroll-multiplier = 2

# macOS 特定
# macos-titlebar-style = hidden

# 窗口设置
window-padding-balance = true
window-save-state = always
window-colorspace = "display-p3"

# 颜色设置
background = 1C2021





# 外观
#theme = tokyonight-storm
background-opacity = 0.75
background-blur-radius = 40
font-family = VictorMono NFM
font-size = 16
cursor-style = block
cursor-style-blink = false
cursor-invert-fg-bg = true
mouse-hide-while-typing = true

# macOS 专属设置
macos-titlebar-style = tabs
macos-option-as-alt = true

# 窗口控制
confirm-close-surface = true
window-title-font-family = VictorMono NFM Italic
window-decoration = true
window-padding-x = 2
window-padding-y = 2
window-padding-balance = true
window-save-state = always

# 自动更新设置
auto-update = download
auto-update-channel = stable

# 附加功能
shell-integration-features = true
copy-on-select = clipboard
focus-follows-mouse = true
link-url = true

# 自定义快捷键
keybind = super+r=reload_config
keybind = super+i=inspector:toggle
keybind = super+f=toggle_fullscreen
keybind = super+left=previous_tab
keybind = super+right=next_tab

# 快速终端 (全局快捷键)
keybind = global:super+grave_accent=toggle_quick_terminal

# tmux 风格的前缀控制快捷键
keybind = super+b>x=close_surface
keybind = super+b>c=new_tab
keybind = super+b>n=new_window
keybind = super+b>f=toggle_fullscreen

# 标签页导航
keybind = super+b>1=goto_tab:1
keybind = super+b>2=goto_tab:2
keybind = super+b>3=goto_tab:3
keybind = super+b>4=goto_tab:4
keybind = super+b>5=goto_tab:5
keybind = super+b>6=goto_tab:6
keybind = super+b>7=goto_tab:7
keybind = super+b>8=goto_tab:8
keybind = super+b>9=goto_tab:9

# 分割
keybind = super+b>\=new_split:right
keybind = super+b>-=new_split:down
keybind = super+b>e=equalize_splits
keybind = super+b>z=toggle_split_zoom

# 分割导航
keybind = super+b>h=goto_split:left
keybind = super+b>j=goto_split:bottom
keybind = super+b>k=goto_split:top
keybind = super+b>l=goto_split:right
keybind = super+b>left=goto_split:left
keybind = super+b>down=goto_split:bottom
keybind = super+b>up=goto_split:top
keybind = super+b>right=goto_split:right
```

