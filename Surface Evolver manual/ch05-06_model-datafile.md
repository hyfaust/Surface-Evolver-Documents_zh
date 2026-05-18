# 第5章 模型 (The Model)

本章描述 Surface Evolver 所采用的表面 (surface) 数学模型。关于如何设置初始表面，请参阅数据文件 (datafile) 一章；关于如何操作表面，请参阅操作 (Operations) 一章。本手册中关键字 (keywords) 通常以大写字母给出，尽管大小写并不敏感。在索引中，关键字以等宽字体显示。

## 5.1 表面的维度 (Dimension of surface)

在标准 Evolver 表面中，表面张力 (surface tension) 存在于二维的面 (facet) 中（这被称为**肥皂膜模型 (soapfilm model)**）。然而，也可以让张力存在于边 (edge) 中，这被称为**弦模型 (string model)**，通过在数据文件 (datafile) 中使用关键字 `STRING` 声明。参见 `slidestr.fe` 作为示例。在肥皂膜模型中，也可以同时让边具有张力，以表示奇异曲线 (singular curves) 具有能量的情形。

本章主要针对肥皂膜模型编写。关于弦模型的差异，请参见下面的"弦模型"一节。关于超过二维的表面，请参见单纯形模型 (Simplex model)。

## 5.2 二次模型 (Quadratic model)

默认情况下，边 (edge) 和面 (facet) 是线性的。通过在数据文件中放置关键字 `QUADRATIC` 或使用 `M` 命令，可以将边表示为二次曲线、面表示为二次曲面片 (quadratic patches)。如果这样做，每条边将被赋予一个中点顶点 (midpoint vertex)。二次表示法已实现了若干基本功能，如面积、体积、约束 (constraints) 和基本的命名量方法 (named quantity methods)。

## 5.3 拉格朗日模型 (Lagrange model)

对于比线性或二次模型更高精度的需求，有一个非常有限的高阶单元 (higher order elements) 实现。在 n 阶拉格朗日模型 (Lagrange model) 中，每条边由参数域中均匀分布的 n + 1 个顶点进行拉格朗日插值定义，每个面由参数域中三角形模式均匀分布的 (n + 1)(n + 2)/2 个顶点进行插值定义。也就是说，在有限元分析 (finite element analysis) 的术语中，这些单元是拉格朗日单元 (Lagrange elements)。拉格朗日模型可通过命令 `lagrange n` 来调用。

拉格朗日模型仅限于某些命名量和方法，因此 Evolver 必须以 `-q` 选项启动，或者您必须给出 `convert_to_quantities` 命令。没有可用的三角剖分操作：不支持细化 (refining)、等角化 (equiangulation) 或其他任何操作。请使用线性或二次模型来建立最终的三角剖分，然后仅使用拉格朗日模型来获得额外的精度。

拉格朗日单元通常按其顶点细分进行绘图，但如果 `smooth_graph` 标志开启，则以 8 倍细分进行绘图。

## 5.4 单纯形模型 (Simplex model)

此模型仅用顶点 (vertex) 和面 (facet) 来表示表面。它的引入是为了能够表示任意维度的表面，但许多 Evolver 功能在此模型中不可用。在此模型中，每个面表示为 k + 1 个顶点的有向列表 (oriented list)，其中 k 是表面的维度。边可以指定为 k − 1 维单纯形 (simplices)，但它们仅用于计算约束积分 (constraint integrals)；不需要完整的边列表。对于超曲面 (hypersurfaces)，体 (body) 仍然存在。

数据文件的第一部分必须包含关键字 `SIMPLEX_REPRESENTATION`，如果 k ≠ 2 则还需包含 `SURFACE_DIMENSION k`。如果定义域不是三维的，则还必须包含 `SPACE_DIMENSION n`。`EDGES` 部分是可选的。每个面应列出 k + 1 个顶点编号。不允许非单纯形面。参见示例数据文件 `simplex3.fe`。

大多数功能尚未实现。顶点可以被设置为 `FIXED`。约束是允许的，但不允许任何形式的被积函数 (integrand)。不支持环面域 (TORUS domain)。不支持二次表示 (QUADRATIC representation)。除迭代和细化外，不允许改变表面。细化会细分每条单纯形边，边中点继承边端点的共同属性。细化将使面的数量增加 2^k 倍。

`simplex_to_fe` 命令可将 1 维或 2 维单纯形模型转换为弦模型或肥皂膜模型，适用于任何环境维度。

## 5.5 环境空间的维度 (Dimension of ambient space)

默认情况下，表面存在于三维空间中。然而，数据文件中的 `SPACE_DIMENSION n` 语句将维度设置为 n。这意味着所有坐标和向量都有 n 个分量。唯一的限制是 Evolver 必须在 Makefile 或 model.h 中将 `MAXCOORD` 宏定义为至少 n 来编译。如果您想要超过四维，请更改 `MAXCOORD` 并重新编译。

对于超过三维的空间，图形显示仅显示前三个维度，但 geomview 除外，它内置了四维查看器（尽管目前使用起来不太方便）。

## 5.6 黎曼度量 (Riemannian metric)

环境空间可以通过在数据文件中放置关键字 `METRIC` 或 `CONFORMAL_METRIC` 后跟度量张量 (metric tensor) 的元素来赋予黎曼度量。共形度量张量 (conformal metric tensor) 是单位矩阵的倍数，因此只需要一个元素。只允许一个坐标补丁 (coordinate patch)，但商空间 (quotient space) 特性使其非常灵活。边和面在坐标中是线性的，它们不是测地线 (geodesic)。度量仅用于计算长度和面积，不用于体积。要对体施加体积约束，您必须定义自己的"量"约束。参见 `quadm.fe` 作为度量的示例。

有一个特殊的内置度量：n 维双曲空间 (hyperbolic space) 的克莱因模型 (Klein model)。定义域是欧几里得坐标中的单位圆盘或球体。在数据文件顶部包含关键字 `KLEIN_METRIC` 将调用此度量。长度和面积是精确计算的，但与其它度量一样，体积和量需要您自行处理。

## 5.7 环面域 (Torus domain)

默认情况下，表面的定义域是欧几里得空间 R³。然而，有许多有趣的问题涉及周期性表面 (periodic surfaces)。Evolver 可以将其定义域取为一个平坦环面 (flat torus)，其单位晶胞 (unit cell) 是一个任意平行六面体 (parallelpiped)，即定义域是一个对面等同的平行六面体。这通过数据文件中的 `TORUS` 关键字来表示。平行六面体的定义基向量在数据文件的 `TORUS_PERIODS` 条目中给出。参见 `twointor.fe` 作为示例。

某些功能在环面域中不可用，即二次表示、约束、边界 (boundaries)、量 (quantities) 和重力 (gravity)。（实际上，您可以将它们放入，但它们不会考虑环面包裹 (torus wrapping)。）然而，有新的命名量方法可以实现二次模型环面域。

体积和体积约束是可用的。然而，如果环面被完全划分为规定体积的体，则体积之和必须等于单位晶胞的体积，且必须在数据文件中给出 `TORUS_FILLED` 关键字。或者干脆不要规定一个体的体积。

体积在某种程度上是模糊的。体积计算方法精确到一个环面体积，因此一个体积为正的体可能被计算为负体积。Evolver 在更改后会尽量使体积与先前的体积保持连续，或在有目标体积时与目标体积保持连续。如果您不喜欢 Evolver 的行为，也可以设置体的 `volconst` 属性。

水平集约束 (Level set constraints) 可在环面模型中使用，但将它们用作体积的镜面对称 (mirror symmetry) 平面时要小心。环面体积算法不能很好地处理这种部分表面。如果必须这样做，请使用 y=const 对称平面而不是 x=const，并使用 `-q` 选项或执行 `convert_to_quantities`。请仔细检查体积是否正确输出；必要时使用 `volconst`。

顶点坐标以单位晶胞内的欧几里得坐标给出，而不是基向量的线性组合。坐标不必位于平行六面体内，因为单位晶胞的确切形状在某种程度上是任意的。表面在环面中环绕的方式通过说明边如何穿过单位晶胞的面来给出。在数据文件中，每条边每个维度有一个符号，指示边向量如何穿过每对等同的面，以及端点之间的向量需要如何调整以获得真实的边向量：

| 符号 | 含义 |
|------|------|
| `*`  | 不穿过面 |
| `+`  | 沿基向量方向穿过，因此将基向量加到边向量上 |
| `-`  | 沿相反方向穿过，因此从边向量中减去基向量 |

有几个命令用于显示环面表面的方式：

- `raw_cells` — 按原样绘制面。对于检查数据文件中全是三角形的情况很有用。被细分后的面可能无法辨认。
- `connected` — 每个体的面在环面中展开，因此体呈现为一个连接的部分。最美观的选项。
- `clipped` — 显示数据文件中指定的单位晶胞。面在平行六面体面上被裁剪。

对于环面模式表面，如果裁剪模式生效，裁剪框的中心由 `display_origin[]` 数组设置，其维度为环境空间的维度。此数组默认不存在，必须由用户在数据文件顶部通过以下语法创建：

```
 display_origin x y z
```

其中 x y z 是所需裁剪框中心的坐标。在运行时，数组元素可以按正常方式更改：

```
display_origin[2] := 0.5
```

更改 `display_origin` 将自动导致图形重新显示。

显示的平行四边形单位晶胞可以与实际单位晶胞不同，只需在数据文件顶部放置一个名为 `display_periods` 的数组，除了常规的 periods 之外。对于弦模型示例：

```
 parameter shear = 1
 torus_filled
 periods
 4 0
 shear 4
 display_periods
 40
 04
```

无论实际单位晶胞被剪切多少，这将始终显示一个正方形。此功能对于剪切效果很好；对于其他类型的变形可能效果不佳。`display_periods` 对弦模型比肥皂膜模型效果更好。对于肥皂膜模型，它似乎对水平剪切效果最好，但不能处理大的剪切，因此如果您的剪切变得太大，我建议使用 `unshear.cmd` 中的 `unshear` 命令将基本区域重置为较小的剪切。

## 5.8 商空间和一般对称性 (Quotient spaces and general symmetry)

作为环面域的推广，您可以声明定义域为 R^n 关于某个对称群 (symmetry group) 的商空间。这不能在数据文件中完全指定，但需要您编写一些 C 例程来定义群运算 (group operations)。群元素由附加在边上的整数表示（类似于环面模型中的包裹 (wrap) 规范）。您定义群元素的整数表示。参见文件 `quotient.c` 和 `symtest.fe` 作为示例。参见 `khyp.c` 和 `khyp.fe` 作为更复杂的示例，该示例对 Klein 双曲空间中识别为亏格 2 曲面的八边形进行建模。数据文件需要关键字 `SYMMETRY_GROUP`，后跟带引号的群名称。有包裹的边在数据文件中通过 `wrap n` 语句指定群元素，其中 n 是群元素的编号。包裹值在运行时可通过边的 `wrap` 属性访问。群运算可通过函数 `wrap_inverse(w)` 和 `wrap_compose(w1,w2)` 访问。

使用任何 Hessian 命令配合除内置环面模型外的任何对称群，需要使用 `-q` 启动选项或 `convert_to_quantities` 命令转换为所有命名量。

使用对称群时，体的体积可能无法正确计算。体积计算只知道内置环面模型。对于其他对称群，如果您声明一个体，它将使用欧几里得体积计算。您需要自行使用命名量和方法设计替代的体积计算。

当前实现的对称群：

### 5.8.1 TORUS 对称群

这是环面模型的基础对称性。虽然环面模型在 Evolver 中有许多内置的特殊功能，但它也可以通过一般对称群接口访问。环面群是 n 维欧几里得空间上由 n 个独立向量（称为周期向量 (period vectors)）生成的群。环面群使用数据文件顶部列出的环面周期。

数据文件声明：

```
   symmetry_group "torus"
   periods
   200
   030
   003
```

群元素编码：32 位代码字 (code word) 分为 6 位字段，每个维度一个包裹字段，低位位对应第一维。因此最大空间维度为 5。在每个位字段中，1 编码正包裹，011111 编码负包裹。编码实际上是一个 2 的补码 5 位整数，因此可以表示更大的包裹。

### 5.8.2 ROTATE 对称群

这是 x-y 平面中旋转的循环对称群 (cyclic symmetry group)，群的阶 (order) 由内部变量 `rotation_order` 给出。还有一个内部变量 `generator_power`（默认为 1），使得旋转角度为 2π·generator_power/rotation_order。`generator_power` 在用户赋值之前不存在。注意：由于此群有不动点 (fixed points)，需要一些特殊预防措施。旋转轴上的顶点必须在数据文件中标记为 `axial_point` 属性。从轴点出发的边必须将轴点放在其尾部 (tail)，且必须具有零包裹。包含轴点的面必须将轴点放在面中第一条边的尾部。

示例数据文件声明：

```
   symmetry_group "rotate"
   parameter rotation_order = 6
```

群元素编码：一个元素编码为群生成元 (generator) 的幂次。

### 5.8.3 FLIP ROTATE 对称群

这是 x-y 平面中旋转的循环对称群，在每次奇数旋转时附加 z → -z 的翻转，群的阶由内部变量 `rotation_order` 给出，该变量最好是偶数。注意：由于此群有在偶数次旋转下固定的点，需要一些特殊预防措施。旋转轴上的顶点必须在数据文件中标记为 `double_axial_point` 属性。从轴点出发的边必须将轴点放在其尾部，且必须具有零包裹。包含轴点的面必须将轴点放在面中第一条边的尾部。

示例数据文件声明：

```
   symmetry_group "flip_rotate"
   parameter rotation_order = 6
```

群元素编码：一个元素编码为群生成元的幂次。

### 5.8.4 CUBOCTA 对称群

这是立方体的完整对称群。可以视为 (x,y,z) 的所有排列和符号变化。

数据文件声明：

```
   symmetry_group "cubocta"
```

群元素编码：wrap 的最低位表示 x 的反射；次低位表示 y 的反射；第三低位表示 z 的反射；接下来的两位构成 (xyz) 排列循环的幂次；下一位指示是否交换 x,y。（由 John Sullivan 编写；源码在 quotient.c 中，名为 pgcube）

### 5.8.5 CUBELAT 对称群

Cubelat 是单位立方晶格 (unit cubic lattice) 的完整对称群。即坐标的所有排列和符号变化，加上整数的加减。

数据文件声明：

```
   symmetry_group "cubelat"
```

群元素编码：wrap&1,2,4 给出 x,y,z 的符号变化；(wrap&24)/8 是 (xyz) 循环的幂次；(wrap&32)/32 指示是否交换 x,y；即 wrap&63 与 cubocta 相同。然后 wrap/64 是环面包裹，如同环面对称群：三个 6 位有符号字段用于每个坐标的平移。平移在其他操作之后应用。

### 5.8.6 XYZ 对称群

cubocta 的保向子群 (orientation-preserving subgroup)。临时包含，因为某篇论文中引用了它。详见 cubocta 的说明。

### 5.8.7 GENUS2 对称群

这是 Klein 双曲空间模型上的对称群，其商群是亏格 2 双曲流形 (genus 2 hyperbolic manifold)。基本区域是一个八边形。

数据文件声明：

```
   symmetry_group "genus2"
```

群元素编码：有 8 个平移元素，将基本区域平移到其相邻区域之一。围绕一个顶点平移给出 8 个元素的循环字符串。编码的群元素是这 8 个元素的子串，空串为恒等元。编码用 4 位表示起始元素，4 位表示终止元素（实际上是终止元素之后的一个，因此 0 0 是恒等元）。详见 `khyp.c`。

### 5.8.8 DODECAHEDRON 对称群

这是用正交十二面体 (right-angled dodecahedra) 铺砌的双曲 3 空间的平移对称群。群的元素表示为整数。群有 32 个生成元，因此每个生成元用 5 位表示。在此方案下，最多由 5 个生成元组合而成的任何元素都可以表示。如果您想使用此群，您需要查看 `dodecgroup.c` 中的源代码，因为这是其他人编写的群，我现在不想全部弄清楚。

数据文件声明：

```
   Klein_metric
   symmetry_group "dodecahedron"
```

### 5.8.9 CENTRAL SYMMETRY 对称群

这是通过原点反演 (inversion through the origin) 的 2 阶对称群，X → -X。

数据文件声明：

```
 symmetry_group "central_symmetry"
```

群元素编码：0 为恒等元，1 为反演。

### 5.8.10 SCREW SYMMETRY 对称群

这是沿 z 轴的螺旋运动 (screw motions) 对称群。全局参数 `screw_height` 是平移距离（默认 1），全局参数 `screw_angle` 是旋转角度（以度为单位，默认 0）。

示例数据文件声明：

```
   parameter screw_height = 4.0
   parameter screw_angle = 180.0
   symmetry_group "screw_symmetry"
```

群元素编码：整数值是群生成元的幂次。

### 5.8.11 QUARTER_TURN 对称群

三维环面，在顶面和底面的识别中进行四分之一圈旋转。x 和 y 周期取为 1。z 周期是用户定义的变量 `quarter_turn_period`。生成元为 x,y,z。x 和 y 与常规环面模式相同。z 是带四分之一圈旋转的垂直平移：(x,y,z)→(-y,x,z)。关系：xz = zy⁻¹，yz = zx。数值表示：与环面相同，按 x,y,z 的幂次排列，生成元按该顺序应用。

示例数据文件声明：

```
   parameter quarter_turn_period = 2.0
   symmetry_group "quarter_turn"
```

群元素编码：与环面相同。
群元素编码：与环面相同。

## 5.9 对称表面 (Symmetric surfaces)

对称表面通常可以通过仅演化一个基本域 (fundamental domain) 来更轻松地完成。如果基本区域由镜面对称 (mirror symmetry) 平面界定，则这是最容易的。这些平面成为基本域的约束面（参见下面的约束部分）。基本区域的多个镜像可以通过使用变换矩阵 (transformation matrices) 来显示（参见数据文件一章中的 `view_transforms`）。

## 5.10 水平集约束 (Level set constraints)

约束 (constraint) 是对顶点 (vertex) 运动的限制。它可以表示为函数的水平集 (level set) 或参数化流形 (parametric manifold)。Evolver 中使用的"约束"一词指的是水平集公式，"边界 (boundary)"指的是参数化公式。"体积约束 (volume constraint)"是完全不同的概念，指的是体 (body)。

水平集约束可以有多种作用：

1. 顶点可以被要求位于约束上（等式约束 (equality constraint)）或位于一侧（不等式约束 (inequality constraint)）。约束可以被声明为 `GLOBAL`，在这种情况下它适用于所有顶点。参见 `mound.fe` 作为示例。定义函数的公式可以包含顶点的属性，因此特别地，顶点额外属性 (vertex extra attributes) 可用于将一个公式定制到各个顶点。

2. 约束可以有一个与之关联的向量场 (vectorfield)，该向量场沿位于约束中的边积分以给出能量。该向量场称为**能量被积函数 (energy integrand)**；语法见数据文件第 6.3.29 节。这对于指定壁面接触角 (wall contact angles) 和计算重力势能 (gravitational potential energy) 很有用。参见 `mound.fe` 作为示例。

3. 约束可以被声明为 `CONVEX`，在这种情况下，约束中的边具有与直边和弯曲壁面之间面积成比例的能量。这种能量（称为"间隙能量 (gap energy)"）旨在补偿平坦面与弯曲壁面相接时通过延长壁面上的一些边和缩短其他边来最小化面积的趋势，其净效果是增加了边与壁面之间的净间隙。参见 `tankex.fe` 作为示例。

4. 约束可以有一个与之关联的向量场，该向量场沿位于约束中的边积分，为边界面包含这些边的体贡献体积。该向量场称为**内容被积函数 (content integrand)**。这对于在不完全用无用面包围体的情况下获得正确的体体积很有用。理解内容如何添加到体中对于正确设置符号至关重要。积分沿边的正方向计算。如果边在面上正向定向，面在体上正向定向，则积分被添加到体中。这最终可能给出与您认为自然的被积函数相反的符号。不对 `FIXED` 的边计算积分。参见 `tankex.fe` 作为示例。在弦模型中，内容被积函数在约束上的顶点处计算。

5. 边被积函数（内容和能量）通过高斯求积 (Gaussian quadrature) 计算。使用的点数由数据文件中的 `INTEGRAL_ORDER` 选项控制。

6. 如果水平集约束在数据文件中被声明为 `NONNEGATIVE` 或 `NONPOSITIVE`，则受约束影响的顶点必须保持在水平集函数定义域的该部分中。通常在单侧约束上给予边积分或将它们声明为 `CONVEX` 是不明智的。顶点是否精确满足约束可以通过顶点的 `hit_constraint` 属性查询。`'g'` 迭代步骤将检查顶点是否想要离开它已到达的单侧约束，但 hessian 命令不会；因此在涉及单侧约束时，明智的做法是在 hessian 或 hessian_seek 之间穿插 `'g'`。

示例：假设想要将一个气泡保持在半径为 5 的球形罐内。则可以在数据文件中定义约束：

```
   constraint 1 nonpositive
   formula: x^2 + y^2 + z^2 = 25
```

为了评估非负性或非正性，所有项都移到公式的左侧。然后将此约束应用于气泡表面的所有顶点、边和面。如果定义了实值顶点额外属性 `one_sided_lagrange`，则到达单侧约束的顶点的拉格朗日乘子 (Lagrange multipliers) 将被记录。`one_sided_lagrange` 可以定义为数组。如果顶点到达的约束数量超过 `one_sided_lagrange` 的大小，则将记录适合的前几个。

几个元素属性在水平集约束方面很有用：

- `on_constraint` — 布尔属性，指示元素是否已被放置在约束上。
- `hit_constraint` — 布尔顶点属性，指示约束是否精确满足约束。用于单侧约束；对于精确约束始终为 1。
- `value_of_constraint` — 顶点属性，是约束公式在顶点处的值。
- `v_constraint_list`, `e_constraint_list`, `f_constraint_list`, `b_constraint_list` — 向量属性，其第一个元素是元素所在约束的数量，后跟约束编号列表（使用命名约束的内部编号）。
- `constraint normal` — 约束在顶点处的单位法向量 (unit normal vector)。

约束的类型可以在运行时作为表达式查询：

```
constraint[number].nonnegative
constraint[name].nonnegative
constraint[number].nonpositive
constraint[name].nonpositive
constraint[number].fixed
constraint[name].fixed
```

如果约束是指定类型则值为 1，否则值为 0。"number" 可以是表达式；"name" 是约束的不带引号的名称（如果有的话）。示例：

```
   print constraint[floorcon].nonnegative
```

列出顶点所在的所有等式约束的示例：

```
 foreach vertex vv do
   for ( inx := 1 ; inx < vv.v_constraint_list[1] ; inx++ )
     if constraint[vv.v_constraint_list[i+1]].fixed then
       printf "Vertex %d on equality constraint %d                                 n",
         vv.id,vv.v_constraint_list[i+1];
```

## 5.11 边界 (Boundaries)

边界 (Boundaries) 是参数化子流形 (parameterized submanifolds)。顶点、边和面可以被认为位于边界中。对于顶点，这意味着顶点的基本参数是边界的参数，其坐标由这些参数计算得出。边界上的顶点在迭代过程中可以移动，除非声明为固定。参见 `cat.fe` 作为示例。边界上的边与约束边一样具有能量和内容积分，但它们在内部实现为命名量。

一个微妙之处是如何处理在圆或圆柱等边界上的环绕 (wrap-around)。细分边界边需要一个中点，但取端点的平均参数可能给出无意义的结果。因此计算平均坐标，然后将该点投影到从一个端点继续的边界上，即使用外推法 (extrapolation)。

使用外推而非插值中点参数解决了在圆或圆柱等边界上的环绕问题。然而，如果您确实想要插值，可以在数据文件顶部使用关键字 `INTERP_BDRY_PARAM`，或使用切换命令 `interp_bdry_param`。

插值要求边的两个端点都在同一边界上，这在不同边界上的边相交的地方不可能发生。为了处理这种情况，可以通过声明两个特定的顶点额外属性 `extra_boundary` 和 `extra_boundary_param` 来向顶点添加额外的边界信息：

```
 interp_bdry_param
 define vertex attribute extra_boundary integer
 define vertex attribute extra_boundary_param real[1]
```

然后在关键顶点上声明属性值，例如：

```
 vertices
 1 0.00 boundary 1 fixed extra_boundary 2 extra_boundary_param 2*pi
```

如果在需要时顶点上未设置 `extra_boundary` 属性，Evolver 将默默地回退到插值。

一般指导原则是对二维壁面使用约束，对一维线材使用边界。如果您使用边界线材，您可能可以将边界上的顶点和边声明为 `FIXED`。然后边界就成为细化边界边的指南。

注意：边界上的顶点不能同时具有约束。

## 5.12 能量 (Energy)

Evolver 通过最小化表面的总能量 (total energy) 来工作。这种能量可以有多个组成部分：

1. **表面张力 (Surface tension)**。肥皂膜和不同流体之间的界面具有与其面积成比例的能量。因此它们会收缩以最小化能量。每单位面积的能量也可以被视为表面张力，或每单位长度的力。每个面具有表面张力，除非数据文件另有指定（参见面的 `TENSION` 选项），否则为 1。不同的面可以有不同的表面张力。面张力可以通过 `'set facet tension ...'` 命令交互式更改。对总能量的贡献是所有面面积乘以各自表面张力的总和。面的表面张力也可以指定为依赖于它所分离的体的相 (phases)。参见 `PHASE`。

2. **重力势能 (Gravitational potential energy)**。如果体具有密度（参见体的 `DENSITY` 选项），则该体将其重力能量贡献给总量。重力加速度 G 由用户控制。设 ρ 为体密度，能量定义为：

   E = ∫∫∫ Gρz dV  (5.1)

   但使用散度定理 (Divergence Theorem) 计算为：

   E = ∫∫ (Gρ/2) z² **k** · d**S**  (5.2)

   此积分在包围体的每个面上进行。如果面分隔两个不同密度的体，则使用适当的密度差。位于 z = 0 平面中的面不做贡献，如果它们在其他方面不需要，可以省略。位于约束中的面，如果它们对重力能量的贡献包含在约束能量积分中，则可以省略。

3. **命名量 (Named quantities)**。参见下面关于命名量的部分。

4. **约束边积分 (Constraint edge integrals)**。约束上的边可以有通过沿有向边积分向量场 **F** 给出的能量：

   E = ∫ **F** · d**l**  (5.3)

   积分使用边的固有方向，但如果边的 `orientation` 属性为负，则取负值。这对于壁面上的规定接触角（代替具有等效张力的壁面）以及否则需要约束中的面的重力势能很有用。

5. **凸约束 (Convex constraints)**。考虑跨越圆柱体的肥皂膜。Evolver 必须用一组面来近似这个表面。这些面的直边不能贴合弯曲的壁面，因此计算出的表面面积遗漏了外边和壁面之间的间隙。Evolver 将自然地尝试通过移动外顶点来最小化面积，从而使间隙增大，最终导致表面坍缩为一条线。这不好。因此提供了"间隙能量 (gap energy)"来阻止这种情况。约束可以在数据文件中声明为 `CONVEX`。对于此类约束上的边，能量计算为：

   E = k |**S** × **Q**| / 6  (5.4)

   其中 **S** 是边向量，**Q** 是边在边尾顶点约束切平面上的投影。常数 k 是称为"间隙常数 (gap constant)"的全局常数。间隙常数为 1 给出间隙实际面积的最佳近似。较大的值最小化间隙，并使顶点很好地分布在约束上。

   间隙能量随着表面的细化而二次衰减。即细化一次将间隙能量减少四分之一。您可以通过使用 `k` 命令更改 k 的值来查看此能量是否对表面有显著影响。

6. **可压缩体 (Compressible bodies)**。如果理想气体模式生效（参见数据文件的 `PRESSURE` 关键字），则每个体贡献能量：

   E = P_amb V₀ ln(V/V₀)  (5.5)

   其中 P_amb 是环境压力，V₀ 是数据文件中规定的体积，V 是体的实际体积。为了考虑抵抗环境压力所做的功，每个体还产生负贡献：

   E = -P_amb V  (5.6)

7. **规定压力 (Prescribed pressure)**。每个具有规定压力 P 的体贡献能量：

   E = PV  (5.7)

   其中 V 是体的实际体积。这可用于生成具有规定平均曲率 (mean curvature) 的表面，因为平均曲率与压力成正比。

8. **平均曲率平方 (Squared mean curvature)**。可以在每个顶点周围计算平均平均曲率，并将此平均值的平方的积分作为能量。此组成部分通过数据文件中的 `SQUARE_CURVATURE` 短语包含。曲率偏移 h₀（因此能量为 (h - h₀)²）可以通过数据文件中的 `H_ZERO` 值指定。加权因子可以通过 `A` 命令通过更改可调常数平方曲率模量 (square curvature modulus) 的值来更改。关于平方曲率积分的确切计算方式的详细信息，请参见技术参考章节。（此功能未在二次模型中实现。）几种平均曲率平方的变体可用，通过 `effective_area` 和 `normal_curvature` 命令切换。详见技术参考章节中的公式。[HKS] 报告了一些实验结果。

9. **平均曲率积分 (Mean curvature integral)**。能量可以通过在数据文件中包含带加权因子的 `MEAN_CURVATURE_INTEGRAL` 关键字来包含有符号平均曲率的积分。

10. **高斯曲率平方 (Squared Gaussian curvature)**。表面的高斯映射 (Gauss map) 通过将点映射到其法线将表面映射到单位球面。点处的高斯曲率 (Gaussian curvature) 是此映射的雅可比行列式 (Jacobian)。此定义可以推广到分段线性表面。Evolver 可以通过在数据文件中包含带加权因子的 `SQUARE_GAUSSIAN_CURVATURE` 关键字来在能量中包含高斯曲率平方的积分。

11. **晶体被积函数 (Crystalline integrands)**。Evolver 可以对晶体表面 (crystalline surfaces) 的能量建模。这些能量与面的面积成比例，但也依赖于法线的方向。能量由表面法线与一组称为 Wulff 向量 (Wulff vectors) 的向量的最大点积给出。表面面积可以被视为 Wulff 向量为单位球的晶体被积函数。详见数据文件中关于 Wulff 向量的部分。表面要么具有晶体能量，要么具有表面张力，不能同时具有两者。不建议使用，因为非光滑性使 Evolver 工作效果差。

## 5.13 命名量和方法 (Named quantities and methods)

这些是为了提供一种更系统的方式来添加新能量和约束的努力。

"方法 (method)"是从某种特定类型的元素（顶点、边、面、体）计算标量值的一种方式。每个方法在内部实现为一组函数，用于计算作为顶点位置函数的值及其梯度 (gradient)。方法通过其名称引用。有关可用方法的完整列表及其所需规范，请参见命名方法和量一章。许多 hessian 可用于命名量，但不适用于其老式对应物。命令行选项 `-q` 将自动将所有内容转换为命名量，尽管有些内容目前还不能转换。Evolver 命令 `convert_to_quantities` 将以交互方式实现相同效果。

添加新方法涉及编写 C 例程来计算作为顶点坐标函数的值和梯度，并在 `quantity.c` 中的方法名称数组中添加结构。从数据文件调用它的所有其他语法已经就位。

"方法实例 (method instance)"是方法的特定使用，带有任何可能需要的特定参数。方法实例可以显式创建并命名，也可以通过定义量来使用方法而隐式创建。详见数据文件一章。每个方法实例都有一个"模量 (modulus)"，它乘以基本值。

"量 (quantity)"是各种方法实例的总和，尽管通常只涉及一个实例。任何量都可以声明为三种类型之一：1) "能量 (energy)"量，添加到表面的总能量中；2) "固定 (fixed)"量，被约束为固定目标值（通过每次迭代的牛顿步 (Newton steps)）；3) "仅信息 (info_only)"量，其值仅报告给用户。每个量都有一个"模量"，它是所有实例值之和的标量乘数。模量为 0 将关闭所有实例的计算。

示例数据文件 `knotty.fe` 包含一些示例。量值可以通过 `v` 命令查看。

计划最终将所有能量和全局约束转换为此系统。但是，现有语法将在可能的情况下保持有效。使用 `-q` 选项启动 Evolver 现在将执行此转换。

## 5.14 压力 (Pressure)

压力是垂直于表面的单位面积上的力。在 Evolver 中，压力可以通过三种方式产生：

1. 如果体具有体积约束，则边界表面不太可能是最小曲面 (minimal surface)。因此需要压力来抵消表面收缩的趋势。当存在体积约束时，Evolver 自动计算所需的压力。压力值可以通过 `v` 命令查看。

2. 体可以具有规定压力。然后在计算表面运动时，将适当的力添加到顶点上的力中。这是获得规定平均曲率表面的方式，因为压力 = 表面张力 × 平均曲率。注意：同一物体上规定体积和规定压力是非法的。警告：如果压力太大，规定压力可以使表面膨胀到无穷大。

3. Evolver 可以将体视为由等温理想气体组成，即体可以是可压缩的。如果 `PRESSURE` 关键字出现在数据文件的第一部分，则会发生这种情况。那里给出的压力是所有体外部的环境压力。每个体必须指定体积，即在环境压力下体的体积。

## 5.15 体积或内容 (Volume or content)

"体积 (volume)"和"内容 (content)"这两个术语用于 n 维空间中区域的最高维度度量：R² 中的面积，R³ 中的体积等。体可以在数据文件中指定体积，这将成为体积约束。体的体积可以写为：

V = ∫∫∫ 1 dV  (5.8)

由散度定理可以写成面积分：

V = ∫∫ z **k** · d**S**  (5.9)

此积分在体的所有边界面上计算。

位于约束上的体边界部分不必以面的形式给出。在这种情况下，可以使用斯托克斯定理 (Stokes' Theorem) 将约束上面积分的部分转换为沿体表面与约束相交的边的线积分。线积分被积函数在数据文件中作为约束内容被积函数给出。

替代的面积分为：

V = (1/3) ∫∫ (x**i** + y**j** + z**k**) · d**S**  (6.10)

如果在数据文件中指定了 `SYMMETRIC_CONTENT` 则使用此公式。如果约束内容积分（通过近似计算）在应为对称的表面上导致不对称结果，这很有用。

与表面积一样，平坦面和弯曲约束之间的间隙会导致问题。您可以使用约束内容积分来克服这个问题。参见教程部分中的罐体和球体示例。

## 5.16 扩散 (Diffusion)

Evolver 可以模拟相邻气泡之间气体扩散的真实现象。这种扩散由表面两侧的压力差驱动。通过数据文件第一部分的关键字 `DIFFUSION` 调用，后跟扩散常数 (diffusion constant) 的值。迭代期间通过面扩散的量计算为：

dm = (scale factor)(diffusion constant)(facet area)(pressure difference)  (5.11)

比例因子 (scale factor) 作为迭代的时间步长。该量被添加到或减去面两侧体的规定体积中。

内部变量 `diffusion_coefficient` 引用扩散常数。

如果您想更精细地控制各种表面的扩散速率，可以在弦模型中定义 `edge_diffusion` 边属性或在肥皂膜模型中定义 `facet_diffusion` 面属性，并根据需要为边或面赋予单独的值。如果定义了属性，则使用其值代替全局扩散常数。

扩散可以在运行时通过 `diffusion` 切换命令进行切换。

## 5.17 运动 (Motion)

Evolver 的核心是减少能量同时遵守任何约束的迭代步骤。表面通过移动顶点来改变。不会改变拓扑结构或三角剖分（除非某些选项被切换开启）。思路是计算每个顶点的速度并沿该方向移动顶点。如果共轭梯度 (conjugate gradient) 选项生效，则相应地调整运动方向。

力是能量的负梯度。在每个顶点处，计算总能量（参见上面的能量部分）作为该顶点位置的函数的梯度。默认情况下，速度取为等于力。如果面积归一化 (area normalization) 选项生效，则将力除以相邻顶点邻域面积的 1/3 以获得平均曲率向量的近似作为速度。如果相关，量约束（如体体积）和水平集约束的梯度在每个顶点处计算。力和量约束梯度投影到每个顶点相关水平集约束的切空间上。为了强制执行量约束，计算沿体积梯度的恢复运动（对每个量找到一个常数，使得当每个顶点移动所有包含该顶点的量的 (常数)(量梯度) 之和时，量至少在线性近似下正确）。然后将量梯度的倍数添加到力中以保持量恒定（对于体积，乘数因子是体的压力，它们实际上作为体积约束的拉格朗日乘子被找到）。

顶点的实际运动是量恢复运动加上全局比例因子乘以速度。比例因子可以是固定的，也可以是优化的（参见命令 `m`）。如果优化，Evolver 为几个比例值（每次加倍或减半）计算能量，直到超过最小能量。然后通过二次插值 (quadratic interpolation) 计算最佳比例。也可以通过为变量 `scale_scale` 赋值来以最佳比例的倍数移动。龙格-库塔步 (Runge-Kutta step) 也可用。

然后移动未固定的顶点。如果抖动 (jiggling) 生效，每个非固定顶点从标准差 = (温度)(特征长度) 的高斯分布 (Gaussian distribution) 中随机方向移动，其中特征长度初始为 1，每次细化时减半。

最后，所有水平集约束被强制执行，包括固定顶点上的约束。违反不等式或等式约束的顶点被投影到约束上（牛顿法 (Newton's method)）。可能需要几个投影步骤，直到违反量小于某个容差或完成一定数量的步骤（这会生成警告消息）。默认约束容差 (constraint tolerance) 为 1e-12，但可以通过数据文件中的 `CONSTRAINT_TOLERANCE` 选项或设置 `constraint_tolerance` 变量来设置。

## 5.18 海森矩阵 (Hessian)

在受限情况下还有另一种运动方式，它通过计算能量的二阶导数矩阵（海森矩阵 (Hessian)）然后求解最小能量来尝试一步到达最小值。执行一次迭代的命令是 `hessian`。对其使用有一些限制。它适用的能量是面积、约束边积分、单纯形模型面面积，以及前面标记的命名量方法。特别注意它不适用于弦模型或普通重力。您可以在肥皂膜模型中使用 `edge_length` 量模拟弦，并使用 `gravity_method` 代替普通重力。处理的约束是体体积、水平集约束和涉及前述方法的固定命名量。参数化边界上的未固定顶点不被处理。其中一些限制将在未来版本中消除。如果 Evolver 抱怨无法对您的表面执行 Hessian，尝试使用 `-q` 选项重新启动 Evolver，如果可能，它会将所有内容转换为命名量。

Hessian 迭代应仅在表面非常接近最小值（或某个临界点）时尝试。我建议使用其他方法（如共轭梯度）演化，直到能量收敛到大约 8 位小数。如果您从太远的地方尝试 Hessian，它很可能会使您的表面爆炸。但如果您执行 `"check_increase ON"`，如果 Hessian 迭代会增加其能量，表面将恢复到先前状态。

需要接近最小值主要是由于表面切向运动，因为三角剖分会重新排列自身。有一个切换 `hessian_normal` 将运动约束为沿表面法线方向（准确地说是体积梯度）。没有明确定义法线的点（如沿三重连接线 (triple junctions) 或四面体点 (tetrahedral points)）不受约束。

运行 Hessian 方法在矩阵不是正定 (positive definite) 时会产生警告消息。如果约束不使净 Hessian 正半定 (positive semidefinite)，则您将得到类似以下的消息：

```
   WARNING: Constrained Hessian not positive definite. Index 3
```

其中 index 是负特征值 (negative eigenvalues) 的数量。这可能在前几次迭代中出现。不要担心，除非它在 Hessian 方法完全收敛时出现，或导致表面爆炸。如果担心爆炸，给出命令 `check_increase`。您可以使用下一小节中提到的命令检查正定性而不移动。

求解 Hessian 时将值视为零的标准由变量 `hessian_epsilon` 设置。其默认值为 1e-8。

要感受 Hessian 方法，请用 `cat.fe` 试一试。

使用 Hessian 矩阵的一些实验性功能可以通过命令 `hessian_menu` 访问。这会弹出各种选项的菜单。一些较有趣的：选项 E 将找到最小特征值和对应的特征向量。在鞍点 (saddle point) 时很有用。E 之后，使用选项 S 沿特征向量方向移动到最小能量。选项 P 找到高于和低于某个值的特征值数量。

更多详细信息，请参见技术参考章节的 Hessian 部分。

## 5.19 特征值和特征向量 (Eigenvalues and eigenvectors)

如果表面已到达鞍点，能够分析 Hessian 是很好的。正定的 Hessian 证明当前表面是稳定的局部最小值。负特征值指示能量减小的方向。零特征值可能指示对称性，如平移或旋转。有关背景知识，请参见任何体面的线性代数教材，如 Strang [SG]，特别是第 6 章。关于稳定性和分岔 (bifurcations) 的更多信息，请参见 Arnol'd [AV] 或 Hale 和 Kocak [HK]。

有几个命令可用于分析特征值。关于某个探测值 (probe value) 的 Hessian 的惯性 (inertia) 可以通过 `"eigenprobe value"` 找到，它报告小于、等于或大于给定探测值的特征值数量。探测值附近的特征值可以通过 `"lanczos value"` 命令找到，它将打印出探测值附近的 15 个近似特征值。最近的一个非常准确，但其他的可能不是。此外，重数 (multiplicities) 通常是虚假的。由于 lanczos 从随机向量开始，它可以运行多次以了解误差。对于更准确的特征值和重数，有 `ritz(value, n)` 命令，它取一个随机的 n 维子空间并对其应用移位逆迭代 (shifted inverse iteration)。它在特征值收敛到机器精度时报告它们。您可以通过按中断键（通常是 CTRL-C）来中断它，它将报告其余的当前值。`saddle` 命令将找到最小特征值，如果为负，将在相应方向上寻求最低能量。

默认 Hessian 通常有许多小特征值，这是由于顶点在表面切向上的近似平移自由度。这在二次模式中尤其成问题，那里往往有许多约 -0.00001 的微小负特征值，通过迭代极难消除。解决办法是将顶点的运动限制为垂直于表面。`hessian_normal` 命令切换此模式。法线方向定义为体积梯度。此方向未明确定义的点，如三重线上的点，不受限制。此模式强烈推荐用于加速常规 Hessian 迭代的收敛。

您可能想要近似光滑表面的特征值和特征向量。这需要一些仔细思考。首先，应使用 `hessian_normal` 模式，因为光滑表面被认为只沿法线方向移动。其次，您可能注意到特征值在细化时会变化。这是因为特征向量是瑞利商 (Rayleigh quotient) 的临界值：

X^T H X / (X^T X)  (5.12)

X^T X 的存在暗示度量被隐式涉及，有必要显式包含度量。特征向量实际上应该被视为瑞利商的临界点：

X^T H X / (X^T M X)  (5.13)

默认度量是 M = I，它给每个顶点单位权重。然而，对于光滑表面，特征函数通过使用 L² 度量来计算，即在表面上积分：

<f, g> = ∫_S f(x)g(x) dx  (5.14)

有几种方法可以近似 Evolver 表面上的 L² 度量。一种是取对角 M，其中每个顶点的权重只是与该顶点相关的面积，准确地说是相邻面面积的 1/3。我称之为"星形度量 (star metric)"。另一种方法是取由顶点处值定义的函数的线性插值的真正 L² 度量。我称之为"线性度量 (linear metric)"。`linear_metric` 命令切换在计算特征值和特征向量时使用度量。默认情况下，度量是星形度量和线性度量的 50-50 混合，因为这在几个测试案例中给出了最接近光滑表面特征值的近似。但您可以通过设置变量 `linear_metric_mix` 为您想要的线性度量比例来控制混合。

在二次模式中，`linear_metric` 实际上使用二次插值。不使用星形度量，因为星形度量的特征值以 h² 收敛，而纯二次插值的特征值以 h⁴ 收敛。

如果您想实际看到特征向量，需要进入 `hessian_menu`。选择 1 进行初始化，然后选择 V 输入您选择的近似值。这将执行移位逆迭代，您可能需要不到 50 次迭代就能获得良好的特征向量。然后使用选项 4 以特征向量的某个倍数移动。选项 7 撤销移动，所以不要害怕。

## 5.20 迁移率 (Mobility)

在将顶点上的力转换为顶点的速度时，需要做出选择。从技术上讲，力是能量的梯度，因此是所有可能构型流形上的协向量 (covector)。在 Evolver 中，该全局协向量可以表示为每个顶点处的协向量。速度是全局向量，表示为每个顶点处的向量。从全局协向量到全局向量的转换需要乘以度量张量 (metric tensor)，即在全局向量和协向量上指定特定的内积 (inner product)。将力转换为速度的张量是迁移率张量 (mobility tensor)，在某个坐标系中表示为迁移率矩阵 M。其逆，将速度转换为力的，是阻力张量 (resistance tensor) S = M⁻¹。在将速度投影到约束的切空间上时，必须使用相同的内积，无论它们是顶点上的水平集约束还是体体积或量积分的约束。Evolver 中实现了几种选择，对应于介质如何抵抗表面穿过它的运动的几种不同物理图像。

### 5.20.1 顶点迁移率 (Vertex mobility)

这是默认迁移率，其中速度等于力。因此 M 和 S 在标准坐标中是单位矩阵。其物理解释是每个顶点穿过介质的运动有与其速度成正比的阻力，但边没有。这不近似于平均曲率运动，但计算非常简单。

### 5.20.2 面积归一化 (Area normalization)

在平均曲率运动中，运动的阻力实际上来自表面，而不是顶点。一种近似方法是说顶点运动的阻力与和该顶点相关的面积成正比。因此此方案使顶点的阻力等于其周围面星 (star of facets) 面积的 1/3（或弦模型中边星长度的 1/2）。这易于计算，因为它是每个顶点的局部计算。S 和 M 是对角矩阵。

### 5.20.3 有效面积归一化 (Area normalization with effective area)

上一段描述的简单面积归一化在某些情况下并不是真正想要的。它对平行于和垂直于表面的所有方向的运动具有相等的阻力。如果顶点是三重连接点 (triple junction) 并沿其中一条边的方向迁移，该边有多长应该无关紧要。因此，如果有效面积模式生效，与顶点相关的面积是其星在顶点力方向法线上投影的面积。计算稍复杂一些，但它仍然是局部的。S 和 M 是块对角矩阵 (block diagonal matrices)，每个顶点一个块。在不在任何约束上的自由边上，力切于表面，阻力为零，迁移率为无穷大。但这准确描述了弹出的肥皂膜。

### 5.20.4 近似多面体曲率 (Approximate polyhedral curvature)

按照 Gerhard Dzuik 和 Alfred Schmidt 的建议，全局向量的内积取为其线性插值在面（或弦模型中的边）上标量积的积分。其优点是表面面积减少率等于表面扫过的体积率，这是平均曲率运动的一个特征。一个大缺点是矩阵 M 和 S 不再是局部的。详见第 7 章。S 是稀疏矩阵 (sparse matrix)，其条目对应于由边连接的每对顶点，M 是其稠密逆。

### 5.20.5 有效面积近似多面体曲率 (Approximate polyhedral curvature with effective area)

上一节没有区分平行于和垂直于表面的运动。更好的近似是只计算垂直于表面的运动。这可以通过在积分它们的标量积之前将插值向量场投影到面的法线上来完成。现在面积减少率等于几何体积扫过率，而不是上一段中必须计算体积扫过的略微不可靠的方式。同样 S 是稀疏矩阵，其条目对应于由边连接的每对顶点，M 是其稠密逆。

### 5.20.6 用户自定义迁移率 (User-defined mobility)

用户可以在数据文件中定义迁移率张量。有标量形式的关键字 `MOBILITY` 和张量形式的 `MOBILITY_TENSOR`。生效时，此迁移率乘以速度以给出新速度。这发生在本节前述迁移率应用之后、投影到约束之前。定义迁移率的公式可以包含可调参数，允许在运行时调整迁移率。

## 5.21 稳定性 (Stability)

迭代的时间步长不应大到放大表面的扰动。短波长扰动最容易被放大。本节包含各种迁移率模式稳定性特征的概述，足以让用户将最大时间步长与最小面或边大小相关联。讨论了两个示例：锯齿形弦和具有等边三角剖分的近平坦表面。不包括有效面积，因为它是近平坦表面的微不足道的修正。本节的一般结论是，迭代中的最大时间步长受最短边的长度或最小面的面积限制，只有一个例外。

### 5.21.1 锯齿形弦 (Zigzag string)

设扰动关于中线的幅度为 Y，边长为 L。则对小 Y，顶点上的力为 F = -4Y/L。设时间步长（Evolver 比例因子）为 Δt。设 V 为顶点速度。则扰动放大的临界时间步长由 VΔt = -2Y 给出，或 Δt = -2Y/V。

- **顶点迁移率**：这里 V = F，所以 Δt = L/2。
- **面积归一化**：这里顶点星的长度为 2L，所以 V = F/L 且 Δt = L²/2。
- **近似曲率**：结果表明锯齿形是迁移率矩阵 M 的最大特征值 3/L 的特征向量，所以 V = 3F/L 且 Δt = L²/6。这是近似曲率的一个主要缺点。如果扰动不稳定性是时间步长的限制因素，它将需要比面积归一化多三倍的迭代次数来完成相同的演化。

### 5.21.2 等边三角剖分的扰动片 (Perturbed sheet with equilateral triangulation)

考虑一个用面积为 A 的等边三角形三角剖分的平面表面。扰动由六边形凹痕 (dimples) 的铺砌组成，其中心高度 √Y 高于其外围。中心顶点处的力为 -√3Y，外围顶点处的力为 √3Y/2。

- **顶点迁移率**：临界时间步长由下式给出：

  (√3Y + √3Y/2)Δt = 2Y  (5.15)

  所以 Δt = 4/(3√3)。注意这与三角形大小无关。这与使用优化比例因子演化时的经验一致，其中最佳时间步长在 0.2 - 0.3 范围内，与三角形大小无关。这是此版本迁移率的一个明确优势，因为表面的不同部分可以有不同大小的三角剖分，一个大小的时间步长可以适用于所有部分。

- **面积归一化**：每个顶点的星面积为 6A，所以速度变为 -√3Y/(2A) 和 √3Y/(4A)，临界时间步长 Δt = 4√(A)/(6√3)。因此在具有不同大小三角形的表面上，时间步长受最小三角形面积的限制。

- **近似面积**：此力是迁移率矩阵特征值 2/A 的特征向量。因此速度是面积归一化的四倍，临界时间步长短四倍。

## 5.22 拓扑变化 (Topology changes)

"表面的拓扑 (topology of the surface)"一词指的是面的并集的拓扑。"三角剖分 (triangulation)"一词指的是面细分表面的特定方式。一些操作，如迭代，两者都不改变。一些，如细化，改变三角剖分但不改变拓扑。一些，如短边消除，可以改变两者。一些操作，如顶点弹出 (vertex popping)，旨在改变拓扑。

## 5.23 细化 (Refinement)

三角剖分的"细化 (refinement)"指的是通过细分原始三角剖分的每个三角形来创建新的三角剖分。Evolver 中使用的方案是在所有边的中点创建新顶点，并使用这些将每个面细分为四个与原始相似的新面。（单纯形细化参见技术参考章节。）

新元素的某些属性从创建它们的旧元素继承。固定性、约束和边界始终被继承。边上的环面包裹被一些但不是所有新边继承。表面张力和可显示性被新面继承。"额外 (Extra)"属性被同类型元素继承。

如果存在弯曲约束或边界，细化可以改变表面积和能量。体体积也是如此。

## 5.24 可调参数和变量 (Adjustable parameters and variables)

用户可以定义命名变量或"参数 (parameters)"并赋予它们值。它们可以在表达式不必为常数的任何地方使用，如约束公式或边界参数化。它们的值可以通过 `A` 命令更改，或通过赋值，例如从命令提示符 `"foo := 3.4"`。变量可以通过在数据文件顶部定义为 `"parameter foo = 3.4"` 来创建，或通过从命令提示符赋值。所有参数都是实值的。更改数据文件顶部声明的参数值将导致表面自动重新计算，假设此类参数用于约束或边界中，除非 `AUTORECALC` 已被切换关闭。

可以通过在数据文件中使用 `optimizing_parameter` 而非 `parameter` 来声明参数为优化变量（与顶点坐标一起）。关于优化参数的能量梯度和海森矩阵是数值而非符号计算的，因此会有速度和精度的损失。

在运行时，参数可以通过 `FIX` 和 `UNFIX` 命令切换为优化或非优化。即 `fix radius` 将使 radius 变量变为非优化（固定值）。

## 5.25 弦模型 (The String Model)

本节列出使用弦模型时需要注意的差异。

通常，面 (face) 承担体 (body) 的角色，边 (edge) 承担面 (facet) 的角色。坐标仍然是 3D 的。如果您想要规定体积的单元，始终将 z = 0 给顶点，并为每个面创建一个仅以该面为边界的体。

数据文件的 face 部分是可选的。

面在输入时不会被细分。

面面积仅使用 x,y 坐标计算，即使顶点仍然是 3D 的。

内容 (content) 指的是面积。

约束能量和内容被积函数是标量（只有一个分量，E1 或 C1，视情况而定），在约束上的顶点处计算。边的尾部计为负，头部计为正。

---

# 第6章 数据文件 (The Datafile)

## 6.1 数据文件的组织 (Datafile organization)

表面的初始配置从 ASCII 数据文件 (datafile) 中读取。数据文件分为六个部分：

1. 定义和选项 (Definitions and options)
2. 顶点 (Vertices)
3. 边 (Edges)
4. 面 (Faces)
5. 体 (Bodies)
6. 命令 (Commands)

在下面的语法描述中，关键字 (keywords) 将以大写显示。`const_expr` 表示常量表达式，`expr` 表示任何表达式。`n` 或 `k` 表示整数，如果用作有向元素标签则可以带符号。方括号表示可选项。`'|'` 表示"或"。

## 6.2 词法格式 (Lexical format)

对于了解此类知识的人，数据文件由 lex 程序生成的词法分析器 (lexical analyzer) 读取。规范在 `datafile.lex` 中。

### 6.2.1 注释 (Comments)

注释可以括在 `/* */` 对中（如 C 语言），可以跨行。`//` 表示该行的其余部分是注释，如 C++。

### 6.2.2 行和行拼接 (Lines and line splicing)

文件由行组成。换行符是重要的。下一个物理行可以通过在当前行的最后一个字符处放置 `\` 来拼接到当前行。行拼接在 `//` 注释中无效。空行和注释行可以自由放置在数据文件的任何位置。各种计算机系统使用的 CR 和 NL 的各种组合都被识别。

### 6.2.3 包含文件 (Including files)

标准 C 语言包含其他文件的方法可用。文件名必须在引号中。如果文件不在当前目录中，将搜索 `EVOLVERPATH`。包含可以嵌套大约 10 层。示例：

```
    #include "common.stuff"
```

### 6.2.4 宏 (Macros)

简单宏（无参数）可以像在 C 中一样定义：

```
     #DEFINE identifier string
```

`identifier` 必须是解析器中没有其他特殊含义的标识符（参见下面的关键字列表）。`string` 是逻辑行的其余部分，不包括注释。每当 `identifier` 作为标记随后出现时，它将被替换。替换会被重新扫描。不检查递归性。宏定义有最大长度（当前 500 个字符）。注意：宏标识符是单独的标记，因此如果 `"-M"` 翻译为 `"-2"`，这将被读作两个标记，而不是带符号的数字。

数据文件中的关键字 `keep_macros` 将在运行时保持宏定义活跃，直到加载下一个数据文件。

### 6.2.5 大小写 (Case)

数据文件中大小写不敏感，运行时仅对单字母命令敏感。

### 6.2.6 空白 (Whitespace)

空白由空格、制表符、逗号、冒号和分号组成。因此如果您想用逗号分隔坐标值是完全可以的。CTRL-Z 也是空白，为从 DOS 导入的文件提供便利。

### 6.2.7 标识符 (Identifiers)

标识符遵循标准 C 规则（由字母数字字符和 `_` 组成，首字符不是数字）且不能是关键字。标识符用于宏和可调常量。至少使用两个字符，因为单个字符可能与命令混淆。要查明名称是否已作为关键字或用户定义名称使用，请使用 `is_defined` 函数，其语法为：

```
     is_defined( stringexpr)
```

`stringexpr` 必须是带引号的字符串或其他字符串表达式。返回值为 0 表示未定义，1 表示已定义。

### 6.2.8 字符串 (Strings)

字符字面量字符串括在双引号中，使用标准 C 反斜杠转义约定处理特殊字符。连续的带引号字符串在读取时连接为一个字符串。

### 6.2.9 数字 (Numbers)

识别的数字表示包括整数、定点、科学记数法、十六进制和二进制数，例如：

```
     2   -3   .5   23.   5e-10   +0.7D2 0x4FA5 11101b
```

### 6.2.10 关键字 (Keywords)

本手册中提到的所有对 Evolver 具有特殊含义的词都应被视为保留字，不可供用户用作变量、命令、量名称等的标识符。

### 6.2.11 颜色 (Colors)

边和面的颜色记录为整数。这些整数如何在屏幕上转换为颜色取决于图形驱动程序的编写方式。为整数 0 到 15 提供了以下同义词，希望图形驱动程序能够正确显示它们：`BLACK`、`BLUE`、`GREEN`、`CYAN`、`RED`、`MAGENTA`、`BROWN`、`LIGHTGRAY`、`DARKGRAY`、`LIGHTBLUE`、`LIGHTGREEN`、`LIGHTCYAN`、`LIGHTRED`、`LIGHTMAGENTA`、`YELLOW` 和 `WHITE`。特殊颜色值 `CLEAR` (-1) 使面透明。这些标记在出现时被简单地翻译为整数值，因此它们是保留字。

### 6.2.12 表达式 (Expressions)

变量表达式 (Variable expressions) 用于约束和边界公式以及被积函数中。常量表达式 (Constant expressions) 可在需要实数值的任何地方使用。表达式以代数记法给出，具有以下标记：

| 标记 | 含义 |
|------|------|
| `x1,x2,...` | 坐标 |
| `x,y,z,w` | 坐标 |
| `p1,p2` | 边界的参数 |
| `constant` | 任何整数或实数 |
| `G` | 当前重力常数 |
| `identifier` | 用户定义的变量 |
| `identifier[expr]...` | 索引数组 |
| `E, PI` | 特殊常数 |
| `+,-,*,/,%,mod` | 实数算术 |
| `imod,idiv` | 整数算术 |
| `=` | 视为低优先级的 `-` |
| `(,)` | 分组和函数记法 |
| `^` | 实数幂次 |
| `**` | 实数幂次 |
| `?:` | 条件表达式，如 C 语言 |

**函数：**

| 函数 | 含义 |
|------|------|
| `abs` | 绝对值 |
| `sqr` | 平方 |
| `sin,cos,tan` | 三角函数 |
| `acos,asin,atan` | 反三角函数（acos, asin 参数限制在 [-1,1]） |
| `atan2` | 反正切，atan2(y,x) |
| `sqrt` | 平方根；参数必须非负 |
| `log,exp` | 自然对数、以 e 为底的指数 |
| `sinh,cosh,tanh` | 双曲函数 |
| `asinh,acosh,atanh` | 反双曲函数 |
| `pow` | pow(x,y)：x 的 y 次幂 |
| `ceil,floor` | 向上或向下取整 |
| `ellipticK,ellipticE` | 完全椭圆积分 (Complete elliptic functions) |
| `incompleteEllipticE` | (ϕ, m) 的不完全椭圆积分 |
| `incompleteEllipticF` | (ϕ, m) 的不完全椭圆积分 |
| `minimum,maximum` | 两个参数的最小值/最大值，即 minimum(a,b) |
| `usrn` | 用户定义的函数 |

用户定义的函数可以在 `userfunc.c` 中用 C 定义。它们适用于表达式解释太慢或需要椭圆积分等函数的情况。当前它们自动是坐标的函数。不要在表达式中给出任何参数；例如 `"(usr1 + usr3)/usr10"`。

表达式被解析为求值树 (evaluation trees)，在需要时进行解释。常量子树在解析时折叠为常量节点。关于在某些位置使用编译函数，请参见安装章节末尾关于动态加载库的部分。

常量表达式必须在读取时求值为值，即它们没有参数或坐标。

在解析表达式时，使用最长的合法表达式。这允许坐标通过几个连续的表达式指定，无需特殊分隔符。

注意：前面有空白后面跟数字的 `'+'` 或 `'-'` 被视为带符号数字。因此 `"3 - 5"` 和 `"3-5"` 是单个表达式，但 `"3 -5"` 不是。这是为了方便分隔在同一行上列出的多个表达式，如顶点坐标、度量分量等。如果对 `'-'` 将如何解释有疑问，或收到关于"值不足"的错误消息，请检查减号。

`mod` 运算符 `'%'` 或 `mod` 执行实数模运算：

x%y = x - floor(x/y) * y  (6.1)

整数运算符 `idiv` 在做整数除法之前将操作数向零取整（如 C 中实现的那样）。`imod` 将操作数向下取整：

x imod y = floor(x) - floor(floor(x)/floor(y)) * floor(y)  (6.2)

## 6.3 数据文件顶部：定义和选项 (Datafile top section: definitions and options)

每行以关键字开头。顺序无关紧要，但标识符必须在使用前定义，量必须在约束中引用前定义。这些都不是必需的，但标记为默认的将被假定，除非存在覆盖选项。

### 6.3.1 宏 (Macros)

```
        #DEFINE identifier string
```

参见上面的宏部分。

### 6.3.2 版本检查 (Version check)

```
evolver_version "2.10"
```

如果数据文件包含仅在 Evolver 某个版本之后才有的功能，数据文件可以包含上述形式的一行。如果当前版本较早，这将生成版本错误消息，或者如果在 2.10 之前的 Evolver 版本上运行，则只是语法错误。

### 6.3.3 元素 ID 编号 (Element id numbers)

数据文件顶部存在关键字：

```
keep_originals
```

与 `-i` 命令行选项效果相同，即在内部保持 ID 编号与数据文件中相同，而不是按读取顺序重新编号。

### 6.3.4 变量 (Variables)

```
        PARAMETER identifier = const_expr ON_ASSIGN_CALL procedure_name
```

这将 `identifier` 声明为具有给定初始值的变量。值可以通过 `A` 命令或赋值更改。变量可以在任何后续表达式或常量表达式中使用。更改此处定义的变量会导致表面自动重新计算，除非 `AUTORECALC` 已被切换关闭。

可选属性 `ON_ASSIGN_CALL` 指定每当变量值更改时调用的过程；该过程没有参数，且必须先前已声明为过程。例如：

```
 procedure tester();
 parameter aaa = 4
 parameter bbb = 5 on_assign_call tester
 procedure tester() aaa := bbb;
```

```
   OPTIMIZING_PARAMETER identifier = const_expr PDELTA = const_expr PSCALE = const_expr
       ON_ASSIGN_CALL procedure_name
```

这如上声明一个变量，附加属性是它受优化约束。即它与顶点坐标一起加入独立变量集。它与坐标的区别在于其梯度通过有限差分 (finite differences) 而非解析计算。因此它可以在允许变量的任何类型的表达式中使用。优化参数的海森矩阵已实现。可选的 `pdelta` 值是有限差分中使用的参数差值；默认值为 0.0001。可选的 `pscale` 值是参数运动的乘数，用于对参数与表面能量进行"阻抗匹配"。这些属性可以设置在任何参数上，以备潜在用作优化参数。在运行时，参数可以通过 `FIX` 和 `UNFIX` 命令切换为优化或非优化。即 `fix radius` 将使 radius 变量变为非优化（固定值）。`"Optimising_parameter"` 是同义词。

在运行时，可以使用变量的 `p_force` 属性查找在约束修正之前能量关于变量的变化率，使用 `p_velocity` 属性查找变量关于 `'g'` 命令比例因子的变化率。示例：

```
  g
  print height.p_velocity
```

### 6.3.5 数组 (Arrays)

可以定义整数或实数的多维数组，语法为：

```
 DEFINE variablename REAL|INTEGER|STRING [expr]...
```

此语法在数据文件头和命令提示符中都有效。如果数组已存在，它将被调整大小，尽可能保留旧元素。不要用不同数量的维度调整大小。示例：

```
 define fvalues integer[10][4]
 define basecoord real[10][space_dimension]
```

在数据文件顶部，数组可以在定义后用嵌套的大括号初始化器初始化。例如：

```
 define qwerty integer[4] = 23, 45, 12, 2
 define vmat real[3][2] = 1,2,3,4,5,6
 define primcol string[3] = "red","blue","green"
```

初始化器不必完整；缺失的值将为零。

数组大小可以通过在运行时执行另一个定义来更改，但维度数量必须相同。调整大小时尽可能保留数组条目值。

`PRINT` 命令可用于以括号形式打印整个数组或数组切片。示例：

```
 print fvalues
 print fvalues[4]
```

在运行时命令语言中，有一些基本的全数组操作，允许数组在赋值语句的左侧：

```
 array := scalar
 array := array
 array := scalar * array
 array := array + array
 array := array - array
 array := array * array
```

这里赋值两侧的 "array" 意味着单个完整数组；不是产生数组的表达式或数组切片。但 "scalar" 可以是求值为单个值的任何表达式。对于乘法，数组必须是二维的，且大小正确匹配。这些操作也适用于作为数组的元素属性。对于向量的内积，有中缀运算符 `dot_product`。

### 6.3.6 维度 (Dimensionality)

表面本身的维度可以声明：

```
          STRING
```

Evolver 将使用弦模型（参见弦模型一节）。

```
          SOAPFILM
```

Evolver 将使用标准二维表面模型。（默认）

或者，

```
          SURFACE_DIMENSION const_expr
```

表面为给定维度。超过 2 的维度仅在单纯形模型中有效。

### 6.3.7 域 (Domain)

```
          EUCLIDEAN (default)
```

表面存在于欧几里得空间中。

```
         SPACE_DIMENSION const_expr
```

表面存在于给定维度的欧几里得空间中。默认为 3。维度必须最多为 model.h 中 `MAXCOORD` 的值，分发版本中为 4。

```
          TORUS
```

表面存在于三维平坦环面中。表面等同于周期性表面。

```
          TORUS_FILLED
```

表示整个环面被体填充，使程序在调整约束体积时避免退化矩阵。

```
           PERIODS
                 expr    expr    expr
                 expr    expr    expr
                 expr    expr    expr
```

与 `TORUS` 域一起使用。指定单位晶胞平行六面体的侧向量（基向量）在接下来的几行中。每个向量由其分量给出。此矩阵的大小取决于空间维度。默认为单位立方体。可调参数可以在表达式中使用，因此基本域可以通过 `'A'` 命令或通过为参数赋新值来交互式更改。确保执行 `recalc` 以重新计算周期矩阵。

```
           SYMMETRY_GROUP "name"
```

定义域是 R^n 关于用户定义对称群的商空间。用户必须链接定义群运算的 C 函数。参见 `quotient.c` 作为示例。`"name"` 是带双引号的名称，与 `quotient.c` 中的名称进行检查以确保链接了正确的对称群。

```
        SYMMETRIC_CONTENT
```

对于体体积积分，使用替代面积分：

V = (1/3) ∫∫ (x**i** + y**j** + z**k**) · d**S**  (6.3)

如果体未建模的侧面从原点径向延伸，或者约束内容积分（通过近似计算）在应为对称的表面上导致不对称结果，这很有用。

### 6.3.8 长度方法 (Length method)

此项 `length_method_name` 指定用于替代默认 `edge_area` 方法计算边长度的预定义方法的名称。它是可选的。使用会自动调用全量模式。主要用途是在二维泡沫中使用精确的圆弧。语法：

```
volume_method_name quoted_method_name
```

例如：

```
string
space_dimension 2
length_method_name "circular_arc_length"
```

特殊方法 `null_length` 可用于获得零值。

### 6.3.9 面积方法 (Area method)

此项 `area_method_name` 指定用于替代弦模型中默认 `edge_area` 方法或肥皂膜模型中 `facet_area` 方法计算面面积的预定义方法的名称。在弦模型中，它与 `volume_method_name` 同义。它是可选的。使用会自动调用全量模式。为在二维泡沫中使用精确圆弧而开发。语法：

```
area_method_name quoted_method_name
```

例如：

```
string
space_dimension 2
area_method_name "circular_arc_area"
```

特殊方法 `null_area` 可用于获得零值。

### 6.3.10 体积方法 (Volume method)

此项 `volume_method_name` 指定用于替代默认 `edge_area` 或 `facet_volume` 方法计算体体积（或弦模型中的面面积）的预定义方法的名称。它是可选的。使用会自动调用全量模式。语法：

```
volume_method_name quoted_method_name
```

例如：

```
string
space_dimension 2
volume_method_name "circular_arc_area"
```

### 6.3.11 表示法 (Representation)

```
           LINEAR     (default)
```

面是平面三角形。

```
           QUADRATIC
```

面是二次曲面片。参见二次表示一节。

```
         LAGRANGE n
```

表面处于 n 阶拉格朗日表示法中。最好不要尝试手动创建拉格朗日表示法输入文件。此短语在此是为了使拉格朗日表示法的转储文件可以重新加载。

```
  SIMPLEX_REPRESENTATION
```

面由有向顶点列表而非边列表定义。参见上面单纯形模型一节。

### 6.3.12 海森特殊法向量 (Hessian special normal vector)

在使用 Hessian 命令时，让扰动沿指定方向而非通常的表面法线可能是有用的。方向向量场在数据文件头部分中指定，语法为：

```
HESSIAN_SPECIAL_NORMAL_VECTOR
c1: expr
c2: expr
c3: expr
```

顶点属性可以在分量表达式中使用，这允许在指定向量场之前进行复杂的计算。例如，可以：

```
define vertex attribute pervec real[3]
HESSIAN_SPECIAL_NORMAL_VECTOR
c1: pervec[1]
c2: pervec[2]
c3: pervec[3]
```

### 6.3.13 动态加载库 (Dynamic load libraries)

要加载编译函数的动态库，语法为：

```
 LOAD_LIBRARY "filename"
```

其中带双引号的文件名是库。当前目录和 `EVOLVERPATH` 将被搜索。关于如何设置和使用动态加载库的详细信息，请参见安装章节。

### 6.3.14 额外属性 (Extra attributes)

可以动态定义元素的额外属性 (extra attributes)，可以是单个值或最多八维数组。定义语法为：

```
   DEFINE elementtype ATTRIBUTE name type [[dim] ...]
```

其中 `elementtype` 是 `vertex`、`edge`、`facet` 或 `body`，`name` 是您选择的标识符，`dim` 是维度的可选表达式。类型为 `REAL` 或 `INTEGER`（内部还有 `ULONG` 无符号长整型）。类型后面可以跟 `FUNCTION`，再跟括号中的过程，在读取属性值时评估；在公式中，`self` 可用于引用相关元素以使用其属性，特别是用于在某个点为属性赋值。目前实数和整数类型之间没有实际区别，因为所有内容在内部都存储为实数。但将来可能会添加更多数据类型。额外属性被由细分生成的同类型元素继承。示例：

```
 define edge attribute charlie real
 define vertex attribute newx real
 define vertex attribute vmat real[3][2]
 vertices
 1 2 0 0 newx 3 vmat 1,2,3,4,5,6
```

命令语言可以使用与内置属性相同的语法使用名称，并可以在运行时定义额外属性：

```
 set vertex newx x
 define edge attribute vibel real[2]
 set edge[2] vibel[1] 3; set edge[2] vibel[2] 4
 print vertex[3].newx
```

属性数组大小可以通过在运行时执行另一个定义来更改，但维度数量必须相同。

额外属性的总元素数可以在运行时通过 `sizeof` 函数检索，语法为：

```
 SIZEOF(name)
```

`PRINT` 命令可用于以括号形式打印整个数组或数组切片。示例：

```
 print vertex[34].newx;
 print facet[1].knots[3][2];
```

### 6.3.15 表面张力能量 (Surface tension energy)

表面张力能量默认始终包含在总能量中。只能通过给面（或弦模型中的边）`"density 0"` 属性来关闭。

```
          AREA      (default)
```

面的表面能量是其面积乘以其表面张力。

```
          WULFF      "filename"
```

指定使用晶体被积函数。下一个标记应该是带双引号的文件名（带路径），给出被积函数的 Wulff 向量。文件格式为每行一个 Wulff 向量，其三个分量以 ASCII 十进制格式用空格分隔。第一个空行结束规范。一些特殊的被积函数可以通过在文件名位置给出特殊名称来使用。当前这些是 `"hemisphere"` 表示上单位半球的 Wulff 形状，和 `"lens"` 表示两个厚度为 1/2 的单位球冠在水平面上粘合在一起。这两个不需要单独的文件。

```
          PHASEFILE       "filename"
```

这允许晶界 (grain boundary) 的表面张力依赖于相邻晶粒的相 (phases) 或类型。信息从 ASCII 文件读取。文件的第一行是不同相的数量。之后的每行由两个相编号和它们之间的表面张力组成。不以一对数字开头的行被视为注释。如果未提到一对相，它们之间的表面张力取为 1.0。弦模型中的面或肥皂膜模型中的体可以通过 `PHASE` 短语标记相。

### 6.3.16 平均曲率平方 (Squared mean curvature)

```
  SQUARE_CURVATURE const_expr
```

此短语表示平均曲率平方的积分将被包含在能量中，权重由 `const_expr` 给出。权重可以通过 `A` 命令通过更改可调常数平方曲率模量的值来更改。

### 6.3.17 积分平均曲率 (Integrated mean curvature)

```
  MEAN_CURVATURE_INTEGRAL const_expr
```

此短语表示平均曲率的积分将被包含在能量中，权重由 `const_expr` 给出。权重可以通过 `A` 命令通过更改可调常数平均曲率模量的值来更改。

### 6.3.18 高斯曲率 (Gaussian curvature)

```
  GAUSS_CURVATURE const_expr
```

此短语表示高斯曲率的积分将被包含在能量中，权重由 `const_expr` 给出。

### 6.3.19 高斯曲率平方 (Squared Gaussian curvature)

```
  SQUARE_GAUSSIAN_CURVATURE const_expr
```

此短语表示高斯曲率平方的积分将被包含在能量中，权重由 `const_expr` 给出。权重可以通过 `A` 命令通过更改可调常数 `square_Gaussian_modulus` 的值来更改。同义词：`squared_gaussian_curvature`、`sqgauss`。

### 6.3.20 理想气体模型 (Ideal gas model)

```
          PRESSURE const_expr
```

指定体是可压缩的，环境压力为给定值。默认是具有给定体积的体不可压缩。

### 6.3.21 重力 (Gravity)

```
         GRAVITY_CONSTANT const_expr
```

指定重力常数 G。默认 1.0。

### 6.3.22 间隙能量 (Gap energy)

```
         GAP_CONSTANT const_expr
```

凸约束间隙能量的乘数。默认 1.0。同义词：`spring_constant`

### 6.3.23 纽结能量 (Knot energy)

有一堆命名量方法用于纽结能量，应使用该语法。但有一些同义词在流通。

```
         INSULATING_KNOT_ENERGY const_expr
```

总能量将包含纽结能量方法 `knot_energy`，乘数为 `const_expr`。命名量的缩写。

```
         CONDUCTING_KNOT_ENERGY const_expr
```

总能量将包含纽结能量方法 `edge_knot_energy`，乘数为 `const_expr`。命名量的缩写。

### 6.3.24 迁移率和平均曲率运动 (Mobility and motion by mean curvature)

```
          GRADIENT_MODE (default)
```

速度等于力。

```
          AREA_NORMALIZATION
```

顶点的速度是力除以相邻面面积的 1/3（或弦模型中相邻边长度的 1/2）以近似平均曲率运动。

```
   APPROXIMATE_CURVATURE
```

通过多面体线性插值内积从力计算顶点速度。不要与 `AREA_NORMALIZATION` 一起使用。

```
   EFFECTIVE_AREA
```

对于面积归一化和近似曲率模式，运动阻力仅在速度的表面法线分量上。

### 6.3.25 退火 (Annealing)

```
          JIGGLE
```

持续抖动。默认无。

```
          TEMPERATURE const_expr
```

给出抖动的温度。默认 0.05。

### 6.3.26 扩散 (Diffusion)

```
          DIFFUSION const_expr
```

指定体之间的扩散以给定的扩散常数生效。默认 0。

### 6.3.27 命名方法实例 (Named method instances)

这些是通过名称引用的计算几何元素标量值的方法。它们被命名量使用（参见下一小节）。关于每种模型（线性、二次、拉格朗日、单纯形等）中哪些有效，请参见第 4 章。

```
METHOD_INSTANCE name METHOD methodname [MODULUS constexpr]
     [ELEMENT_MODULUS attrname] [GLOBAL] parameters
```

这是命名量的命名方法实例的显式定义。如果您的量有多个方法实例，并且您想查看它们的单独值或将实例应用于不同的元素，则此类显式定义很有用。模量乘以方法值以给出实例值。默认模量为 1。`GLOBAL` 使方法应用于适当类型的所有元素。非全局实例可以单独应用于元素。

每种方法可以有各种参数来将其特化为实例。当前此处指定的唯一参数是标量被积函数，语法为：

```
    SCALAR_INTEGRAND: expr
```

向量被积函数，语法为：

```
VECTOR_INTEGRAND:
       Q1:   expr
       Q2:   expr
       Q3:   expr
```

2-形式被积函数 (2-form integrands)，语法为：

```
FORM_INTEGRAND:
        Q1:     expr
        Q2:     expr
        Q3:     expr
       $. . . $
```

其中形式分量按字典序排列，即在 4D 中六个分量 12,13,14,23,24,34 将列为 Q1 到 Q6。

表达式可以使用各个元素的属性（密度、长度、额外属性等）。某些方法使用全局参数（这是最终将被消除的遗留问题）。实例定义不必在一行上。

有关可用方法的列表及其所需规范，请参见命名方法和量一章。

### 6.3.28 命名量 (Named quantities)

```
QUANTITY name ENERGY| FIXED =value | INFO_ONLY| CONSERVED
 [MODULUS constexpr] [LAGRANGE_MULTIPLIER constexpr] [TOLERANCE constexpr]
 methodlist | FUNCTION methodexpr
```

这些是为了提供一种更系统的方式来添加新能量和约束的努力。"方法"是从某种特定类型的元素（顶点、边、面、体）计算标量值的一种方式。"量"是应用于各种元素的各种方法的总和，尽管通常只涉及一种方法。名称是标识符。任何量都可以声明为三种类型之一：1) 能量量添加到表面的总能量中；2) 固定量被约束为固定目标值（通过每次迭代的单个牛顿步）；3) 信息量的值仅报告给用户；4) 守恒量 (conserved quantities) 不作为这样的量评估，但梯度和海森矩阵在计算运动方向时将它们视为固定量。

每个量都有一个"模量"，它是整个量的标量乘数。模量为 0 将关闭能量量。默认模量为 1。添加新方法涉及编写 C 例程来计算作为顶点坐标函数的值和梯度，并在 `quantity.c` 中的方法名称数组中添加结构。

对于固定量，可选的拉格朗日乘子值提供拉格朗日乘子的初始值（量的 `"pressure"` 属性）。它用于转储文件，因此重新加载时无需进行迭代即可拥有有效的拉格朗日乘子。

对于固定量，`tolerance` 属性用于判断收敛。当所有量偏差与容差之比的总和小于 1 时，表面被认为收敛。此总和还包括固定体积的体。如果未设置容差或为负，则使用变量 `target_tolerance` 的值，默认值为 0.0001。

守恒量对于消除 hessian 计算中不需要的自由度很有用，特别是旋转。最好将量应用于顶点而不是边或面。守恒量与优化参数不兼容，因为优化参数的梯度通过有限差分找到，在这里不起作用。

量定义的 methodlist 版本可以包含一个或多个方法实例。要合并先前显式定义的实例，包含：

```
     METHOD instancename
```

要在量定义中实例化方法，您实质上是合并实例定义，但没有实例名：

```
     METHOD methodname [MODULUS constexpr] [GLOBAL] parameters
```

详见上一小节关于方法的细节。通常第二种隐式定义更方便，因为通常每个量只有一个方法。如果使用 `GLOBAL_METHOD` 代替 `GLOBAL`，则方法应用于适当类型的所有元素。它等同于在方法规范中使用 `GLOBAL` 关键字。非全局实例必须单独应用于元素。这只需在定义元素的行中添加量或实例名称即可。如果使用量名称，则该量的所有适当类型的方法实例都应用于元素。量的原始附加被记住，因此如果边方法应用于面，则从细化该面创建的边将继承边方法。可定向方法可以在数据文件中通过在名称后跟短划线应用于具有负方向的元素。`set` 命令中的方向遵循元素生成时的方向。

量也可以通过方法实例的任意函数来定义。关键字 `FUNCTION` 指示这一点，后跟定义函数表达式。涉及的方法实例必须都已预先定义为命名方法实例。

量值可以通过 `Q` 或 `A` 命令查看，或在命令中引用为 `"quantityname.value"`。不要只使用 `quantityname`，因为 `quantityname` 单独被解释为元素属性。可以为 `quantityname.target` 或 `quantityname.modulus` 赋值。

示例：

```
   Hooke energy:
   quantity hooke ENERGY modulus 10 global_method hooke_energy
```

一个小示例数据文件：

```
// test of quantity integrands on constraints

method_instance len method edge_length
quantity lenny info_only method len

quantity sam info_only method facet_scalar_integral
scalar_integrand z

vertices
1 0 0 1 fixed
2 1 1 2 fixed
3 0 1 3 fixed

edges
1 1 2 lenny
2 23
3 3 1 len

faces
1 1 2 3 sam
```

示例数据文件 `knotty.fe` 包含更多示例。

数据文件顶部的关键字 `EVERYTHING_QUANTITIES` 使所有面积、体积等被转换为命名量和方法。它等同于命令行选项 `-q` 或 `convert_to_quantities` 命令。

### 6.3.29 水平集约束 (Level set constraints)

```
        CONSTRAINT n [GLOBAL] [CONVEX] [NONNEGATIVE| NONPOSITIVE] [NONWALL] [CONTENT_RANK n]
        EQUATION | FORMULA | FUNCTION expr
      [ ENERGY
        E1:   expr
        E2:   expr
        E3:   expr]
      [ CONTENT
       C1:      expr
       C2:      expr
       C3:      expr]
```

这定义了约束编号 n，其中 n 是正整数。`GLOBAL` 意味着约束自动适用于所有顶点（但不自动适用于边或面）。`GLOBAL` 约束计入数量限制。如果给出 `CONVEX`，则约束中的边被赋予额外的间隙能量，以防止它们试图短路凸边界；参见上面的约束和能量部分以及 `k` 命令。如果给出 `NONNEGATIVE` 或 `NONPOSITIVE`，则所有顶点将在每次迭代中被强制适当地符合约束。`EQUATION` 表达式定义实际约束的零水平集。它可以写成方程，因为 `'='` 被解析为低优先级的减号。不要使用 `'>'` 或 `'<'` 表示不等式；使用 `NONNEGATIVE` 或 `NONPOSITIVE` 和表达式。条件表达式，如 C 语言中，对于定义由多个光滑连接的表面组成的约束很有用，例如带半球形端盖的圆柱。

`NONWALL` 指示此约束在顶点和边弹出中被忽略，各种"星"平均曲率平方方法不会将此约束视为镜面平面。

公式可以包含 Evolver 已知其值的任何表达式，给定特定顶点。最常见的是只使用顶点的坐标 (x,y,z)，但可以使用变量、量值或顶点额外属性。使用顶点额外属性是将一个公式定制到各个顶点的好方法。例如，如果有一个名为 `zfix` 的顶点额外属性，可以用一个公式 `z = zfix` 的约束强制顶点到各自的 z 值，当然要先为每个顶点分配适当的 `zfix` 值。在细化或以其他方式创建新顶点后，确保修正额外属性，因为新顶点的额外属性默认值为 0。

注意：单侧约束可能导致最佳比例因子算法行为异常。可能需要使用固定的比例因子。参见下面的 `m` 命令。

重要注意：不要让两个具有相同公式的约束应用于顶点；这会导致在尝试将顶点投影到约束上时矩阵求逆奇异。例如，不要让顶点受 `X1 = 0` 约束同时还有全局 `X1 NONNEGATIVE`。

`ENERGY` 表示约束上的顶点或边被认为具有能量。在 `SOAPFILM` 模型中，接下来的三行给出沿约束上每条边积分的向量场的分量。在 `STRING` 模型中，只需要一个分量，在约束上的每个顶点处计算。其主要目的是允许完全在约束上的面被省略。它们本应有的任何能量应包含在此处。一个用途是在约束处获得规定的接触角。此能量还应包括因省略面而产生的重力势能。不对 `FIXED` 的边计算积分。

`CONTENT` 表示约束上的顶点（`STRING` 模型）或边（`SOAPFILM` 模型）对体的面积或体积有贡献。如果体在约束上的边界没有以面的形式给出，则体体积必须从内容积分中获得贡献。理解内容如何添加到体中对于正确设置符号至关重要。积分沿边的正方向计算。如果边在面上正向定向，面在体上正向定向，则积分被添加到体中。这最终可能给出与您认为自然的被积函数相反的符号。加载新数据文件时始终检查积分是否正确。

如果顶点（弦模型）或边（肥皂膜模型）在具有内容积分的多个约束上（例如在壁面相交处），那么如果存在内容等级 (content ranks)，等级最低的内容积分将贡献到负侧体的内容，等级最高的内容积分将贡献到正侧体的内容。

警告：这些积分仅对位于约束上且两个端点都在约束上的边进行计算。在单侧约束上放置任何这些积分都是不好的主意，因为两个端点实际上必须到达约束才能计数。

### 6.3.30 约束容差 (Constraint tolerance)

```
             CONSTRAINT_TOLERANCE const_expr
```

这是顶点被认为满足约束的容差。默认 1e-12。

### 6.3.31 边界 (Boundaries)

```
           BOUNDARY n PARAMETERS k [CONVEX] [CONTENT_RANK n]
            X1   expr
            X2   expr
            X3   expr
          [ ENERGY
            E1   expr
            E2   expr
            E3   expr]
          [ CONTENT
            C1   expr
            C2   expr
            C3   expr]
```

这定义了边界编号 n，其中 n 是正整数，k 是参数的数量（1 或 2）。如果给出 `CONVEX`，则边界上的边被赋予额外的能量以防止它们试图短路凸边界；参见下面的 `k` 菜单选项。接下来的三行是三个坐标关于参数 P1（可能还有 P2）的函数。边界的能量和内容积分使用与约束相同的语法实现。

### 6.3.32 数值积分精度 (Numerical integration precision)

```
          INTEGRAL_ORDER_1D n
          INTEGRAL_ORDER_2D n
```

设置数值积分精确完成的多项式次数。边积分通过 k 点高斯求积完成。这对 n = 2k − 1 次多项式给出精确值。默认为 k = 2，将精确计算三次多项式。阶数没有限制，因为权重和横坐标由 Evolver 计算。

面积分通过 1、3、7、12 或 28 点积分完成，对应于 n = 1、2、5、6 或 11。

### 6.3.33 比例因子 (Scale factor)

```
          SCALE const_expr       [FIXED]
```

设置初始比例因子。如果存在 `FIXED`，则设置固定比例因子模式。默认为 scale = 0.1 和优化模式。

```
          SCALE_LIMIT const_expr
```

设置比例因子的上限以防止失控运动。默认值为 1。如果您使用不接近 1 的表面张力和密度，可能需要设置此值。

### 6.3.34 迁移率 (Mobility)

```
           MOBILITY_TENSOR
           expr   expr    expr
           expr   expr    expr
           expr   expr    expr
```

或

```
           MOBILITY expr
```

力向量乘以迁移率标量或张量以获得速度。适用于例如使晶界迁移率依赖于温度。

### 6.3.35 度量 (Metric)

```
           METRIC
           expr   expr    expr
           expr   expr    expr
           expr   expr    expr
```

或

```
           CONFORMAL_METRIC
           expr
```

或

```
           KLEIN_METRIC
```

用户可以仅为弦模型定义背景度量。关键字 `METRIC` 后跟度量张量的 N² 个分量，其中 N 是空间维度。分量不必遵循任何特定的行布局；它们可以全部在一行上，每个在自己的行上，或任何组合。由用户负责维护对称性。共形度量是单位矩阵的标量倍数，只需给出倍数即可。共形度量的运行速度约为两倍。Klein 度量是在单位圆盘或球体上建模的双曲 n 空间的内置度量。

### 6.3.36 自动切割 (Autochopping)

```
     AUTOCHOP const_expr
```

这开启了长边的自动切割。常数是最大边长。

### 6.3.37 自动弹出 (Autopopping)

```
     AUTOPOP
```

这开启了短边和不适当顶点的自动弹出。

### 6.3.38 总时间 (Total time)

```
     TOTAL_TIME const_expr
```

这允许设置以固定比例演化的表面的初始时间。主要用于从转储文件恢复时。

### 6.3.39 龙格-库塔法 (Runge-Kutta)

```
  RUNGE_KUTTA const_expr
```

这开启了使用龙格-库塔方法进行迭代。

### 6.3.40 位似缩放 (Homothety scaling)

```
  HOMOTHETY const_expr
```

这开启了每次迭代进行位似缩放。缩放是从原点的均匀缩放，以保持所有体的总体积在给定值。

### 6.3.41 视图矩阵 (Viewing matrix)

```
  VIEW_MATRIX
  const_expr const_expr const_expr const_expr
  const_expr const_expr const_expr const_expr
  const_expr const_expr const_expr const_expr
  const_expr const_expr const_expr const_expr
```

用于指定表面的初始视图变换矩阵。矩阵在齐次坐标 (homogeneous coordinates) 中，平移在最后一列。矩阵大小比空间维度大一。此矩阵将成为所有转储文件的一部分，因此视图可以在会话之间保存。此矩阵仅适用于内部图形（Postscript、Xwindows 等），不适用于外部图形（geomview）。元素可以在运行时通过 `view_matrix[i][j]` 读取，索引从 1 开始。

### 6.3.42 视图变换 (View transforms)

```
  VIEW_TRANSFORMS integer
  [color color]
  [swap_colors swap_colors]
  const_expr const_expr const_expr const_expr
  const_expr const_expr const_expr const_expr
  const_expr const_expr const_expr const_expr
  const_expr const_expr const_expr const_expr
  ...
```

为了同时显示表面的多个变换，可以给出多个视图变换矩阵。变换适用于所有图形，内部和外部，并且在内部图形的视图变换矩阵之前。恒等变换始终执行，因此不需要指定。矩阵数量跟在关键字 `VIEW_TRANSFORMS` 之后。每个矩阵在齐次坐标中。每个矩阵的大小比空间维度大一。单个矩阵不需要特殊分隔；Evolver 只是继续疯狂读取表达式直到获得所有需要的数字。每个矩阵前面可以有颜色规范，适用于由该矩阵变换的面。颜色仅适用于一个变换；它不会继续到下一个颜色规范。如果存在 `SWAP_COLORS`，则应用此矩阵时面的正面颜色和背面颜色将被交换。变换可以通过 `transforms on` 或 `transforms off` 交互式激活或停用。内部变量 `transform_count` 记录变换数量，变换矩阵可以在运行时作为三维矩阵 `view_transforms[][][]` 访问。参见下一段了解控制视图变换的更复杂方式。

### 6.3.43 视图变换生成器 (View transform generators)

```
  VIEW_TRANSFORM_GENERATORS integer
  SWAP_COLORS
  const_expr const_expr const_expr const_expr
  const_expr const_expr const_expr const_expr
  const_expr const_expr const_expr const_expr
  const_expr const_expr const_expr const_expr
  ...
```

列出所有视图变换（如上一段所述）既繁琐又不灵活。另一种方法是只列出几个可以生成变换的矩阵。参见 `transform_expr` 命令了解输入生成实际变换的表达式的说明。特别注意：在环面模式中，周期平移会自动添加到列表末尾。因此在环面模式中，即使数据文件中没有 `view_transform_generators`，这些也始终可用。如果存在 `SWAP_COLORS`，则应用此矩阵时面的正面颜色和背面颜色将被交换。内部变量 `transform_count` 记录变换数量，变换矩阵可以在运行时作为三维矩阵 `view_transforms[][][]` 访问。

### 6.3.44 缩放参数 (Zoom parameter)

```
ZOOM_RADIUS constexpr
  ZOOM_VERTEX constexpr
```

设置缩放命令的当前参数。用于转储文件，而非用户的原始数据文件。

### 6.3.45 替代体积方法 (Alternate volume method)

```
VOLUME_METHOD_NAME "methodname"
```

设置用于计算面下体积（或 2D 中边下面积）的方法为命名方法（带引号给出）。自动将所有内容转换为量。

### 6.3.46 固定面积约束 (Fixed area constraint)

```
FIXED_AREA expr or AREA_FIXED expr
```

将总面积约束为给定值的过时方法。不再使用。请在固定命名量中使用 `facet_area` 方法。

### 6.3.47 品质因子 (Merit factor)

```
MERIT_FACTOR expr
```

如果关键字 `MERIT_FACTOR` 存在，则 `i` 命令将打印比率 total_area³/total_volume²，该比率衡量面积包围体积的效率。这是 Evolver 早期试图超越 Kelvin 空间分割的遗留物。

### 6.3.48 参数文件 (Parameter files)

```
PARAMETER name PARAMETER_FILE string
```

参数可以用文件中的一组值初始化，但我目前忘记了它是如何工作的。

### 6.3.49 抑制警告 (Suppressing warnings)

不需要的警告可以通过包含以下语法的行来抑制：

```
 SUPPRESS_WARNING number
```

其中 `number` 是警告编号。旨在抑制您知道无关的恼人警告消息。警告可以通过以下语法恢复：

```
 UNSUPPRESS_WARNING number
```

### 6.3.50 内存分配提示 (Giving hints on memory allocation)

可以在数据文件开头指示 Evolver 分配多少各种数据结构。这样做完全是可选的，但对于大型表面，它可能加速加载并减少由于扩展元素列表导致的内存碎片。语法：

```
 vertices_predicted number
 edges_predicted number
 facets_predicted number
 facetedges_predicted number
 bodies_predicted number
 method_instances_predicted number
 quantities_predicted number
```

这些可以独立使用；如果您不期望大量命名量，可以只预测从顶点到体的数量。

## 6.4 元素列表 (Element lists)

几何元素的列表遵循一般格式。每个元素在一行上定义。行上的第一个条目是元素编号。编号不必连续，可以省略数字，但请注意内部元素将按顺序重新编号。数据文件中的原始编号可作为元素的 `"original"` 属性访问。元素编号之后是基本定义数据，后跟任意顺序的可选属性。除了下面列出的每种元素类型的特定属性外，可以为先前定义的任何额外属性指定值。语法是属性名称后跟适当数量的值。也可以列出任意数量的命名量或方法实例。这些将此元素的方法值添加到命名量中。命名量或实例必须已在数据文件顶部声明。参见上面的命名量部分。

## 6.5 顶点列表 (Vertex list)

顶点列表由行首关键字 `VERTICES` 开始。后跟每行一个顶点规范的行，格式为以下之一：

```
 k x y z [FIXED] [CONSTRAINT c1 [c2]] [BARE] [quantityname ...] [methodname ...]
```

```
 k p1 [p2] BOUNDARY b [FIXED] [BARE] [quantityname ...] [methodname ...]
```

这里 k 是顶点编号，正整数。顶点不必按顺序列出，编号可以有间隔。但是，如果不按连续顺序，则转储文件中的编号将不同。x、y 和 z 是域中坐标的常量表达式；p1 和 p2 是参数值的常量表达式。如果给出 `FIXED`，则顶点永远不会移动，除了可能到约束的初始投影。如果给出 `CONSTRAINT`，则必须跟一个或两个约束编号。（实际上，您可以列出任意数量的约束，只要在任何时候精确适用的约束是相容且独立的。）给定的坐标不必精确位于约束上；它们将被投影到约束上。

如果给出 `BOUNDARY`，则给出边界参数值而非坐标。顶点坐标将由边界编号 b 的坐标公式定义。顶点只能在一个边界上。

`BARE` 属性只是对检查例程的指示，表明此顶点在肥皂膜模型中不应有相邻的面，因此不会生成虚假警告。当您想显示裸线或勾勒基本域的轮廓时很有用。

## 6.6 边列表 (Edge list)

边列表由行首关键字 `EDGES` 开始。后跟每行一个边规范的行，格式为（此处行已拼接）：

```
 k v1 v2 [midv] [s1 s2 s3] [FIXED] [BOUNDARY b] [CONSTRAINTS c1 c2 ...]
  [TENSION | DENSITY const_expr] [COLOR n] [BARE] [NO_REFINE] [NONCONTENT]
  [quantityname ...] [methodname ...]
```

这里 k 是边编号，编号规则与顶点相同。v1 和 v2 是边的尾顶点和头顶点的编号。在二次模型中，边的中点可以列为第三个顶点 midv（默认将创建中点）。在 `TORUS` 模型中，接下来是三个符号 s1 s2 s3，指示边如何包裹每个单位晶胞方向：`+` 表示正向一次，`*` 表示无，`-` 表示反向一次。`FIXED` 意味着细分此边产生的所有顶点和边将具有 `FIXED` 属性。它并不意味着边的端点将被固定。（注意：`EFIXED` 是 `FIXED` 的过时版本，来自 `FIXED` 不固定端点的时代。）同样，`BOUNDARY` 和 `CONSTRAINT` 属性将被从此边派生的所有边和顶点继承。如果约束有能量或内容被积函数，将为此边计算。重要：如果约束编号给出为负数，边能量和内容积分将以相反方向进行。在弦模型中，默认张力为 1，在肥皂膜模型中，默认张力为 0。然而，在肥皂膜模型中可以给边非零张力，它们将贡献能量。`NO_REFINE` 意味着此边不会被 `r` 命令细分。

如果单纯形模型生效，边比面少一个维度，由有序顶点列表给出。只有具有积分的约束上的边需要列出。

`BARE` 属性只是对检查例程的指示，表明此边在肥皂膜模型中不应有相邻的面，因此不会生成虚假警告。当您想显示裸线或勾勒基本域的轮廓时很有用。

`NONCONTENT` 属性表示此边不用于肥皂膜模型中的任何体积计算或弦模型中的面积计算。

## 6.7 面列表 (Face list)

面列表由行首关键字 `FACES` 开始。后跟每行一个面规范的行，格式为：

```
 k e1 e2 ... [FIXED] [TENSION | DENSITY const_expr] [BOUNDARY b]
  [CONSTRAINTS c1 [c2]] [NODISPLAY] [NO_REFINE]
  [COLOR n] [FRONTCOLOR n] [BACKCOLOR n] [PHASE n] [NONCONTENT]
  [quantityname ...] [methodname ...]
```

这里 k 是面编号，编号规则与顶点相同。接下来是面周围逆时针顺序的有向边编号列表。负边编号意味着与边列表中定义的相反方向。最后一条边的头部必须是第一条边的尾部（除非您在弦模型中使用技巧）。边数没有限制。在肥皂膜模型中，如果面超过三条边，将自动细分为三角形。`TENSION` 或 `DENSITY` 值是面每单位面积的能量（表面张力）；默认为 1。密度为 0 的面不施加力，可用于定义体积或在显示中。分数密度对于规定接触角很有用。`NODISPLAY`（同义词 `NO_DISPLAY`）阻止面被显示。`COLOR` 属性适用于面的两面；`FRONTCOLOR` 适用于正面（边逆时针方向），`BACKCOLOR` 适用于背面。`PHASE` 编号在弦模型中用于确定不同相面之间的边的表面张力（如果使用相）。`NONCONTENT` 属性表示此面不用于其所在的任何体的体积计算。`FIXED`、`BOUNDARY`、`CONSTRAINT`、`DENSITY` 和 `NODISPLAY` 属性将被面内部细分产生的所有面、边和顶点继承。`NO_REFINE` 对细化面本身没有影响，但会被面内部创建的边继承。

如果单纯形模型生效，边列表应替换为有向顶点编号列表。

在弦模型中，面部分是可选的。

## 6.8 体 (Bodies)

体列表由行首关键字 `BODIES` 开始。后跟每行一个体规范的行，格式为：

```
 k f1 f2 f3 .... [VOLUME v] [VOLCONST v] [PRESSURE p] [DENSITY d]
   [PHASE n] [ACTUAL_VOLUME v] [quantityname ...] [methodname ...]
```

这里 k 是体编号，f1 f2 f3 ... 是无序的有符号面编号列表。正号表示面法线（由面列表中边顺序的右手法则给出）从体向外，负号表示法线向内。给出 `VOLUME` 值 v 意味着体具有体积约束，除非理想气体模型生效，在这种情况下 v 是环境压力下的体积。`VOLCONST` 是加到体积上的值；当面和边积分的体积计算与真实体积相差常数时很有用，这在环面模型中可能发生。但是要注意，在更改影响体体积的东西时；您可能需要重置 `volconst`。`ACTUAL_VOLUME` 是一个数字，可以在环面体积 `volconst` 计算给出错误答案的罕见情况下指定；`volconst` 将被调整以给出此体的体积。给出 `PRESSURE` 值 p 意味着体被认为具有恒定的内部压力 p；这对于规定平均曲率问题很有用。它与规定体积不兼容。给出 `DENSITY` 值 d 意味着将包含重力势能（重力常数 G）。v、p 和 d 是常量表达式。

要在弦模型中赋予面 `VOLUME`、`PRESSURE` 或 `DENSITY` 属性，定义一个仅以该面为边界的体。

`PHASE` 编号在肥皂膜模型中用于确定不同相体之间的面的表面张力（如果使用相）。

`BODIES` 部分是可选的。

## 6.9 命令 (Commands)

在数据文件中遇到关键字 `READ` 会使 Evolver 从数据文件模式切换到命令模式，并将数据文件的其余部分作为命令输入读取。此功能对于自动初始化表面（包括细化、迭代、定义自己的命令等）很有用。
