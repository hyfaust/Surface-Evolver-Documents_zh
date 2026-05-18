# 第17章 杂项 (Miscellaneous)

本章包含一些普通用户可能不感兴趣的杂项主题。

## 17.1 自定义图形 (Customizing graphics)

本节面向需要编写自己图形接口模块的用户。所有与设备相关的图形输出已被收集到少数几个基本例程中。接口有两种风格：一种以随机顺序提供面片 (facet)，适用于能够自行进行隐藏面消除的例程；另一种以从后到前的顺序提供面片（画家算法 (painter algorithm)）。

### 17.1.1 随机顺序接口 (Random-order interface)

随机顺序接口有若干指向函数的全局指针，应将其设置为用户的函数。这允许在一个程序中同时使用多组图形例程。面片由 `graphgen()` 生成，该函数会调用用户函数。函数 `display()` 作为整体显示函数被调用；它应设置函数指针并调用 `graphgen()`。示例：`iriszgraph.c`。

函数指针如下：

```c
void (*graph_start)(void);
```

该函数在每次显示开始时调用。它应完成所有必要的设备初始化和屏幕清除工作。

```c
void (*graph_facet)(struct graphdata *, facet_id)
```

该函数用于绘制一个三角面片。参见 `extern.h` 中 `graphdata` 的定义。第二个参数是面片标识符，适用于不满足于仅使用 `graphdata` 中信息的例程；仅供 Evolver 高手使用。面片以随机顺序呈现。坐标未经变换；当前变换矩阵存储在 `view[][]` 中，使用齐次坐标。

```c
void (*graph_edge)(struct graphdata *)
```

该函数用于在弦模型 (string model) 中绘制一条边。

```c
void (*graph_end)(void)
```

该函数在所有数据提供完毕后调用。

### 17.1.2 画家接口 (Painter interface)

画家模型 (painter model) 类似，但多了一层函数。示例：`xgraph.c`、`psgraph.c`、`gnugraph.c`。在 `display()` 中，用户应设置：

```c
graph_start = painter_start;
graph_facet = painter_facet;
graph_end   = painter_end;
```

用户还应设置以下函数指针：

```c
void (*init_graphics)(void);
```

由 `painter_start()` 调用，用于设备初始化。

```c
void (*display_facet)(struct tsort *);
```

由 `painter_end()` 调用，用于逐个绘制排序后的面片。参见 `extern.h` 中 `struct tsort` 的定义。

```c
void (*finish_graphics)(void);
```

在所有面片绘制结束时调用。

用户应按照随机接口的方式设置 `graph_edge`。

## 17.2 动态加载库 (Dynamic load libraries)

Evolver 的许多功能，如水平集约束 (level set constraints)、参数化边界 (parametric boundaries)、命名方法积分 (named method integrands) 和黎曼度量 (Riemannian metrics)，都需要用户定义的函数。这些函数的表达式通常以解析树的形式存储，并在每次需要时进行解释执行，这比编译表达式的求值要慢得多。有一种机制可以通过动态加载 (dynamic loading) 来使用针对特定数据文件的编译函数集。具体做法是将数据文件的函数库单独编译，然后在运行时加载数据文件时一起加载。目前，Evolver 仅实现了在许多 Unix 系统上都能找到的动态加载机制，可以通过检查 `/usr/include/dlfcn.h` 文件是否存在来判断系统是否支持。如果该文件存在，可以在 Makefile 的 `CFLAGS` 行中加入 `-DENABLE_DLL` 来启用动态加载。在某些系统上，可能还需要在 `GRAPHLIB` 行中加入 `-ldl`，以便将 Evolver 与 `dlopen()` 等函数链接。

要为数据文件创建函数库，请编写一个包含所需函数 C 代码的源文件，编译并链接为共享库。函数应能计算函数值及其偏导数，如果要使用 Hessian 相关功能，还需计算二阶偏导数。以下是一个二维数据文件的示例源文件：

```c
#define FUNC_VALUE 1
#define FUNC_DERIV 2
#define FUNC_SECOND 3
#define MAXCOORD 4    /* must be same as in Evolver!! */
#define REAL double /* long double if Evolver compiled with -DLONGDOUBLE */
struct dstack { REAL value;
                REAL deriv[2*MAXCOORD];
                REAL second[2*MAXCOORD][2*MAXCOORD]; };

void func1 ( mode, x, s )
int mode; /* FUNC_VALUE, FUNC_DERIV, FUNC_SECOND */
REAL *x; /* pointer to list of arguments */
struct dstack *s; /* for return values */
{ REAL value;

  s->value = x[0] + x[1]*x[1];

  if ( mode == FUNC_VALUE ) return;

  /* first partials */
  s->deriv[0] = 1.0;
  s->deriv[1] = 2*x[1];

  if ( mode == FUNC_DERIV ) return;

  /* second partials */
  s->second[0][0] = 0.0;
  s->second[0][1] = 0.0;
  s->second[1][0] = 0.0;
  s->second[1][1] = 2.0;

  return;
}
```

假设源文件名为 `foo.c`，在 SGI 系统（IRIX 5.0.1 或更高版本）上编译和链接的命令如下：

```
cc -c foo.c
ld -shared foo.o -o foo.so
```

Sun 系统的命令相同，只是用 `-s` 替代 `-shared`。对于其他系统，请查阅 `ld` 文档了解创建共享库或动态加载库的选项。

要在数据文件中使用这些函数，请在数据文件顶部、在使用任何函数之前加入以下一行：

```
load_library "foo.so"
```

最多可以加载 10 个库。之后，任何函数都可以仅通过名称来调用，无需显式的参数列表，因为在这些函数合法使用的地方，参数列表总是隐含的。以下是一些示例（假设 `func2` 也定义了一个参数）：

```
constraint 1
formula: func1

boundary 1 parameters 2
x1: func2
x2: 3*func2 + sin(p1)
```

用户有责任确保函数期望的参数数量与函数使用时隐含的参数数量一致。用户无需在数据文件中显式声明函数。任何未定义的标识符都会被检查是否为动态加载的函数。

> **注意：** 此动态加载实现为实验性的，此处描述的接口将来可能会发生变化。


# 第18章 实用提示与注意事项 (Helpful hints and notes)

## 18.1 提示 (Hints)

以下是我自己使用 Evolver 的经验以及帮助他人时积累的一些实用提示。

Evolver 以无量纲单位工作，当尺寸、表面张力 (surface tension)、体积等接近 1 时，默认设置效果最佳。如果决定使用会产生非常大或非常小数值的单位，可能需要调整 `scale_limit`、`target_tolerance` 和 `constraint_tolerance` 等参数。

在构建初始数据文件时，应尽量把草图画得大一些，因为需要在上面标注很多符号。对所有顶点 (vertex)、边 (edge) 和面片 (facet) 进行编号。在边上画方向箭头，并标明面片的方向（我喜欢用围绕面片编号的弯曲箭头来表示）。

初始面应为凸面。虽然 Evolver 可以处理非凸面，但其三角剖分 (triangulation) 算法非常简单，非凸面的三角剖分可能会很难看。只需额外添加一两条边，将面分成几个凸面即可。

为带有约束能量或含量积分 (constraint energy or content integrals) 的边以及不带积分的边分别创建单独的约束。即使其他边是固定的，当只有精确需要的边处于带有积分的约束上时，检查被积函数 (integrand) 是否正确也会容易得多。

如果所有元素没有连续编号（通常是由于使用的编号方案或添加/删除元素导致的），请使用 `-i` 命令行选项运行 Evolver，这样鼠标拾取 (mouse-picking) 报告的元素编号将与数据文件中的编号一致。也可以在数据文件顶部加入 `keep_originals` 来达到同样效果。

确保所有体 (body) 的面片方向正确。Evolver 会报告普通边上面片方向不匹配的问题，但固定边 (fixed edges)、受约束边 (constrained edges) 等不受此检查约束。一个好的检查方法是通过着色，例如：

```
set body[1].facet color green
```

确保顶点、边和面片位于正确的约束上。可以通过着色进行可视化检查，例如：

```
set edge color red where on_constraint 1
set facet color green where on_constraint 1
```

不能直接对顶点着色，但可以通过细分几次并对顶点相邻的边着色来获得近似效果：

```
foreach vertex vv where on_constraint 1 do set vv.edge color blue
```

检查初始数据文件中所有的能量、体积、量 (quantities) 等是否正确。有关如何进行详细检查的更多信息，请参阅下面关于合理比例因子 (reasonable scale factors) 的章节。

如果正在模拟液体在固体壁面上的接触线 (contact lines)，我建议先创建一个将液体所有边界面都显式表示为面片的数据文件，然后再制作第二个版本，使用约束能量和含量积分来替换固定壁面上的面片。在第一个版本中验证能量和体积要容易得多，但它在演化过程中也更容易出问题。使用第一个版本来检查第二个版本的正确性，并使用第二个版本进行正式工作。

如果在曲线约束上的边试图抄近路 (short-cut)，有几种方法可以阻止：

1. 创建第二个引导约束 (guide constraint)，使两个约束的交集为顶点定义导轨。通过使用顶点属性来自定义引导约束，只需一个引导约束即可。例如：

   ```
   define vertex attribute guides real[2]
   constraint 1
   formula: x^2 + y^2 = rad^2     // curved constraint
   constraint 2
   formula: guides[1]*x + guides[2]*y = 0 // radial guide planes
   ```

   然后可以在运行时设置引导系数：

   ```
   set vertex.guides[1] -y where on_constraint 1
   set vertex.guides[1] x where on_constraint 1
   ```

2. 如果确切理解是什么能量或体积条件导致了抄近路，可以调整曲线约束上的能量或含量被积函数，进行足够的补偿以消除这种驱动力。这基本上意味着计算边与曲线约束之间间隙的表面积，或间隙所包围的体积。

3. 将曲线约束声明为 CONVEX。这会添加一个与间隙面积大致成比例的能量。这很容易做到，只要将 `gap_constant` 设置得足够高即可（但应将间隙常数保持在能够工作的最低值），但如果使用凸约束，则不能使用任何 Hessian 命令。

在细分 (refine) 之前先在低分辨率下运行。一个好的演化脚本通常会交替进行细分和演化。三角形数量过多不仅计算耗时长，而且每次迭代运动只能传播一个三角形。不要在某个特定的细分级别上过度演化。记住这只是一个近似。将一个精度只有 4 位的近似演化到 12 位精度没有多大意义。

使用 `V`（顶点平均 (vertex averaging)）、`u`（等角化 (equiangulation)）、`l`（长边细分 (long edge division)）和 `t`（微小边删除 (tiny edge deletion)）来修整表面三角剖分。可能需要一些实验才能找到正确的序列，包括细分操作。对某些长边进行细分可能比简单地对整个表面细分更好。然而，过度修整可能不利于收敛；有时收敛后的表面不希望被完全等角化或平均化，这样就会陷入迭代和修整的无尽循环。一旦找到了好的脚本，请将其写入数据文件末尾的便捷命令中以便使用。

使用 `dump` 或 `d` 命令定期保存演化后的表面。请记住，Evolver 没有撤销功能来恢复灾难性的命令。

使用共轭梯度模式 (conjugate gradient mode) 可以加速梯度下降 (gradient descent)，但不要过早使用。先使用常规梯度下降来适应体积或约束的变化。共轭梯度应在常规运动稳定下来后才使用。共轭梯度假设能量函数是二次的，当不是二次时可能会出错。可能需要关闭并重新开启共轭梯度以使其忘记历史。

在梯度下降（包括共轭梯度）期间，请关注比例因子 (scale factor)。比例因子应保持相对稳定。比例因子趋近于 0 并**不**意味着收敛；它意味着表面遇到了困难。然而，一个好的比例因子可能取决于细分级别和其他因素。参见下面关于合理比例因子的章节。

二阶 Hessian 收敛比一阶梯度下降快得多（当 Hessian 有效时）。因此，我的建议是仅使用梯度下降来达到可以安全使用 `hessian` 或 `hessian_seek` 的状态。实际上，`hessian_seek` 几乎总是可以安全使用的，因为它确保能量在减小。我已经发现，`hessian_seek` 作为迭代步骤即使在表面远未收敛的情况下也能取得惊人的效果。

当心能量的鞍点 (saddle point)。对称的表面，例如焊盘上或围绕导线的焊料团，可能看起来在梯度下降下收敛了，但实际上只是到达了一个鞍点。使用 `eigenprobe` 命令测试稳定性，如果不稳定，使用 `saddle` 命令脱离鞍点。

在梯度下降中判断收敛是很困难的。如果迭代以大致恒定的比例因子运行，能量变化不大，并且在共轭梯度模式下长时间运行后仍然变化不大，那么情况可能不错。但请使用 `eigenprobe` 命令确认，并使用 `hessian` 来完成最终收敛。

如果打算使用二次模式 (quadratic mode) 或 Lagrange 模式来获得更高精度，请先在线性模型中演化到最终阶段，因为线性模型要快得多，并且有更多可用的三角剖分修整命令。

## 18.2 检查数据文件 (Checking your datafile)

应始终检查初始数据文件，确保它确实在执行你期望的操作。很容易在被积函数的符号上出错，或将量 (quantities) 应用到错误的元素上。加载初始数据文件时，初始能量、体体积和量值应完全符合预期——无论是通过手工计算还是通过另一个你信任的数据文件得出。特别是，当使用约束积分替代省略的面片时，我建议另外创建一个使用面片而非积分的数据文件，专门用于检查两者之间的一致性。

借助命名方法和量 (named methods and quantities) 功能，可以获得非常详细的数值来源信息。如果执行 `convert_to_quantities` 命令，每个能量、体积和约束被积函数都会在内部转换为命名方法和量（尽管所有内容的用户界面保持不变）。这些内部量通常不会被 `v` 或 `Q` 命令显示，但如果执行 `show_all_quantities`，它们就会显示出来。此外，`Q` 还会显示所有组成方法实例 (method instance)。以下是一个示例输出：

```
Enter command: convert_to_quantities
Enter command: show_all_quantities
Enter command: Q
Quantities and instances:
(showing internal quantities also; to suppress, do "show_all_quantities off")
 1. default_length                               64.2842712474619 info_only quantity
                                modulus         1.00000000000000
 2. default_area                                 4.00000000000000 energy quantity
                                modulus         1.00000000000000
 3. constraint_1_energy                       -0.342020143325669 energy quantity
                                modulus         1.00000000000000
 4. constraint_2_energy                       -0.342020143325669 energy quantity
                                modulus         1.00000000000000
 5. body_1_vol                                   1.00000000000000 fixed quantity
                                  target        1.00000000000000
                                modulus         1.00000000000000
     body_1_vol_meth                            0.000000000000000 method instance
                                modulus         1.00000000000000
     body_1_con_2_meth                            1.00000000000000 method instance
                                modulus         1.00000000000000
 6. gravity_quant                              0.000000000000000 energy quantity
                                modulus        0.000000000000000
```

以下是对上述 `Q` 命令输出的详细解释：

- `default_length` — 使用 `edge_length` 方法计算的总边长度。这将是弦模型中的默认能量，在 soapfilm 模型中其实不需要存在。但它是一个 `info_only` 量，意味着只有当有人请求其值时才会被计算。
- `default_area` — soapfilm 模型中的默认能量，如右侧的 "energy quantity" 所示，包含在能量中。
- `constraint_1_energy` — 约束 1 的能量积分，使用 `edge_vector_integral` 方法应用于约束 1 上的所有边。
- `constraint_2_energy` — 约束 2 的能量积分，使用 `edge_vector_integral` 方法应用于约束 2 上的所有边。
- `body_1_vol` — 体 1 的体积，由多个方法实例的和组成。`body_1_vol_meth` 是对体上所有面片的 `(0,0,z)` 进行 `facet_vector_integral`。`body_con_2_meth` 是对体 1 面片上位于约束 2 上的所有边的约束 2 含量被积函数的积分。
- `gravity_quant` — 所有已分配密度的体的总重力能量。即使没有任何体或没有任何体密度，此量也始终存在。但你会注意到其模 (modulus) 为 0，这意味着跳过其计算，因此此量的存在不会造成任何损害。

可以通过将量或方法名称用作元素的属性来查找单个元素的量或方法贡献。使用量名称实际上意味着对其应用于该元素的所有组成方法求和。例如：

```
Enter command: foreach edge ee where on_constraint 2 do printf "%d %f\n",id, ee.body_1_con_2_meth
5 0.000000
6 0.000000
7 1.000000
8 0.000000
Enter command: foreach edge where constraint_1_energy != 0 do print constraint_1_energy
  -0.342020143325669
```

## 18.3 合理的比例因子 (Reasonable scale factors)

演化中的问题通常由小比例因子来表示，这意味着存在某些障碍阻止了演化。当然，这意味着你需要知道什么是合理的比例因子，这取决于所使用的能量类型和表面的细分程度。在正常演化中，比例因子的大小由表面上小尺度粗糙度的发展决定。结合一些量纲分析，可以得出比例因子应随 $L^{2-q}$ 变化，其中 $L$ 是典型的边长度，能量的单位是长度的 $q$ 次方。量纲分析如下：

设 $D$ 为一个顶点偏离平衡表面的扰动。一般来说，能量在平衡点附近是二次的，所以

$$E = D^2 L^{q-2}$$

因此该顶点处的能量梯度为

$$\nabla E = 2DL^{q-2}$$

运动是比例因子乘以梯度，我们希望它与 $D$ 成比例，所以

$$\text{scale} \times \nabla E = \text{scale} \times 2DL^{q-2} = D$$

因此比例因子的量级为 $L^{2-q}$。以下是一些示例：

| 能量 | 能量量纲 | 比例因子 | 示例文件 |
|------|---------|---------|---------|
| soapfilm 的面积 | $L^2$ | $L^0$ | `quad.fe` |
| 弦的长度 | $L^1$ | $L^1$ | `flower.fe` |
| 弦的曲率平方 | $L^{-1}$ | $L^3$ | `elastic8.fe` |
| soapfilm 的平均曲率平方 | $L^0$ | $L^2$ | `sqcube.fe` |

特别需要注意的是，面积演化的比例因子与细分无关，但对于大多数其他能量，比例因子会随细分而减小。

影响面积演化比例因子的另一个常见因素是表面张力。在单位系统中，如果面片的表面张力赋值为 470，那么所有计算出的梯度都会乘以 470，因此比例因子需要减小 470 倍才能获得相同的几何运动。因此，应将 `scale_limit` 设置为表面张力的倒数。


# 第19章 缺陷 (Bugs)

目前没有已知的完全缺陷，但它们毫无疑问是存在的。当你遇到缺陷时，我很乐意听取你的反馈。缺陷报告应通过电子邮件发送至 `brakke@susqu.edu`。请附上 Evolver 版本号、问题描述、初始数据文件以及重现该问题所需的命令序列。

不过，存在以下一些不足之处：

- 并非所有功能在所有模型中都已实现。
- 顶点和边弹出 (popping) 在边界或约束上的顶点方面不够优雅或不够完整。
- 零长度边和零面积三角形会导致停滞。
- 表面可以在不知道的情况下相交。
- 收敛到最小能量可能难以判断。


# 第20章 版本历史 (Version history)

**Version 1.0** — 1989年8月4日
首个公开版本。

**Version 1.01** — 1989年8月22日
各种缺陷修复。
约束积分 (constraint integral) 规范更改为仅包含分量，而非密度。
面片-边 (facet-edge) 规范已弃用（但仍合法）。
二次模型的顶点运动调整。
缩放因子从 2 改为 1.2。
初始数据文件读取方式改用 lex 和 yacc。支持简单宏。注释必须有分隔符。表达式现在使用代数形式，而非 RPN。

**Version 1.10** — 1989年10月18日
更多缺陷修复。
Eric Haines 贡献了 HP98731 的图形驱动程序。
数据文件读取改进：
- 允许方程作为约束。
- 反斜杠行拼接。
- 表达式中的常量折叠。

**Version 1.11** — 1990年5月18日
更多缺陷修复。
`x`、`y`、`z` 被接受为 `x1`、`x2`、`x3` 的同义词。

**Version 1.12** — 1990年5月25日
数据文件坐标可以以表达式形式给出。
约束进行了改进。每个元素的约束数量上限提高到 `sizeof(int)`。单侧约束可以有选择地应用。GLOBAL 约束自动应用于所有顶点（计入约束数量限制）。

**Version 1.2** — 1990年6月17日
注释在 lex 分析器之前从输入流中移除。因此宏中的注释现在是安全的。
使用 `m` 命令切换时，比例因子上限可调。
实现了可调整常量。数据文件中的语法：`PARAMETER name = constant-expression`。这些在表达式中被视为常量，但可以使用 `A` 命令更改。适用于在约束表达式中动态更改接触角等。
在线性模型中添加了对称含量评估 (symmetric content evaluation)。体积以 $(x\vec{i} + y\vec{j} + z\vec{k})/3$ 的曲面积分而非 $z\vec{k}$ 的积分来评估。在数据文件中使用关键字 `SYMMETRIC CONTENT`。允许更准确地评估月牙形区域。
`sprintf` 的返回值未使用，因为这在不同系统间有差异。
添加了任意表面能量被积函数 (surface energy integrands)。在指定面片上积分矢量场。语法：

```
surface energy n
e1:    expression
e2:    expression
e3:    expression
```

通过在面片定义后加上 `energy n` 来指定面片，方式与指定约束相同。仅适用于线性模型。适用于改变重力方向，通过在重力势能的散度定理等效表面被积函数中放入可调整常量来实现。
`q` 或 `x` 退出命令提供了加载另一个数据文件、继续当前配置或退出的选项。
可以通过在数据文件中加入以下行来更改 `scale` 因子的初始上限：

```
SCALE LIMIT value
```

`value` 必须是数字（不能是表达式）。

`V` 命令（顶点平均）将每个不受约束的顶点替换为其相邻顶点（通过边连接）的平均值。有时对解决瘦长三角形有帮助。

在设置面片表面张力时，`TENSION` 被允许作为 `DENSITY` 的同义词。
二进制保存/重载功能已禁用，因为它已过时，且二进制文件实际上是 ASCII dump 文件的两倍大小。

**Version 1.21** — 1990年6月30日
为 MinneView 添加了共享内存接口（MinneView 是明尼苏达超级计算机研究所几何项目为 Iris 编写的公共领域 3D 图形查看器）。
为 ridge notcher 添加了直方图（选项 `n`）。
移植到 NeXT（无屏幕图形，但可以显示 PostScript 输出文件）。
在所有改变能量的选项后添加了自动能量重新计算。

**Version 1.3** — 1990年7月30日
图形命令中字母前的重复次数。
添加了顺时针 (`c`) 和逆时针 (`C`) 旋转。
在二次搜索最优比例因子时抑制了打印输出。
添加了 `i` 命令用于信息查看。`v` 仅报告体积。
修复了外推命令 `e`。
在需要实数值的地方允许使用常量表达式。
`F` 命令将命令记录到文件。
`-ffilename` 命令行选项从文件读取命令。之后从 stdin 读取命令。
Dump 文件中的实数值打印到 15 位小数，以保证精度不丢失。
通过数据文件中的 `INTEGRAL_ORDER` 关键字可调整边积分的精度（设置高斯求积的阶数）。
数据文件现在允许使用 `CONSTRAINT_TOLERANCE` 指定约束容差。
所有双字关键字通过用 `_` 连接改为单字关键字。

数据文件解析在出错后继续执行。
`b` 命令允许编辑体体积。
`v` 命令对没有规定体积的体打印 `none`。
手册使用 TEX 格式并包含 PostScript 图片。
修复了 CONVEX 间隙能量和力。$k = 1$ 是面积的最佳近似。
修复了顶点弹出以处理切锥的不相交分量。同时在修改后不会破坏其数据结构。

**Version 1.31**
添加了长波长随机抖动 (long-wavelength random jiggle)（命令 `jj`）。
修复了同时运行的 MinneView 以处理环面 (torus) 显示选项。
同时运行的 MinneView 可以停止和重启。
修复了含量积分高斯求积中的缺陷。
修复了等角化以处理任意小的三角形。
直方图调整为当前长度和面积的数量级。
零面积三角形的测试面积阈值调整为表面的尺度。
改进了顶点平均以保持体积。
修复了小边移除缺陷。在折叠面片时，会优先保留约束上的边。
在数据文件中添加了 `VOLCONST` 对体体积的调整。
添加了"量 (Quantities)"。量是面片和边上的矢量积分之和。可以简单地用于信息统计，也可以用作具有固定值的数学约束。适用于质心、转动惯量、磁通量等。
添加了共轭梯度能量最小化。使用 `U` 命令在梯度下降和此方法之间切换。

**Version 1.4** — 发布于1990年8月20日

**Version 1.41** — 1990年9月22日
修复了顶点弹出和元素列表管理方面的缺陷。
长抖动命令 `jj` 允许用户输入自己的数字、使用随机数或使用之前的数字。

**Version 1.42**
缺陷修复：
- 数据文件末尾错误消息导致的段违规 (segment violation)。
- STRING 模型不绘制第三维。
- 在 SOAPFILM 模型上，没有面片的边也会被显示。适用于显示表面之外的导线边界。但此类边在读取数据文件时会产生警告。

**Version 1.5** — 1991年5月15日
二维表面可以存在于 N 维空间中。参见 `SPACE_DIMENSION`。
添加了单纯形模型 (simplicial model)，用于表示 N 维空间中的 k 维表面。
添加了初始的查询语言 (query language)。支持 list 和 show，以及 set 和 unset 属性。
添加了空间上的背景度量 (background metric)，仅适用于弦模型。
可以通过 `read "filename"` 从文件读取命令。

**Version 1.6** — 1991年6月20日
黎曼度量 (Riemannian metric) 扩展到所有维度的表面。
查询语言中添加了 refine 和 delete。List 查询的输出格式与数据文件 dump 相同。
添加了商空间 (quotient spaces)。
为命令和查询添加了管道输出 (piping output)。

**Version 1.63** — 1991年7月21日
添加了 `SET FACET COLOR` 查询。颜色包括 CLEAR。还添加了 `SET FACET TRANSPARENCY`（用于 Iris 及类似平台）。
添加了平均曲率平方 (squared mean curvature) 作为可选能量。
查询可以通过数据文件中父元素的原始编号引用元素。
可调整常量可以根据应用到的元素的 ID 号从文件中获取值。

**Version 1.64** — 1991年8月2日
修订了缺口命令 (`n`)，改为细分相邻面片而非边本身。应在之后进行等角化。
添加了 `K` 命令，用于细分瘦长三角形的最长边（根据其最小角度判断）。
为边添加了 `VALENCE` 属性用于查询。它是边上面片的数量。

**Version 1.65** — 1991年8月20日
添加了使用牛顿法 (Newton's method) 对能量 Hessian 矩阵进行最小化的功能。仅适用于无约束面积最小化且没有其他能量的情况。命令 `hessian`。
NeXT 版本提供了图形界面。
添加了用户定义的坐标函数。参见 `userfunc.c`。

**Version 1.76** — 1992年3月20日
弦模型中的自动弹出 (autopopping) 和自动切割 (autochopping)，用于自动演化。
相位相关的晶界能量 (phase-dependent grain boundary energies)。
近似多面体曲率 (approximate polyhedral curvature)。
近似曲率的稳定性测试。
高斯曲率平方 (squared Gaussian curvature) 仅作为能量的一部分，不作为力。
`system` 命令执行 shell 命令。
`check_increase` 防止迭代过程中的爆炸。
`effective_area` 仅计算对表面法向运动的阻力。
Runge-Kutta 迭代。

**Version 1.80** — 1992年7月25日
命令和查询语言大幅扩展。
添加了 geomview 接口。
添加了固定面积 (fixed area) 作为约束。
可以在数据文件中指定多个视图变换，以便将对称表面的一个基本区域显示为整个表面。
命令可以包含在数据文件末尾，以关键字 `READ` 引入。

**Version 1.83** — 1992年9月9日
添加了一些曲率平方的替代定义。通过 `effective_area ON | OFF` 或 `normal_curvature ON | OFF` 调用。

**Version 1.84** — 1992年9月10日
为 xgraph 和 cheygraph 添加了阴影颜色 (shaded colors)。

**Version 1.85** — 1992年9月29日
添加了将运动限制在表面法向的功能。切换命令 `tt normal_motion`。
平均曲率平方、高斯曲率和高斯曲率平方扩展到带有边界的表面。
在数据文件中为 soapfilm 模型中的顶点和边添加了 `bare` 属性，以避免产生错误的警告。
为高斯曲率平方添加了力计算，因此可以用于能量中。
所有需要实数值响应的提示现在都接受任意表达式。

**Version 1.86** — 1992年10月19日
添加了用户定义的迁移率 (mobility)，支持标量和张量形式。
默认的曲率平方适用于 $R^n$ 中的 2 维表面。

**Version 1.87** — 1992年10月27日
添加了 `close_show` 命令以关闭显示窗口（原生图形窗口，不是 geomview）。
图形命令在进行任何变换之前检查字符串中是否有非法字符。
二面角 (dihedral angle) 现在适用于任意维度的 2 维表面。
可以使用 `::=` 而非 `:=` 进行永久变量赋值。此类赋值在开始新表面时不会被遗忘。
添加了 C 风格的条件表达式：`expr ? expr : expr`。适用于将约束拼接在一起。

**Version 1.88** — 1992年12月16日
为原生图形添加了 `SET BACKGROUND color` 命令。
添加了视图变换生成器和表达式。
为 PostScript 文件计算精确的边界框。

**Version 1.88a** — 1993年1月6日
默认的 `constraint_tolerance` 从 `1e-5` 降低到 `1e-12`。
修复了 1.88 中引入的体积约束计算缺陷。

**Version 1.89** — 1993年2月18日
PostScript 在表面内部绘制固定边和边界边。所有内部图形在特殊边（裸边、三重边等）的绘制上应保持一致。
视图矩阵可以从数据文件中读取并将被导出。关键字 `VIEW_MATRIX`。
添加了取模运算符 `%`，以及 `floor()` 和 `ceil()` 函数。
添加了 `rebody` 命令，用于在颈部收缩 (neck pinching) 和任何其他体断裂后重新计算连通体。
如果平均曲率平方是能量的一部分，则顶点处的平均曲率平方可以作为查询属性 `sqcurve` 使用。
这些量现在可以在命令表达式中使用：`vertex_count`、`edge_count`、`facet_count`、`body_count`、`total_energy`、`total_area`、`total_length`、`scale`。
Dump 文件在末尾的 `read` 部分记录已定义的过程。
添加了结能量 (knot energies)，包括导电和绝缘导线。
添加了 `dissolve` 命令，用于擦除元素并在表面留下间隙，与 `delete` 命令不同，后者会关闭间隙。只能溶解不被更高维元素需要的元素。

命令重复次数被限制为仅三种类型的命令：1. 没有可选参数的单字母命令（`l`、`t`、`j`、`m`、`n`、`w` 有可选参数）2. 花括号中的命令列表 3. 用户定义的过程名称。这是为了防止像 `list vertex 1293` 这样的灾难，之前这会产生 1293 个完整顶点列表。
不带参数的 `dump` 将导出到默认文件名，即数据文件名加 `.dmp` 扩展名。
捕获 SIGTERM 并导致导出到默认 dump 文件然后退出。适用于使用 `kill -TERM` 中断后台运行的脚本。SIGHUP 同理。

**Version 1.90** — 1993年4月2日
共轭梯度 ON/OFF 状态保存在 dump 文件中。注意共轭梯度历史向量不会被保存。
缺口和 `dihedral` 属性适用于弦模型中的顶点。
添加了 `FOREACH` 迭代器。语法：`FOREACH element [ name ] [WHERE expr] DO command`
添加了 `LOAD` 命令。语法：`LOAD "filename"`。适用于启动新表面，特别是在脚本中。
添加了 `PRINTF` 命令用于格式化打印。语法：`PRINTF "format string",expr,expr,...`。`expr` 是浮点数，因此使用 `%f` 或 `%g` 格式。
添加了字符串变量。可以在需要带引号的字符串的地方使用。可以赋值。`SPRINTF` 是 `PRINTF` 的字符串输出版本。
数据文件中的视图变换矩阵前可以加上 `color n`，为该变换指定颜色（覆盖任何面片颜色）。
在查询中，添加了元素属性 `id`，返回带符号的 `id` 版本。
添加了许多结能量。还添加了一种 "hooke energy"，用于保持边接近均匀长度。
PostScript 输出可选地包含颜色。

**Version 1.91** — 1993年5月31日
面片的两面可以有不同的颜色。`COLOR` 应用于两面，`FRONTCOLOR` 和 `BACKCOLOR` 分别应用于不同面。
可以在循环中设置单独命名元素的属性，例如 `foreach facet ff do set ff color red`。
每次命令更改全局变量时，表面都会被重新计算。这极大地减慢了脚本的速度。因此现在唯一会导致重新计算的变量是：1) 数据文件中定义的可调整参数 2) 量的模和参数。
历史命令现在会回显。
可以通过最小化 Dirichlet 积分来最小化表面积，按照 Polthier 和 Pinkall 的方案。命令 `dirichlet`。
为了减少长命令中显式行拼接的需要，解析器现在会跟踪花括号和圆括号的嵌套深度，如果一行在嵌套内部结束，会请求更多输入。因此如果要输入多行命令，以 `{` 开始，在许多行之后以 `}` 结束。如果某些标记是行中的最后一个标记（如 `+`），也会自动进行行拼接。
添加了 `facet_knot_energy_fix` 方法。
修复了命令赋值，只赋值一个命令。因此 `ggg := g; g` 等同于 `{ ggg := g}; g` 而非 `ggg := { g;g}`。
查询可以遍历与顶点相邻的边和面片，以及体的面片，例如 `list vertices vv where max(vv.facet,color==red) > 0`。
改进了 NeXT 终端界面。`-u` 选项用于无图形，`-t` 用于终端和图形。
`view_4d` 命令切换是否向 geomview 发送完整的 4D 坐标。默认为 OFF。

**Version 1.92** — 1993年7月31日
为命名量计算启用了 SGI 并行。
引入了方法-实例方案 (method-instance scheme)。
环面周期可以使用包含可调整参数的表达式指定。
动词（`list`、`refine`、`delete`、`dissolve`）可以应用于单个元素：`foreach edge ee do refine ee`

`FIX` 和 `UNFIX` 可以用作动词：

```
fix vertices where on_constraint 1
```

切换命令名称现在可以在命令表达式中用作布尔值。还新增了只读布尔变量：`torus`、`torus_filled`、`symmetry_group`、`simplex_representation`。新的只读数值变量：`space_dimension`、`surface_dimension`、`integration_order`。
Mac 版本的重复命令可通过 `Ctrl` + `.` 中断。
Macintosh 和 DOS 版本将管道输出到文件而非命令：

```
Enter command: list vertices | "filename"
```

对于环面域，环面周期可以使用包含参数的表达式指定，因此基本单元可以交互式更改。更改此类参数后执行 `recalc` 以更新环面周期。
`gv_binary` 切换用于向 geomview 发送二进制/ASCII 数据。默认 ON 为二进制，速度更快。ASCII 模式适用于调试。

**Version 1.93** — 1993年12月13日
添加了 `history` 命令来打印命令历史。为方便起见，单字母命令现在也包含在历史中。但历史不记录命令发出的提示响应。
命令重复次数现在可以是表达式。
添加了更多命令事件的内部计数器变量：`equi_count`、`delete_count`、`notch_count`、`dissolve_count`、`pop_count`、`where_count`。
添加了边和面上的标量和矢量被积函数的量。
量名称现在可以用作元素属性。量的总值必须引用为 `total quantity-name`。
DOS 版本改进了图形。支持更高分辨率和更多颜色。
可以使用 `SET` 命令将命名量应用于元素。
未记录的 `user_attr`。

**Version 1.94** — 1994年1月24日
新的命名量方法：`vertex_scalar_integrand`、`facet_2form_integral`。
命名量方法的 Hessian：`edge_length`、`facet_area`、`vertex_scalar_integral`、`edge_scalar_integral`、`edge_vector_integral`、`facet_scalar_integral`、`facet_vector_integral`、`facet_2form_integral`、`gravity_method`。
添加了 `edge wrap` 作为可读属性。
添加了边和面的坐标属性。分别解释为边矢量分量和面法向分量。
命令在成功解析后而非成功执行后被添加到历史列表。
未找到的文件被视为错误而非提示输入新名称（数据文件除外）。
新的算术运算符：`mod`（`%` 的同义词）、`imod`、`idiv`。新的算术函数：`atan2(y,x)`。
边和面的显示条件保存在数据文件的 read 部分。
总能量出现在 dump 文件顶部的注释中。
弦模型 3D 情况下的 PostScript 输出有带边框交叉的选项。
`w` 是坐标 `x4` 的同义词。

**Version 1.95** — 1994年6月24日
曲率平方的命名量方法：`sq_mean_curvature`、`eff_area_sq_mean_curvature`、`normal_sq_mean_curvature`。所有方法都与 `h_zero` 一起使用。
新量：`edge_general_integral`、`facet_volume`、`facet_torus_volume`、`facet_general`、`stress_integral`、`edge_area`、`edge_torus_area`。还有基本量的二次模型版本。还有 Hessian。
二次模型边的中点包含在 dump 中。在数据文件中可选。
二次模型中边的 `midv` 属性。
`iteration_counter` 变量用于打印当前重复次数。
新数学函数：`tanh`、`asinh`、`acosh`、`atanh`。

额外属性 (extra attributes)，可索引。可以有非导出的额外属性。
`quietgo` 切换用于抑制仅 `g` 命令的输出。
`ribiere` 切换用于共轭梯度。不启动 CG。还在共轭梯度或 post-project 模式中对约束进行额外投影，如果在 10 次投影中不收敛则将 `iteration_counter` 设为 -1。
`assume_oriented` 切换用于平均曲率平方。
PostScript 输出添加了标签选项。
AND 和 OR 的短路求值 (short-circuit evaluation)。
`delete facet` 更加积极；尝试按递增长度顺序消除面片的所有边直到成功。

**Version 1.96** — 1994年9月22日
`G` 命令接受数值参数而非重复次数。
`hessian_menu` 命令包含有关 Hessian、特征值和特征向量的实验性功能。Saddle 将沿最低特征向量搜索，无需进入菜单。
`sprintf`、`printf` 现在接受字符串参数，但它们以 8 字节压入，因此格式字符串中的 `%s` 后应跟 `half`。
"Extra" 属性现在在相同类型的元素上继承。
添加了 `jiggle` 切换和 `jiggle_temperature` 内部变量。
添加了 `total_time` 内部变量。也可设置。
复合量 (compound quantities) 允许量能量作为方法实例的函数。
元素生成器上的索引。
允许数据文件表达式中的元素属性用于量等，但仅在命名量中有效。
`hessian_normal` 标志用于在非奇异点将 Hessian 运动约束在表面法向上。
将 `ribiere` 设为共轭梯度的默认模式。
添加了 geomview `string` 命令，让脚本可以向 geomview 发送命令。
`print` 命令也接受字符串。例如：`print datafilename`
当前数据文件的名称可以在命令中作为 `datafilename` 引用，在任何可以使用字符串的地方。

**Version 1.97** — 1994年12月16日
命名量可以引用 `qqq.value`、`qqq.target`、`qqq.pressure` 和 `qqq.modulus`。
替代 Hessian 分解（通过 `ysmp` 切换），带有 Bunch-Kauffman 选项。
添加了 `lanczos` 和 `eigenprobe` 命令。
Dump 保存切换状态。

**Version 1.98** — 1995年3月15日
添加了 `Lanczos(t,n)` 和 `ritz(t,n)` 命令。特征值的线性度量。
`-q` 选项将所有内容转换为量。
geomview 拾取。
`break` 和 `continue` 命令。
`P`、`M` 命令接受参数。
添加了 `random_seed` 变量用于用户控制随机数。
为面片添加了 12 点 6 阶和 28 点 11 阶积分规则。默认面片求积改为 12 点 5 阶。面积稳定性大幅提高。单独的 `integral_order_1D` 和 `integral_order_2D` 变量。

**Version 1.99** — 1995年7月19日
体和量的 `target`、`volconst` 属性。
更高阶的求积公式。
Hessian 的 `linear_metric`。
`edgeswap` 命令。
环面平移自动添加到视图变换生成器。

元素结构仅分配所需的存储。
`convert_to_quantities` 命令。
约束限制提高到 127。
切换会打印先前的值。
Hessian 操作保存运动方向。特征值保存在 `last_eigenvalue` 中，步长保存在 `last_hessian_scale` 中。
`eigenprobe(lambda, n)` 找到特征向量。Hessian 菜单选项 G 最小化平方梯度而非能量，用于 saddle 和 `hessian_seek`。可以在 Hessian 菜单中选择 Ritz 向量。`Saddle` 和 `hessian_seek` 命令接受步长限制参数。
`move` 命令。
`-DSDIMn` 编译器选项用于硬连线优化的维度。
SGI_MULTI 模式下的 Hessian 计算并行化。
`bottominfo` 命令。
单字母命令的重新定义。
`geompipe` 切换。
`P` 命令接受参数以跳过菜单。

**Version 2.00** — 1996年4月30日
文档的 HTML 版本，也由 `help` 命令使用。
Lagrange 模型。
使用 `-DLONGDOUBLE` 编译时的四精度 (quad precision)。
Windows NT 版本。
`X` 命令打印额外属性字典。
引入了 `optimizing_variable`。
`postscript` 命令使用切换而非交互方式（如 `P 3`）。
`return` 命令用于结束当前命令。

**Version 2.01** — 1996年8月15日
Mac 68K 和 Power PC 版本。
`node_charge` 顶点属性用于 `knot_energy`。适用于展开图形。
`new_vertex` 等。
`V` 已修改；`vertex_average` 在受约束顶点和二次边中点上效果更好。
3D 中的单纯形等角化。
边和顶点的 `no_refine` 属性。
`>>` 重定向。
函数的动态链接库。
DOS、Windows 版本保留字母数字转义序列。
可以打印 `transform_expr`、`transform_count`。

**Version 2.10** — 1998年7月10日
使用 OpenGL 的 Windows NT/95/98 版本具有更好的图形。可以用鼠标左键旋转、平移或缩放，用右键拾取元素，甚至可以做交叉立体视觉。在图形窗口中键入 `h` 获取命令摘要。还为程序制作了悬链面图标。
C 风格赋值运算符 `+=`、`-=`、`*=`、`/=` 在合理的地方可用。
参数化边界 (parameterized boundaries) 可以有能量和含量积分，与水平集约束相同的方式。
使用 `>>` 追加、`>>>` 覆盖将命令输出重定向到文件。
变量可以在运行时通过 `unfix varname` 和 `fix varname` 分别在优化或非优化之间切换。
数据文件头部的 `keep_macros` 在数据文件之后保持宏处于活动状态。

命令行选项 `-i` 将保持元素 ID 与数据文件中相同，而非默认的连续重新编号。
如果要重新排列内部列表中的元素排列顺序（即 `list vertices` 等列出元素的方式），可以定义额外属性 `vertex_order_key`、`edge_order_key`、`facet_order_key`、`body_order_key`、`facetedge_order_key`，给它们赋适当的值，然后给出命令 `reorder_storage`。参见发布 fe 目录中的 `reorder.cmd`。
`renumber_all` 按内部列表顺序重新编号元素。
只读内部变量 `random` 用于生成 0 到 1 之间均匀分布的随机数。
添加了关于在数据文件中使用关键字作为标识符的警告。数据文件仍然可以运行，但你的命令会误解这些标识符。
所有关键字都在在线帮助中。如果你想检查一个潜在的关键字，使用 `help "keyword"`。`help` 也识别用户在当前表面中定义的标识符。对于脚本中的测试，有一个函数 `is_defined(stringexpr)`，如果名称已在使用中则返回 1，否则返回 0。
在数据文件中，将边设为 FIXED 不再固定其端点。这与固定面片和运行时固定边的工作方式兼容。
对于逻辑上依赖于元素方向的命名方法（即 `facet_vector_integral` 等），应用方法时记录元素的相对方向。默认为数据文件中的正方向，除非在应用于单个元素的方法或量名称后添加了 `-`。

**Version 2.11** — 1999年3月1日
为 `pop edge`、`pop vertex`、`delete`、`notch`、`refine`、`dissolve`、`edgeswap`、`unstar` 的操作消息添加了 `verbose` 标志。
`sq_mean_curvature` 方法的 `IGNORE_FIXED` 和 `IGNORE_CONSTRAINT` 标志。
终于去掉了旧的 `fixed_area`。
赋值语句允许出现在表达式的开头；适用于约束和量被积函数中的公共子表达式。
`hessian_slant_cutoff` 变量用于控制约束上的 Hessian。
`-e` 选项回显输入；适用于管道输入。
需要时自动转换为命名量；可通过 `-a-` 选项抑制。
`scale` 属性用于比例因子阻抗匹配的优化参数。

**Version 2.14** — 1999年8月18日
`hessian_normal` 现在默认为 ON。
实现了自动 `convert_to_quantities`；仍有一两处无法在运行时转换。命令行选项 `-a-` 禁用。
为 `pop edge`、`pop vertex`、`delete`、`notch`、`refine`、`dissolve` 和 `edgeswap` 的操作消息添加了 `verbose` 切换命令。
`dissolve` 命令现在可以溶解 soapfilm 模型中体上的面片，以及弦模型中面上的边。
弦模型中边具有 `frontbody` 和 `backbody` 属性。
添加了 `chdir` 命令用于更改工作目录。
元素额外属性可以声明带有计算其值的代码。

**Version 2.17** — 2002年7月25日
GLUT OpenGL 图形，带有下拉菜单和多窗口。
Mac OSX 版本。
多维数组。
PostScript 可以进行可见性检查以减少输出大小。

**Version 2.20** — 2003年8月20日
变量和元素额外属性的多维数组。
带参数的函数和过程。
局部变量 (local variables)。
`FOR` 循环控制结构。
增广 Hessian (augmented Hessian)。
稀疏约束 (sparse constraints)。

**Version 2.24** — 2004年10月13日
运行时定义命名量、方法实例、约束和边界。
更多弹出命令：`t1_edgeswap`、`pop_quad_to_quad`、`pop_tri_to_edge`、`pop_edge_to_tri`；以及切换 `pop_disjoin`、`pop_to_face`、`pop_to_edge`。
`vertex_merge()`、`edge_merge()` 和 `facet_merge()`。
球面弧方法 (spherical arc methods)。
`star_perp_sq_mean_curvature` 方法，我认为是目前最好的。Star 方法现在适用于部分 star。
`cpu_counter` 变量用于真正的高分辨率计时。

**Version 2.26** — 2005年8月20日
手册的 PDF 版本，带有书签和链接。
`binary_printf`、`reverse_orientation`、`quietload` 命令。
`eigenvalues` 数组。
带引号字符串的连接。

**Version 2.30** — 2008年1月1日
图形中的裁剪和平面切片 (clipping and slicing planes)。
全数组操作 (whole-array operations)。
Evmovie 显示程序和 `binary_off_file`。
`addload` 用于多文件加载。
简单图形文本。
显示弦面片 (string facets)。
子命令提示。
调试断点 (debugging breakpoints)。


# 第21章 参考文献 (Bibliography)

> **译者注：** 以下参考文献保留原始英文格式，包括作者姓名、论文/书籍标题、期刊名称和出版信息，以便读者查阅原始文献。

**[A]** F. Almgren, "Minimal surface forms," *The Mathematical Intelligencer*, vol.4, no. 4 (1982), 164–172.

**[AV]** V. I. Arnol'd, *Catastrophe Theory*, 3rd ed., Springer-Verlag, 1992.

**[AT]** F. Almgren and J. Taylor, "The geometry of soap films and soap bubbles," *Scientific American*, July 1976, 82–93.

**[AYC]** J. Ambrose, B. Yendler, and S. H. Collicot, "Modeling to evaluate a spacecraft propellant gauging system," *Spacecraft and Rockets* 37 (2000) 833-835.

**[B1]** K. Brakke, *The motion of a surface by its mean curvature*, Princeton University Press, Princeton, NJ (1977).

**[B2]** K. Brakke, "The surface evolver," *Experimental Mathematics*, vol. 1, no. 2 (1992), 141–165.

**[B3]** K. A. Brakke, "Minimal surfaces, corners, and wires," *Journal of Geometric Analysis* 2 (1992) 11-36.

**[B4]** K. A. Brakke, "The opaque cube problem video," *Computing Optimal Geometries*, J. E. Taylor, ed., American Mathematical Society, Providence RI, 1991.

**[B5]** K. A. Brakke, "Grain growth with the Surface Evolver," *Video Proceedings of the Workshop on Computational Crystal Growing*, J. E. Taylor, ed., American Mathematical Society, Providence RI, 1992.

**[B6]** K. A. Brakke, "The opaque cube problem," *Am. Math. Monthly* 99 (Nov. 1992), 866-871.

**[BB]** K. A. Brakke and F. Baginski, "Modeling ascent configurations of strained high-altitude balloons," *AIAA Journal* 36 (1998) 1901-1920.

**[B7]** K. A. Brakke and F. Morgan, "Instabilities of cylindrical bubble clusters," *Eur. Phys. J. E* 9 (2002) 453-460.

**[BS]** K. A. Brakke and J. M. Sullivan, "Using Symmetry Features of the Surface Evolver to Study Foams," in *Mathematics and Visualization*, ed. K. Polthier and H. Hege, Springer Verlag, Berlin, (1997).

**[C]** M. Callahan, P. Concus and R. Finn, "Energy minimizing capillary surfaces for exotic containers," *Computing Optimal Geometries*, American Mathematical Society, Providence RI, 1991.
