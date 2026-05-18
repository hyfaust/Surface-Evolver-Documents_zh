# 第11章 一般命令（General Commands）

本章按字母顺序描述Evolver的一般命令。

## 11.1 值（Values）

一个值（value）可以是一个实数（real number）、一个元素（element），或两者的混合。当需要实数时，元素会被转换为其编号。一个"元素"是一个顶点（vertex）、边（edge）、面（facet）或体（body）的编号。元素有时也被称为句柄（handle）。赋值语句的左侧必须是可赋值的。

一个表达式（expression）可以使用以下标准运算符：`+`、`-`、`*`、`/`、`^`（幂），以及标准数学函数。字符串（string）可以用双引号括起来，用 `.` 连接，但不能用于期望数字的位置。"表达式"将语法更正式地称为 "set_expression"。

命令 `set` 可以用来设置元素属性（element attributes）。例如：

```
set vertex[3] color red
```

请注意，`set` 后面的关键字必须是可以接受属性的元素类型。在特别详细的命令描述中，"表达式"将语法更正式地称为 "set_expression"。由于 `set` 关键字被保留，`set` 可以用作变量名，但请小心，因为许多命令确实使用变量名——大多数可用作变量名的命令在"变量"部分中记录。例如 `display` 或 `exec`。

也可使用以下语法来设置属性：

```
set vertex color red where x > 0
```

在某些情况下，可能需要在赋值或条件中使用没有括号的属性名称。例如，`x` 表示第1个坐标，但 `x[3]` 表示顶点3的第1个坐标。其他情况将从上下文中显而易见。用户定义的属性（user-defined attributes）可以类似于 `x` 使用。因此，在数据文件中声明 `define vertex attribute foo real` 后，`foo` 就像一个坐标。

### 11.1.1 变量赋值（Variable Assignment）

变量可以通过传统方式赋值：

```
variable_name := expression
```

变量名称可以是任何字母和数字的组合，以字母开头。但是，许多名称被Evolver保留用于各种目的（见下文）。变量名称区分大小写。有些变量是内置的，有些由用户创建。变量需要赋值后才能使用。

### 11.1.2 元素生成器（Element Generators）

元素生成器产生元素列表。语法是：

```
generator := element_type [relop expression] [attribute relop expression] ...
```

其中 `element_type` 是 `vertex`、`edge`、`facet` 或 `body`，`relop` 是关系运算符 `<`、`>`、`<=`、`>=`、`==` 或 `!=`。括号中指定的元素类型（element_type）是必需的，而其他项是可选的。`expression` 的值用于与每个元素的标识号或属性值进行比较。

`where` 子句可以在 `foreach` 命令和某些其他地方指定。它与元素生成器具有相同的语法，用 `where` 关键字分隔，后跟条件。注意：`where` 子句区分大小写。示例：

```
foreach facet ff where ff.id < 10 do ...
foreach edge ee where ee.color == red do ...
```

### 11.1.3 数组（Arrays）

可以通过以下方式创建整数索引的数字数组：

```
define array_name[upper_bound]
```

或

```
define array_name[lower_bound:upper_bound]
```

其中边界是整数表达式。数组始终是一维的。如果省略下界，则默认为1。数组名可以是任何未被其他方式使用的名称。数组元素的访问方式为 `array_name[index]`。索引是整数；如果索引超出范围，不会生成错误。`undefine` 命令（见下文）可以删除数组定义。

数组可以用作值。例如，`a := b` 如果 `a` 和 `b` 都是数组，则将 `b` 复制到 `a`。如果 `a` 是单个变量而 `b` 是数组，则 `a` 被赋予数组的大小。`sizeof` 函数返回数组的大小。`dim` 函数对于标量返回1，对于数组返回维度。`loindex` 和 `hiindex` 函数返回数组的下标界和上标界。

### 11.1.4 关键字（Keywords）

以下关键字和短语不能用作用户变量名：

- `and`
- `atof`
- `backcolor`
- `binary` 或 `ascii`
- `boundary`
- `constraint`
- `crossingcolor`
- `define`
- `delete`
- `e` （自然对数的底）
- `edgemarkcolor`
- `else`
- `even` 或 `odd`
- `facet`
- `fixed`
- `foreach`
- `function` 或 `procedure`
- `get_more_search_results`
- `global`
- `gravity`
- `if`
- `in`
- `integer`
- `is_defined`
- `knot`
- `labelcolor`
- `load`
- `log`
- `max`
- `maxcolor`
- `min`
- `new_para`
- `no`
- `not`
- `off`
- `on`
- `or`
- `pi`
- `postscript`
- `printf`
- `real`
- `rgb`
- `set`
- `slice`
- `string`
- `sum`
- `then`
- `total`
- `undefine`
- `vertex`
- `while`
- `yes`
## 11.2 命令列表

以下按字母顺序列出Evolver的交互式命令及其简要描述。

### ABORT

`ABORT` 使命令序列在 `do` 命令期间退出，类似于 `break` 命令。这是 `do` 命令特定的退出命令。

### ADDLOAD

`ADDLOAD` 读取另一个数据文件，如同它被追加到当前数据文件末尾。语法：

```
ADDLOAD "filename"
```

在文件名中，可以使用 `$` 来替换为数字或字符串表达式。格式为 `$(expression)` 表示数字表达式，`$stringvar` 表示字符串变量。用于循环读取一系列文件。例如：

```
ADDLOAD "file_$(step)"
```

### ADD

`ADD` 命令启动一系列addition命令。实际的addition出现在括号中，必须是 `do` 命令的有效内容。完整的语法是：

```
ADD element_generator { commands }
```

将执行每个新元素的命令。在创建过程中，`new_id` 和 `new_vertex` 等变量可用于表示新元素的ID和顶点。

### AGGREGATE命令

`AGGREGATE` 命令计算一组元素上某种类型属性的聚合值。它有三种模式：SUM、COUNT和AVG。语法为：

```
aggregate attribute_name generator
aggregate (SUM | COUNT | AVG) attribute_name generator
```

### A命令

`A` 命令弹出命名方法（named methods）或命名数量（named quantities）的菜单。它显示当前定义的所有数量及其值。还显示约束体积和它们的"压力"（拉格朗日乘数）。语法：

```
A
```

### area_normal

计算面片法向量的面积加权之和。在计算重心处的力时，面积法向量是必需的。

### B命令

`B` 命令允许为body（体）设置或读取属性。

### BACKCOLOR

`BACKCOLOR` 命令设置背景颜色。语法：

```
BACKCOLOR expression
```

其中表达式求值为颜色代码。

### BOUNDARY

`BOUNDARY` 命令用于定义或操作边界（boundaries）。边界可以用参数方程定义。

### BREAK

`BREAK` 在 `do` 循环或 `if` 语句内使用，相当于提前退出循环。

### CHDIR

`CHDIR` 命令更改当前工作目录。语法：

```
CHDIR "directory_path"
```

### CLIP

`CLIP` 命令控制裁剪平面（clipping planes）。它可以让您移除表面的一部分以便查看内部。语法：

```
CLIP expression
```

### COLOR

`COLOR` 命令用于设置元素的颜色。

### CONCATENATE命令

`CONCATENATE` 命令将数组或属性值连接起来。

### CONSTRAINT

`CONSTRAINT` 命令定义或修改约束。约束可以是等式或不等式。

### CONTINUE

`CONTINUE` 使命令序列跳过当前迭代的其余部分并继续下一次迭代。

### COUNT命令

`COUNT` 命令统计满足条件的元素数量。

### CROSSINGCOLOR

`CROSSINGCOLOR` 命令设置在单线图（wireframe display）模式下交叉线的颜色。

### D命令

`D` 命令删除满足某些条件的元素。

### DATAFILENAME

`DATAFILENAME` 命令返回当前数据文件的名称。

### DEBUG命令

`DEBUG` 命令调用一个简单的内置调试器。

### DELETE命令

`DELETE` 命令从曲面中删除元素。语法：

```
DELETE element_generator
```

### DETURCK

`DETURCK` 命令执行DeTurck的技巧以改进平均曲率流（mean curvature flow）的收敛性。

### DISSOLVE

`DISSOLVE` 命令通过删除顶点来简化曲面。

### DO

`DO` 命令用于循环和条件执行。语法：

```
do { commands }
do ( expression ) { commands }
do ( expression ; expression ) { commands }
do ( expression ; expression ; expression ) { commands }
```

也可以使用 `while` 循环：

```
while ( expression ) { commands }
```

`foreach` 循环用于遍历元素：

```
foreach element_type ( generator ) { commands }
foreach element_type element_name where condition { commands }
```

### DUMP

`DUMP` 命令将当前曲面状态以数据文件格式写入文件。

### EDGEMARKCOLOR

`EDGEMARKCOLOR` 命令设置边标记的颜色。

### ELAPSED_TIME

`ELAPSED_TIME` 返回自程序启动以来经过的秒数。

### ERASE

`ERASE` 命令清除屏幕。

### EXTRAPOLATE

`EXTRAPOLATE` 命令根据外推法估算最小能量。

### EXEC

`EXEC` 命令执行操作系统命令。

### EXIT

`EXIT` 命令退出Evolver。

### EXPRESSION

`EXPRESSION` 是最通用的命令形式，可以是任何有效的数学表达式。

### FACETEDGES

`FACETEDGES` 命令切换是否在面的显示中包含边。

### FACET_CROSSCUT

`FACET_CROSSCUT` 用于在面中创建截面视图。

### FIXED

`FIXED` 命令将元素标记为固定（fixed），使其在演化过程中不移动。

### FLIP

`FLIP` 命令翻转边或面的方向。

### FOREACH

`FOREACH` 命令遍历满足条件的元素集合并对每个元素执行命令。

### FUNCTION

`FUNCTION` 命令定义一个用户可编程的函数。

### G

`G` 命令执行一步演化（gradient descent）。这是Evolver中最重要的命令之一——它使曲面向能量更低的构形演化。

```
g
g expression
```

`g` 可以跟一个数字表达式来指定迭代次数，例如 `g 100` 执行100步迭代。

### GEXECUTE

`GEXECUTE` 用Geomview执行操作。

### GET_SQ_MEAN_CURVATURES

`GET_SQ_MEAN_CURVATURES` 计算每个顶点的平方平均曲率值。

### GOPOINT

`GOPOINT` 将视图移动到指定点。

### GRAVITY

`GRAVITY` 切换重力的开启和关闭。

### HESSIAN

`HESSIAN` 命令使用海森矩阵（Hessian matrix）迭代求解能量最小值。这比简单的梯度下降收敛快得多。

```
hessian
hessian expression
```

`hessian_menu` 命令提供海森矩阵迭代的调试选项。

### HESSIAN_DIFF

`HESSIAN_DIFF` 通过有限差分检查海森矩阵值。

### HESSIAN_SEEK

`HESSIAN_SEEK` 执行海森矩阵迭代，带行搜索（line search）优化。

### HESSIAN_SADDLE

`HESSIAN_SADDLE` 寻找鞍点方向。

### HOMOTHETY

`HOMOTHETY` 按比例缩放所有体的体积，使总体积为1。

### ID

`ID` 命令用于识别鼠标点击的元素。

### INTEGER_ATTRIBUTE

用于定义整数属性。

### JIGGLE

`JIGGLE` 切换抖动（jiggling）选项，该选项在每个迭代中对顶点添加随机扰动以帮助跳出局部最小值。

### K

`K` 命令创建骨架（skeleton）显示。

### KNOT

`KNOT` 命令用于设置结的参数。
### LABELCOLOR

`LABELCOLOR` 设置标签颜色。

### LANCZOS

`LANCZOS` 命令使用Lanczos算法进行海森矩阵迭代，比标准方法更快。

### LENGTH

`LENGTH` 返回边或曲线的长度。

### LINEAR

`LINEAR` 切换到线性模型（linear model）。

### LOAD

`LOAD` 命令加载一个数据文件。语法：

```
LOAD "filename"
```

或

```
LOAD expression
```

### LOGFILE

`LOGFILE` 开始或停止日志文件记录。

### LOOK_FEEL

`LOOK_FEEL` 设置显示的外观参数。

### LONG_JIGGLE

`LONG_JIGGLE` 执行长波长扰动（long wavelength perturbation），比普通抖动更适合探索大尺度的构形空间。

### M命令

`M` 命令设置迭代步长（scale factor）。语法：

```
m expression
```

例如 `m 0.5` 将步长设为0.5。`m 0` 仅强制执行约束而不移动表面。

### MAX

`MAX` 返回两个数中的最大值。

### MEMORY

`MEMORY` 显示内存使用情况。

### METHOD_INSTANCE

`METHOD_INSTANCE` 创建或操作命名方法实例。

### MIDV

`MIDV` 命令对边进行细分并在中间点插入新顶点。

### MIN

`MIN` 返回两个数中的最小值。

### MINI_QUANTITIES

`MINI_QUANTITIES` 设置用于最小化的数量。

### NEW_EDGE

`NEW_EDGE` 创建一条新边。

### NEW_FACET

`NEW_FACET` 创建一个新面。

### NEW_VERTEX

`NEW_VERTEX` 创建一个新顶点。

### NOTCH

`NOTCH` 命令在边的交点处引入缺口。

### N命令

`N` 命令将窗口重置为默认视图。

### O

`O` 切换等角化（equiangulation）开关。

### OMETRY

`OMETRY` 设置量度属性。

### OPTIMIZE

`OPTIMIZE` 切换优化模式，在该模式下步长会自动选择以最小化能量。语法：

```
optimize
optimize expression
```

### ORIENTATION_REVERSE

`ORIENTATION_REVERSE` 翻转所有面的定向。

### P命令

`P` 命令打印元素（顶点、边、面或体）的信息。

```
p element_type expression
```

### PALETTE

`PALETTE` 命令用于设置调色板。

### PARAMETER

`PARAMETER` 命令定义或修改可调参数。

### PERMLOAD

`PERMLOAD` 命令永久加载一个数据文件。

### PERSISTENT

`PERSISTENT` 设置持久化属性。

### POSTSCRIPT

`POSTSCRIPT` 命令以PostScript格式输出当前图形。

### PRINTF

`PRINTF` 命令格式化输出，类似于C语言的printf函数。语法：

```
printf "format string" , arg1, arg2, ...
```

支持的格式说明符包括 `%d`（整数）、`%f`（浮点数）、`%g`（自动格式）、`%e`（科学记数法）、`%s`（字符串）。

### Q命令

`Q` 命令显示所有变量及其当前值。

### QUADRATIC

`QUADRATIC` 切换到二次模型（quadratic model）。

### QUIET

`QUIET` 控制输出的详细程度。

### RAWESTV

`RAWESTV` 执行原始形式的顶点平均（vertex averaging），不考虑约束和三线交点的限制。

### RAWV

`RAWV` 执行不保留体积的顶点平均。

### REAL_ATTRIBUTE

定义实数属性。

### RECALC

`RECALC` 命令重新计算所有几何量（能量、体积、面积、曲率等）。在手动移动顶点后使用此命令更新内部状态。

### REDEFINE

`REDEFINE` 命令重新定义内部命令。

### REFINING

细化操作会将每个边分成两段，每个面分成四个面。这有效地将表面分辨率加倍。

### REFINE

`REFINE` 命令细化曲面，将每个三角形面细分为四个更小的三角形。

### REGION

`REGION` 定义一个区域。

### REVERSE_ORIENTATION

`REVERSE_ORIENTATION` 翻转所有面的法线方向。

### RIBIERE

`RIBIERE` 切换共轭梯度法（conjugate gradient method）的Polak-Ribiere版本。

### ROTATE

`ROTATE` 命令旋转视角。

### SADDLE

`SADDLE` 在海森矩阵迭代中寻找鞍点方向。

### S

`S` 命令保存当前表面到数据文件。

### SAVE

`SAVE` 将当前表面保存为数据文件格式。

### SCALAR_FIELD

创建标量场属性。

### SET命令

`SET` 命令设置元素属性或系统变量。

### SHOW_EXPR

`SHOW_EXPR` 在图形窗口中显示表达式。

### SHOW_INNER

`SHOW_INNER` 控制内部元素（如三线交点）的显示。

### SHOW_OUTER

`SHOW_OUTER` 控制外部边界元素的显示。

### SHOW_Q

`SHOW_Q` 显示数量（quantity）信息。

### SIZE

`SIZE` 设置显示窗口的大小。

### SLICE

`SLICE` 用一个平面对表面进行切片。

### SOBOLEV

`SOBOLEV` 执行Sobolev能量迭代。Sobolev迭代比普通梯度下降收敛更快，但比海森矩阵方法慢。

### SOBOLEV_SEEK

`SOBOLEV_SEEK` 执行Sobolev能量迭代并进行行搜索。

### STRING

`STRING` 模型命令切换到字符串模型（string model），用于一维表面（曲线）。

### SUBCOMMAND

`SUBCOMMAND` 执行子命令。

### SYMMETRIC_CONTENT

`SYMMETRIC_CONTENT` 切换到对称体积计算模式。

### T命令

`T` 命令切换到三角形（Triangle）显示模式。

### TASK_EXEC

`TASK_EXEC` 启动子进程。

### TOGGLE_NAME

`TOGGLE_NAME` 切换命名属性。

### TOPINFO

`TOPINFO` 控制顶部信息栏的显示。

### TOTAL

`TOTAL` 计算元素属性的总和。语法：

```
total attribute_name generator
```

### TRIPLE_POINT

`TRIPLE_POINT` 与三线交点相关的操作。

### U命令

`U` 命令执行等角化（equiangulation），改善三角形质量。建议多次使用直到不再发生变化。

### UNFIX

`UNFIX` 取消元素的固定状态。

### V命令

`V` 命令打印顶点信息。特别有用的是显示每个体的压力（pressure），即体积约束的拉格朗日乘数（Lagrange multiplier）。

### VALID_ELEMENT

`VALID_ELEMENT` 检查元素是否有效。

### VECTOR_FIELD

`VECTOR_FIELD` 创建向量场属性。

### VERTEX_AVERAGE

`VERTEX_AVERAGE` 命令执行顶点平均操作，将每个顶点移动到其邻近面重心的加权平均位置，同时保留体积。

### VIEW_MATRIX

`VIEW_MATRIX` 设置或显示视图矩阵。

### VOLUME

`VOLUME` 计算体的体积。

### W命令

`W` 命令切换线框（wireframe）显示模式。

### WHERE

`WHERE` 子句用于筛选满足条件的元素。在 `foreach` 和 `set` 命令中使用。

### WRAP_COLORS

`wrap_colors` 切换环绕颜色的使用。

### Y命令

`Y` 命令执行一次长波长扰动（long wavelength perturbation）。

### Z

`Z` 命令用于放大或缩小。

### ZOOM

`ZOOM` 命令放大或缩小视图。

---

# 第12章 脚本示例（Script Examples）

本章展示一些使用Evolver脚本语言的示例。用户定义的命令用于创建"宏"以执行常见任务。脚本可以放在数据文件中或单独的文件中使用 `LOAD` 加载。

## 12.1 示例1：环面的极小曲面

本示例演示如何在环面（torus）域中找到极小曲面。此示例演示了如何使用数组来收集和平均结果，以及如何编写一个循环来计算一个数量的多个样本。

```
// 数据文件的定义...
// 定义参数
parameter N := 20
define array results[N]

// 扰动表面以获得多个样本
do (i := 1; i <= N; i++) {
    // 扰动
    foreach vertex vv do {
        set vv.z vv.z + 0.001*sin(i*vv.x*3.14)
    }
    g 100
    results[i] := total_energy
}

// 计算平均值
avg := 0
do (i := 1; i <= N; i++) {
    avg := avg + results[i]
}
avg := avg / N
printf "Average energy: %g\n", avg
```

## 12.2 示例2：从参数范围生成数据

本示例演示如何用一个参数在一系列值上运行，并将结果保存到输出文件。

```
// 用height参数从0.5到1.5变化
do (h := 0.5; h <= 1.5; h := h + 0.1) {
    height := h
    recalc
    g 200
    printf "%g %g %g\n", h, total_energy, total_area
}
```

## 12.3 示例3：序列参数运行

本示例演示如何读取一系列数据文件并收集每个文件的结果。

```
// 读取系列文件
do (i := 1; i <= 10; i++) {
    load "data_$(i).fe"
    g 100
    printf "File %d: energy = %g\n", i, total_energy
}
```

## 12.4 示例4：克里福德环面的视图序列

本示例生成克里福德环面（Clifford torus）的一系列旋转视图。

```
do (angle := 0; angle < 360; angle := angle + 10) {
    rotate angle, 0, 1, 0
    postscript "clifford_$(angle).ps"
}
```

---

# 第13章 操作（Operation）

## 13.1 系统命令行

Evolver可以用各种选项从命令行启动：

```
evolver [options] [datafile]
```

常用选项包括：
- `-d`：启动调试模式
- `-f`：强制执行
- `-p`：打印模式
- `-q`：安静模式
- `-s`：安全模式

## 13.2 初始化（Initialization）

启动时，Evolver会读取数据文件并初始化所有几何量。初始化步骤包括：

1. 读取并解析数据文件
2. 建立拓扑关系（哪些边连接哪些顶点等）
3. 计算初始能量、面积、体积
4. 检查约束的有效性

## 13.3 错误处理（Error Handling）

Evolver在遇到错误时会打印描述性消息并中止当前操作。常见的错误包括：
- 语法错误
- 除零错误
- 未定义的变量或函数
- 内存不足

## 13.4 中断（Interrupts）

用户可以通过按 `Ctrl+C` 中断正在运行的命令。这将导致Evolver停止当前操作并返回到提示符。对于长时间运行的迭代（如 `g` 命令），中断会安全地停止迭代。

---

# 第14章 图形（Graphics）

Evolver能够以各种格式生成和显示图形输出。默认情况下，Evolver使用内部的painter算法进行隐面消除。也可以使用OpenGL或Geomview进行3D渲染。

## 14.1 图形命令

以下命令控制图形显示：

### 显示命令

- `D`：显示表面
- `W`：切换线框/实体显示
- `T`：切换三角形线显示
- `F`：切换面填充显示

### 视图控制

- `N`：恢复默认视图
- `rotate`：旋转视图
- `ZOOM`：缩放视图
- `SIZE`：设置窗口大小

### 颜色命令

- `BACKCOLOR`：设置背景颜色
- `COLOR`：设置元素颜色
- `EDGEMARKCOLOR`：设置边标记颜色
- `CROSSINGCOLOR`：设置交叉线颜色

## 14.2 OpenGL

Evolver可以使用OpenGL进行硬件加速的3D渲染。这提供了比内置painter算法更好的性能和视觉效果。要使用OpenGL，编译时需要链接OpenGL库。

## 14.3 图形变量

以下变量控制图形外观：

- `display`：切换图形显示
- `show_inner`：显示内部元素
- `show_outer`：显示外部边界
- `full_bounding_box`：完整边界框
- `slice_view`：切片视图
- `clip_view`：裁剪视图

## 14.4 主要命令

主要图形命令包括：

- `postscript`：生成PostScript输出
- `geomview`：使用Geomview进行3D显示
- `binary`：切换二进制/ASCII输出模式

## 14.5 文件格式

Evolver支持多种文件格式输出：

### 14.5.1 PostScript格式（PostScript File）

PostScript输出使用命令 `postscript` 生成。输出文件包含完整的PostScript代码，可以直接打印或嵌入文档。

### 14.5.2 PostScript选项

PostScript输出的选项包括：
- 线宽控制
- 灰度/彩色模式
- 隐藏线消除
- 尺寸和缩放

### 14.5.3 Triangle文件格式

Triangle文件格式用于与Triangle程序交互。使用 `t` 命令切换三角形显示。

### 14.5.4 Triangle文件

Triangle格式的文件包含顶点列表和三角形（面）列表。

### 14.5.5 SoftImage文件格式

SoftImage格式用于与SoftImage 3D软件交互。
---

# 第15章 命名方法和数量（Named Methods and Quantities）

命名方法（named methods）和命名数量（named quantities）允许用户在不修改Evolver源代码的情况下扩展Evolver的功能。这使得Evolver能够计算任意积分和其他量。

Evolver内置了几何量的计算（面积、体积、边长等），但用户可能希望计算其他量。命名方法和命名数量通过允许用户在不修改源代码的情况下向Evolver添加任意量来解决这个问题。

## 15.1 数量和方法实例的语法

在数据文件中，一个命名数量（named quantity）被定义如下：

```
quantity quantity_name method method_name [modulus modulus] [global_method | element_type element_generator]
[cons_constant]
```

一个命名方法实例（method instance）被定义如下：

```
method_instance method_name method method_type [modulus modulus]
[global_method | element_type element_generator]
```

其中 `quantity_name` 和 `method_name` 是标识符，`modulus` 是乘以数量值和梯度的乘数。如果数量是全局的，使用 `global_method`；否则指定应用该数量的元素类型和生成器。一个数量可以有多个方法实例附加到它，每个实例有自己的方法类型。

一些方法类型需要指定常量作为参数。这些在方括号中给出。在 `READ` 部分之前读取的 `quantity` 语句是"全局的"，影响所有适当类型的元素。

## 15.2 方法实例

方法实例（method instances）是Evolver计算量的构建块。每个方法实例定义了如何对单个元素（边或面）计算一个量。

### 15.2.1 0D方法

0D方法适用于零维元素（顶点）。

#### 15.2.1.1 scalar_integral

`scalar_integral` 对一个顶点（0-单形）的值进行求和。这等价于对顶点的值进行点积。

### 15.2.2 1D方法

1D方法适用于一维元素（边）。

#### 15.2.2.1 edge_scalar_integral

`edge_scalar_integral` 计算标量函数沿边的积分。公式为：

$$\int_e f(x,y,z) \, ds$$ (15.1)

其中 $ds$ 是边的线元。

### 15.2.3 2D方法

2D方法适用于二维元素（面）。这些是Evolver中最常用的方法类型。

#### 15.2.3.1 整数

`simplicial_integral` 计算三角形面上的积分。这是最基本的面积积分方法。

对于三角形面，`simplicial_integral` 的计算如下：首先，对于每个三角形面，计算函数在三角形三个顶点处的值，然后乘以三角形的面积。具体来说，对于顶点 $v_1, v_2, v_3$ 和标量函数 $f$：

$$\text{integral} = \text{area} \times \frac{f(v_1) + f(v_2) + f(v_3)}{3}$$ (15.2)

#### 15.2.3.2 格式定义

```
method_instance name method simplicial_integral [modulus m]
```

`simplicial_integral` 的实现分两种情况：

1. **标准情况**：函数是简单表达式。Evolver对表达式在三角形三个顶点处求值并取平均值，然后乘以面积。

2. **精确计算**：对于某些特殊函数，Evolver可以进行精确积分。

#### 15.2.3.3 exact_area

`exact_area` 方法仅在二次模型（quadratic model）中可用。它精确计算三角形的面积，而不是使用线性近似。在二次模型中，三角形被定义为弯曲的曲面片，线性面积公式只是近似值。`exact_area` 使用精确的积分公式。

#### 15.2.3.4 edge_vector_integral

`edge_vector_integral` 计算向量场沿边的线积分。这用于定义与路径相关的量，如磁通量。公式为：

$$\int_e \vec{F} \cdot d\vec{r}$$ (15.3)

#### 15.2.3.5 facet_vector_integral

`facet_vector_integral` 计算向量场通过面的通量。公式为：

$$\iint_f \vec{F} \cdot d\vec{S}$$ (15.4)

#### 15.2.3.6 form2_integral

`form2_integral` 计算2-形式在面上的积分。2-形式积分是向量通量积分的推广。在三维空间中，2-形式是：

$$\omega = A \, dy \wedge dz + B \, dz \wedge dx + C \, dx \wedge dy$$ (15.5)

其在面上的积分为：

$$\iint_f \omega$$ (15.6)

#### 15.2.3.7 simplexfacet_integral

`simplexfacet_integral` 计算三角形面上标量函数的积分，使用与 `simplicial_integral` 相同的公式，但适用于三角形面。

#### 15.2.3.8 linear_integral

`linear_integral` 计算线性标量函数在边上的积分。对于标量函数 $f$ 和边 $e$，积分为：

$$\int_e f \, ds$$ (15.7)

其中 $ds$ 是线元。线性积分意味着函数在边上被线性插值。

#### 15.2.3.9 gauss_integral

`gauss_integral` 计算高斯积分（Gauss integral），也称为连接数（linking number）。它计算两个闭合曲线之间的连接数：

$$\frac{1}{4\pi} \oint_{C_1} \oint_{C_2} \frac{(\vec{r}_1 - \vec{r}_2) \cdot (d\vec{r}_1 \times d\vec{r}_2)}{|\vec{r}_1 - \vec{r}_2|^3}$$ (15.8)

### 15.2.4 标量函数积分的特殊方法

以下方法用于对特定类型的标量函数进行积分。每种方法针对特定的函数形式进行了优化。

#### 15.2.4.1 string_gravity_method_instance

`string_gravity_method_instance` 用于在字符串模型（string model）中计算重力势能。在字符串模型中，表面是一维曲线，重力势能是：

$$V = g \int y \, ds$$ (15.9)

其中 $g$ 是重力加速度，$y$ 是高度，$ds$ 是线元。

### 15.2.5 2-形式积分

`form2_integral` 是一种2-形式积分方法。它用于计算2-形式在面上的积分。在三维空间中，2-形式可以表示为：

$$\omega = A(x,y,z) \, dy \wedge dz + B(x,y,z) \, dz \wedge dx + C(x,y,z) \, dx \wedge dy$$ (15.10)

### 15.2.6 体积积分

`vol_general` 是一种通用体积积分方法，用于在由表面包围的体积内积分标量函数。这通过散度定理（divergence theorem）转化为面积分：

$$\iiint_V f \, dV = \frac{1}{3} \iint_{\partial V} f \vec{r} \cdot d\vec{S}$$ (15.11)

### 15.2.7 knot_energy_pair_method

`knot_energy_pair_method` 是一种通用的配对能量方法，用于计算两个曲线段之间的能量。配对核（pair kernel）$K(r)$ 定义了能量密度：

$$E = \sum_{\text{pairs}} \int\int K(|\vec{r}_1 - \vec{r}_2|) \, ds_1 \, ds_2$$ (15.12)

### 15.2.8 gravity_method_instance

`gravity_method_instance` 是重力势能（gravitational potential energy）的方法实例。重力势能通过以下方式计算：假设重力场指向 $z$ 轴负方向，每个体的重力势能与其体积乘以重力常数成正比。具体来说：

$$V_{\text{gravity}} = g \cdot z_{\text{centroid}} \cdot \text{volume}$$ (15.13)

其中 $g$ 是重力常数，$z_{\text{centroid}}$ 是体质心的 $z$ 坐标。

---

## 15.3 整数

### 15.3.1 边上的标量积分

`edge_scalar_integral` 计算标量函数沿边的积分：

$$\int_{\text{edge}} f \, ds$$ (15.14)

### 15.3.2 面上的标量积分

`facet_scalar_integral` 计算标量函数在面上的积分：

$$\iint_{\text{facet}} f \, dA$$ (15.15)

### 15.3.3 边上的向量积分

`edge_vector_integral` 计算向量场沿边的积分：

$$\int_{\text{edge}} \vec{F} \cdot d\vec{r}$$ (15.16)

### 15.3.4 面上的向量积分

`facet_vector_integral` 计算向量场通过面的通量：

$$\iint_{\text{facet}} \vec{F} \cdot \vec{n} \, dA$$ (15.17)

### 15.3.5 面上的2-形式积分

`form2_integral` 计算2-形式在面上的积分：

$$\iint_{\text{facet}} \omega$$ (15.18)

## 15.4 组合方法

以下方法将基本积分组合以计算更复杂的量。

### 15.4.1 表面积分

`facet_area` 计算面的面积。这等价于在标量函数为1时的面上标量积分。

### 15.4.2 边长

`edge_length` 计算边的长度。这等价于在标量函数为1时的边标量积分。

### 15.4.3 体积

`body_volume` 计算由闭合面包围的体积。这通过散度定理转化为面积分。

### 15.4.4 重力

`gravity_method_instance` 计算重力势能。

## 15.5 约束数量

约束数量（constraint quantities）允许将元素约束到固定值。约束类型包括：

- **固定数量**：元素数量固定不变
- **边界约束**：元素必须位于指定边界上
- **不等式约束**：元素数量必须满足不等式条件

## 15.6 内置方法

### 15.6.1 sq_mean_curvature

`sq_mean_curvature` 是每个顶点的平方平均曲率（square of mean curvature）方法。平均曲率 $H$ 由公式给出：

$$H = \frac{\kappa_1 + \kappa_2}{2}$$ (15.19)

其中 $\kappa_1$ 和 $\kappa_2$ 是主曲率（principal curvatures）。在Evolver中，平均曲率通过以下方式计算：对于每个顶点，考虑所有与之相邻的面。每个面的法向量贡献于该顶点的平均曲率向量。

对于一个由边 $e$ 分隔的两个相邻面 $f_1$ 和 $f_2$，平均曲率向量的贡献为：

$$\vec{H}_e = \frac{1}{2} (\vec{n}_1 \times \vec{e} + \vec{n}_2 \times \vec{e})$$ (15.20)

其中 $\vec{n}_1$ 和 $\vec{n}_2$ 是两个面的单位法向量，$\vec{e}$ 是边的方向向量。顶点的总平均曲率向量是所有相邻边贡献的和。

平方平均曲率 $H^2$ 的面积元积分定义为：

$$\int H^2 \, dA$$ (15.21)

在离散情况下，这被近似为：

$$\sum_v H_v^2 A_v$$ (15.22)

其中 $H_v$ 是顶点 $v$ 处的平均曲率，$A_v$ 是顶点 $v$ 的面积（相邻面面积的1/3之和）。

### 15.6.2 sq_mean_curvature_v

`sq_mean_curvature_v` 是与 `sq_mean_curvature` 类似的方法，但在向量模型中使用。两者的主要区别在于曲率计算的实现细节。

### 15.6.3 sq_mean_curvature_c

`sq_mean_curvature_c` 是另一种平方平均曲率变体。它使用不同的曲率计算方法，特别适用于某些特殊几何形状。

### 15.6.4 sq_gauss_curvature

`sq_gauss_curvature` 是平方高斯曲率（square of Gaussian curvature）方法。高斯曲率 $K$ 由公式给出：

$$K = \kappa_1 \kappa_2$$ (15.23)

高斯曲率的面积元积分为：

$$\int K \, dA$$ (15.24)

在离散情况下，顶点 $v$ 处的高斯曲率通过角度缺陷（angle deficit）计算：

$$K_v = 2\pi - \sum_i \theta_i$$ (15.25)

其中 $\theta_i$ 是顶点 $v$ 处相邻面的角度。高斯-博内定理（Gauss-Bonnet theorem）指出，对于闭合曲面，总高斯曲率等于 $2\pi \chi$，其中 $\chi$ 是欧拉示性数（Euler characteristic）。

### 15.6.5 gauss_curvature_integral

`gauss_curvature_integral` 是高斯曲率积分（integral of Gaussian curvature）方法。它使用完整的积分公式而不是平方近似：

$$\int K \, dA$$ (15.26)

在Evolver的实现中，高斯曲率积分通过角度缺陷计算：

$$\int K \, dA \approx \sum_v \left(2\pi - \sum_i \theta_i\right)$$ (15.27)

### 15.6.6 circle_willmore

`circle_willmore` 是圆Willmore能量（circle Willmore energy）方法。Willmore能量定义为：

$$W = \int H^2 \, dA$$ (15.28)

其中 $H$ 是平均曲率。Willmore猜想（Willmore conjecture）指出，对于亏格为1的闭合曲面，Willmore能量的最小值为 $2\pi^2$。

### 15.6.7 laplacian_mean_curvature

`laplacian_mean_curvature` 是拉普拉斯平均曲率（Laplacian mean curvature）方法。它使用拉普拉斯-贝尔特拉米算子（Laplace-Beltrami operator）来计算平均曲率。

### 15.6.8 一般维度方法

#### 15.6.8.1 simplex_vector_integral

`simplex_vector_integral` 是单形（simplex）上的向量积分方法。它在任意维度的单形上积分向量函数。

#### 15.6.8.2 knot_energy_pair_method

`knot_energy_pair_method` 是结能量配对方法（knot energy pair method）。它计算两个曲线段之间的能量。这是实现各种结能量的基础方法。

### 15.6.9 结能量方法（knot energy methods）

Evolver包含大量的结能量方法，用于研究纽结理论（knot theory）。这些方法计算闭合曲线之间的相互作用能量。

#### 15.6.9.1 基本结能量方法

- `coulomb_method`：库仑能量（Coulomb energy），核为 $1/r$
- `cotangent_method`：余切能量（cotangent energy），核为 $\cot(\theta/2)$
- `morse_pair_method`：Morse配对能量
- `magnetic_pair_method`：磁配对能量

#### 15.6.9.2 弹性拉伸方法

弹性拉伸方法（elastic stretching methods）用于模拟曲线的弹性行为：

- `dirichlet_elastic`：Dirichlet弹性能量
- `general_linear_elastic`：一般线性弹性能量
- `linear_elastic`：线性弹性能量
- `relaxed_elastic`：松弛弹性能量
- `SVK_elastic`：Saint Venant-Kirchhoff弹性能量

### 15.6.10 杂项方法

- `wulff_energy`：Wulff能量（Wulff energy），用于各向异性表面能
- `carter_energy`：Carter能量
- `johndust`：John dust能量
- `ackerman`：Ackerman能量
---

# 第16章 技术参考（Technical Reference）

本章包含Evolver的详细技术参考信息，包括数学公式、算法实现和计算细节。

## 16.1 符号表示（Notation）

本章使用以下符号表示：

- $v$：顶点坐标向量 $\vec{v} = (x, y, z)$
- $e$：边（连接两个顶点的线段）
- $f$：面（三角形面片）
- $\vec{n}$：单位法向量
- $A$：面积
- $V$：体积
- $H$：平均曲率
- $K$：高斯曲率

## 16.2 表面表示（Surface Representation）

Evolver中的表面由顶点、边和面组成。在标准线性模型中：
- **顶点**：三维空间中的点 $(x, y, z)$
- **边**：连接两个顶点的直线段
- **面**：由三条边组成的三角形平面

在二次模型（quadratic model）中：
- **边**：由三个点定义的抛物线段（两个端点加一个中点）
- **面**：由六个点定义的弯曲三角形（三个顶点加三个边中点）

### 16.2.1 法向量的计算

对于三角形面 $f$，其法向量 $\vec{n}$ 由两条边的叉积给出：

$$\vec{n} = \frac{(\vec{v}_2 - \vec{v}_1) \times (\vec{v}_3 - \vec{v}_1)}{|(\vec{v}_2 - \vec{v}_1) \times (\vec{v}_3 - \vec{v}_1)|}$$ (16.1)

其中 $\vec{v}_1, \vec{v}_2, \vec{v}_3$ 是三角形的三个顶点。

## 16.3 能量和力（Energies and Forces）

### 16.3.1 面积（Area）

三角形面的面积由以下公式计算：

$$A = \frac{1}{2} |(\vec{v}_2 - \vec{v}_1) \times (\vec{v}_3 - \vec{v}_1)|$$ (16.2)

面积的梯度（相对于顶点 $\vec{v}_1$）为：

$$\frac{\partial A}{\partial \vec{v}_1} = \frac{1}{2} \left[ \vec{n} \times (\vec{v}_3 - \vec{v}_2) \right] \cdot \vec{n}$$ (16.3)

### 16.3.2 体积（Volume）

体积由散度定理（divergence theorem）计算：

$$V = \frac{1}{3} \sum_f \vec{v}_f \cdot \vec{n}_f A_f$$ (16.4)

其中 $\vec{v}_f$ 是面 $f$ 的任意一个顶点（因为面是平的，所以选择哪个顶点无关紧要），$\vec{n}_f$ 是面 $f$ 的单位外法向量，$A_f$ 是面 $f$ 的面积。

体积的梯度（相对于顶点 $\vec{v}_1$）为：

$$\frac{\partial V}{\partial \vec{v}_1} = \frac{1}{3} \sum_{f \ni v_1} A_f \vec{n}_f$$ (16.5)

### 16.3.3 重力势能（Gravitational Potential Energy）

当重力被开启时，重力势能为：

$$E_{\text{gravity}} = g \sum_b p_b V_b$$ (16.6)

其中 $g$ 是重力常数，$p_b$ 是体 $b$ 的压力（密度），$V_b$ 是体 $b$ 的体积。

### 16.3.4 内部压力（Internal Pressure）

对于封闭体，可以施加内部压力。压力的能量为：

$$E_{\text{pressure}} = -p V$$ (16.7)

其中 $p$ 是压力，$V$ 是体积。负号表示正压力增加体积。

### 16.3.5 边界能量（Boundary Energy）

边界能量通过在边界上积分标量函数计算：

$$E_{\text{boundary}} = \int_{\partial} f \, ds$$ (16.8)

### 16.3.6 约束能量（Constraint Energy）

约束能量通过拉格朗日乘数（Lagrange multiplier）实现。对于约束 $C$，约束能量为：

$$E_{\text{constraint}} = \lambda C$$ (16.9)

其中 $\lambda$ 是拉格朗日乘数（压力）。

### 16.3.7 表面能量（Surface Energy）

表面能量与表面积成正比：

$$E_{\text{surface}} = \gamma A$$ (16.10)

其中 $\gamma$ 是表面张力（surface tension），$A$ 是表面积。

### 16.3.8 结能量（Knot Energy）

结能量用于研究纽结理论。基本的库仑结能量为：

$$E_{\text{knot}} = \int_C \int_C \frac{1}{|\vec{r}_1 - \vec{r}_2|^p} \, ds_1 \, ds_2$$ (16.11)

其中 $p$ 是幂次（通常为1或2），$C$ 是结曲线。

### 16.3.9 弹性能量（Elastic Energy）

弹性能量用于模拟弹性曲线或曲面：

$$E_{\text{elastic}} = \frac{1}{2} \int k^2 \, ds$$ (16.12)

其中 $k$ 是曲率。

## 16.4 命名数量和方法（Named Quantities and Methods）

### 16.4.1 概述

命名数量允许用户定义自定义的积分量。Evolver计算这些量的值和梯度，可用于优化或约束。

### 16.4.2 定义数量

数量在数据文件中定义，格式为：

```
quantity name method method_type modulus m element_type generator
```

### 16.4.3 数量值

数量的值通过对所有相关元素求和计算：

$$Q = \sum_e Q_e$$ (16.13)

其中 $Q_e$ 是元素 $e$ 的贡献。

### 16.4.4 路径积分

路径积分（path integral）沿曲线积分标量函数：

$$\int_C f(x,y,z) \, ds$$ (16.14)

在离散情况下，对每条边进行求和：

$$\int_C f \, ds \approx \sum_e f(\bar{v}_e) \, |e|$$ (16.15)

其中 $\bar{v}_e$ 是边 $e$ 的中点，$|e|$ 是边的长度。

### 16.4.5 线积分

线积分（line integral）沿曲线积分向量场：

$$\int_C \vec{F} \cdot d\vec{r} = \int_C (F_x dx + F_y dy + F_z dz)$$ (16.16)

### 16.4.6 标量面积分

标量面积分（scalar surface integral）在面上积分标量函数：

$$\iint_S f(x,y,z) \, dA$$ (16.17)

### 16.4.7 向量面积分

向量面积分（vector surface integral）计算向量场通过面的通量：

$$\iint_S \vec{F} \cdot d\vec{S} = \iint_S \vec{F} \cdot \vec{n} \, dA$$ (16.18)

### 16.4.8 2-形式面积分

2-形式面积分是向量面积分的推广：

$$\iint_S \omega = \iint_S (A \, dy \wedge dz + B \, dz \wedge dx + C \, dx \wedge dy)$$ (16.19)

### 16.4.9 一般积分

一般积分（general integral）允许用户定义任意的积分表达式。Evolver自动计算其梯度。

### 16.4.10 弦面积

弦面积（string area）是在字符串模型中计算的面积：

$$A_{\text{string}} = \sum_e |e|$$ (16.20)

### 16.4.11 体积积分

体积积分在体 $V$ 内积分标量函数：

$$\iiint_V f \, dV$$ (16.21)

通过散度定理转化为面积分：

$$\iiint_V f \, dV = \frac{1}{3} \iint_{\partial V} f \vec{r} \cdot d\vec{S}$$ (16.22)

### 16.4.12 重力

重力数量计算重力势能：

$$E_g = g \sum_b \rho_b V_b z_{\text{centroid},b}$$ (16.23)

### 16.4.13 Hooke能量

Hooke能量（Hooke energy）是弹性能量的一种形式：

$$E_{\text{Hooke}} = \frac{k}{2} (L - L_0)^2$$ (16.24)

其中 $k$ 是弹性常数，$L$ 是当前长度，$L_0$ 是自然长度。

### 16.4.14 局部Hooke能量

局部Hooke能量（local Hooke energy）是每边的弹性能量：

$$E_{\text{local}} = \frac{k}{2} \sum_e (|e| - L_{0,e})^2$$ (16.25)

### 16.4.15 平均曲率积分

平均曲率积分（integral of mean curvature）计算：

$$\int H \, dA$$ (16.26)

### 16.4.16 平方平均曲率

平方平均曲率（integral of squared mean curvature）计算：

$$\int H^2 \, dA$$ (16.27)

### 16.4.17 高斯曲率积分

高斯曲率积分（integral of Gaussian curvature）由角度缺陷给出：

$$\int K \, dA = 2\pi \chi$$ (16.28)

其中 $\chi$ 是欧拉示性数。

### 16.4.18 平均交叉数

平均交叉数（average crossings）计算曲线的平均交叉数：

$$\bar{n} = \frac{1}{2} \int_C \int_C |\dot{\vec{r}}_1 \times \dot{\vec{r}}_2| \cdot \frac{\vec{r}_1 - \vec{r}_2}{|\vec{r}_1 - \vec{r}_2|^3} \, ds_1 \, ds_2$$ (16.29)

### 16.4.19 线性弹性

线性弹性能量（linear elastic energy）用于模拟弹性曲线：

$$E_{\text{elastic}} = \frac{1}{2} \int |k|^2 \, ds$$ (16.30)

### 16.4.20 结能量分类

Evolver中的结能量方法分为三类：

#### I类结能量

I类结能量（type I knot energies）的核函数在零处发散：

$$E_I = \int_C \int_C \frac{1}{|\vec{r}_1 - \vec{r}_2|^p} \, ds_1 \, ds_2$$ (16.31)

其中 $p > 0$。

#### II类结能量

II类结能量（type II knot energies）使用导数：

$$E_{II} = \int_C \int_C \frac{|\dot{\vec{r}}_1 \times \dot{\vec{r}}_2|^2}{|\vec{r}_1 - \vec{r}_2|^{2p}} \, ds_1 \, ds_2$$ (16.32)

#### III类结能量

III类结能量（type III knot energies）使用二阶导数：

$$E_{III} = \int_C \int_C \frac{|(\dot{\vec{r}}_1 \cdot \dot{\vec{r}}_2)|^2}{|\vec{r}_1 - \vec{r}_2|^{2p}} \, ds_1 \, ds_2$$ (16.33)

### 16.4.21 共形球能量

共形球能量（conformal sphere energy）是一种特殊的Willmore能量：

$$W_C = \int (H^2 - K) \, dA$$ (16.34)

其中 $H$ 是平均曲率，$K$ 是高斯曲率。

## 16.5 体积（Volumes）

### 16.5.1 默认体积

默认体积通过散度定理计算：

$$V = \frac{1}{3} \sum_f (\vec{v}_1 \cdot \vec{n}_f) A_f$$ (16.35)

### 16.5.2 SYMMETRIC_CONTENT体积

`SYMMETRIC_CONTENT` 模式用于处理具有对称性的表面。在此模式下，体积的计算考虑了对称性：

$$V_{\text{sym}} = \frac{1}{3} \sum_f (\vec{v}_1 \cdot \vec{n}_f) A_f + \text{对称修正项}$$ (16.36)

### 16.5.3 边体积

边体积（edge volume）是通过边的体积贡献：

$$V_e = \frac{1}{6} (\vec{v}_1 + \vec{v}_2) \cdot (\vec{v}_1 \times \vec{v}_2)$$ (16.37)

### 16.5.4 环面域

在环面域（torus domain）中，必须考虑环绕效应。体积计算为：

$$V_{\text{torus}} = \frac{1}{3} \sum_f (\vec{v}_1 \cdot \vec{n}_f) A_f + \text{环绕修正}$$ (16.38)

环绕修正项处理了跨越域边界的面。

## 16.6 约束投影（Constraint Projection）

约束投影确保顶点满足其约束条件。在每次迭代后，Evolver将顶点投影回约束流形。

### 16.6.1 线性约束

对于线性约束，投影是简单的正交投影：

$$\vec{v}_{\text{new}} = \vec{v} - \frac{\vec{n} \cdot \vec{v} - d}{|\vec{n}|^2} \vec{n}$$ (16.39)

其中 $\vec{n}$ 是约束的法向量，$d$ 是约束的常数项。

### 16.6.2 非线性约束

对于非线性约束，使用牛顿迭代法（Newton's method）进行投影：

$$\vec{v}_{n+1} = \vec{v}_n - \frac{C(\vec{v}_n)}{|\nabla C(\vec{v}_n)|^2} \nabla C(\vec{v}_n)$$ (16.40)

### 16.6.3 不等式约束

不等式约束（inequality constraints）仅在违反时才激活：

$$C(\vec{v}) \geq 0$$ (16.41)

当 $C(\vec{v}) < 0$ 时，执行投影以使 $C(\vec{v}) = 0$。

## 16.7 体积约束（Volume Constraints）

体积约束允许固定体的体积。在优化过程中，Evolver保持体积不变：

$$V = V_0$$ (16.42)

这通过拉格朗日乘数实现：

$$\mathcal{L} = E - \lambda (V - V_0)$$ (16.43)

其中 $\mathcal{L}$ 是拉格朗日函数，$E$ 是能量，$\lambda$ 是压力。

## 16.8 数量约束（Quantity Constraints）

数量约束允许固定任何命名数量的值：

$$Q = Q_0$$ (16.44)

这同样通过拉格朗日乘数实现。

## 16.9 迭代（Iteration）

### 16.9.1 固定步长迭代

固定步长迭代（fixed step iteration）使用固定的步长 $\delta$：

$$\vec{v}_{n+1} = \vec{v}_n - \delta \nabla E(\vec{v}_n)$$ (16.45)

步长由 `m` 命令设置。

### 16.9.2 优化迭代

优化迭代（optimizing iteration）自动选择最佳步长。通过行搜索（line search）找到使能量最小的步长：

$$\delta^* = \arg\min_\delta E(\vec{v} - \delta \nabla E)$$ (16.46)

### 16.9.3 共轭梯度迭代

共轭梯度迭代（conjugate gradient iteration）比梯度下降收敛更快。搜索方向为：

$$\vec{d}_{n+1} = -\nabla E_{n+1} + \beta_n \vec{d}_n$$ (16.47)

其中 $\beta_n$ 的选择有多种方法：

- Fletcher-Reeves：$\beta_n = \frac{|\nabla E_{n+1}|^2}{|\nabla E_n|^2}$ (16.48)
- Polak-Ribière：$\beta_n = \frac{\nabla E_{n+1} \cdot (\nabla E_{n+1} - \nabla E_n)}{|\nabla E_n|^2}$ (16.49)

## 16.10 海森矩阵迭代（Hessian Iteration）

海森矩阵迭代使用能量的二阶导数信息，比梯度方法收敛更快。

### 16.10.1 海森矩阵

能量 $E$ 的海森矩阵 $H$ 定义为：

$$H_{ij} = \frac{\partial^2 E}{\partial v_i \partial v_j}$$ (16.50)

迭代公式为：

$$\vec{v}_{n+1} = \vec{v}_n - H^{-1} \nabla E(\vec{v}_n)$$ (16.51)

### 16.10.2 约束海森矩阵

在存在约束的情况下，海森矩阵必须考虑约束投影。约束海森矩阵为：

$$H_C = P^T H P$$ (16.52)

其中 $P$ 是投影到约束切空间的矩阵。

### 16.10.3 正定性

海森矩阵必须是正定的才能保证迭代收敛到最小值。Evolver使用以下技术处理非正定情况：

1. **特征值修正**：将负特征值替换为小的正数
2. **Levenberg-Marquardt**：添加 $\lambda I$ 使矩阵正定
3. **Sobolev梯度**：使用Sobolev内积修改海森矩阵

## 16.11 力和扭矩（Forces and Torques）

### 16.11.1 力的计算

在刚体上计算力时，Evolver支持五种不同的方法：

#### 方法1：直接求和

$$\vec{F} = \sum_f p A_f \vec{n}_f$$ (16.53)

其中 $p$ 是压力，$A_f$ 是面积，$\vec{n}_f$ 是法向量。

#### 方法2：梯度法

$$\vec{F} = -\nabla E_{\text{rigid}}$$ (16.54)

#### 方法3：面积加权法

$$\vec{F} = \sum_f A_f \vec{f}_f$$ (16.55)

其中 $\vec{f}_f$ 是面 $f$ 上的力密度。

#### 方法4：能量梯度

$$\vec{F} = -\frac{\partial E}{\partial \vec{x}_{\text{rigid}}}$$ (16.56)

#### 方法5：变分法

$$\vec{F} = \delta E / \delta \vec{x}$$ (16.57)

### 16.11.2 扭矩的计算

扭矩（torque）的计算类似：

$$\vec{\tau} = \sum_f \vec{r}_f \times (p A_f \vec{n}_f)$$ (16.58)

其中 $\vec{r}_f$ 是面 $f$ 的位置相对于旋转中心的向量。

### 16.11.3 悬链面示例

以下是计算悬链面（catenoid）上力的示例脚本 `catforce.fe`：

```
// catforce.fe - 计算悬链面的力
// 设置参数
parameter a := 1.0
constraint 1
  formula: x^2 + y^2 = a^2*cosh(z/a)^2

// 定义悬链面
vertices
1   1.0   0.0   0.0
2   0.0   1.0   0.0
// ... 更多顶点

// 计算力
g 100
printf "Total force: %g\n", total_force
```

### 16.11.4 扰动大小

在海森矩阵迭代中，扰动大小的选择很重要。推荐的扰动大小为：

$$\epsilon = \sqrt{\epsilon_{\text{machine}}} \approx 10^{-8}$$ (16.59)

对于单精度，使用 $\epsilon \approx 10^{-4}$。

### 16.11.5 收敛准则

海森矩阵迭代的收敛准则基于能量变化：

$$\frac{|E_{n+1} - E_n|}{|E_n|} < \epsilon$$ (16.60)

或基于梯度范数：

$$|\nabla E| < \epsilon$$ (16.61)

## 16.12 等角化（Equiangulation）

等角化（equiangulation）是一种改进三角形质量的操作。它通过翻转对角线使四边形的两个三角形更接近等边三角形。

对于由两个三角形共享的对角线，如果翻转对角线后两个三角形的最小角增大，则执行翻转：

$$\text{flip if } \min(\alpha'_1, \alpha'_2) > \min(\alpha_1, \alpha_2)$$ (16.62)

其中 $\alpha_i$ 是原三角形的角，$\alpha'_i$ 是翻转后三角形的角。

## 16.13 二面角（Dihedral Angle）

二面角（dihedral angle）是两个相邻面之间的夹角：

$$\cos \theta = \vec{n}_1 \cdot \vec{n}_2$$ (16.63)

其中 $\vec{n}_1$ 和 $\vec{n}_2$ 是两个面的单位法向量。

## 16.14 面积归一化（Area Normalization）

面积归一化将表面缩放到指定的总面积：

$$\vec{v}_{\text{new}} = \sqrt{\frac{A_0}{A}} \vec{v}$$ (16.64)

其中 $A_0$ 是目标面积，$A$ 是当前面积。

## 16.15 隐藏面（Hidden Surfaces）

Evolver使用画家算法（painter's algorithm）进行隐面消除。面按深度排序并从后向前绘制。

## 16.16 外推法（Extrapolation）

外推法（extrapolation）用于估计最小能量。Evolver使用理查德森外推法（Richardson extrapolation）：

$$E_{\text{exact}} \approx E_1 + \frac{E_1 - E_2}{r^p - 1}$$ (16.65)

其中 $E_1$ 和 $E_2$ 是不同分辨率下的能量，$r$ 是细化比，$p$ 是外推阶数。

## 16.17 曲率测试（Curvature Test）

曲率测试用于检测表面是否接近球面：

$$\text{test} = \frac{\max_v |H_v - \bar{H}|}{\bar{H}} < \epsilon$$ (16.66)

其中 $H_v$ 是顶点 $v$ 处的平均曲率，$\bar{H}$ 是平均曲率的均值。

## 16.18 退火（Annealing）

退火（annealing）是一种优化技术，通过添加随机扰动帮助跳出局部最小值。在Evolver中，退火在每个迭代中添加随机位移：

$$\vec{v}_{\text{new}} = \vec{v} + T \cdot \vec{\xi}$$ (16.67)

其中 $T$ 是"温度"，$\vec{\xi}$ 是随机向量。温度逐渐降低以收敛到全局最小值。

## 16.19 长波长扰动（Long Jiggling）

长波长扰动（long wavelength perturbation）使用正弦函数扰动表面，帮助探索大尺度的构形空间：

$$\vec{v}_{\text{new}} = \vec{v} + A \sin(kx + \phi)$$ (16.68)

其中 $A$ 是振幅，$k$ 是波数，$\phi$ 是相位。

## 16.20 同胚变换（Homothety）

同胚变换（homothety）按比例缩放所有体的体积，使总体积为1：

$$\vec{v}_{\text{new}} = V^{-1/3} \vec{v}$$ (16.69)

其中 $V$ 是总体积。

## 16.21 弹出非最小边（Popping Non-Minimal Edges）

弹出（popping）操作删除接近退化的边。当边的长度接近零或角度接近0或π时，删除该边。

## 16.22 弹出顶点锥（Popping Vertex Cones）

弹出顶点锥操作处理退化的顶点配置。当一个顶点的所有相邻边几乎共线时，移除该顶点。

## 16.23 细化（Refining）

细化（refining）将每个边分成两段，每个面分成四个面：

$$\vec{v}_{\text{mid}} = \frac{\vec{v}_1 + \vec{v}_2}{2}$$ (16.70)

## 16.24 单形模型中的细化

在单形模型中，细化通过重心细分（barycentric subdivision）实现。

## 16.25 移除微小边（Removing Tiny Edges）

移除长度小于阈值的边：

$$|e| < \epsilon$$ (16.71)

## 16.26 清除小三角形（Weeding Small Triangles）

清除面积小于阈值的三角形：

$$A_f < \epsilon$$ (16.72)

## 16.27 顶点平均（Vertex Averaging）

顶点平均（vertex averaging）将每个顶点移动到其邻近面重心的加权平均位置：

$$\vec{v}_{\text{new}} = \frac{\sum_f A_f \vec{c}_f}{\sum_f A_f}$$ (16.73)

其中 $\vec{c}_f$ 是面 $f$ 的重心，$A_f$ 是面积。

## 16.28 放大顶点（Zooming In On Vertex）

放大顶点操作将视图中心移动到指定顶点，便于详细检查该区域。

## 16.29 移动性和近似曲率（Mobility and Approximate Curvature）

### 16.29.1 移动性

移动性（mobility）矩阵描述了每个顶点在受力时的响应：

$$\delta \vec{v}_i = \sum_j M_{ij} \vec{F}_j$$ (16.74)

其中 $M_{ij}$ 是移动性矩阵的元素，$\vec{F}_j$ 是作用在顶点 $j$ 上的力。

### 16.29.2 阻力矩阵

阻力矩阵（resistance matrix）是移动性矩阵的逆：

$$R = M^{-1}$$ (16.75)

### 16.29.3 近似曲率

近似曲率（approximate curvature）通过以下方式计算：

$$\kappa \approx \frac{2 |\vec{n}_1 \times \vec{n}_2|}{|e|}$$ (16.76)

其中 $\vec{n}_1$ 和 $\vec{n}_2$ 是相邻面的法向量，$|e|$ 是共享边的长度。

### 16.29.4 曲率半径

曲率半径（radius of curvature）是曲率的倒数：

$$R = \frac{1}{\kappa}$$ (16.77)

对于平均曲率 $H$ 和高斯曲率 $K$，主曲率半径为：

$$R_1, R_2 = \frac{1}{H \pm \sqrt{H^2 - K}}$$ (16.78)

---

## 16.30 附录：公式汇总

本节汇总了Evolver中使用的主要公式。

### 16.30.1 几何量

- 面积：$A = \frac{1}{2} |\vec{e}_1 \times \vec{e}_2|$ (16.79)
- 体积：$V = \frac{1}{3} \sum_f \vec{v}_f \cdot \vec{n}_f A_f$ (16.80)
- 平均曲率：$H = \frac{\kappa_1 + \kappa_2}{2}$ (16.81)
- 高斯曲率：$K = \kappa_1 \kappa_2$ (16.82)

### 16.30.2 能量

- 表面能：$E = \gamma A$ (16.83)
- 重力势能：$E_g = g \rho V z_c$ (16.84)
- 压力能：$E_p = -p V$ (16.85)
- 结能量：$E_k = \int\int K(r) \, ds_1 \, ds_2$ (16.86)

### 16.30.3 迭代公式

- 梯度下降：$\vec{v}_{n+1} = \vec{v}_n - \delta \nabla E$ (16.87)
- 海森矩阵：$\vec{v}_{n+1} = \vec{v}_n - H^{-1} \nabla E$ (16.88)
- 共轭梯度：$\vec{d}_{n+1} = -\nabla E_{n+1} + \beta_n \vec{d}_n$ (16.89)

### 16.30.4 约束处理

- 投影：$\vec{v}_{\text{new}} = \vec{v} - \frac{C(\vec{v})}{|\nabla C|^2} \nabla C$ (16.90)
- 拉格朗日：$\mathcal{L} = E - \lambda C$ (16.91)

---

## 附录A：Evolver命令快速参考

| 命令 | 功能 |
|------|------|
| `g [n]` | 执行n步梯度下降 |
| `hessian` | 海森矩阵迭代 |
| `r [n]` | 细化n次 |
| `u` | 等角化 |
| `m step` | 设置步长 |
| `display` | 切换显示 |
| `s` | 保存 |
| `q` | 打印变量 |
| `v` | 打印顶点 |
| `p` | 打印元素 |
| `d` | 删除元素 |
| `w` | 线框显示 |
| `t` | 三角形显示 |
| `n` | 重置视图 |
| `y` | 长波长扰动 |
| `j` | 切换抖动 |
| `o` | 切换等角化 |
| `z` | 缩放 |
| `x` | 旋转 |

## 附录B：数学符号表

| 符号 | 含义 |
|------|------|
| $\vec{v}$ | 顶点坐标 |
| $\vec{n}$ | 单位法向量 |
| $A$ | 面积 |
| $V$ | 体积 |
| $H$ | 平均曲率 |
| $K$ | 高斯曲率 |
| $\kappa_1, \kappa_2$ | 主曲率 |
| $\lambda$ | 拉格朗日乘数 |
| $\gamma$ | 表面张力 |
| $\nabla E$ | 能量梯度 |
| $H$ | 海森矩阵 |
| $\delta$ | 步长 |
| $\epsilon$ | 小量/容差 |
