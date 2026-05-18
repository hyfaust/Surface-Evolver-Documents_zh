# The Surface Evolver 文档（中文翻译版）

[English](README.md) | [简体中文](README_zh.md)

---

> 本仓库为 [The Surface Evolver](http://www.susqu.edu/brakke/evolver/evolver.htm) 的中文翻译文档集——一款由 Kenneth A. Brakke 开发的交互式程序，用于研究由表面张力和其他能量塑造的曲面。使用MiMo-V2.5-Pro进行翻译

## 目录

- [简介](#简介)
- [项目结构](#项目结构)
- [文档概览](#文档概览)
- [示例数据文件](#示例数据文件)
- [相关资源](#相关资源)

## 简介

Surface Evolver 是一款交互式程序，用于研究由[表面张力](http://www.susqu.edu/brakke/evolver/energies.htm)和其他能量塑造、并受各种[约束](http://www.susqu.edu/brakke/evolver/constrnt.htm)影响的曲面。曲面被实现为单纯复形（三角形的集合）。用户在数据文件中定义初始曲面，Evolver 通过梯度下降法将曲面演化至最小能量状态。

主要功能：

- 表面张力、重力势能、平均曲率平方、用户定义的曲面积分及纽结能量
- 任意拓扑结构（如真实肥皂泡簇）、体积约束、边界约束、接触角、规定平均曲率、结晶被积函数和重力
- 曲面可存在于任意维度的环境空间中，支持黎曼度量和群作用下的商空间
- 图形输出支持屏幕显示和多种文件格式，包括 PostScript

本仓库包含 Surface Evolver 2.70 版的**中文翻译文档**，包括基于 HTML 的参考文档和 Markdown 格式的完整手册翻译。

## 项目结构

```
The Surface Evolver/
├── Surface Evolver manual/      # 完整手册中文翻译（Markdown 格式）
│   ├── ch01-04_*.md             # 第1–4章：简介、安装、教程、几何元素
│   ├── ch05-06_*.md             # 第5–6章：表面模型、数据文件
│   ├── ch07-10_*.md             # 第7–10章：语法、内部变量、单字母命令、开关
│   ├── ch11-16_*.md             # 第11–16章：命令、脚本、操作、图形、命名量、技术参考
│   ├── ch17-21_*.md             # 第17–21章：杂项、提示、缺陷、历史、参考文献
│   └── README.md                # 手册目录与来源信息
├── default.htm / evolver.htm    # HTML 文档主入口
├── intro.htm                    # Surface Evolver 概述
├── install.htm                  # 安装说明
├── tutorial.htm                 # 教程与示例
├── elements.htm                 # 几何元素与属性
├── model.htm                    # 表面模型
├── energies.htm                 # 能量类型
├── constrnt.htm                 # 约束与边界
├── quants.htm                   # 命名量与方法
├── syntax.htm                   # 语言语法
├── datafile.htm                 # 数据文件格式
├── commands.htm                 # 命令语言
├── graphics.htm                 # 图形与显示
├── general.htm                  # 常规选项、错误处理、中断执行
├── eigentut.htm                 # Hessian 矩阵、特征值与特征向量教程
├── hints.htm                    # 实用提示
├── debugging.htm                # 调试指南
├── profiling.htm                # 性能分析
├── mpi_evolver.htm              # MPI 并行 Evolver
├── biblio.htm                   # 参考文献
├── index.htm / index.html       # 文档索引
├── news_01.htm – news_22.htm    # 版本历史与更新日志（22个文件）
├── *.fe                         # Evolver 示例数据文件
├── *.gif                        # 教程图片与示意图
└── evhelp.txt                   # 快速帮助文本
```

## 文档概览

文档分为两种格式：

### HTML 文档（`*.htm`）

文档主体部分，源自 Surface Evolver 官方发行版，已翻译为中文。涵盖内容如下：

| 主题 | 文件 | 说明 |
|------|------|------|
| 概述 | `intro.htm` | 程序介绍与应用领域 |
| 安装 | `install.htm` | Unix/Linux、Windows、macOS 安装指南 |
| 教程 | `tutorial.htm`、`catenoid.htm`、`mound.htm`、`column.htm`、`cube.htm`、`twointor.htm`、`nnn.htm`、`ringblob.htm` | 带示例的分步教程 |
| 参考手册 | `elements.htm`、`model.htm`、`energies.htm`、`constrnt.htm`、`quants.htm`、`syntax.htm`、`datafile.htm`、`commands.htm` | 完整的语言与数据文件参考 |
| 高级主题 | `eigentut.htm`、`graphics.htm`、`general.htm`、`debugging.htm`、`profiling.htm`、`mpi_evolver.htm` | Hessian 分析、图形、调试、性能分析、MPI |
| 历史版本 | `news_01.htm` – `news_22.htm` | 版本历史与更新日志 |
| 参考文献 | `biblio.htm` | 学术参考文献 |

### Markdown 手册（`Surface Evolver manual`）

以 Markdown 格式翻译的完整手册，按章节组织：

| 文件 | 章节 | 内容 |
|------|------|------|
| `ch01-04_*.md` | 第1–4章 | 简介、安装、教程、几何元素 |
| `ch05-06_*.md` | 第5–6章 | 表面模型、数据文件 |
| `ch07-10_*.md` | 第7–10章 | 语法、内部变量、单字母命令、开关 |
| `ch11-16_*.md` | 第11–16章 | 命令、脚本、操作、图形、命名量、技术参考 |
| `ch17-21_*.md` | 第17–21章 | 杂项、提示、缺陷、历史、参考文献 |

## 示例数据文件

本仓库包含 Surface Evolver 示例数据文件（`.fe` 扩展名，代表 "facet-edge"，即 Evolver 中表面的内部结构）：

| 文件 | 说明 |
|------|------|
| `column.fe` | 计算以偏斜悬链面形状的焊料液柱所产生的作用力 |
| `addload_example.fe` | 演示 `addload` 命令，用于加载同一表面的多个副本并设置不同参数 |

## 相关资源

- **Surface Evolver 官方主页**：[Surface Evolver](https://kenbrakke.com/evolver/evolver.html)
- **原版PDF 手册**：[manual270](https://kenbrakke.com/evolver/downloads/manual270.pdf)
- **作者**：[Kenneth A. Brakke](https://kenbrakke.com/default.htm)，萨斯奎哈纳大学数学系

