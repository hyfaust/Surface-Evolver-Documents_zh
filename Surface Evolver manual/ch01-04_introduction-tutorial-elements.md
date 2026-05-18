# 第1章 引言 (Introduction)

## 1.1 总体描述 (General description)

Surface Evolver 是一个交互式程序，用于研究由表面张力 (surface tension) 和其他能量所决定的表面形状。表面以单纯复形 (simplicial complex) 的方式实现，即三角形的并集。用户在数据文件 (datafile) 中定义一个初始表面。Evolver 通过梯度下降法 (gradient descent method) 将表面演化至最小能量状态。这种演化是按平均曲率 (mean curvature) 演化过程的计算机模型，该过程在 [B1] 中以变分法 (varifolds) 和几何测度论 (geometric measure theory) 的框架下对表面张力能量进行了研究。Evolver 中的能量可以是表面张力、重力势能 (gravitational energy)、平均曲率的平方、用户自定义的表面积分或纽结能量 (knot energies) 的组合。Evolver 能够处理任意拓扑结构（如真实肥皂泡群中所见）、体积约束 (volume constraints)、边界约束 (boundary constraints)、边界接触角 (boundary contact angles)、规定平均曲率 (prescribed mean curvature)、晶面积分 (crystalline integrands)、重力以及以表面积分形式表达的约束条件。表面可以位于任意维度的环境空间 (ambient space) 中，该空间可以具有黎曼度量 (Riemannian metric)，也可以是群作用下的商空间 (quotient space)。用户可以交互式地修改表面，以改变其性质或使演化保持良好行为。Evolver 最初是为一维和二维表面编写的，但也能处理更高维度的表面，只是某些功能会受到限制。图形输出支持屏幕显示以及多种文件格式，包括 PostScript。

Surface Evolver 程序可免费获取（见第 2 章），目前已被众多研究者使用。迄今为止 Evolver 的一些应用包括：模拟火箭燃料箱中燃料在低重力下的形状 [Te]、计算不透明立方体问题 (Opaque Cube Problem) 的面积 [B4][B6]、计算立方体中的毛细曲面 (capillary surfaces) [MH] 和特殊容器中的毛细曲面 [C]、模拟晶粒生长 (grain growth) [FT][WM]、研究被夹杂物钉扎的晶界 (grain boundaries)、寻找比 Kelvin 四角十四面体 (tetrakaidecahedra) 更高效的空间分割 [WP][KS1]、计算泡沫的流变学 (rheology of foams) [KR1][KR2]、模拟微电路上熔融焊料的形状 [RSB]、研究聚合物链堆积 (polymer chain packing)、模拟细胞膜 (cell membranes) [MB]、纽结能量 [KS2]、球面翻转 (sphere eversion) [FS] 以及分类极小曲面 (minimal surface) 奇点。

Surface Evolver 程序的优势在于其处理问题的广度，而非对某个特定问题的最优处理。程序仍在持续开发中，欢迎用户提出新功能建议。本手册包含操作细节和数学描述（请原谅不一致的字体和格式；手册是逐步积累而成的）。手册中不包含大量数学公式的部分也以 HTML 格式包含在发行包中。Evolver 的期刊介绍见 [B2]。Evolver 的老用户请查阅历史 (History) 章节了解新功能。

## 1.2 可移植性 (Portability)

Evolver 使用可移植的 C 语言编写，已在多种系统上运行：Microsoft Windows、Linux、Unix 和 Macintosh。它旨在易于移植到任何拥有 C 编译器的系统。程序可以 32 位或 64 位编译。

## 1.3 错误报告 (Bug reports)

错误报告应通过电子邮件发送至 brakke@susqu.edu。请包括 Evolver 版本号、问题描述、初始数据文件以及重现问题所必需的命令序列。

## 1.4 网页主页 (Web home page)

作者的网页主页是 http://www.susqu.edu/brakke，Evolver 页面是 http://www.susqu.edu/brakke/evolver。Evolver 相关资料和链接将在那里发布，特别是包含大量表面示例。

## 1.5 通讯 (Newsletter)

Surface Evolver 用户群体已足够庞大，作者已开始发布通讯。通讯内容主要包括新 Evolver 版本的公告。如果您希望加入邮件列表，请将您的电子邮件地址发送至 brakke@susqu.edu。往期通讯已包含在发行包的 HTML 部分中。

## 1.6 致谢 (Acknowledgements)

Evolver 最初是作为几何超级计算项目 (Geometry Supercomputing Project)（现为几何中心 (The Geometry Center)）最小曲面小组的一部分编写的，由美国国家科学基金会 (National Science Foundation)、能源部 (Department of Energy)、Minnesota Technology, Inc. 和明尼苏达大学 (University of Minnesota) 赞助。程序可免费使用。

---

# 第2章 安装 (Installation)

本章介绍如何获取和安装 Evolver。Evolver 编写时考虑了跨系统可移植性。Windows 和 Macintosh 有预编译版本；Unix/Linux 系统提供源代码文件和 Makefile。

各系统的发行包可从以下地址获取：

http://www.susqu.edu/brakke/evolver/evolver.html

每个发行包还包含文档、示例数据文件和脚本。文档子目录名为 `doc`，包含 PDF 格式的手册、文档的 HTML 版本（数学部分除外）、Evolver 帮助命令使用的文本文件以及简要说明。示例位于子目录 `fe` 中（这是作者用于数据文件的文件扩展名，代表 "facet-edge"，即 Evolver 中表面的内部结构）。

本手册的 PostScript 格式可单独从以下地址下载：

http://www.susqu.edu/brakke/evolver/manual250.ps

PDF 格式可从以下地址下载：

http://www.susqu.edu/brakke/evolver/manual250.pdf

PDF 版本已包含在标准 Evolver 发行包中。

HTML 手册可在线阅读：

http://www.susqu.edu/brakke/evolver/html/default.htm

## 2.1 Microsoft Windows

### 2.1.1 现代图形界面安装 (Modern GUI installation)

此处提供的发行包包含 32 位版本的 Evolver（`evolver.exe`）和 64 位版本（`evolver64.exe`）。64 位版本适用于非常大的模型（数十万个面）。除非您有如此大的表面，否则请使用 32 位版本，因为它需要移动的数据更少，速度快 10% 到 20%。

文件 http://www.susqu.edu/brakke/aux/downloads/Evolver-2.50-Win32.msi 是一个图形安装程序，将引导您完成安装过程。它会自动设置下述环境变量。

### 2.1.2 传统手动安装 (Old-fashioned installation by hand)

文件 http://www.susqu.edu/brakke/aux/downloads/evolver250-Win32.zip 包含可执行文件 `evolver.exe`、`evolver64.exe` 以及文档和示例数据文件子目录。创建一个目录（例如 `C:\evolver`），并将发行包解压到那里。您可以将 `evolver.exe` 留在那里并将 `C:\evolver` 添加到 PATH，或者将 `evolver.exe` 复制到 PATH 中的某个位置，例如 `C:\windows\system32`。

您还应该创建一个环境变量 EVOLVERPATH，告诉 Evolver 在哪里搜索各种文件。方法是打开"控制面板/系统/高级/环境变量"，在"系统变量"下点击"新建"，输入 EVOLVERPATH 作为变量名，输入 `c:\evolver\fe;c:\evolver\doc` 作为变量值。如果您愿意，可以在此列表中添加更多路径。

要使 Evolver 在您点击 `*.fe` 文件时自动启动，可以将 Evolver 与文件扩展名 `.fe` 关联：打开"我的电脑/工具/文件夹选项/文件类型/新建"，输入文件扩展名 `fe`，点击"确定"，点击"更改"，然后浏览找到 `evolver.exe` 程序。（此操作顺序在不同 Windows 版本中可能有所不同。）

Windows 版本使用 OpenGL/GLUT 图形。OpenGL 在 Windows 中是标准的，所有必要的 GLUT 组件都包含在可执行文件中，因此您无需安装任何额外内容。

## 2.2 Macintosh

作者不是 Mac 专家，仅了解足够将 Evolver 最小移植到 Mac 的知识，因此没有 Mac 特有的花哨功能。

Mac OSX 版本位于 http://www.susqu.edu/brakke/aux/downloads/Evolver250-OSX.tar.gz。下载并解压后，您可能会得到一个 `Evolver250-OSX` 文件夹，其中包含可执行文件 `Evolver`、示例文件夹 `fe` 和文档文件夹 `doc`。您可以将可执行文件移动到 PATH 中的某个位置，或将该文件夹添加到 PATH。您还应该创建环境变量 EVOLVERPATH，包含 `fe` 和 `doc` 文件夹的路径，方法是在 `.tcshrc` 文件中添加以下行（需适当修改）：

```
setenv EVOLVERPATH /User/yourname/Evolver250-OSX/fe:/User/yourname/Evolver250-OSX/doc
```

此版本源自 Unix 版本，而非 Mac OS 9 版本，因此您必须从终端窗口运行它。它使用 OpenGL GLUT 图形，这在 OSX 中是标准的。

## 2.3 Unix/Linux

程序以压缩 tar 文件 `evolver-2.50.tar.gz` 发行（适用于 Unix 系统；其他系统见下文）。将此文件下载到工作目录。用以下命令解压：

```
gunzip evolver-2.50.tar.gz
```

用以下命令提取文件：

```
tar xvf evolver.tar
```

这将解压为三个子目录：`src`（源代码）、`doc`（手册）和 `fe`（示例数据文件）。压缩包约 2MB，解压后约 5MB。编译可能还需要另外 3 或 4 MB 空间。编译说明见下文。

Evolver 需要找到初始数据文件，有时还需要其他文件（例如 `read` 命令的命令文件，或 HTML 版本的手册）。如果文件不在当前目录中，则会查询名为 EVOLVERPATH 的环境变量以获取目录搜索列表。数据文件目录和包含 HTML 文件的文档目录应包含在内。格式与通常的 PATH 变量相同。按常规方式在系统中设置：

Unix C shell：

```
setenv EVOLVERPATH /usr/you/evolver/fe:/usr/you/evolver/doc
```

Bourne shell：

```
EVOLVERPATH=/usr/you/evolver/fe:/usr/you/evolver/doc
export EVOLVERPATH
```

### 2.3.1 编译 (Compiling)

首先，您需要为您的系统修改 `Makefile`。Makefile 开头是针对各种系统的宏定义集。如果您的系统已列出，请删除定义开头的注释符号 `#`。如果您的系统未列出，请使用 GENERIC 定义，或自行设置。如果您的系统有 OpenGL/GLUT，则保留图形文件为 `glutgraph.o`；如果有 X-Windows，则使用 `xgraph.o`；否则使用 `nulgraph.o`。如果您自行定义系统，请确保在 `include.h` 中添加相应的部分。在获得可运行的程序后，如果您无法使用所提供的图形界面，可以编写自己的屏幕图形界面。编辑 CFLAGS 以包含适当的选项（优化、浮点选项等）。GRAPH 应为屏幕图形界面文件的名称。GRAPHLIB 应为相应的图形库加上任何其他需要的库。检查所有路径并根据您的系统进行必要的更改。

GLUT 图形使用单独的线程来显示图形，因此如果使用 GLUT，必须使用 `-DPTHREADS` 编译，并在 GRAPHLIB 中加入 `-lpthread`。

如果您希望 Evolver 能够使用 geomview，请在 CFLAGS 中包含 `-DOOGL`。

如果您希望使用基于 METIS 分区软件的命令（`metis`、`kmetis` 和 `metis_factor`），则应从以下地址下载 METIS 包：

http://www-users.cs.umn.edu/~karypis/metis/

并 "make" 库 `libmetis.a`（在某些系统上，make 会抱怨找不到 ranlib，但生成的 `libmetis.a` 仍然可用）。在 Evolver 的 Makefile 中，向 CFLAGS 添加 `-DMETIS`，向 GRAPHLIB 添加 `-lmetis`。您可能还需要向 GRAPHLIB 添加 `-Lpath` 以告诉链接器在哪里找到 `libmetis.a`。请注意，METIS 已包含在 Windows 可执行文件中。如果您在非常大的表面上使用 hessian 命令，那么 `metis_factor` 可能比 Evolver 中的其他稀疏矩阵分解方案快得多，作者强烈推荐使用它。

如果您希望 Evolver 在比默认最大值 4 更高的空间维度 n 中运行，请在 CFLAGS 中包含 `-DMAXCOORD=n`。这设置了维度的上限，用于在数据结构中分配空间。您可以使用 `-DMAXCOORD=3` 来节省一点内存。

如果您的系统支持 `long double` 数据类型，可以通过在 CFLAGS 中编译 `-DLONGDOUBLE` 来以更高精度计算。这应该只被精度狂热者使用。而且在 Intel 芯片上，即使分配了 128 位存储，它也只做 80 位精度，因为这是 8087 数学协处理器的硬件精度。要获得 128 位精度（软件实现，因此慢得多），请使用 `cf -DFLOAT128` 编译并链接 quadmath 库（您需要自行找到它）。

您可以通过编译器选项 `-DSDIM=n` 将空间维度硬编码到代码中，从而让编译器更好地优化，其中 n 是所需的空间维度。但这样的 Evolver 只能处理给定的空间维度，不多不少。

具有多个处理器的 Silicon Graphics 系统可以通过在 CFLAGS 中包含 `-DSGI_MULTI` 来编译一个版本，该版本将使用所有处理器进行某些计算。此版本在单处理器上也能正常运行。目前，唯一并行执行的计算是"命名量 (named quantities)"。实际并行执行的进程数可以通过命令行选项 `-pn` 控制。

文件 `include.h` 列出了各种系统的包含文件。如果您的系统未列出，您将需要自行添加。尝试复制通用列表（或其他列表之一）并编译。您的编译器无疑会非常友好和乐于助人地指出未找到的头文件。

`include.h` 还包含各种其他系统特定的定义。请参阅 GENERIC 部分的注释，并为您的系统包含适当的定义。

现在尝试运行 make 进行编译。希望您只需更改 Makefile 和 `include.h` 中的系统特定部分即可使程序工作。如果需要对其他文件进行重大更改，请告知作者。例如，`sprintf()` 的返回值在不同系统间有所不同，这曾经导致过问题。

通过在 `cube.fe` 示例文件上运行进行测试，如教程 (Tutorial) 章节所述。

## 2.4 Geomview 图形 (Geomview graphics)

Evolver 内置了 OpenGL/GLUT 图形，可在大多数当前系统上运行，但也可以在 Unix 系统上使用外部 Geomview 程序。Geomview 可从 http://www.geomview.org 获取。对于已为 Geomview 定义表面的用户，Geomview 的 OFF 格式文件可以通过 Polymerge 程序转换为 Evolver 的数据文件格式，该程序包含在 Geomview 发行包中。使用 `-b` 选项。其他 Geomview 格式的文件可以通过 `anytooff`（也包含在 Geomview 中）转换为 OFF 格式。

## 2.5 X-Windows 图形 (X-Windows graphics)

有一个非常原始的 X-Windows 图形界面，如果出于某种原因 OpenGL 无法工作，可以在 Unix 系统上使用。要让 Evolver 使用 X-Windows 图形作为其原生图形，请编辑 Makefile，将图形模块设为 `xgraph.o`，并链接所有必要的库。当您执行 `s` 命令时，X 窗口将出现。Evolver 不会持续轮询窗口重绘事件，因此如果您移动或调整窗口大小，将需要再次执行 `s` 来重绘表面。

# 第3章 教程 (Tutorial)

本章介绍一些基本概念，然后引导用户完成一系列示例。Evolver 附带的示例数据文件并非全部在此讨论；用户可以在空闲时浏览它们。本章可以在后续章节之前阅读。后续章节假设您已经阅读了本章的基本概念部分。如果您对高等微积分 (Advanced Calculus) 有些生疏，本章末尾有一个简短的教程。

## 3.1 基本概念 (Basic Concepts)

用于表示表面的基本几何元素 (geometric elements) 是顶点 (vertices)、边 (edges)、面 (facets) 和体 (bodies)。顶点是欧几里得三维空间中的点。边是连接一对顶点的直线段。面是由三条边围成的平坦三角形。表面是面的并集。（实际上，程序中没有单独的表面实体；所有面本质上属于一个逻辑表面。）体由其边界面定义。

术语"表面"用于指代 Evolver 所操作的实体时，包括所有几何元素加上辅助数据，如约束 (constraints)、边界 (boundaries) 和力 (forces)。

对多少条边可以共享一个顶点以及多少个面可以共享一条边没有限制。因此任意拓扑结构都是可能的，包括肥皂膜特有的表面三重交汇 (triple junctions)。

边和面为记账目的而定向，但对相邻面的方向没有限制。因此无定向表面也是可能的。

表面被认为具有总能量，来源于表面张力、重力势能，可能还有其他来源。Evolver 最小化的就是这个能量。

程序不使用特定的度量单位，只处理数值。如果您希望将程序值与现实世界关联，则所有值应在同一个一致的系统中，如 cgs 或 MKS 制。

初始表面在文本文件（以下称为数据文件）中指定，可以用任何标准文本编辑器创建。（我一直使用的 `.fe` 扩展名代表 "facet-edge"，指的是用于表示表面的内部数据结构。您可以为数据文件使用任何名称。）

Evolver 的基本操作是读取数据文件并接受用户命令。主命令提示符为：

```
Enter command:
```

基本命令是单个字母（区分大小写），有时带有数值参数。最常用的命令有：

| 命令 | 说明 |
|------|------|
| `gn` | 执行 n 次迭代 |
| `s` | 在屏幕上显示表面（或 geomview 的 P 选项 8） |
| `r` | 细化表面的三角剖分 |
| `P` | 图形输出（选项 3 为 PostScript） |
| `q` | 退出 |

还有更复杂的命令语言（此时不区分大小写）。命令必须后跟回车键；Evolver 只读取完整的行。

一次迭代 (iteration) 是一个演化步骤。步骤的运动按如下方式计算：首先，从表面总能量关于该顶点位置的梯度计算每个顶点上的力 (force)。力给出运动方向。其次，使力符合所有适用的约束。第三，通过将力乘以一个全局比例因子 (scale factor) 得到实际运动。

## 3.2 示例 1. 立方体演化为球体 (Example 1. Cube evolving into a sphere)

示例数据文件 `cube.fe` 随 Evolver 一起提供。初始表面是一个单位立方体。表面围住一个体，该体被约束为体积为 1。没有重力或除表面张力之外的任何其他力。因此最小能量表面将是一个球体。此示例说明了基本数据文件格式和一些基本命令。

让我们看一下指定初始单位立方体的数据文件：

```
// cube.fe
// Evolver data for cube of prescribed volume.

vertices /* given by coordinates */
1 0.0 0.0 0.0
2 1.0 0.0 0.0
3 1.0 1.0 0.0
4 0.0 1.0 0.0
5 0.0 0.0 1.0
6 1.0 0.0 1.0
7 1.0 1.0 1.0
8 0.0 1.0 1.0

edges /* given by endpoints */
1 1 2
2 2 3
3 3 4
4 4 1
5 5 6
6 6 7
7 7 8
8 8 5
9 1 5
10 2 6
11 3 7
12 4 8

faces /* given by oriented edge loop */
1 1 10 -5 -9
2 2 11 -6 -10
3 3 12 -7 -11
4 4 9 -8 -12
5 5 6 7 8
6 -4 -3 -2 -1

bodies /* one body, defined by its oriented faces */
1 1 2 3 4 5 6 volume 1
```

数据文件按行组织，每行定义一个几何元素。顶点必须首先定义，然后是边、面，最后是体。每个元素都有编号，供数据文件中后续引用。

注释用 `/* */` 界定（如 C 语言），或跟在 `//` 后直到行尾（如 C++）。大小写不重要，所有输入立即转换为小写。因此关于数据文件的错误消息将引用小写项目，即使您输入的是大写。

数据文件语法基于关键字 (keywords)。关键字 `VERTICES`、`EDGES`、`FACES` 和 `BODIES` 标示各部分的开始。注意面不一定是三角形（这就是为什么它们被称为 FACES 而不是 FACETS）。任何非三角形面将通过在其中心放置一个顶点并连接到每个原始顶点来自动三角化。面不必是平面的。注意边上的负号意味着该边按与其在 EDGES 部分中定义的相反方向遍历。面的定向法线按通常的右手定则定义。立方体的所有面都有向外的法线，因此它们在体列表中都是正的。在定义体时，边界面必须具有向外的法线。如果面定义时具有向内的法线，则必须在列表中以负号列出。

体被约束为体积为 1 由体定义之后的关键字 `VOLUME` 指示，后跟体积值。元素具有的任何属性或性质都在其定义之后的同一行给出。

启动 Evolver 并用以下命令行加载数据文件：

```
evolver cube.fe
```

您应该得到提示符 `Enter command:`。给出命令 `s` 来显示表面。您应该看到一个被对角线分成四个三角形的正方形。这是立方体的前面；您沿着正 x 轴方向看，z 轴垂直，正 y 轴向右。在大多数系统上，您可以用鼠标操作显示的表面：按住左键拖动鼠标旋转表面；按 `z` 键切换到"缩放"模式，按 `t` 切换到"平移"，按 `c` 切换到"旋转"，按 `r` 返回"旋转"。在图形窗口中按 `h` 键可获得所有可能性的摘要。您也可以在图形命令提示符下给出图形命令；这对精确控制很有用。图形命令提示符为 `Graphics command:`。它接受字母字符串，每个字母对表面进行一个视图变换。最常用的有：

| 命令 | 说明 |
|------|------|
| `r` | 向右旋转 6 度 |
| `l` | 向左旋转 6 度 |
| `u` | 向上旋转 6 度 |
| `d` | 向下旋转 6 度 |
| `R` | 重置到原始位置 |
| `q` | 退出回主命令提示符 |

尝试 `rrdd` 获得立方体的斜视图。您所做的任何变换在下次显示表面时仍将保持有效。然后做 `q` 回到主提示符。

现在做一些迭代。给出命令 `g 5` 做 5 次迭代。您应该得到如下输出：

```
 5. area: 5.11442065156005 energy: 5.11442065156005 scale: 0.186828
 4. area: 5.11237323810972 energy: 5.11237323810972 scale: 0.21885
 3. area: 5.11249312304592 energy: 5.11249312304592 scale: 0.204012
 2. area: 5.11249312772740 energy: 5.11249312772740 scale: 0.20398
 1. area: 5.11249312772740 energy: 5.11249312772740 scale: 0.554771
```

注意每次迭代后打印一行，包含迭代倒计数、面积 (area)、能量 (energy) 和当前比例因子 (scale factor)。默认情况下，Evolver 寻求最优比例因子以最小化能量。最初运动较大，体积约束可能不会精确满足。由于体积约束的作用，能量可能会增加。体积约束不是精确强制执行的，但每次迭代都会使体积更接近目标值。您可以用 `v` 命令查找当前体积：

```
Body   target volume         actual volume   pressure
 1 1.000000000000000          0.999999779366360 3.408026016427987
```

最后一列的压力 (pressure) 实际上是体积约束的拉格朗日乘子 (Lagrange multiplier)。现在用 `r` 命令细化三角剖分。这将每个面细分为四个更小的相似面。此处的打印输出给出了几何元素的计数和它们占用的内存：

```
Vertices: 50  Edges: 144  Facets: 96  Facetedges: 288  Memory: 27554
```

再迭代 10 次。您会注意到面积不断减小，表面越来越接近球体。最终您将想要退出。给出 `q` 命令。您会得到提示：

```
Enter new datafile name (none to continue, q to quit):
```

您可以通过输入数据文件名来启动新表面，或按回车键继续当前表面，或再输入 `q` 真正退出。

## 3.3 示例 2. 带重力的液滴 (Example 2. Mound with gravity)

此示例是一个液体液滴 (mound) 放置在桌面上并在重力作用下的情况。液滴表面与桌面之间的接触角 (contact angle) 是可调的，以模拟液体润湿桌面的不同程度。此示例说明了宏 (macros)、变量 (variables)、带能量的约束 (constraints with energy) 以及从体表面中省略面 (omitting faces from body surfaces)。

液滴从一个底面在桌面上（z = 0 平面）的立方体开始。指定接触角最直接的方法是声明面 6 被约束保持在桌面上，并赋予它不同于默认值 1 的表面张力。但这会导致下面描述的问题。处理接触角的方式是省略面 6，并给面 6 周围的边一个能量积分，其结果与我们包含面 6 时得到的能量相同。

我选择将接触角参数化为桌面与液滴内部表面之间的角度（以度为单位）。此角度可以通过在运行时为变量 `angle` 赋值来调整。

数据文件 `mound.fe`：

```
// mound.fe
// Evolver data for drop of prescribed volume sitting on plane with gravity.
// Contact angle with plane can be varied.

PARAMETER angle = 90         // interior angle between plane and surface, degrees

#define T (-cos(angle*pi/180)) // virtual tension of facet on plane

constraint 1 /* the table top */
formula: x3 = 0
energy: // for contact angle
e1: -T*y
e2: 0
e3: 0

vertices
1 0.0 0.0 0.0 constraint 1 /* 4 vertices on plane */
2 1.0 0.0 0.0 constraint 1
3 1.0 1.0 0.0 constraint 1
4 0.0 1.0 0.0 constraint 1
5 0.0 0.0 1.0
6 1.0 0.0 1.0
7 1.0 1.0 1.0
8 0.0 1.0 1.0
9 2.0 2.0 0.0 fixed /* for table top */
10 2.0 -1.0 0.0 fixed
11 -1.0 -1.0 0.0 fixed
12 -1.0 2.0 0.0 fixed

edges /* given by endpoints and attribute */
1 1 2 constraint 1 /* 4 edges on plane */
2 2 3 constraint 1
3 3 4 constraint 1
4 4 1 constraint 1
5 5 6
6 6 7
7 7 8
8 8 5
9 1 5
10 2 6
11 3 7
12 4 8
13 9 10 fixed /* for table top */
14 10 11 fixed
15 11 12 fixed
16 12 9 fixed

faces /* given by oriented edge loop */
1 1 10 -5 -9
2 2 11 -6 -10
3 3 12 -7 -11
4 4 9 -8 -12
5 5 6 7 8
7 13 14 15 16 density 0 fixed /* table top for display */

bodies /* one body, defined by its oriented faces */
1 1 2 3 4 5 volume 1 density 1
```

液滴基本上是从 `cube.fe` 复制的，但删除了面 6。原因是面 6 不需要，实际上还会妨碍。它对体积计算不需要，因为它总是在 z = 0，因此对体积的表面积分没有贡献。侧面面的底边被约束位于平面 z = 0 中，因此不需要面 6 来防止它们灾难性地收缩。

现在在 `mound.fe` 上运行 Evolver。细化并迭代一段时间。您应该得到一个漂亮的液滴。它不是半球体，因为默认情况下重力是开启的且 G = 1。如果您使用 `G` 命令设置 `G 0` 并迭代一段时间，您会得到半球体。尝试改变接触角，例如 45 度（用命令 `angle := 45`）或 135 度。您还可以改变重力。做 `G 10` 得到扁平的液滴，或 `G -5` 得到从天花板悬挂的液滴。

## 3.4 示例 3. 悬链面 (Example 3. Catenoid)

悬链面 (catenoid) 是在两个不太远的环之间形成的极小曲面 (minimal surface)。在柱坐标中，其方程为 r = (1/a) cosh(az)。在 `cat.fe` 中，上环和下环都作为单参数边界线 (one-parameter boundary wires) 给出。分离距离和半径是参数，因此您可以在运行时用 `A` 命令更改它们。给定的初始半径是给定环间距下悬链面存在的最小半径。要获得稳定的悬链面，您需要增大此值。

初始表面由六个矩形组成，在两个圆之间形成一个圆柱体。边界上的顶点是固定的，否则它们会沿着边界滑动以缩短曲率；两个直径比一个圆周短。

悬链面数据文件：

```
// cat.fe
// Evolver data for catenoid.

PARAMETER RMAX = 1.5088795 // minimum radius for height
PARAMETER ZMAX = 1.0

boundary 1 parameters 1         // upper ring
x1: RMAX * cos(p1)
x2: RMAX * sin(p1)
x3: ZMAX

boundary 2 parameters 1         // lower ring
x1: RMAX * cos(p1)
x2: RMAX * sin(p1)
x3: -ZMAX

vertices // given in terms of boundary parameter
1 0.00 boundary 1 fixed
2 pi/3 boundary 1 fixed
3 2*pi/3 boundary 1 fixed
4 pi boundary 1 fixed
5 4*pi/3 boundary 1 fixed
6 5*pi/3 boundary 1 fixed
7 0.00 boundary 2 fixed
8 pi/3 boundary 2 fixed
9 2*pi/3 boundary 2 fixed
10 pi boundary 2 fixed
11 4*pi/3 boundary 2 fixed
12 5*pi/3 boundary 2 fixed

edges
1 1 2 boundary 1 fixed
2 2 3 boundary 1 fixed
3 3 4 boundary 1 fixed
4 4 5 boundary 1 fixed
5 5 6 boundary 1 fixed
6 6 1 boundary 1 fixed
7 7 8 boundary 2 fixed
8 8 9 boundary 2 fixed
9 9 10 boundary 2 fixed
10 10 11 boundary 2 fixed
11 11 12 boundary 2 fixed
12 12 7 boundary 2 fixed
13 1 7
14 2 8
15 3 9
16 4 10
17 5 11
18 6 12

faces
1 1 14 -7 -13
2 2 15 -8 -14
3 3 16 -9 -15
4 4 17 -10 -16
5 5 18 -11 -17
6 6 13 -12 -18
```

边界定义中的参数始终是 P1（在双参数边界中是 P2）。Evolver 可以处理周期参数化，如此示例中所做的那样。

尝试以下命令序列（在方便时显示）：

| 命令 | 说明 |
|------|------|
| `r` | 细化以获得粗糙但可用的三角剖分 |
| `u` | 等角化使三角剖分更好 |
| `g 120` | 需要这么多次迭代才能使颈部塌缩 |
| `t` | 通过消除所有短于 0.05 的边来将颈部塌缩为单个顶点 |
| `0.05` | 输入阈值 |
| `o` | 分裂颈部顶点以分离上下表面 |
| `g` | 尖刺塌缩 |

悬链面展示了一些演化的微妙之处。假设初始半径设置为 RMAX = 1.0，初始高度为 ZMAX = 0.55。使用优化比例因子进行 50 次迭代后，面积为 6.458483。此时每次迭代仅减少面积 0.0000001，三角形都几乎等边，一切看起来都很好，天真的用户可能会认为表面已非常接近其最小值。但这实际上是能量的鞍点 (saddle point)。进一步迭代表明，每次迭代的面积变化在第 70 次左右降到最低，到第 300 次迭代时面积降到 6.4336。

演化可以通过用 `U` 命令开启共轭梯度法 (conjugate gradient method) 来加速。

## 3.5 示例 4. 环面分割为两个单元 (Example 4. Torus partitioned into two cells)

此示例具有平坦的三环面 (3-torus)（即周期性边界条件），分为两个体。单元晶格 (unit cell) 是一个单位立方体，表面具有 Kelvin 将空间分割为四角十四面体 (tetrakaidecahedra) [TW] 的拓扑结构。数据文件通过为每个方向指定边是正向环绕 (+)、负向环绕 (-) 还是不环绕 (*) 来处理边在环面中的环绕。

环面中表面的显示可以用几种方式完成。`connected` 命令（我最喜欢的）将每个体显示为单个单元。`clipped` 命令显示裁剪到基本平行六面体 (fundamental parallelpiped) 的表面。`raw_cells` 命令显示未编辑的表面。

Weaire-Phelan 结构 [WP] 在数据文件 `phelanc.fe` 中。它比 Kelvin 的面积少 0.3%。

```
// twointor.fe
// Two Kelvin tetrakaidecahedra in a torus.

TORUS_FILLED

periods
1.000000 0.000000 0.000000
0.000000 1.000000 0.000000
0.000000 0.000000 1.000000

vertices
1 0.499733 0.015302 0.792314
2 0.270081 0.015548 0.500199
3 0.026251 0.264043 0.500458
4 0.755123 0.015258 0.499302
5 0.026509 0.499036 0.794636
6 0.500631 0.015486 0.293622
7 0.025918 0.750639 0.499952
8 0.499627 0.251759 0.087858
9 0.256701 0.499113 0.087842
10 0.026281 0.500286 0.292918
11 0.500693 0.765009 0.086526
12 0.770240 0.499837 0.087382

edges
1 1 2 ***
2 2 3 ***
3 1 4 ***
4 3 5 ***
5 2 6 ***
6 2 7 *-*
7 1 8 **+
8 4 6 ***
9 5 9 **+
10 3 10 * * *
11 3 4 - * *
12 6 8 * * *
13 6 11 * - *
14 7 4 - + *
15 8 12 * * *
16 9 8 * * *
17 9 11 * * *
18 10 7 * * *
19 11 1 * + -
20 12 5 + * -
21 5 7 * * *
22 11 12 * * *
23 10 12 - * *
24 9 10 * * *

faces
1 1 2 4 9 16 -7
2 -2 5 12 -16 24 -10
3 -4 10 18 -21
4 7 15 20 -4 11 -3
5 -1 3 8 -5
6 6 14 -11 -2
7 5 13 -17 24 18 -6
8 -12 13 19 7
9 -16 17 22 -15
10 -10 11 8 12 15 -23
11 -21 9 17 19 1 6
12 -14 -18 23 -22 -13 -8
13 -24 -9 -20 -23
14 -19 22 20 21 14 -3

bodies
1 -1 -2 -3 -4 -5 9 7 11 -9 10 12 5 14 3 volume 0.500
2 2 -6 -7 8 -10 -12 -11 -13 1 13 -14 6 4 -8 volume 0.500
```

做一些细化和迭代将显示最优形状略有弯曲。

## 3.6 示例 5. 吸管内的薄膜 (Example 5. Film inside a tube)

此示例展示了一个恰好拟合在圆柱体内的表面。表面是一个朝外的气泡 (bubble) 压在管壁上，但也可以是一个凸起的膜或悬链面 (catenoid)。几何元素被约束在圆柱体上。演示了 `SHOW` 语法、`CLIP` 命令和二面角能 (dihedral energy)。

```
// tube.fe
// soap film on inside of cylinder, with dihedral angle energy

#define RADIUS 1
#define PI  3.14159
PARAMETER wall_energy = 0

constraint 1  /* cylinder */
formula:  x^2 + y^2 = RADIUS^2

READ // show a view clipped by x > 0

vertices
1   0.0   0.0  0.0    /* center of top */
2   0.0   0.0 -1.0    /* center of bottom */
3   RADIUS   0.0  0.0   constraint 1
4   0.0   RADIUS  0.0   constraint 1
5   -RADIUS  0.0  0.0   constraint 1
6   0.0  -RADIUS  0.0   constraint 1
7   RADIUS   0.0 -1.0   constraint 1
8   0.0   RADIUS -1.0   constraint 1
9   -RADIUS  0.0 -1.0   constraint 1
10   0.0  -RADIUS -1.0   constraint 1

edges
1   1  3  constraint 1
2   1  4  constraint 1
3   1  5  constraint 1
4   1  6  constraint 1
5   2  7  constraint 1
6   2  8  constraint 1
7   2  9  constraint 1
8   2  10  constraint 1
9   3  4  constraint 1
10   4  5  constraint 1
11   5  6  constraint 1
12   6  3  constraint 1
13   7  8  constraint 1
14   8  9  constraint 1
15   9  10  constraint 1
16   10  7  constraint 1

faces
1   1  9  -2     dihedral 0.001  energy wall_energy*x
2   2  10  -3    dihedral 0.001  energy wall_energy*x
3   3  11  -4    dihedral 0.001  energy wall_energy*x
4   4  12  -1    dihedral 0.001  energy wall_energy*x
5   5  13  -6    dihedral 0.001  energy wall_energy*x
6   6  14  -7    dihedral 0.001  energy wall_energy*x
7   7  15  -8    dihedral 0.001  energy wall_energy*x
8   8  16  -5    dihedral 0.001  energy wall_energy*x
9   -1  -2  -3  -4
10   5  6  7  8
```

在数据文件中，`READ` 命令后跟包含 Evolver 命令的行，并在输入时立即执行。在本例中，我们正在使用它来对程序进行编程。`READ` 只能读取一行输入，其自身在行中只能单独出现。`READ` 命令后面跟的是命令 `show_re where color := white`。完整的命令语法允许使用别名 (aliases) 并可以是规则。接下来的命令将我们设置为在 x > 0 时的颜色显示。`WHERE` 规则修改面的显示，因此只有在 x > 0 的部分会显示。表面本身不受影响。`dihedral` 选项和 `e1:` 项为面 9 和 10 周围的边贡献能量。`dihedral` 值是能量的斜率。这是一个最小二乘问题，因此能量是 k * w * x，其中 k 是我们正在改变的值。像这样设置一个变量，我们可以在演化时进行实验。

## 3.7 示例 6. 液滴 (Example 7. Blob)

这是一个更复杂的演化的示例，表面具有指定的体积和固定的边界。注意 `blob.fe` 如何仅为表面指定部分边界面。在当前演化中，它会绕过鞍点。

```
// blob.fe
// Evolver data for a hanging drop with prescribed volume.
// The drop has a flat top (fixed) and a round bottom.
// This is like the upper half of a balloon with a small neck,
// like a drop of water hanging from the underside of a flat surface.
// Use large display and scl=0.05 for nice display.
// Evolve with g 30;r;g 30;r;g 100;r;g 200;

PARAMETER  rad = 0.49   // radius of neck, 0.5 is ideal sphere
PARAMETER  v = 2.0   // volume of drop
PARAMETER  h0 = 1    // initial height of center
PARAMETER  Xrad = 1.5  // horizontal extent
PARAMETER  segments = 15 // for circles in xz plane
PARAMETER  side = 0   // 0 for bottom, 1 for top
#define  id  if side then 1 else -1

constraint 1  /* drop has a flat top (or bottom) */
formula: x3 = 0

boundary 1  parameters 1
x1:  Xrad*cos(p1)
x2:  Xrad*sin(p1)
x3:  0.0

vertices
1   0.00000   0.00000   id*h0        fixed    /* top center */
2   rad   0   0          constraint 1  /* neck point */
3   -rad   0   0         constraint 1
4   Xrad   0   0         boundary 1    /* outer edge */
5   0   Xrad   0         boundary 1
6   -Xrad   0   0        boundary 1
7   0   -Xrad   0        boundary 1

edges
1   2   3  constraint 1
2   4   5  boundary 1
3   5   6  boundary 1
4   6   7  boundary 1
5   7   4  boundary 1

faces
1   2   3   4   5 constraint 1 density 0

// we use the ellipse command to create more realistic drop shape
read
refine edges where on_boundary
equiangulate
```

另一个技巧是使用 `read` 命令一次执行多行命令，或在文件中放入 `read` 命令，它会回显接下来的命令。尝试运行 `blob.fe` 并查看结果。

## 3.8 示例 7. 立方体，通过演化进行 (Example 8. Cube, evolving way)

如果您从未使用过命令 `r` 来细化表面，您可以仅通过使用 `g` 演化来进行。对于本示例，使用了 `cube.ev`。同样，这种计算不如使用细化那么精确，但它说明了我们可以通过在 cube.ev 中使用约束来以不同方式进行计算。最终表面应该收敛到最优值。

```
// cube.ev
// Evolver data for cube of prescribed volume.

vertices
1   0.0  0.0  0.0
2   1.0  0.0  0.0
3   1.0  1.0  0.0
4   0.0  1.0  0.0
5   0.0  0.0  1.0
6   1.0  0.0  1.0
7   1.0  1.0  1.0
8   0.0  1.0  1.0

edges
1   1  2
2   2  3
3   3  4
4   4  1
5   5  6
6   6  7
7   7  8
8   8  5
9   1  5
10   2  6
11   3  7
12   4  8

faces
1   1  10  -5  -9
2   2  11  -6  -10
3   3  12  -7  -11
4   4  9  -8  -12
5   5  6  7  8
6  -4  -3  -2  -1

bodies
1   1  2  3  4  5  6  volume 1
```

## 3.9 示例 8. 鞍点、最大面积 (Example 9. Saddle, maximal area)

对于本示例，我们将查看表面的鞍点 (saddle points)。Evolver 可以通过添加可移动的顶点来演化鞍点。它也称为极小曲面 (minimal surface)，因为它最小化给定边界的面积。现在，表面将倾向于在负平均曲率 (negative mean curvature) 处达到平衡，因此面积将增加。Evolver 中的命令用于查找鞍点，但您可能需要通过减小比例因子来控制它。`scale_limit` 命令设置迭代中移动的最大距离。运行 `saddle.fe`：

```
// saddle.fe
// saddle-shaped film with 4-fold symmetry, also pseudosymmetry
// about x=0 and y=0 planes.

constraint 1
formula:  x = 0

constraint 2
formula:  y = 0

vertices
1    1    0    0       constraint 1
2    0    1    0       constraint 2
3    0.7   0.7   0.2    constraint 4    /* free vertex */
4    0.5   0.5   0      constraint 1  constraint 2

edges
1   1   4  constraint 1
2   2   4  constraint 2
3   1   3
4   3   2

faces
1   1   3   4   2    /* saddle face */

read
evert
hessian_seek
hessian
```

约束是一个放置在 x = 0 和 y = 0 处的平面。在 x = 0 平面上的顶点被约束为在 x = 0 时保持在 x 方向（其他方向类似）。在鞍点处，尝试演化命令 `g 5` 看看发生了什么。您会注意到面积实际上是增加的。然后使用 `h` 命令重置，然后再次用 `g` 演化。鞍点现在应该位于约束上。

## 3.9.1 哑铃，自相交 (Example 9.1 Dumbbell, self intersecting)

Evolver 擅长处理具有单一轮廓的表面，但有时您希望能够在表面上滑动。哑铃 (dumbbell) 被视为具有两个平行边的环面，中间有一个颈部。假设您希望研究给定体积的哑铃的平衡形状，但您不想自己制作精美的数据文件。您可以让 Evolver 来做。数据文件 `dumbbell.fe` 制作了一个哑铃，它从两个通过隧道连接的球体开始。约束被添加以将哑铃保持在圆柱体内。一个巧妙的技巧是使用两层顶点——一个哑铃顶点层和一个颈部顶点层——并允许两层交互。`dumbbell.fe` 文件中可以定义这些层。

`dumbbell.fe` 文件可以保存为文本文件，然后像前面的示例一样运行。当您运行它时，您将看到一个带有颈部的哑铃。注意每个体都有指定的体积。另请注意，隧道是一个穿过每个球体中心的非常薄的气缸。这导致在每个球体中形成了瓶颈。最后，注意约束被放在整个哑铃上。您需要运行它几次并细化，直到它收敛。

```
// dumbbell.fe
// Evolver data for a self-intersecting dumbbell.
// By J. Sullivan, 1999

// set up parameters
PARAMETER pin = 0.25    // height of pin
PARAMETER pinrad = 0.1   // radius of pin
PARAMETER phirange = pi/4  // angular range of phi
PARAMETER thetarange = pi/4  // angular range of theta
PARAMETER smooth = 0.5   // amount of smoothing
PARAMETER fixlev = 2     // what level to fix the belt

// symmetry group 432 (the octahedral group)
// with (1,1,1) axis at (0,0,1)
// and (1,0,0) axis at (0,-1,0)
// would need both xy and yz reflection to get full group

#define bb  1/sqrt(2)    /* pi/4 */
#define cc  sqrt(2/3)    /* atan(sqrt(2)) */
#define dd  1/sqrt(3)    /* atan(sqrt(2)/2) */
#define ee  sqrt(1/6)

/* some level planes */
constraint 1
formula:  z = 0

constraint 2
formula:  z = pin

constraint 3
formula:  x^2 + y^2 <= pinrad^2

/* antipodal boundary */
boundary 1  parameters 2
x:  sin(p1)*cos(p2)
y:  sin(p1)*sin(p2)
z:  cos(p1)

vertices
1   0   0   1     boundary 1  fixed   /* top */
2   dd   ee   dd   boundary 1  fixed   /* upper ring */
3   dd   ee   dd   boundary 1  fixed
4   dd   ee   -dd   boundary 1  fixed
5   dd   ee   -dd   boundary 1  fixed
6   dd   ee   dd   boundary 1  fixed
7   dd   ee   -dd   boundary 1  fixed
8   0   0   -1    boundary 1  fixed   /* bottom */

edges
1   1   2  boundary 1
2   1   3  boundary 1
3   1   6  boundary 1
4   2   4  boundary 1
5   3   5  boundary 1
6   6   7  boundary 1
7   4   8  boundary 1
8   5   8  boundary 1
9   7   8  boundary 1

faces
1   1   2  -3  -4
2   3   5  -2  -6
3   4   7  -5  -9
4   6   8  -7  -9

bodies
1   1  2  3  4  volume 1  /* centered at origin */

read
refine faces where 1
hessian_seek
```

## 3.9.2 球形储罐 (Example 9.2 Sphere, tank example)

Evolver 有大量内置的命令，但有时您需要的特定功能并不存在。Evolver 允许使用 C 语言的 `do` 循环编写脚本以使用子程序。在此示例中，我们将查看一个球形储罐 (sphere tank) 半满时的体积。脚本使用 `do` 循环来创建一个命令，通过测量其体积来计算球体中液体的深度。

在此计算中，有两个体：一个是气泡 (bubble)，一个是油箱 (tank)。Evolver 中的一个有用命令是 `exec` 命令，它将执行外部程序（附录中有脚本）。脚本文件在 Evolver 中被读取，并创建了 `sphere_ev`，它包含所有用 C 编写的子程序，用于计算和绘制结果。

```
// sphere_fe
// Example 7.2.2

PARAMETER RADIUS = 1
PARAMETER HEIGHT = 0

constraint 1  /* sphere */
formula:  x^2 + y^2 + z^2 = RADIUS^2

constraint 2  /* bottom of sphere */
formula:  z = HEIGHT

vertices
1   RADIUS   0   0   constraint 1  constraint 2
2   0   RADIUS   0   constraint 1  constraint 2
3   -RADIUS   0   0   constraint 1  constraint 2
4   0   -RADIUS   0   constraint 1  constraint 2
5   0   0   RADIUS    constraint 1

edges
1   1   2  constraint 1  constraint 2
2   2   3  constraint 1  constraint 2
3   3   4  constraint 1  constraint 2
4   4   1  constraint 1  constraint 2
5   5   1  constraint 1
6   5   2  constraint 1
7   5   3  constraint 1
8   5   4  constraint 1

faces
1   1   2   3   4   constraint 2
2   -5  1   6
3   -6  2   7
4   -7  3   8
5   -8  4   5

bodies
1   -1   2   3   4   5   volume 0.01

read
refine edges where on_constraint 1
```

在处理此示例之前，请阅读命令 `exec` 的信息。当 Evolver 运行 `sphere_fe` 时，它创建球体几何结构。注意我们在构造中使用了两个约束。约束 1 是球体，约束 2 是 z = 0 平面。这使我们可以轻松地为不同的液体深度设置球体。同时注意，面 1 是一个特殊的面。它是 `constraint 2` 上的一个面，只是一种说法，即此面位于约束 2 上。面 1 是一个特殊面，因为它是一个非三角形面。它是一个正方形，但会自动三角化。接下来，我们使用 `do` 命令来运行一个 C 程序，该程序计算不同填充水平下的体积。Evolver 使用 `do` 循环来迭代。然后使用 `exec` 来运行一个外部程序，该程序绘制结果。

脚本 `sphere_ev` 使用了用户自定义的 C 函数 `fill()`，该函数计算液面高度并返回所需的结果。Evolver 命令 `exec` 将执行外部程序，在本例中是 `sphere_ev` 脚本。它将输出数据到文本文件，然后使用 `plot` 程序创建 PostScript 输出，或使用 gnuplot 程序绘制。

在 `sphere_ev` 中，我们使用了用户定义的 C 函数。在 Evolver 中，`do` 命令使用 C 语法。`while` 语句也使用 C 语法。要终止 C 代码，您需要在单独的行上输入 `}`，然后是 `}`。

在 `sphere_ev` 中使用的一个有用命令是 `exec` 命令，它将执行外部程序。在本例中，外部程序是 gnuplot 程序。gnuplot 程序会创建一个 PostScript 文件，然后您可以打印。

## 3.9.3 球体与重力 (Example 9.3 Sphere with gravity)

在此示例中，我们再次查看带重力的球体，但这次我们使重力成为变量。因此，我们可以使重力非常大，看看球体压在桌面上时会发生什么。这对于查看力和压力如何随着球体变扁而变化很有用。参见前面关于变量作为参数 (Parameters) 的讨论。使用关键字 `PARAMETER` 设置初始值，使用 `:=` 在运行时分配新值。

`PARAMETER` 在数据文件中具有将变量设置为特定值的效果，因此您需要在数据文件中有一个地方来设置它们。关键字 `PARAMETER` 放在数据文件的开头，然后是参数列表。您可以通过在命令行键入 `参数` 来在运行时更改它。

数据文件如下所示。注意我们如何为 body 1 设置密度 (density)，然后使用 gravity 来控制重力。

```
// spheregrav.fe
// Sphere with variable gravity.

PARAMETER gravity = 1.0   // in some suitable units
PARAMETER R = 1            // sphere radius
PARAMETER rhostar = 0      // ratio of fluid densities

constraint 1  /* table top */
formula:  z = 0

constraint 2  /* sphere */
formula:  x^2 + y^2 + z^2 = R^2

vertices
1   R   0   0   constraint 1  constraint 2
2   0   R   0   constraint 1  constraint 2
3   -R   0   0   constraint 1  constraint 2
4   0   -R   0   constraint 1  constraint 2
5   0   0   R    constraint 2

edges
1   1   2  constraint 1  constraint 2
2   2   3  constraint 1  constraint 2
3   3   4  constraint 1  constraint 2
4   4   1  constraint 1  constraint 2
5   1   5  constraint 2
6   2   5  constraint 2
7   3   5  constraint 2
8   4   5  constraint 2

faces
1   1   2   3   4   constraint 1  density 0
2   1   6   -5
3   2   7   -6
4   3   8   -7
5   4   5   -8

bodies
1   1   -2   -3   -4   -5   volume 1  density 1

read
gravity_constant := gravity
```

在 `spheregrav.fe` 中，注意面 1 被赋予密度 0。由于面 1 位于桌面上，不需要表面张力。面 2-5 是球体的面，被赋予密度 1。体 1 也被赋予密度 1。

运行此数据文件，并使用命令 `gravity_constant := 100` 将重力设置为 100。然后迭代几次。您会看到球体被压扁在桌面上。

## 3.9.4 运行球形储罐示例 (Example 9.4 Running the sphere tank example)

运行球形储罐示例的步骤是：

1. 在 Evolver 中读取 `sphere_fe` 数据文件。
2. 细化球体使其成为一个不错的网格。
3. 运行 `sphere_ev` 脚本以计算体积和压力。

在运行 Evolver 时，您应该得到类似以下的输出：

```
Enter command: r
Vertices: 29  Edges: 84  Facets: 56  Facetedges: 168  Bodies: 2
Memory: 2000

Enter command: g 5
5. area: 3.00913100572682  energy: 2.98523853285762  scale: 0.198062
4. area: 3.00913100572682  energy: 2.98523853285762  scale: 0.201895
3. area: 3.00913100572682  energy: 2.98523853285762  scale: 0.199689
2. area: 3.00913100572682  energy: 2.98523853285762  scale: 0.199894
1. area: 3.00913100572682  energy: 2.98523853285762  scale: 0.201810
```

体积和压力结果将取决于您设置的约束。您可以更改 `sphere_fe` 中的参数来研究不同的情况。

## 3.10 示例 10. 晶面积分 (Example 10. Crystalline integrand)

本教程讨论了具有一般值晶面积分 (general-valued crystalline integrand) 的表面的示例，这意味着表面张力不遵循 Wulff 定理 (Wulff's theorem)。当晶体结构的表面张力 (surface tension) 每个单位面积 (unit area) 的值不同时，就会发生这种情况。具有各向异性 (anisotropic) 表面张力的晶体可能具有取向相关的表面张力 (orientation-dependent surface tension)。这里展示的示例是两个凸起 (bumps) 在 z = 0 以上的表面，使用约束来约束它们。参见图 3.4。

```
// crystal.fe
// crystal-line integrand example, from Taylor's algorithm.
// surface with two bumps above z=0

PARAMETER angle = 0.0

#define R  angle*pi/180  /* angle in radians */

energy_integral := (
   /* We will define the integrand to be a general */
   /* value function of the surface normal */
   /* and it will be a function of the angle of the */
   /* surface normal */
   /* with the x,y,z-axes. */
   /* Let "n" be the normal, and */
   /* "nx,ny,nz" its components. */
   /* Then the integrand will be */
   /* (nx^2+ny^2+nz^2)^(1/2). */

   /* The integrand on a facet with surface normal (nx,ny,nz) */
   /* is defined to be: */
   /*    (nz*cos(R)+ny*sin(R))^2 + nx^2 */
   /*                             + (nz*sin(R)-ny*cos(R))^2 */
   /* which is the same as */
   /*    1 - (nz*cos(R)+ny*sin(R))^2 */

   /* Here we give the components of the "vector" */
   /* integrand; these are the values that appear */
   /* in the integrand, multiplied by the area */
   /* of the facet, and summed. */

   /* The three components of the force are: */
   /*    f_1 = -nz*cos(R)-ny*sin(R)) */
   /*    f_2 = nx */
   /*    f_3 = nz*sin(R)-ny*cos(R) */

   /* In addition, there is a contribution from the */
   /* gradient of the area of a facet (the area is */
   /* the length of the normal vector) which is */
   /* the unit normal. */

   /* For the facets on constraint 1, the contribution */
   /* to the energy is the facet area times the */
   /* constraint integrand evaluated on the facet normal. */

   /* For the facets on the planes x=0 and y=0, there */
   /* is an additional energy contribution due to */
   /* contact angle. This is simulated by a "virtual" */
   /* facet energy. */
)

constraint 1
formula:  z = 0

vertices
1   1.0   1.0   0.0   constraint 1
2   -1.0   1.0   0.0   constraint 1
3   -1.0   -1.0   0.0   constraint 1
4   1.0   -1.0   0.0   constraint 1
5   0.0   0.0   1.0

edges
1   1   2  constraint 1
2   2   3  constraint 1
3   3   4  constraint 1
4   4   1  constraint 1
5   1   5
6   2   5
7   3   5
8   4   5

faces
1   1   2   3   4   constraint 1 density 0
2   5   6   -1
3   6   7   -2
4   7   8   -3
5   8   5   -4

bodies
1   1   -2   -3   -4   -5   volume 0.1
```

在 `crystal.fe` 中，注意面 1 被赋予密度 0。由于面 1 位于 z = 0 平面上，不需要表面张力。面 2-5 是凸起的面，被赋予密度 1。体 1 也被赋予密度 1。

`crystal.fe` 数据文件还展示了如何使用 `energy_integral` 来定义晶面积分。晶面积分的计算由 C 语言子程序 `energy_integral` 完成。在 Evolver 中，`energy_integral` 使用 C 语法。`energy_integral` 必须在 Evolver 之外编译。

## 3.11 高等微积分教程 (Tutorial in Advanced Calculus)

为了运行某些示例，您可能需要了解一些微积分知识。本教程是为那些可能对微积分有些生疏的人准备的。我们将从空间中曲线 (curves) 和曲面 (surfaces) 的基本思想开始。在进行一些微积分之后，我们将回到 Evolver 并学习如何使用它来计算表面积分。

在三维空间中，您可以通过指定 x、y 和 z 坐标来描述一个点。我们用 **r** = (x,y,z) 表示从原点到点的位移向量 (displacement vector)。

我们用 **r** = (x,y,z) 表示向量。向量是一个有方向和大小的量，通常用箭头表示。向量的长度（大小）用 |**r**| 表示，由勾股定理 (Pythagorean theorem) 给出：

|**r**|² = x² + y² + z²

在 Evolver 中，我们将向量表示为列向量，例如：

$$\mathbf{r} = \begin{pmatrix} x \\ y \\ z \end{pmatrix}$$

向量可以相加和缩放（乘以标量 (scalar)）。设 **a** = (a₁,a₂,a₃) 和 **b** = (b₁,b₂,b₃) 是向量，c 是标量：

**a** + **b** = (a₁+b₁, a₂+b₂, a₃+b₃)

c**a** = (ca₁, ca₂, ca₃)

两个向量的点积 (dot product)（也称为内积 (inner product) 或标量积 (scalar product)）定义为：

**a** · **b** = a₁b₁ + a₂b₂ + a₃b₃

注意 **a** · **a** = |**a**|²。

两个向量的叉积 (cross product) 定义为：

**a** × **b** = (a₂b₃ - a₃b₂, a₃b₁ - a₁b₃, a₁b₂ - a₂b₁)

注意 **a** × **b** 垂直于 **a** 和 **b**。

### 曲线 (Curves)

空间中的曲线可以参数化 (parameterize)。设 t 是一个参数 (parameter)，范围从 a 到 b。曲线由向量函数 (vector function) **r**(t) = (x(t),y(t),z(t)) 给出。

曲线的长度 (length) 由弧长公式 (arc length formula) 给出：

$$L = \int_a^b |\mathbf{r}'(t)| \, dt$$

其中 **r**'(t) = (x'(t),y'(t),z'(t)) 是切向量 (tangent vector)。

曲线的单位切向量 (unit tangent vector) 是：

$$\mathbf{T} = \frac{\mathbf{r}'(t)}{|\mathbf{r}'(t)|}$$

### 曲面 (Surfaces)

曲面可以通过参数化来描述。设 u 和 v 是参数。曲面由 **r**(u,v) = (x(u,v),y(u,v),z(u,v)) 给出。

切向量 (tangent vectors) 是偏导数 (partial derivatives)：

$$\mathbf{r}_u = \frac{\partial \mathbf{r}}{\partial u} = \left(\frac{\partial x}{\partial u}, \frac{\partial y}{\partial u}, \frac{\partial z}{\partial u}\right)$$

$$\mathbf{r}_v = \frac{\partial \mathbf{r}}{\partial v} = \left(\frac{\partial x}{\partial v}, \frac{\partial y}{\partial v}, \frac{\partial z}{\partial v}\right)$$

法向量 (normal vector) 是叉积：

$$\mathbf{n} = \mathbf{r}_u \times \mathbf{r}_v$$

单位法向量 (unit normal vector) 是：

$$\hat{\mathbf{n}} = \frac{\mathbf{n}}{|\mathbf{n}|}$$

面积元 (area element) 是：

$$dS = |\mathbf{r}_u \times \mathbf{r}_v| \, du \, dv$$

曲面的面积 (area) 是：

$$A = \iint |\mathbf{r}_u \times \mathbf{r}_v| \, du \, dv$$

### 积分 (Integrals)

表面积分 (surface integral) 是在曲面上对标量函数或向量函数进行积分。

标量函数 f(x,y,z) 在曲面 S 上的积分是：

$$\iint_S f \, dS = \iint f(\mathbf{r}(u,v)) \, |\mathbf{r}_u \times \mathbf{r}_v| \, du \, dv$$

向量函数 **F** 在曲面 S 上的积分（通量 (flux)）是：

$$\iint_S \mathbf{F} \cdot \hat{\mathbf{n}} \, dS = \iint \mathbf{F} \cdot (\mathbf{r}_u \times \mathbf{r}_v) \, du \, dv$$

### 散度定理 (Divergence Theorem)

散度定理将体积分与面积分联系起来。设 V 是由封闭曲面 S 包围的体积，**F** 是向量场 (vector field)。则：

$$\iiint_V \nabla \cdot \mathbf{F} \, dV = \iint_S \mathbf{F} \cdot \hat{\mathbf{n}} \, dS$$

其中 ∇ · **F** 是 **F** 的散度 (divergence)。

### Stokes 定理 (Stokes' Theorem)

Stokes 定理将曲面上的面积分与沿其边界的线积分 (line integral) 联系起来。设 S 是以曲线 C 为边界的曲面，**F** 是向量场。则：

$$\iint_S (\nabla \times \mathbf{F}) \cdot \hat{\mathbf{n}} \, dS = \oint_C \mathbf{F} \cdot d\mathbf{r}$$

其中 ∇ × **F** 是 **F** 的旋度 (curl)。

### Green 定理 (Green's Theorem)

Green 定理是 Stokes 定理在平面中的特殊情况。设 C 是平面上的简单闭合曲线，D 是其包围的区域。则：

$$\oint_C (P \, dx + Q \, dy) = \iint_D \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right) \, dA$$

### 表面张力 (Surface Tension)

在物理中，表面张力 (surface tension) 是作用在液体表面的力，使其尽可能小。表面张力 σ 定义为每单位长度的力。具有表面张力的液体表面的总能量是：

$$E = \sigma \cdot A$$

其中 A 是面积。

Evolver 使用此公式来计算表面张力能量。Evolver 中的默认表面张力是 1。

### Evolver 中的表面积分 (Surface Integrals in Evolver)

Evolver 可以计算表面积分。例如，要计算 z² 在表面上的积分，您可以在数据文件中使用以下命令：

```
quantity z2_integral energy method facet_integral
scalar_integrand: z^2
```

然后 Evolver 将计算该积分。

# 第4章 几何元素 (Geometric Elements)

## 4.1 概述 (General)

本章详细描述构成 Evolver 中表面的基本几何元素 (geometric elements)：顶点 (vertices)、边 (edges)、面 (facets/faces)、体 (bodies) 和面边 (facetedges)。每种元素类型都有一组属性 (attributes)，这些属性可以在数据文件中设置，也可以在运行时通过命令修改。

几何元素在数据文件中按以下顺序定义：顶点、边、面、体。面边 (facetedges) 是自动创建的内部元素，用户不需要直接定义。

每种元素类型的属性将在以下各节中详细描述。属性可以在元素定义行上以任意顺序指定，但元素编号必须是该行上的第一项。

## 4.2 顶点 (Vertices)

顶点是空间中的点。它们是构建所有其他几何元素的基本单元。顶点的定义格式为：

```
vertex_number  x  y  z  [attributes]
```

其中 `x`、`y`、`z` 是坐标。在高于三维的空间中，可以指定更多坐标。

### 顶点属性 (Vertex Attributes)

| 属性 | 说明 |
|------|------|
| `fixed` | 顶点在演化过程中保持不动 |
| `boundary n` | 顶点被约束在边界 n 上 |
| `constraint n` | 顶点被约束在约束 n 上（可指定多个约束） |
| `no_refine` | 顶点在细化操作中不被分裂 |
| `no_transform` | 顶点不参与对称变换 |
| `axial_point` | 顶点是轴对称的轴点 |
| `original` | 标记顶点为原始顶点（细化前） |
| `color n` | 设置顶点的显示颜色 |
| `coord n` | 指定坐标系编号 |
| `v_constraint_list` | 顶点约束列表 |

## 4.3 边 (Edges)

边是连接两个顶点的线段。边的定义格式为：

```
edge_number  head_vertex  tail_vertex  [attributes]
```

边是有方向的：从尾顶点 (tail vertex) 指向头顶点 (head vertex)。当边被面引用时，方向很重要。

### 边属性 (Edge Attributes)

| 属性 | 说明 |
|------|------|
| `fixed` | 边在演化过程中保持不动 |
| `boundary n` | 边被约束在边界 n 上 |
| `constraint n` | 边被约束在约束 n 上（可指定多个约束） |
| `no_refine` | 边在细化操作中不被分裂 |
| `no_transform` | 边不参与对称变换 |
| `wrap n` | 边在对称群中环绕 n |
| `color n` | 设置边的显示颜色 |
| `bare` | 边不属于任何面 |
| `length tension` | 边具有指定的长度张力 |
| `edge_vector` | 边的方向向量 |

## 4.4 面 (Facets/Faces)

面是由边围成的多边形，通常是三角形。面的定义格式为：

```
facet_number  edge1  edge2  edge3  ...  [attributes]
```

其中边按右手定则顺序列出以确定面的法线方向。负的边号意味着该边按与其定义相反的方向遍历。

面在演化过程中会自动三角化 (triangulated)。如果面不是三角形，Evolver 会在其中心添加一个顶点并将其连接到所有原始顶点。

### 面属性 (Facet Attributes)

| 属性 | 说明 |
|------|------|
| `fixed` | 面在演化过程中保持不动 |
| `boundary n` | 面被约束在边界 n 上 |
| `constraint n` | 面被约束在约束 n 上 |
| `density d` | 面的表面张力密度（默认为 1） |
| `color n` | 设置面的显示颜色 |
| `no_refine` | 面在细化操作中不被分裂 |
| `no_transform` | 面不参与对称变换 |
| `wrap n` | 面在对称群中环绕 n |
| `backcolor n` | 设置面背面的显示颜色 |
| `opacity r` | 设置面的不透明度（0 到 1） |
| `dihedral` | 面具有二面角能 (dihedral energy) |
| `frontbody` | 面的正面所属的体 |
| `backbody` | 面的背面所属的体 |

## 4.5 体 (Bodies)

体是由面围成的三维区域。体的定义格式为：

```
body_number  facet1  facet2  facet3  ...  [attributes]
```

其中面按外向法线方向列出。如果面的法线指向体内，则在列表中使用负号。

### 体属性 (Body Attributes)

| 属性 | 说明 |
|------|------|
| `volume v` | 体的规定体积 |
| `density d` | 体的密度（用于重力计算） |
| `pressure p` | 体的压力（拉格朗日乘子） |
| `fixed` | 体在演化过程中保持不变 |
| `no_transform` | 体不参与对称变换 |
| `target_pressure` | 目标压力值 |
| `color n` | 设置体的显示颜色 |

## 4.6 面边 (Facetedges)

面边 (facetedges) 是 Evolver 的内部数据结构元素，用于维护面和边之间的关联关系。每个面对应一组面边，每个面对应于面的一条边。面边自动创建，用户通常不需要直接操作它们。

面边的主要用途是维护面的边列表的方向信息。当一条边被多个面共享时，每个面可以以不同的方向使用该边。

## 4.7 公共属性 (Common Attributes)

所有几何元素类型共享一些公共属性：

| 属性 | 说明 |
|------|------|
| `id` | 元素的标识号 |
| `original` | 标记元素为原始元素 |
| `no_transform` | 元素不参与对称变换 |
| `color` | 元素的显示颜色 |
| `opacity` | 元素的不透明度 |

## 4.8 详细属性列表 (Detailed Attribute Lists)

### 顶点详细属性 (Detailed Vertex Attributes)

| 属性 | 类型 | 说明 |
|------|------|------|
| `x, y, z` | 坐标 | 顶点的三维坐标 |
| `x1, x2, x3, ...` | 坐标 | 通用坐标表示 |
| `vertexnormal` | 向量 | 顶点的法向量（用于某些计算） |
| `fixed` | 标志 | 顶点固定不动 |
| `boundary n` | 整数 | 顶点所属的边界 |
| `constraint n` | 整数 | 顶点所属的约束（可多个） |
| `no_refine` | 标志 | 不被细化 |
| `no_transform` | 标志 | 不参与对称变换 |
| `axial_point` | 标志 | 轴对称的轴点 |
| `color n` | 整数 | 显示颜色 |
| `coord n` | 整数 | 坐标系编号 |
| `global` | 标志 | 全局顶点 |
| `extra_offset` | 整数 | 额外数据偏移量 |
| `v_constraint_list` | 列表 | 顶点约束列表 |
| `e_constraint_list` | 列表 | 边约束列表 |
| `f_constraint_list` | 列表 | 面约束列表 |

### 边详细属性 (Detailed Edge Attributes)

| 属性 | 类型 | 说明 |
|------|------|------|
| `v[2]` | 顶点数组 | 边的两个端点（头和尾） |
| `fixed` | 标志 | 边固定不动 |
| `boundary n` | 整数 | 边所属的边界 |
| `constraint n` | 整数 | 边所属的约束（可多个） |
| `no_refine` | 标志 | 不被细化 |
| `no_transform` | 标志 | 不参与对称变换 |
| `wrap n` | 整数 | 对称群环绕 |
| `color n` | 整数 | 显示颜色 |
| `bare` | 标志 | 边不属于任何面 |
| `length tension` | 实数 | 长度张力 |
| `edge_vector` | 向量 | 边的方向向量 |
| `extra_offset` | 整数 | 额外数据偏移量 |
| `inv_measures` | 实数 | 逆度量值 |
| `noncontent` | 标志 | 边不贡献体积 |
| `hashtable` | 指针 | 哈希表指针 |

### 面详细属性 (Detailed Facet Attributes)

| 属性 | 类型 | 说明 |
|------|------|------|
| `fe_list` | 面边列表 | 面的边列表 |
| `fixed` | 标志 | 面固定不动 |
| `boundary n` | 整数 | 面所属的边界 |
| `constraint n` | 整数 | 面所属的约束 |
| `density d` | 实数 | 表面张力密度 |
| `color n` | 整数 | 显示颜色 |
| `no_refine` | 标志 | 不被细化 |
| `no_transform` | 标志 | 不参与对称变换 |
| `wrap n` | 整数 | 对称群环绕 |
| `backcolor n` | 整数 | 背面颜色 |
| `opacity r` | 实数 | 不透明度 |
| `dihedral` | 标志 | 具有二面角能 |
| `frontbody` | 体 | 正面所属的体 |
| `backbody` | 体 | 背面所属的体 |
| `extra_offset` | 整数 | 额外数据偏移量 |
| `quartic` | 标志 | 面是四次曲面片 |
| `no_transform` | 标志 | 不参与对称变换 |
| `noncontent` | 标志 | 面不贡献体积 |
| `hit_vertex` | 顶点 | 用于拾取的命中顶点 |

### 体详细属性 (Detailed Body Attributes)

| 属性 | 类型 | 说明 |
|------|------|------|
| `f_list` | 面列表 | 体的边界面列表 |
| `volume v` | 实数 | 规定体积 |
| `target_volume` | 实数 | 目标体积 |
| `density d` | 实数 | 密度 |
| `pressure p` | 实数 | 压力 |
| `volconst c` | 实数 | 体积常数修正 |
| `fixed` | 标志 | 体固定不动 |
| `no_transform` | 标志 | 不参与对称变换 |
| `color n` | 整数 | 显示颜色 |
| `extra_offset` | 整数 | 额外数据偏移量 |

## 4.9 元素标识 (Element Identification)

几何元素可以在 Evolver 命令中通过多种方式标识：

- **编号**：直接使用元素编号，如 `vertex 5`、`edge 10`
- **where 子句**：使用条件表达式选择元素，如 `vertices where x > 0.5`
- **on_constraint**：选择在特定约束上的元素，如 `edges where on_constraint 1`
- **on_boundary**：选择在特定边界上的元素
- **颜色**：选择特定颜色的元素

## 4.10 元素编号 (Element Numbering)

元素在数据文件中按编号定义。编号不必连续，但必须是正整数。Evolver 内部使用编号来引用元素。

在运行时，可以使用 `new_vertex`、`new_edge`、`new_facet` 和 `new_body` 命令创建新元素。新元素将获得下一个可用的编号。

## 4.11 元素删除 (Element Deletion)

可以使用 `delete` 命令删除几何元素。删除一个元素时，Evolver 会自动处理相关元素的更新：

- 删除一个顶点会删除所有以该顶点为端点的边
- 删除一条边会删除所有包含该边的面
- 删除一个面会更新所有包含该面的体

删除操作是不可逆的，因此在执行删除之前应仔细检查。

---

<!-- END_OF_DOCUMENT -->
