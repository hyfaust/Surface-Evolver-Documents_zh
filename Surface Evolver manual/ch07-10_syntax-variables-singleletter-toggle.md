# 第7章 语言语法 (Language Syntax)

## 7.1 通用语言语法 (General Language Syntax)

命令 (command) 每次输入一行，经过解析后执行。多行命令可以用花括号括起来输入。如果一行在嵌套的花括号或括号中结束，Evolver 会要求更多输入。如果行以某些不能合法结束命令的标记（如 `+`）结尾，也会要求更多输入。未闭合的引号同样会要求更多输入，嵌入的换行符将被省略。可以用反斜杠（`\`）结束一行来显式续行（行拼接）。你也可以使用 `read` 命令从文件中读取长命令。

成功解析的命令会保存在历史列表中，最多保存 100 条命令。可以使用 `!!` 访问最后一条命令，或使用 `!string` 访问以匹配字符串开头的最新命令。`!number` 将按编号重复命令。命令将被回显。保存的历史列表可以用 `history` 命令打印。

一些单字母命令 (single-letter command) 需要交互式输入。对于这些命令，下面列出了等效的命令，它们将输入信息作为命令的一部分接受。这样命令可以从脚本中读取，而无需在命令之后的附加行上放置输入数据，尽管对于单字母版本仍然可以这样做。

**通用说明：** 某些命令会提示你输入一个值。空响应（仅按回车键）将保持旧值不变并返回命令提示符。在零值有意义的选项上，必须显式输入零。需要实数值的命令将接受任意表达式 (expression)。

许多改变曲面或改变模型的命令会导致重新计算能量和体积。如果你怀疑某个命令没有执行此操作，`recalc` 命令将重新计算所有内容。它还将更新任何自动显示。

在以下命令语法描述中，关键字 (keyword) 以大写字母显示，但在实际命令中大小写无关紧要，单字母命令除外。方括号括起命令的可选部分。

### 7.1.1 命令分隔符 (Command Separator)

```
command ; command ...
```

同一行上的多个命令可以用分号分隔。分号也是复合命令内分隔命令所必需的。最后一个命令之后不需要分号。示例：

```
g 10; r; g 10; u
```

### 7.1.2 复合命令 (Compound Commands)

```
{ command ; ... }
```

花括号将命令列表组合为一个命令。这在各种控制结构中很有用。如果后面有命令，则 `}` 后面需要分号（注意这与 C 语言不同）。在 `IF THEN ELSE` 命令的第一个命令之后不要使用分号。空的复合命令 `{ }` 是合法的。变量名 (variable) 的作用域可以通过声明该名称为局部变量来限制到复合命令中，例如：

```
{ local inx;
  for ( inx := 1 ; inx <= 5 ; inx += 1 )
  { print inx;
  };
};
```

使用局部变量可以防止全局命名空间污染，并允许递归函数。局部变量可以遮蔽同名的全局变量。注意，局部声明不是类型声明，只是作用域声明。

### 7.1.3 命令重复 (Command Repetition)

```
command expr
```

用于执行命令若干次。确保在单字母命令和表达式之间留有空格，以免你的命令被解释为一个标识符。为避免几种类型的混淆，只有某些类型的命令是可重复的：

1. 没有可选参数的单字母命令（l, t, j, m, n, w, P, M, G 有可选参数）
2. 花括号中的命令列表
3. 用户定义的过程 (procedure) 名称
4. 重新定义的单字母命令

示例：

```
{ g 10; u; V; } 100
```

### 7.1.4 管道命令输出 (Piping Command Output)

```
command | stringexpr
```

命令的输出被管道传输到系统命令。`stringexpr` 需要是带引号的字符串或字符串变量。它被解释为系统命令。

示例：

```
list facets | "more"
list vertices | "tee vlist" ; g 10
list edges | "cat >edgefile"
```

### 7.1.5 重定向命令输出 (Redirecting Command Output)

```
command >> stringexpr
command >>> stringexpr
```

命令的输出被重定向到文件，`>>` 为追加，`>>>` 为覆盖。`stringexpr` 需要是带引号的字符串或字符串变量。

由于 `>` 用作比较运算符，因此不提供使用 `>` 替换当前内容的重定向。

示例：

```
{ { g 10; u } 15 } >> "logfile"
list vertices >>> "vlist.txt"
```

### 7.1.6 流程控制 (Flow of Control)

本节解释控制命令执行顺序的基本编程构造。

#### IF 条件语句

```
IF expr THEN command [ ELSE command ]
```

用于命令的条件执行。`expr` 为非零时为真。不要使用分号结束第一个命令。

示例：

```
if denom == 0 then return;
if vertex[1] fixed then print "fixed\n" else print "unfixed\n";
if max(edges,length) > 0.02 then { r; g 100 } else g 4;
```

#### WHILE 循环

```
WHILE expr DO command
DO command WHILE expr
```

用于由逻辑表达式控制的迭代执行。表达式为非零时为真。示例：

```
while max(edges,length) > 0.02 do { r; { g 40; u} 5 }
```

#### FOR 循环

```
FOR ( command1 ; expr ; command2 ) command3
```

这是 Evolver 版本的 C 语言 `for` 构造。第一个命令是初始化命令；注意它是单个命令，而不是 C 语言中的表达式。如果要在初始化中使用多个命令，请使用花括号括起的复合命令。中间表达式在每次循环迭代开始时求值；如果其值为真（即非零），则执行循环；否则流程控制传递到 `command3` 之后的命令。`command2` 在每次循环迭代结束时执行；同样，它是单个命令。循环体是单个命令 `command3`，通常是复合命令。注意：`command3` 应以分号结尾，除非它是 if-then 语句的 if 子句。示例：

```
for ( inx := 1 ; inx < 3 ; inx++ )
  print facet[inx].area;
for ( {inx := 1; factorial := 1;} ; inx < 7 ; inx++ )
{ factorial *= inx;
  printf "factorial %d is %d\n",inx,factorial;
};
```

#### ABORT

导致正在执行的命令立即终止并返回命令提示符。用于在发现错误条件时停止命令的执行。将输出错误消息，给出中止发生的文件和行号，但最好让脚本或过程或函数在执行 `abort` 命令之前使用 `errprintf` 打印错误消息，以便用户知道原因。

#### BREAK

退出最内层的当前循环。注意：带有重复计数的命令不算作循环。

#### BREAK n

退出最内层的 n 个循环。注意：带有重复计数的命令不算作循环。

#### CONTINUE

跳过当前循环体的剩余部分，进入下一次迭代。注意：带有重复计数的命令不算作循环。

#### CONTINUE n

退出最内层的 n-1 个循环，并跳到第 n 个最内层循环的生成器。注意：带有重复计数的命令不算作循环。

#### RETURN

退出当前命令。如果当前命令是由另一个命令调用的用户定义命令，则父命令继续。这本质上是从子过程返回。

### 7.1.7 用户定义的过程 (User-Defined Procedures)

用户可以使用以下语法定义自己的命令词：

```
identifier := { commandlist }
```

示例：

```
gg := { g 10; u; V; }
groom := {
  refine edges where length > 0.4 and not fixed;
  delete edges where length < 0.1;
  u; V; u; V;
};
```

用户可以使用带参数的过程定义自己的过程，语法如下：

```
PROCEDURE identifier ( type arg1, type arg2, ... )
{ commands }
```

目前参数的已实现类型是 `real` 和 `integer`。参数列表可以为空。示例：

```
procedure proc1 ( real ht, real wd )
{
  prod := ht*wd; // 这会使 prod 成为全局变量
  return;
}
```

注意，过程参数作为局部变量，即它们的作用域是过程体，并且它们有栈存储，因此过程可以是递归的。过程原型 (prototype) 可以在过程体定义之前声明过程，使用相同的语法，只需将过程体替换为分号。原型语法：

```
procedure identifier ( type arg1, type arg2, ... ) ;
```

注意，过程用作命令，而函数 (function) 用在数值表达式中。

### 7.1.8 用户定义的函数 (User-Defined Functions)

用户可以使用以下语法定义具有参数和返回值的函数：

```
FUNCTION type identifier ( type arg1, type arg2, ... )
{ commands }
```

目前返回值和参数的已实现类型是 `real` 和 `integer`。参数列表可以为空。返回值在 `return expr` 语句中给出。示例：

```
function real proc1 ( real ht, real wd )
{ local prod;
  prod := ht*wd;
  return prod;
}
```

注意，函数参数作为局部变量，即它们的作用域是函数体，并且它们有栈存储，因此函数可以是递归的。函数原型可以在函数体定义之前声明函数，使用相同的语法，只需将函数体替换为分号。原型语法：

```
function type identifier ( type arg1, type arg2, ... ) ;
```

注意，过程用作命令，而函数用在数值表达式中。

## 7.2 表达式 (Expressions)

表达式有三种类型：数值型、数值数组型和字符串型。字符串表达式要么是带引号的字符串，要么由 `SPRINTF` 命令创建；连续的带引号字符串将被连接为一个字符串。数值表达式始终是浮点数，不是整数。条件的布尔值也是浮点数，0 为假，非零为真（布尔运算的真结果为 1）。整数值在内部全部转换为实数值以进行表达式求值。

**数值值：**

| 表达式 | 说明 |
|--------|------|
| `constant` | 显式数字：整数、定点数、科学计数法、十六进制（`0x12AC`）或二进制表示法（`0110110b`）。 |
| `G` | 当前重力常数 (gravitational constant) |
| `e`, `pi` | 特殊常数 |
| `identifier` | 数值变量的名称 |
| `identifier[expr]...` | 完全索引的数组名，一个数组条目 |
| `element.attribute` | 数值元素属性。元素可以由元素生成器（见第 11.2 节）指定，由生成器中的元素名称指定（同样见第 11.2 节），或者如果它是元素生成器中当前元素的属性，则可以省略。 |
| `functionname(arglist)` | 函数调用 |
| `max, min, avg, sum, count` | 聚合表达式 (aggregate expression) |
| `quantity.attribute` | 命名量的属性：`value`, `target`, `fixed`, `pressure`, `modulus`, `tolerance` |
| `instance.attribute` | 命名方法实例的属性 |
| `constraintname` | 用在期望值的地方的约束名称被转换为其内部标识编号 |
| `boundaryname` | 用在期望值的地方的参数化边界名称被转换为其内部标识编号 |
| `parameter.attribute` | 优化参数属性：`pdelta`, `pscale` 或 `fixed` |
| `colorname` | 标准颜色名称 `black`, `blue`, ..., `white` 被视为整数 0 到 15 |
| `togglename` | 在表达式中使用的开关名称，ON 时值为 1，OFF 时值为 0。这不适用于像 `U` 这样的单字母开关，但它们都有文字等价物，如 `conj_grad` |

**数值数组表达式：** 这些可用于数组运算或与 `print` 命令一起使用。

| 表达式 | 说明 |
|--------|------|
| `arrayname` | 非索引数组名 |
| `arrayname[expr]...` | 部分索引的数组名，数组的一个切片 |
| `element.arrayname` | 元素的非索引数组属性 |
| `element.arrayname[expr]...` | 部分索引的元素数组属性，属性数组的一个切片 |

**运算符（从高到低优先级）：** "标量"表示运算符作用于单个数值。

| 优先级 | 运算符 | 说明 |
|--------|--------|------|
| 1 | `()` | 分组和函数表示法 |
| 2 | `^`, `**` | 实数幂，例如 `2^4 = 16`。标量 |
| 3 | `-` | 一元负号，如 `-x`。标量和数组 |
| 4 | `*` | 乘法。标量和数组 |
|   | `/` | 实数除法。标量 |
|   | `%`, `mod` | 实数模运算，即除法余数。`11 % 3 = 2`。标量 |
|   | `imod` | 整数模运算。标量。实数操作数在模运算前向下取整为整数 |
|   | `idiv` | 整数除法，例如 `34 idiv 5` 为 6。标量。实数操作数向零取整 |
| 5 | `+`, `-` | 加法和减法。标量和数组 |
| 6 | `==`, `>`, `<`, `<=`, `>=`, `!=` | 比较。标量 |
| 7 | `not`, `!` | 逻辑非。标量 |
| 8 | `and`, `&&` | 逻辑与，短路求值。标量 |
| 9 | `or`, `\|\|` | 逻辑或，短路求值。标量 |
| 10 | `? :` | 条件表达式，如 C 语言。即 `expr1 ? expr2 : expr3` 在 `expr1` 为真（非零）时求值为 `expr2`，在 `expr1` 为假（零）时求值为 `expr3`。标量 |

**注意：** 在数据文件中，前面有空白且后面跟数字的 `+` 或 `-` 被视为带符号数字。因此 `"3 - 5"` 和 `"3-5"` 是单个表达式，但 `"3 -5"` 不是。这是为了方便在数据文件中同一行上分隔多个表达式。

**注意：** 布尔 AND 和 OR 运算符使用短路求值；即仅在必要时才计算第二个操作数。

**自增和自减：** 前缀和后缀自增及自减运算符 `++` 和 `--`（如 C 语言）仅作为独立命令对单个变量有效。`++var` 或 `var++` 将使 `var` 的值增加 1，`--var` 或 `var--` 将使 `var` 的值减少 1。示例：

```
change_count++;
--left_to_do;
for ( inx := 1 ; inx <= 10 ; inx++ )
```

是合法的，但 `"zsum := zarray[inx++]"` 不合法，因为 `"inx++"` 在 Evolver 中是一个命令，而不是一个值。

**字符串表达式：** 字符串表达式求值为一个字符字符串。目前，产生字符串的唯一方式是：

1. 双引号字符串字面量，例如 `"this is a string"`。以下标准 C 转义序列被识别：
   - `\n` 换行
   - `\r` 回车
   - `\t` 制表符
   - `\b` 退格
   - `\q` 双引号
   - `\c` 字符 `c` 本身，例如 `\\` 给出 `\`，`\"` 给出 `"`

2. 字符串变量 (string variable)，可以是像 `datafilename` 这样的内部变量，也可以是用户定义的。

3. `sprintf` 的输出。

在 Microsoft Windows 文件路径中，使用 `/` 作为目录分隔符，因为反斜杠是转义字符。Windows 一直接受 `/` 作为目录分隔符。

## 7.3 聚合表达式 (Aggregate Expressions)

对一组元素的表达式求最大值、最小值、总和、计数和平均值可以用聚合表达式完成。`histogram` 和 `loghistogram` 命令具有相同的形式。一般形式为：

```
aggregate( generator, expr)
```

其中 `aggregate` 可以是 `max`, `min`, `sum`, `count` 或 `avg`。生成器 (generator) 按照上面讨论的方式生成元素。逻辑表达式上的 `max` 和 `min` 可用于逻辑 `any` 和 `all`。空集的 `max` 是大负数，空集的 `min` 是大正数，因此使用 `WHERE` 子句时要小心。

示例：

```
print max(edge,length);
ave_area := avg(facet where not fixed,area);
histogram(facet where color==green, area);
show facets ff where max(ff.edge ee,max(ee.facet fff, fff.id == 4))}
```

---

# 第8章 内部变量 (Internal Variables)

以下是 Evolver 定义的变量的字母顺序列表。

| 变量名 | 说明 | 读写 |
|--------|------|------|
| `ambient_pressure_value` | 理想气体模型中外部压力的值 | 读写 |
| `area_fixed` | 旧固定面积约束的目标值。不激活约束。已弃用。现在最好使用带有 `facet_area` 方法的命名量 | 读写 |
| `autochop_length` | `autochop` 命令的截断长度。写入它不会打开 autochop | 读写 |
| `background` | 某些屏幕图形使用的背景颜色 | 读写 |
| `body_count` | 体 (body) 的数量 | 只读 |
| `body_dissolve_count` | 由 `dissolve bodies` 命令溶解的面数量 | 只读，由 `reset_counts` 命令重置 |
| `breakflag` | 设置为非零值时，导致命令解释器中止并返回命令提示符。相当于键盘中断（通常是 CTRL-C）的软件等价物。中断不会立即发生，而是在解释器循环中定期检查用户中断的某个点。用于从嵌套命令中退出，因为 `return` 只跳出当前过程。可能已弃用。请改用 `abort` 命令 | 读写 |
| `brightness` | PostScript 输出和屏幕图形中使用的中值灰度级 | 读写 |
| `check_count` | 最近一次 `C` 命令发现的错误数量 | 只读 |
| `clock` | 自启动 Evolver 以来的进程经过时间（秒） | 只读 |
| `console_title` | 此字符串变量是显示在 Evolver 命令控制台窗口上的标题。默认值为 `"Surface Evolver - datafilename"`（当然包含当前数据文件的名称）。当你同时运行多个实例时很有用，便于区分哪个在哪个控制台窗口中运行。只需将字符串赋给 `console_title` 即可自动更改窗口上的标题 | 读写 |
| `colorfile` | 字符串变量，保存 `P` 命令 colormap 选项的文件名 | 读写 |
| `constraint_tolerance` | 被视为等效于零的约束值 | 读写 |
| `cpu_counter` | 自开机以来的 CPU 周期（目前仅在 x86 上可用） | 只读 |
| `curvature_power` | 当在数据文件顶部声明 `squared_curvature` 或使用 `sqcurve_string` 命名方法时，字符串模型中使用的曲率幂 | 读写 |
| `datafilename` | 包含当前数据文件名的字符串 | 只读 |
| `date_and_time` | 包含当前日期和时间的字符串 | 只读 |
| `delete_count` | `edge_delete_count` 和 `facet_delete_count` 之和 | 只读，由 `reset_counts` 命令重置 |
| `detorus_epsilon` | 当 `detorus_sticky` 打开时，`detorus` 识别顶点的容差 | 读写 |
| `diffusion_coeff` | 当扩散生效时，控制体积沿表面扩散速率的变量。如果你想更精细地控制各种表面的扩散速率，可以在字符串模型中定义 `edge_diffusion` 边属性或在 soapfilm 模型中定义 `facet_diffusion` 面属性，并根据需要为边或面赋予单独的值。如果定义了该属性，则使用其值代替 `diffusion_coeff` | 读写 |
| `dissolve_count` | `vertex_dissolve_count`, `edge_dissolve_count` 等之和 | 只读 |
| `edge_count` | 边 (edge) 的数量 | 只读 |
| `edge_delete_count` | 由 `delete edges` 命令删除的边数量 | 只读，由 `reset_counts` 命令重置 |
| `edge_dissolve_count` | 由 `dissolve edges` 命令溶解的边数量 | 只读，由 `reset_counts` 命令重置 |
| `edge_pop_count` | 由 `pop edges` 或 `O` 命令弹出的边数量 | 只读，由 `reset_counts` 命令重置 |
| `edge_refine_count` | 由 `refine edges` 命令细分的边数量 | 只读，由 `reset_counts` 命令重置 |
| `edgeswap_count` | 由 `edgeswap` 命令翻转的边数量 | 只读，由 `reset_counts` 命令重置 |
| `eigenneg` | 最后一次 Hessian 分解中的负特征值数量 | 只读 |
| `eigenpos` | 最后一次 Hessian 分解中的正特征值数量 | 只读 |
| `eigenvalues` | 包含 `ritz` 命令产生的特征值列表的数组 | 只读 |
| `eigenzero` | 最后一次 Hessian 分解中的零特征值数量 | 只读 |
| `equi_count` | 由 `equiangulate` 或 `u` 命令翻转的边数量 | 只读，由 `reset_counts` 命令重置 |
| `estimated_change` | 当 `estimate` 开关打开时，`g` 步骤期间的估计变化量 | 只读 |
| `facet_count` | 面 (facet) 的数量 | 只读 |
| `facet_delete_count` | 由 `delete facets` 命令删除的面数量 | 只读，由 `reset_counts` 命令重置 |
| `facet_dissolve_count` | 由 `dissolve facets` 命令溶解的面数量 | 只读，由 `reset_counts` 命令重置 |
| `facet_refine_count` | 由 `refine facets` 命令细分的面数量 | 只读，由 `reset_counts` 命令重置 |
| `facetedge_count` | 面边 (facetedge) 的数量 | 只读 |
| `fix_count` | 由 `fix` 命令固定的元素数量 | 只读，由 `reset_counts` 命令重置 |
| `graphics_title` | 此字符串变量是显示在 Evolver 图形窗口上的标题。默认值为数据文件名。当你同时运行多个实例时很有用，便于区分哪个在哪个图形窗口中运行。只需将字符串赋给 `graphics_title` 即可自动更改窗口上的标题。如果还有第二个或第三个图形窗口，还有 `graphics_title2` 和 `graphics_title3` 变量 | 读写 |
| `gravity_constant` | 重力常数的值；也可通过 `G` 命令设置 | 读写 |
| `hessian_epsilon` | `hessian` 命令在分解 Hessian 矩阵时视为零的量级。如果在分解过程中枢轴位置的对角线上出现零，则检查该行的其余部分是否为零。如果是，则在对角线上放置 1；否则报告错误 | 读写 |
| `hessian_slant_cutoff` | 使 hessian 命令将法向量几乎垂直于约束的顶点视为固定的。`hessian_slant_cutoff` 是角度的余弦。适用于 `hessian_normal` 模式中具有一个自由度的顶点 | 读写 |
| `high_boundary` | 最高参数化边界编号（包括命名边界） | 只读 |
| `high_constraint` | 最高级集约束编号（包括命名约束） | 只读 |
| `inverse_periods[expr][expr]` | `torus_periods` 矩阵的逆；基于 1 的索引 | 只读 |
| `integral_order` | 1D 和 2D 高斯积分完成的多项式阶数。最好分别设置 1D 和 2D | 读写 |
| `integral_order_1d` | 1D 高斯积分完成的多项式阶数 | 读写 |
| `integral_order_2d` | 2D 高斯积分完成的多项式阶数 | 读写 |
| `iteration_counter` | 当前迭代循环的索引值 | 只读 |
| `jiggle_temperature` | 当前抖动温度 | 读写 |
| `lagrange_order` | Lagrange 模型的阶数。用 `lagrange` 命令设置 | 读写 |
| `last_eigenvalue` | 最后一次 `saddle` 或 `ritz` 命令的最低特征值 | 只读 |
| `last_error` | 最后一个错误或警告消息的编号 | 读写。可写以便将其设为 0 来清除错误指示 |
| `last_hessian_scale` | 最后一次 `saddle` 或 `hessian_seek` 命令的步长 | 只读 |
| `linear_metric_mix` | Hessian 度量中线性插值的分数，相对于顶点加权 | 读写 |
| `memory_arena` | 分配给程序堆的总内存。仅限 Windows 版本 | 只读 |
| `memory_used` | 程序堆中使用的总内存。仅限 Windows 版本 | 只读 |
| `notch_count` | 由 `notch` 命令切口的边数量 | 只读，由 `reset_counts` 命令重置 |
| `pickenum` | 在图形显示中最后拾取的边编号 | 读写 |
| `pickfnum` | 在图形显示中最后拾取的面编号 | 读写 |
| `pickvnum` | 在图形显示中最后拾取的顶点编号。此顶点编号由图形窗口 `F` 键命令用于设置旋转中心的顶点，这就是它可写的原因 | 读写 |
| `pop_count` | `vertex_pop_count` 和 `edge_pop_count` 之和 | 只读，由 `reset_counts` 命令重置 |
| `pop_edge_to_tri_count` | 由 `pop_edge_to_tri` 命令翻转为三角形的边数量 | 只读，由 `reset_counts` 命令重置 |
| `pop_quad_to_quad_count` | 由 `pop_quad_to_quad` 命令翻转的四边形数量 | 只读，由 `reset_counts` 命令重置 |
| `pop_tri_to_edge_count` | 由 `pop_tri_to_edge` 命令翻转为边的三角形数量 | 只读，由 `reset_counts` 命令重置 |
| `ps_bareedgewidth` | PostScript 输出中裸边的宽度，相对于图像宽度为 3 的绝对项 | 读写 |
| `ps_conedgewidth` | PostScript 输出中约束或边界边的宽度，相对于图像宽度为 3 的绝对项 | 读写 |
| `ps_fixededgewidth` | PostScript 输出中固定边的宽度，相对于图像宽度为 3 的绝对项 | 读写 |
| `ps_gridedgewidth` | PostScript 输出中不属于任何特殊边类别的边的宽度，相对于图像宽度为 3 的绝对项 | 读写 |
| `ps_labelsize` | PostScript 输出中元素标签的相对宽度。默认为 3；值 1 给出相对于图像宽度为 3 的小但可读的标签 | 读写 |
| `ps_tripleedgewidth` | PostScript 输出中三价或更高价边的宽度，相对于图像宽度为 3 的绝对项 | 读写 |
| `ps_stringwidth` | PostScript 输出中字符串模型边的正常宽度，相对于图像宽度为 3 的绝对项 | 读写 |
| `quadratic_metric_mix` | 二次模型中 Hessian 度量中二次插值的分数。（从默认值 1 改变几乎无用） | 读写 |
| `random` | 0 到 1 之间的随机实数，每次不同 | 只读 |
| `random_seed` | 随机数生成器的种子。在数据文件开始时默认为 1。每次写入时重新初始化生成器 | 读写 |
| `refine_count` | `edge_refine_count` 和 `facet_refine_count` 之和 | 只读，由 `reset_counts` 命令重置 |
| `scale` | 当前比例因子 | 读写 |
| `scrollbuffersize` | 在 Windows 机器上设置命令窗口滚动缓冲区大小。适用于没有菜单属性选项的非 NT Windows | 读写 |
| `self_sim_coeff` | 当 `self_similar` 开关打开时用作量级系数的变量 | 读写 |
| `simplex_representation` | 面是否表示为单纯形（布尔值） | 只读 |
| `space_dimension` | 环境空间的维度 | 只读 |
| `string_curve_tolerance` | 在二次模型中，弯曲二次边的绘图平滑度可以通过内部变量 `string_curve_tolerance` 控制，它是构成边的连续绘图线段之间的期望角度（度） | 读写 |
| `surface_dimension` | 曲面的维度，字符串模型为 1，soapfilm 模型为 2 | 只读 |
| `symmetry_group` | 是否有任何对称性处于活动状态（布尔值） | 只读 |
| `t1_edgeswap_count` | 由 `t1_edgeswap` 命令翻转的边数量 | 只读，由 `reset_counts` 命令重置 |
| `target_tolerance` | 固定量误差容差的默认值，默认为 0.0001 | 读写 |
| `thickness` | 进行 3D 图形时分离不同颜色面侧的厚度，以防止奇怪的点画效果 | 读写 |
| `torus` | 环面域是否生效（布尔值） | 只读 |
| `torus_filled` | `torus_filled` 模式是否生效（布尔值） | 只读 |
| `torus_periods[expr][expr]` | 环面周期向量，如数据文件顶部部分；基于 1 的索引。注意行是周期向量 | 只读 |
| `total_area` | 曲面的总面积（soapfilm 模型） | 只读 |
| `total_energy` | 曲面的总能量 | 只读 |
| `total_length` | 曲面的总长度（字符串模型） | 只读 |
| `total_time` | 以总比例因子形式表示的经过时间 | 只读 |
| `transform_count` | 活动视图变换的数量 | 只读 |
| `unfix_count` | 由 `unfix` 命令取消固定的元素数量 | 只读，由 `reset_counts` 命令重置 |
| `vertex_count` | 顶点 (vertex) 的数量 | 只读 |
| `vertex_dissolve_count` | 由 `dissolve vertices` 命令溶解的顶点数量 | 只读，由 `reset_counts` 命令重置 |
| `vertex_pop_count` | 由 `pop vertices` 或 `o` 或 `O` 命令弹出的顶点数量 | 只读，由 `reset_counts` 命令重置 |
| `view_matrix[][]` | 从世界坐标（曲面坐标）到屏幕坐标的变换矩阵。Evolver 分发中的文件 `saveview.cmd` 有一个命令 `saveview`，可用于将当前 `view_matrix` 保存到文件中，该文件可以读回以恢复给定视图 | 读写 |
| `view_transforms_unique_point[]` | 在 `view_transforms_use_unique_point` 模式下由 `transform_expr` 命令用作点坐标的向量，用于丢弃重复的视图变换。默认情况下，"重复"意味着相同的矩阵，但在此模式下，"重复"由 `view_transforms_unique_point` 向量中坐标的图像来判断 | 读写 |
| `where_count` | 满足最后一个 `where` 子句的项目数量 | 只读，由 `reset_counts` 命令重置 |

## 8.1 实用函数 (Utility Functions)

```
sizeof(name)
```

数组或数组额外属性名称（不带引号）中的条目数量。也可应用于字符串或字符串变量以获取字符串中的字符数。

```
is_defined(stringexpr)
```

布尔函数。如果字符串中的标识符为 Evolver 所知（作为关键字、变量名、量名等），返回 1，否则返回 0。此函数在运行时求值，但整个命令中的变量在命令执行之前被解析，因此像 `if is_defined("newvar") then newvar := 1 else newvar := 2` 这样的命令即使 `newvar` 是首次出现也会给它赋值 1。在脚本中更好的测试方法是使用 `define` 命令定义变量而不初始化，然后测试它是否具有默认值，即数值变量为 0，字符串变量的 `sizeof` 为 0。

```
valid_element(indexed_element)
```

布尔函数。根据给定索引的元素是否存在返回 1 或 0。示例：

```
if valid_element(edge[12]) then refine edge[12]
if valid_element(body[2]) then set body[2].facet color red
```

```
valid_constraint(expr)
```

布尔函数。如果整数参数是有效级集约束的编号（注意命名约束有内部编号，在此使用），返回 1。

```
valid_boundary(expr)
```

布尔函数。如果整数参数是有效参数化边界的编号（注意命名边界有内部编号，在此使用），返回 1。

---

# 第9章 单字母命令 (Single-Letter Commands)

最古老和最常用的命令只是单个字母。这些命令区分大小写。单字母始终被解释为命令，因此不能使用单字母作为变量名。

可以使用以下语法将单字母重新分配给你自己的命令：

```
letter :::= command
```

但这只应在特殊情况下使用，例如重新定义 `r` 以在细分的同时执行额外操作。旧含义可以通过空赋值 `"letter :::="` 恢复。使用单引号括起字母可获得旧含义，即当 `r` 被重新定义时，`'r'` 将执行标准的 `refine`。重新定义在加载新曲面时被清除。在定义其他命令时使用重新定义的命令要小心。重新定义在执行重新定义命令时生效，而不是在解析时。重新定义不追溯到先前定义的命令中的使用。

## 9.1 单字母命令摘要 (Single-Letter Command Summary)

以下是简要摘要；完整描述请参见下一节。概念上有五组命令：

**1. 报告类：**

| 命令 | 说明 |
|------|------|
| `C` | 运行一致性检查 |
| `c` | 报告元素计数 |
| `e` | 外推 |
| `i` | 状态信息 |
| `v` | 报告体积 |
| `X` | 列出元素额外属性 |
| `z` | 执行曲率测试 |

**2. 模型特性类：**

| 命令 | 说明 |
|------|------|
| `A` | 设置可调常数 |
| `a` | 切换面积归一化 |
| `b` | 设置体压力 |
| `f` | 设置扩散常数。需要值 |
| `G` | 设置重力。需要值 |
| `J` | 切换每次移动的抖动 |
| `k` | 设置边界间隙常数 |
| `M` | 切换线性/二次模型 |
| `m` | 切换固定运动比例。设置时需要值，取消时不需要 |
| `p` | 设置环境压力 |
| `Q` | 报告或设置量 |
| `U` | 切换共轭梯度法 |

**3. 曲面修改类：**

| 命令 | 说明 |
|------|------|
| `g` | 执行一个迭代步。通常后跟重复计数 |
| `j` | 抖动一次。需要抖动大小的值 |
| `K` | 瘦长三角形长边细分。需要值 |
| `l` | 细分长边。需要值 |
| `N` | 将目标体积设为实际值 |
| `n` | 切口山脊和山谷。需要值 |
| `O` | 弹出非最小边 |
| `o` | 弹出非最小顶点 |
| `r` | 细分三角剖分 |
| `t` | 移除微小边。需要值 |
| `u` | 等角化 |
| `V` | 顶点平均 |
| `w` | 去除小三角形。需要值 |
| `y` | 环面复制 |
| `Z` | 缩放到顶点 |

**4. 输出类：**

| 命令 | 说明 |
|------|------|
| `D` | 切换每次迭代显示 |
| `d` | 将曲面转储到数据文件 |
| `P` | 创建图形显示文件 |
| `s` | 图形显示三角剖分 |

**5. 杂项：**

| 命令 | 说明 |
|------|------|
| `F` | 切换命令日志 |
| `H`, `h`, `?` | 帮助屏幕 |
| `q`, `x` | 退出 |

`G`, `j`, `l`, `m`, `n`, `t` 和 `w` 命令需要实数值，可以在同一行输入，如果没有则在提示时给出。

## 9.2 按字母顺序的单字母命令参考

### A — 可调值 (Adjustable Values)

显示当前值并允许你输入新值。新值作为常数编号（从列表中）和新值输入。命名量的值、它们的模量以及固定命名量的目标值也出现在这里。模量和目标值可以更改。只有显式用户定义的命名量才会出现在这里，除非 `show_all_quantities` 开关打开。

### a — 切换面积归一化 (Area Normalization Toggle)

切换顶点力和其他梯度的面积归一化。确保你有足够小的比例因子，否则事物往往会爆炸。细分后临时减小比例因子，因为三角形面积减小了 4 倍，但旧的折痕仍然存在。当此选项为 ON 时，可以对移动过多的面进行可选检查。这是通过计算法线变化长度与旧法线长度的比率来完成的。如果超过用户指定的值，则所有顶点都恢复到先前的位置。用户应减小运动比例因子并再次迭代。

### b — 设置体压力 (Body Pressures)

允许用户更改体的规定体积或压力。打印每个体的旧值并提示输入新值。

### C — 一致性检查 (Consistency Checks)

运行各种内部一致性检查。如果没有问题，只打印 `"Checks completed."`。发现的错误数存储在变量 `check_count` 中。检查内容包括：

- **元素列表完整性** — 检查数据结构是否完好。此类错误可能是 Evolver 的 bug，应予以报告。
- **面边检查** — 如果面与边相邻，则边与面相邻，且面周围的三条边相连。此类错误可能是 Evolver 的 bug，应予以报告。
- **面体检查** — 相邻面是否在同一侧具有相同的体。可能是由于数据文件中体定义中的面方向错误，或由于曲面在三重线处发生扭曲而导致的用户问题。
- **折叠元素** — 检查边的端点是否相同，以及相邻面是否共享多于一条边和两个顶点。不违法，但你可能想避免。

`C` 或 `check` 命令完成后，有一些变量保存发现的各种类型错误的数量：

- `bad_next_prev_count` — 元素链表中的坏链接
- `inconsistent_bodies_count` — 相邻面具有相同体的违规
- `edge_loop_count` — 单个顶点上的环边
- `edges_same_vertices_count` — 具有相同端点的边对
- `facets_same_vertices_count` — 具有相同端点的面对
- `bad_error_count` — 我认为严重到你应该修改演化以避免的各种类型错误之和。元素列表内的坏链接，以及元素之间的坏链接。

### c — 元素计数 (Element Counts)

打印元素和使用的内存（仅针对元素结构，非所有内容）的计数，并打印各种模型参数。同义词：`counts`。

### D — 切换显示 (Display Toggle)

切换每次迭代时的显示。默认为 ON。

### d — 转储数据 (Dump Data)

以与初始数据文件相同的格式将数据转储到 ASCII 文件。你将被提示输入文件名。空响应将使用默认转储名称，即数据文件名加 `.dmp` 扩展名。用于检查你的输入是否被正确读取、保存当前配置以及调试。

### e — 外推 (Extrapolate)

如果已进行至少两次细分，则将总能量外推到无限细分。使用三个连续细分级别的最后能量值。同义词：`extrapolate`。

### F — 切换日志 (Logging Toggle)

切换在文件中记录命令。如果开始记录，你将被提示输入日志文件名。该名称的任何现有文件将被覆盖。退出曲面时记录自动停止。只有改变曲面的命令才会被记录。

### f — 设置扩散常数 (Set Diffusion Constant)

打印旧值并提示输入新值。

### G — 设置重力 (Set Gravity)

切换重力开或关。如果任何体有 `DENSITY`，则重力开始为 ON；否则为 OFF。如果后跟值，则将重力设置为该值。否则打印重力常数的旧值并提示输入新值。可以选择在命令行上接受新的重力值。

### g — 执行迭代步 (Go Iteration Step)

与 `go` 命令相同。执行迭代步。每次迭代计算每个顶点由于其对总能量的贡献而受到的力，并将顶点移动力的倍数。有一个全局比例因子乘以力以给出位移。如果面积归一化打开，则每个顶点的力还除以相邻面的总面积，以更好地近似平均曲率运动（但这似乎由于长而窄的三角形而在数值上经常表现不佳）。如果任何体有规定体积，则顶点也会被位移以使体积恢复到接近规定值。

如果比例优化（参见命令 `m`）为 ON，则将尝试不同的全局比例值，直到可以进行二次插值以找到最优值。（在某些情况下这可能会爆炸。）用于运动的比例因子然后乘以 `scale_scale` 变量（默认值 1）。

输出包括剩余迭代次数（对于想知道他们的 1000 次迭代离结束有多近的人）、面积和能量，以及比例因子。用户可以通过向进程发送中断（准确地说是 SIGINT；键盘上的 CTRL-C 或其他）来中止重复迭代。

### h, H, ? — 帮助 (Help)

打印列出这些命令的帮助屏幕。

### i — 信息 (Information)

打印杂项信息：

- 总能量
- 面的总面积
- 元素计数和内存使用
- 面积归一化（如果开启）
- LINEAR 或 QUADRATIC 模型
- 共轭梯度是否开启
- 数值积分阶数
- 比例因子值和选项（固定或优化）
- 扩散选项和扩散常数值
- 重力选项和重力常数值
- 抖动状态和温度
- 间隙常数（用于间隙能量，如果激活）
- 环境压力（如果理想气体模型生效）

### J — 切换抖动 (Jiggle Toggle)

切换每次迭代时的抖动。如果抖动被打开，提示输入温度值。

### j — 抖动 (Jiggle)

抖动所有顶点一次。对于使陷入沟槽的曲面（特别是晶体积分）抖动起来很有用。你将被提示输入一个"温度"用作比例因子，如果你不在命令中给出温度的话。默认值是 `jiggle_temperature` 内部变量的值，初始为 0.05。实际抖动是每个顶点独立的高斯分布随机位移。有关用户可定义的扰动，请参见下面的 `longj` 命令。

### K — 瘦三角形细分 (Skinny Triangle Subdivision)

查找最小角度小于指定截断值的瘦三角形。你将被提示输入一个值。此类三角形的最长边将被细分。之后应该进行微小边移除（`t`）和等角化（`u`）。默认情况下，长边在其中点处细分，但如果执行 `k_altitude_mode on`，则将在对顶点的高线足处分割。

### k — 间隙常数 (Gap Constant)

为凸边界的间隙能量设置"间隙常数"。添加大致与边和边界之间面积成比例的能量。你将被提示输入一个值。正常值在 1 的量级。值 `k = 1` 最接近真实面积。使用 0 消除能量。

### l — 细分长边 (Subdivide Long Edges)

细分长边，必要时创建新面。如果你不在命令中给出值，你将被提示输入截断边长。现有长于截断值的边将仅被细分一次。新创建的边不会被细分。因此之后可能还有一些长边。如果输入 `h`，你将获得边长的直方图。如果按回车而没有值，则不执行任何操作。细分比细分所有边好得多。`"l value"` 的同义词是 `"edge_divide value"`。

### M — 设置模型类型 (Set Model Type)

将模型类型设置为 LINEAR、QUADRATIC 或 LAGRANGE。从 LINEAR 更改为 QUADRATIC 会在每条边的中点添加顶点。从 QUADRATIC 更改为 LINEAR 会删除中点。Lagrange 同理。可以选择在命令行上接受新的模型类型（1（线性）、2（二次）或 > 2（给定阶数的 Lagrange））。

### m — 切换比例优化 (Scale Optimization Toggle)

切换二次搜索最优全局运动比例因子。如果搜索被切换为 OFF，你将被提示输入比例因子。如果你在命令中给出值，则设置固定比例因子。当三角剖分表现良好且面积归一化（命令 `a`）关闭时，0.2 左右的值效果良好。在优化模式下，比例因子变小（例如低于 0.01）表示三角剖分问题。太大的比例因子将表现为总能量增加。如果你有面积归一化运动（命令 `a`）为 ON，请使用小比例因子，如 0.001，直到你了解什么有效。

### N — 归一化体积 (Normalize Volumes)

将体的规定体积归一化为当前实际体积。

### n — 切口 (Notch)

切口山脊和山谷。查找具有两个相邻面且这些面的法线形成的角度大于某个截断角度的边。如果你不在命令中给出值，你将被提示输入截断角度（弧度）。合格的边将在中心放置新顶点来细分相邻面。之后应进行等角化。在字符串模型中，它将细分与边之间角度（平行方向）超过给定值的顶点相邻的边。可以选择在命令行上接受截断角度。

### O — 弹出非最小边 (Pop Non-Minimal Edges)

扫描附有超过三个面的边。将此类边分割为三面边。分割沿多重边传播直到遇到某些障碍。它还尝试正确弹出墙上的边。尝试 `octa.fe` 作为示例。要进行更精细的控制，请使用 `pop` 命令。

### o — 弹出非最小顶点 (Pop Non-Minimal Vertices)

此命令扫描曲面以查找不具有三个最小切锥之一拓扑的顶点。这些被"弹出"到正确的局部拓扑。算法是用球体替换顶点。到原始顶点的面在球体表面被截断。球体被这些面分成胞腔，最大的胞腔被删除，这保留了曲面补集的拓扑。一个特殊情况是两个锥在顶点相遇；如果锥足够宽，它们将被合并，否则将被分割。在合并锥的情况下，如果两个锥内部被定义为同一部分体的一部分，则不会在合并产生的颈部放置面；如果它们是不同的体或没有体，则会在颈部放置一个面。仅测试曲面内部的顶点，不测试固定或在约束或边界上的顶点。此命令倾向于创建大量小边和瘦三角形。尝试 `popstr.fe` 和 `octa.fe` 作为示例。

### P — 创建图形输出 (Create Graphics Output)

产生图形输出文件。视图与 `s` 命令看到的相同。目前有几种格式可用，将出现一个菜单。这些是 Pixar、geomview、PostScript、SoftImage 和一种称为 Triangle 的个人格式。你可以在命令行上给出菜单项编号。如果做环面曲面，你将被要求选择显示选项，有关详细信息请参见环面部分。你将被提示输入文件名。对于 Pixar 格式，你将被问及顶点是否应有法向量用于法线插值（计算为围绕顶点的所有面的平均法线）；是否要绘制内部面（与两个体相邻）、外部面（与零个或一个体相邻）或所有面；以及是否应为不同体使用不同颜色。如果是，你将被要求提供一个文件名，其中包含 RGB 值格式的颜色映射，每行一组，值在 0 和 1 之间。（此映射可能在所有设备上都不起作用。）

你可能还会被问是否需要加厚。如果需要，每个面将被记录两次，方向相反，顶点从其原始位置沿法线方向移动加厚距离（该选项允许你输入）。每个顶点使用的法线与法线插值使用的相同，因此平面顶点周围的所有面将使该顶点移动相同的量。三重结将被分离。加厚适用于坚持一致方向表面或看不到曲面背面的渲染程序。默认加厚距离是对象直径的千分之一。

有关文件格式，请参见图形文件格式部分。

对于有 geomview 的用户，相关命令在此。Geomview 当前使用管道接口。除了启动和停止同时 geomview 的选项外，还有启动命名管道而不调用 geomview 的选项。你将被告知管道的名称，由你启动管道读取器。Evolver 阻塞直到管道读取器启动。这对于让 Evolver 的第二个实例通过让 geomview 加载管道来向 geomview 馈送第二个曲面很有用。geomview 命令语言中的命令可以用 `ggeomview string` 命令发送。

此命令后面可以跟一个数字来选择菜单选项而不显示菜单。因此 `P 8` 启动 geomview。

另见 `GEOMVIEW` 和 `POSTSCRIPT` 命令。

### p — 设置环境压力 (Set Ambient Pressure)

在理想气体模型中设置环境压力。大值使体更不可压缩。

### Q — 报告量 (Report Quantities)

单字母主命令。报告用户定义的方法实例和命名量的当前值。如果 `show_all_quantities` 开关为 on，则内部量和方法实例也会显示。如果已执行 `convert_to_quantities`（与 `-q` 命令行选项相同），这尤其信息丰富，因为约束积分等内部值处于方法实例的形式。

### q — 退出 (Exit)

退出程序。你将有机会重新考虑。你也可以加载新的数据文件。如果你真的退出，会自动关闭图形。不保存任何内容。

### r — 细分 (Refine)

细分三角剖分。边被一分为二，SOAPFILM 面被分成四个面，继承属性。设置了 `no_refine` 属性的边和面不会被细分。报告结构数量和使用的内存量。

### s — 显示 (Show)

在屏幕上显示曲面。必须链接适当的显示例程以适应显示所在的机器。进入图形命令模式（见下文）。环面曲面有你第一次会被问及的显示选项，有关详细信息请参见环面部分。图形窗口可以用 `close_show` 命令关闭。

### t — 移除微小边 (Remove Tiny Edges)

消除微小边及其相邻面。如果你不在命令中给出值，你将被提示输入截断边长。如果输入 `h`，你将获得边长直方图。如果按回车而没有值，则不执行任何操作。某些边可能由于被固定或端点与边具有不同属性而无法消除。

### U — 切换共轭梯度 (Conjugate Gradient Toggle)

此命令切换共轭梯度模式，该模式通常比默认梯度下降模式更快地收敛到最小能量。唯一的区别是运动沿共轭梯度方向。比例因子应处于优化模式。每次曲面修改（如细分或等角化）后，历史向量会被重置。在大变化（例如体积变化）之后，不使用共轭梯度运行几步以恢复正常。

### u — 等角化 (Equiangulation)

此命令称为"等角化"，尝试改善三角剖分。在 soapfilm 模型中，每条有两个相邻面（因此是四边形的对角线）的边都会被测试，看切换四边形对角线是否会使三角形更等角。对于平面三角剖分，完全等角化的三角剖分是 Delaunay 三角剖分，但该测试对 3D 空间中的偏斜四边形也有意义。可能需要重复命令几次才能获得完全等角化。`tt edgeswap` 命令可以强制翻转规定的边。在单纯形模型中，等角化仅适用于曲面维度 3。在那里，当四面体的一个面违反 Delaunay 空洞条件时，有两种移动可用：将具有公共面的两个四面体替换为三个，或将围绕公共边的三个四面体替换为两个，具体取决于条件如何被违反。此命令在字符串模型中不起作用。

### V — 顶点平均 (Vertex Averaging)

对于每个顶点，计算新位置为相邻面质心的面积加权平均。仅使用具有相同约束和边界的相邻面。至少在一级近似上保持体积。有关无体积保持的顶点平均，请参见下面的 `rawv` 命令，有关忽略约束相似性的请参见 `rawestv`。不移动三重边上的顶点或固定顶点。约束上的顶点被投影回其约束上。所有新位置在移动之前计算。有关顺序计算和移动，请参见 `vertex_average` 命令。

### v — 显示体积 (Show Volumes)

显示每个体的规定体积、实际体积和压力。还显示命名量。除非 `show_all_quantities` 已打开，否则只显示显式用户定义的命名量。压力实际上是 Lagrange 乘子。压力在迭代之前计算，因此报告的值基本上落后一个迭代。同义词：`show_vol`。

### W — 切换同胚放缩 (Homothety Toggle)

切换同胚放缩。如果同胚放缩为 ON，则每次迭代后，曲面被放大，使所有体的总体积为 1。用于没有任何约束的曲面，以查看曲面坍缩到一点时的极限形状。

### w — 去除小三角形 (Weed Small Triangles)

尝试去除小三角形。如果你不在命令中给出值，你将被提示输入截断面积值。如果输入 `h`，你将获得面积的直方图以供参考。如果按回车而没有值，则不执行任何操作。某些小三角形可能由于约束或其他障碍而无法消除。操作是消除三角形上的一条边，在此过程中消除多个面。边将按从最短到最长的顺序尝试消除。**警告：** 虽然会进行检查以查看消除一条边是否合理，但这假设面相对较小。如果你告诉它消除面积低于 5 的所有面，Evolver 可能会毫无顾忌地消除你的整个曲面。

### X — 列出额外属性 (List Extra Attributes)

列出当前元素额外属性，包括名称、大小和类型。一些内部属性也会列出，以双下划线开头。

### x — 退出 (Exit)

退出程序。你将有机会重新考虑。你也可以加载新的数据文件。如果你真的退出，会自动关闭图形。不保存任何内容。

### y — 环面复制 (Torus Duplication)

在环面模型中，提示输入周期编号（1、2 或 3），然后在该方向上加倍环面单元胞。用于将简单配置扩展为更广泛的配置。

### Z — 缩放到顶点 (Zoom on Vertex)

缩放到一个顶点。要求输入顶点编号和半径。编号为数据文件中顶点列表中给出的编号。注意顶点编号在转储中会更改（但正确的当前缩放顶点编号将记录在转储中）。消除距顶点 1 半径距离之外的所有元素。半径处的新边被设为 FIXED。用于研究切锥和复杂行为，例如电线穿过过手结曲面中的表面的位置。缩放仅针对没有体的曲面实现。

### z — 曲率测试 (Curvature Test)

在二次模型上执行曲率测试。如果你正在寻找具有单调平均曲率的曲面，应该有用。目前检查沿边的折痕角度，并在面内部采样曲率。方向相对于面最初定义的方式。

---

# 第10章 开关 (Toggles)

各种特性可以通过给出开关名称与 ON 或 OFF 来切换开或关。仅使用开关名称等同于使用 ON。这与单字母命令开关不同，后者总是改变状态。下面的开关名称有对其 ON 状态下动作的简要描述。开关通常会打印其先前的状态。开关的当前值可以通过命令 `"print togglename"` 找到。

少数开关被初始化为"未设置"状态，打印为 -1。这些通常在需要时提示输入值。

### AMBIENT_PRESSURE

切换理想气体模式，即存在固定外部压力。外部压力可以在数据文件顶部用 `pressure` 短语设置，或在运行时用 `p` 命令设置，例如 `"p 10"`。默认为 OFF。

### APPROXIMATE_CURVATURE

使用多面体曲率（面上线性插值度量）计算平均曲率向量。实际上建立微分形式或向量的内积为面上顶点值线性插值的欧几里得内积的积分。同义词：`approx_curv`, `approx_curvature`。默认为 OFF。

### AREA_NORMALIZATION

在 soapfilm 模型中，将顶点上的力除以相邻面面积的三分之一，或在字符串模型中除以相邻边长度的一半，以将力转换为 `g` 命令的运动速度。当能量为表面张力时，这旨在使速度成为平均曲率的离散近似。类似于 `a` 命令。默认为 OFF。

### ASSUME_ORIENTED

告诉平方平均曲率例程可以假设曲面在局部是一致定向的。仅对极端形状有意义。默认为 OFF。

### AUGMENTED_HESSIAN

通过将体和量约束梯度放入与 Hessian 一起的增广矩阵中，并使用稀疏矩阵技术进行分解来求解受约束的 Hessian。当成千上万个稀疏约束时（如泡沫中），可以极大地加速。默认状态为未设置（打印为 -1），在这种情况下，对于 50 个或更多约束使用增广，但对于少于 50 个约束则不使用。

### AUTOCHOP

每次迭代时自动切割长边。由于语法上的滥用，它还兼任截断长度的变量。使用 `"autochop := expr"` 设置 autochop 长度并打开自动切割。或者可以使用读写变量 `autochop_length` 而不影响开关状态。每次迭代，任何预计变得比截断值更长的边都会被二等分。如果进行了任何二等分，则重新进行运动计算。默认为 OFF。

### AUTODISPLAY

切换每次曲面变化时的自动显示。与 `D` 命令效果相同。默认为 ON。

### AUTOPOP

切换每次迭代时自动删除短边和弹出不正确顶点。在每次迭代之前，任何预计缩短到临界长度以下的边都通过识别其端点来删除。临界长度计算为 Lc = √(2∆t)，其中 ∆t 是时间步长或比例因子。因此，这应该只与固定比例一起使用，而不是优化比例因子。选择临界长度使得在平均曲率运动中不会出现不稳定性。如果删除了任何边，则检查顶点是否存在不正确顶点，如 `o` 命令中那样。在字符串模型中有用。默认为 OFF。

自 Evolver 版本 2.30 起，AutoPop 也针对小面实现。临界面积计算为 Ac = √(2∆t) × P/2，其中周长 P 是面三条边长度之和。

另见 `immediate_pop` 和 `autopop_quartic` 开关。

### AUTOPOP_QUARTIC

修改 autopop 模式。边的临界长度设为 Lc = √(2 × ⁴√(∆t))，面的临界面积设为 Ac = √(2 × ⁴√(∆t)) × P/2，其中 P 是面周长；用于速度与曲面四阶导数成比例的量，如 `laplacian_mean_curvature`。默认为 OFF。

### AUTORECALC

切换当可调参数或能量量模量更改时自动重新计算曲面。默认为 ON。

### BACKCULL

阻止显示法线背离观察者的面。在不同的图形显示中可能有不同的效果。例如，要仅查看体的内部背面，仅 `"set frontcolor clear"` 在 2D 显示中有效，但对于直接 3D 还需要 backcull。默认为 OFF。

### BEZIER_BASIS

当 Evolver 使用 Lagrange 模型表示几何元素时，此开关将 Lagrange 插值多项式（通过控制点）替换为 Bezier 基多项式（不通过内部控制点，但具有正值，这保证边或面在控制点的凸包内）。默认为 OFF。

### BIG_ENDIAN

控制 `binary_printf` 数值输出中字节的顺序。大端序是最高有效字节在前。要更改为小端序，请使用 `little_endian`，而不是 `little_endian off`。默认设为 Evolver 运行所在机器的本机模式。

### BLAS_FLAG

如果 Evolver 程序已使用 `-DBLAS` 选项编译并链接了某些 BLAS 库，则切换使用某些矩阵例程的 BLAS 版本。目前仅限开发者使用。默认为 OFF。

### BOUNDARY_CURVATURE

在进行平均曲率或曲率平方的积分时，边界顶点的曲率不能由其邻近顶点定义，因此边界顶点星的面积改为与相邻内部顶点一起计数。默认为 OFF。

### BREAK_AFTER_WARNING

导致 Evolver 在任何警告消息后停止执行命令并返回命令提示符。中断要到执行的命令或子命令完成才发生；使用 `break_on_warning` 实现即时中断。与命令行选项 `-y` 效果相同。默认为 OFF。

### BREAK_ON_WARNING

导致 Evolver 在任何警告消息后立即停止执行命令并返回命令提示符。不像 `break_after_warning` 那样延迟到当前命令完成。默认为 OFF。

### BUNCH_KAUFMAN

在替代最小度分解方法（`ysmp off`）中切换 Bunch-Kaufman 分解。这将 Hessian 分解为 LBL^T，其中 L 是下三角矩阵，对角线上为 1，B 是块对角矩阵，具有 1×1 或 2×2 块。在分解不定 Hessian 时应更稳定。默认为 OFF。

### CALCULATE_IN_3D

平方平均曲率命名方法 `star_sq_mean_curvature`、`star_eff_area_sq_mean_curvature`、`star_normal_mean_curvature` 和 `star_perp_sq_mean_curvature` 在任意维度空间中工作，但如果由于某种原因空间的环境维度大于 3，而你想将曲率计算限制在前三个坐标，则开关 `calculate_in_3d` 可以做到这一点。

### CHECK_INCREASE

切换在迭代循环中检查能量增加。如果能量增加，则停止迭代循环。用于早期检测不稳定性和其他导致曲面行为异常的问题。在使用固定比例进行多次迭代时很有用。注意：在某些情况下能量增加是适当的，例如当有体积或量约束且符合约束意味着初始能量增加时。默认为 OFF。

### CIRCULAR_ARC_DRAW

如果开启，则在二次字符串模式中，边被绘制为通过端点和中点的圆弧（实际上是 16 个子线段），而不是二次样条。默认为 OFF。

### CLIP_VIEW

切换在图形中显示裁剪平面。在图形窗口中，`l` 键（小写 L）使鼠标拖动平移裁剪平面，`k` 键使鼠标拖动旋转裁剪平面。此外，裁剪平面系数可以在数组 `clip_coeff[10][4]` 中手动设置，允许最多 10 个同时裁剪平面。每组 4 个裁剪系数 c1, c2, c3, c4 确定一个裁剪体积 c1\*x + c2\*y + c3\*z <= c4。默认为 OFF。

### CLIPPED, CLIPPED_CELLS

设置环面商空间显示裁剪到基本区域。不是开/关开关。与 `RAW_CELLS` 和 `CONNECTED` 的三向开关。裁剪平行四边形的原点（左下后角）可以通过设置 `display_origin` 向量中的条目来设置。默认为未设置，因此 Evolver 在首次显示图形时提示用户。设置在加载新曲面时保持。但在当前显示非环面模型时加载环面模型不会提示。

### COLORMAP

使用来自文件的颜色映射。使用 `colorfile := "filename"` 设置文件。默认为 OFF。

### CONF_EDGE

通过将球体拟合到边和相邻顶点来计算曲率平方（共形曲率）。默认为 OFF。

### CONJ_GRAD

使用共轭梯度法。另见 RIBIERE。默认为 OFF。

### CONNECTED

设置商空间显示将每个体作为连接的、包裹的曲面。不是开/关开关。与 `CLIPPED` 和 `RAW_CELLS` 的三向开关。同义词：`connected_cells`。默认为未设置，因此 Evolver 在首次显示图形时提示用户。设置在加载新曲面时保持。但在当前显示非环面模型时加载环面模型不会提示。

由于演化过程中的轻微运动可能导致包裹突然改变，因此有一个体布尔属性 `centerofmass`，它导致记住体的质心，下次绘制体时，调整包裹使质心接近先前的质心。示例：`set body centerofmass`

### DETORUS_STICKY

控制 `detorus` 命令是否将识别重合的顶点、边和面。识别的容差由变量 `detorus_epsilon` 给出，默认为 1e-6。默认为 ON。

### DEBUG

打印命令解析的 YACC 调试跟踪。不要这样做！默认为 OFF。

### DETURCK

沿法线的单位速度运动，而不是曲率向量运动。默认为 OFF。

### DIFFUSION

激活每次迭代的扩散步骤。默认为 OFF。

### DIRICHLET_MODE

当 `facet_area` 方法用于在 hessian 命令中计算面积时，此开关切换使用近似的 `facet_area` hessian，它是正定的。这允许 hessian 迭代在远非最小的曲面上大步前进而不用担心爆炸。然而，由于它只是近似的 hessian，最终收敛到最小值可能很慢。仅限线性模型。隐式执行 `convert_to_quantities`。此方法的另一个变体由 `sobolev_mode` 触发。默认为 OFF。

### DIV_NORMAL_CURVATURE

开关使 `sq_mean_curvature` 能量通过面顶点处法向量的散度计算平均曲率。默认为 OFF。

### EFFECTIVE_AREA

在面积归一化中，运动的阻力因子仅取为顶点星面积垂直于运动的投影。如果正在计算平方平均曲率，则此投影面积用于计算曲率。默认为 OFF。

### ESTIMATE

激活每个梯度下降步（`g` 命令）中的能量减少估计。对于每次 `g` 迭代，它打印估计和实际的能量变化。估计通过能量梯度与实际运动的内积计算。仅对远小于优化值的固定比例因子有用，因此线性近似良好。内部变量 `estimated_change` 记录估计值。默认为 OFF。

### FACET_COLORS

在某些图形接口（如 xgraph）中启用面的着色。如果关闭，面颜色为白色。默认为 ON。

### FORCE_DELETION

在 soapfilm 模型中，覆盖 `delete` 命令拒绝删除会创建具有相同端点的两条边的边或面。有时需要这样的边，例如在掐断颈部时。但这通常是个坏主意。另见 `star_finagle`。默认为 OFF。

### FORCE_EDGESWAP

开关。使 `u` 或 `equiangulate` 或 `edgeswap` 命令跳过某些测试并无论如何执行交换。跳过的测试是：(1) 被翻转边的两个顶点是不同的，(2) 创建具有相同顶点的两个面。仅用于你确实知道你在做什么的罕见情况。你不应将此开关保持在 ON 状态；在完成顽固的边交换后将其关闭。

### FORCE_POS_DEF

如果在 Hessian 的 YSMP 分解期间此项开启且 Hessian 变为不定，则会在对角元素上添加某些内容以使其正定。可能是某些实验的遗留。默认为 OFF。

### FULL_BOUNDING_BOX

导致 PostScript 输出中的边界框为完整窗口，而不是窗口内曲面的实际范围。默认为 OFF。

### FUNCTION_QUANTITY_SPARSE

对于定义为命名方法函数的命名量，此开关切换在计算 hessian 时使用稀疏矩阵。默认为 OFF。

### GRAVITY

在总能量中包含重力能量。如果有体具有密度，则默认为 ON。

### GV_BINARY

切换以二进制格式向 geomview 发送数据，这比 ascii 更快。在 SGI 上默认为二进制，在其他系统上为 ascii，因为在某些系统上二进制格式有问题。Ascii 也用于调试。默认为 OFF。

### H_INVERSE_METRIC

用力的拉普拉斯算子替换力。用于通过平均曲率的拉普拉斯算子进行运动。默认为 OFF。

### HESSIAN_DOUBLE_NORMAL

当 `hessian_normal` 也开启且空间维度为偶数时，后半部分维度的法向量分量是前半部分的副本。听起来很奇怪？但在 4D 中使用字符串模型计算圆柱对称曲面的稳定性时很有用。默认为 OFF。

### HESSIAN_DIFF

通过有限差分计算 Hessian。非常慢。用于调试 Hessian 例程。默认为 OFF。

### HESSIAN_NORMAL

约束 hessian 迭代使每个顶点垂直于曲面移动。这消除了使收敛困难的所有烦人的横向顶点运动。垂直定义为体积梯度，但在三重结等处除外，这些处保持完全自由度。默认为 ON。

如果你想在 `hessian_normal` 模式下运行但免除特定顶点的限制，你可以设置顶点的 `no_hessian_normal` 属性，例如：

```
set vertex no_hessian_normal where z > 1.2
```

### HESSIAN_NORMAL_ONE

如果此项和 `hessian_normal` 都开启，则任何点处的法线将是一维的。这适用于具有 Plateau 边界的肥皂膜，其中有相切膜的三重结。普通的 `hessian_normal` 允许此类三重结的横向移动，但 `hessian_normal_one` 不允许。仅对 2D 中的字符串模型和 3D 中的 soapfilm 模型有效。法向量计算为与顶点相邻的所有边或面的法线投影矩阵之和的最大特征值的特征向量。默认为 OFF。

### HESSIAN_NORMAL_PERP

如果开启，则 Hessian 线性度量仅使用垂直于面或边的法线分量。这略微提高了特征值。默认为 OFF。

### HESSIAN_QUIET

在 Hessian 操作期间抑制状态消息。关闭用于调试。默认为 ON。

### HESSIAN_SPECIAL_NORMAL

当 `hessian_normal` 开启时，此开关切换使用特殊向量场作为扰动方向，而不是通常的表面法线。向量场在数据文件头的 `hessian_special_normal_vector` 部分中指定。注意 `hessian_special_normal` 也适用于由 `vertexnormal` 属性计算的法线和常规顶点平均使用的法线。默认为 OFF。

### HOMOTHETY

每次迭代后通过均匀缩放整个曲面来调整所有体的总体积为固定值。默认为 OFF。

### IMMEDIATE_AUTOPOP

修改 autopop 模式。导致在检测到短边或小面后立即删除，然后再继续检测其他小边或面。原始行为是在任何消除之前完成所有检测，如果很多边同时变短可能会导致不良结果。默认为 OFF（为了向后兼容），但你可能应该将其打开。

### INTERP_BDRY_PARAM

对于参数化边界上的边，通过插值参数值而非从一端外推来计算新顶点（由细分引入）的参数值。仅当参数不是周期性时有用。默认为 OFF。

### INTERP_NORMALS

对支持它的图形接口使用插值顶点法线进行着色显示。默认为 OFF。

### ITDEBUG

在 `g` 步骤期间打印一些调试信息。仅限专家。默认为 OFF。

### JIGGLE

切换每次迭代时的抖动。默认为 OFF。

### K_ALTITUDE_MODE

切换 `K` 命令使用从顶点的高线而非中线来细分瘦三角形。默认为 OFF。

### KRAYNIKPOPEDGE

切换边弹出模式（`O` 或 `pop` 命令），其中可弹出边查找不同 `edge_pop_attribute` 值的相邻面以从原始边分离；如果失败则恢复为常规弹出模式。这旨在给用户对边弹出方式的更大控制。由用户声明 `edge_pop_attribute` 整数面属性并赋值。默认为 OFF。

### KRAYNIKPOPVERTEX

切换 3D 顶点弹出模式，其中检查可弹出顶点是否是六条边和九个面的特殊配置。如果是，则执行比默认弹出好得多的特殊弹出。默认为 OFF。

### KUSNER

通过边公式而非顶点公式计算曲率平方。默认为 OFF。

### LINEAR_METRIC

Hessian 的特征值和特征向量是相对于度量定义的。此命令切换一个模仿光滑曲面 L² 积分自然度量的度量。与 `HESSIAN_NORMAL` 一起使用可获得类似于光滑曲面上的特征值和特征向量。默认为 OFF。

### LITTLE_ENDIAN

控制 `binary_printf` 数值输出中字节的顺序。大端序是最高有效字节在前。要更改为小端序，请使用 `big_endian`，而不是 `big_endian off`。默认为 Evolver 运行所在机器的本机模式。

### MEMDEBUG

打印内存分配/释放消息，并使 `c` 命令打印内存使用情况。用于调试。默认为 OFF。

### METIS_FACTOR

切换使用 Karypis 和 Kumar 的 METIS 库的实验性 Hessian 矩阵分解。不在公共分发中。默认为 OFF。

### METRIC_CONVERT

如果定义了黎曼度量，是否使用度量进行梯度形式到向量的转换。同义词：`metric_conversion`。默认为 OFF。

### NO_DUMP

这是一个按变量的开关或布尔属性。设置后，它防止变量的值被 `dump` 或 `d` 命令写出。与 `replace_load` 和 `add_load` 命令一起使用时很有用，在重新加载当前文件的转储时，你想保留那些会被加载转储文件覆盖的变量值（默认情况下，变量在数据文件顶部声明）。`no_dump` 变量改为写在转储文件的 `"read"` 部分中，因此转储文件将作为独立文件加载。适用于全局变量和数组。语法（运行时命令；不在数据文件顶部）：

```
variable.no_dump on
variable.no_dump off
```

`no_dump` 声明必须在变量存在之后。示例：

```
frame := 1;
frame.no_dump;
dump "temp.dmp";
frame := 2;
```

### NORMAL_CURVATURE

通过取顶点面积为平行于平均曲率向量的体积梯度分量来计算曲率平方。默认为 OFF。

### NORMAL_MOTION

将运动投影到表面法线（定义为体积梯度）。如果顶点倾向于横向滑入丑陋的图案，在平方曲率中可能有用。默认为 OFF。

### OLD_AREA

在具有面积归一化的字符串模型中，在三重顶点处，Evolver 通常尝试计算运动以遵守 Von Neumann 定律，即面积变化率与胞腔的边数成比例。如果 `old_area` 为 ON，则通过将力除以星面积来简单计算运动。默认为 OFF。

### PINNING

检查因相邻顶点不在相同约束上（而它们可以）而无法移动的顶点。不太常用。默认为 OFF。

### POP_DISJOIN

更改弹出边和顶点的行为以像合并 Plateau 边界一样，即产生不相交的膜而不是用交叉面连接的膜。在边的情况下，如果四条面沿一条边相遇且两个相对的体是同一实体，则弹出边将在 `pop_disjoin` 生效时合并这些体。在顶点的情况下，如果顶点有一个体作为围绕它的环面，则顶点将被分成两个顶点，使环面成为连续圆盘。所有这些都在不考虑面相遇角度的情况下完成。适用于 `pop`、`o` 和 `O` 命令。默认为 OFF。

### POP_ENJOIN

更改 soapfilm 模型中弹出顶点的行为，使得当检测到两个不同的锥在公共顶点相遇时，弹出结果是将锥顶点扩大为颈部而不是使锥分离。适用于 `pop` 和 `o` 命令。默认为 OFF。

### POP_TO_EDGE

三角棱柱框架上的非最小锥可以两种方式弹出。如果此开关开启，则弹出为边而非面。默认为 OFF。

### POP_TO_FACE

三角棱柱框架上的非最小锥可以两种方式弹出。如果此开关开启，则弹出为面而非边。默认为 OFF。

### PS_COLORFLAG

使 `POSTSCRIPT` 命令在创建的文件中使用 CMYK 颜色而非 RGB 颜色。默认为 OFF。

### PS_COLORFLAG

使 `POSTSCRIPT` 命令使用颜色。默认为 OFF。

### PS_CROSSINGFLAG

使 `POSTSCRIPT` 命令在字符串模型中的背景边中放置断点。默认状态为未设置（打印为 -1）。

### PS_GRIDFLAG

使 `POSTSCRIPT` 命令绘制显示面的所有边，而不仅仅是满足当前边显示条件的边。默认为 OFF。

### PS_LABELFLAG

使 `POSTSCRIPT` 命令在元素上打印标签。对调试新数据文件有用，但元素太多时不适用。默认为 OFF。

### QUANTITIES_ONLY

使除命名量外的所有能量无效。供程序员调试使用。默认为 OFF。

### QUIET

自动抑制命令自动生成的所有正常输出消息。在运行脚本或加载具有长读取部分的数据文件时很有用。来自 `print`、`printf` 和 `list` 命令的显式输出仍将出现，用户输入的提示也是如此。适用于重定向输出和控制台输出。错误或用户中断命令将关闭 `QUIET`，以保证安全。默认为 OFF。

### QUIETGO

仅抑制迭代步骤输出。默认为 OFF。

### QUIETLOAD

抑制正在读取的文件的回显。这适用于数据文件末尾的读取部分以及用 `read` 命令读入的任何文件。此开关在新数据文件开始时不会重置。此开关可以用 `-Q` 命令行选项设置，以在加载的第一个数据文件中抑制回显。默认为 OFF。

### POST_PROJECT

每次迭代时引入对体积和固定量约束的额外投影。如果 10 次迭代后收敛失败，你将收到警告消息，重复迭代将停止，变量 `iteration_counter` 将为负值。默认为 OFF。

### RAW_CELLS

设置商空间显示为普通、未包裹的面。不是开/关开关。与 `CLIPPED` 和 `CONNECTED` 的三向开关。默认为未设置，因此 Evolver 在首次显示图形时提示用户。设置在加载新曲面时保持。但在当前显示非环面模型时加载环面模型不会提示。

### RGB_COLORS

切换图形使用用户指定的元素红绿蓝颜色分量，而不是颜色属性索引预定义的 16 色调色板。单独元素的 rgb 值在元素额外属性中：边为 `ergb`，面为 `frgb`，面背面颜色为 `fbrgb`。由用户定义这些属性；如果未定义，则不使用且不占空间。如果定义了 `frgb` 但未定义 `fbrgb`，则 `frgb` 用于正面和背面颜色。属性为 3 或 4 维实数；如果是 4 维，第四个分量作为 alpha 值传递给图形系统，但可能不起作用。值范围为 0 到 1。确保初始化 rgb 属性，否则你将获得全黑的曲面。要使用的属性定义为：

```
define edge attribute ergb real[3]
define facet attribute frgb real[3]
define facet attribute fbrgb real[3]
```

默认为 OFF。

### RIBIERE

使共轭梯度法使用 Polak-Ribiere 版本而非 Fletcher-Reeves 版本。（此开关不打开共轭梯度。）Polak-Ribiere 似乎从停滞中恢复得更好。Ribiere 是默认模式。

### ROTATE_LIGHTS

开启时，使灯光在图形显示中随对象旋转。默认为 OFF。

### RUNGE_KUTTA

在迭代步骤中使用 Runge-Kutta 方法（仅限固定比例因子）。默认为 OFF。

### SELF_SIMILAR

如果正在使用平方平均曲率能量，此开关将速度缩放为朝向自相似运动。仅当使用旧的数据文件顶部 `squared_curvature` 声明或 `sqcurve` 命名方法时适用。全局读写变量 `self_sim_coeff` 用作乘数。默认为 OFF。

### SEPTUM_FLAG

在某些情况下，弹出顶点可能留下两个由隧道连接的区域；如果 `septum_flag` 开关开启，它将强制在隧道上放置一个曲面。默认为 OFF。

### SLICE_VIEW

切换在图形中显示曲面的平面横截面。在图形窗口中，`l` 键（小写 L）使鼠标拖动平移切片平面，`k` 键使鼠标拖动旋转切片平面。此外，切片平面系数可以在数组 `slice_coeff[4]` 中手动设置。4 个裁剪系数 c1, c2, c3, c4 的集合确定一个平面 c1\*x + c2\*y + c3\*z = c4。默认为 OFF。

### SMOOTH_GRAPH

在 Lagrange 模型中，使边和面以 8 倍细分而非 Lagrange 阶数细分来绘制。默认为 OFF。

### SHADING

在某些图形接口（xgraph、psgraph）中切换面着色。面的暗度取决于法线与垂直方向的角度，模拟表面上方的光源。默认为 ON。

### SHOW_ALL_EDGES

Evolver 开关命令。控制在图形窗口中显示所有边，无论当前 `"show edges ..."` 条件如何。与图形窗口中的 `e` 键相同。

### SHOW_ALL_QUANTITIES

默认情况下，只有显式用户定义的命名量由 `Q` 或 `v` 命令显示。如果 `show_all_quantities` 开启，则所有内部命名量（由 `-q` 选项或 `convert_to_quantities` 创建）也会显示。默认为 OFF。

### SHOW_BOUNDING_BOX

切换在图形显示中显示边界框。等同于在图形窗口中按 `o` 键。

### SHOW_INNER

显示内部面（在 2 个体上的面）。默认为 OFF。

### SHOW_OUTER

显示外部面（在 0 或 1 个体上的面）。默认为 OFF。

### SOBOLEV_MODE

当 `facet_area` 方法用于在 hessian 命令中计算面积时，此开关切换使用近似的 `facet_area` hessian，它是正定的。这允许 hessian 迭代在远非最小的曲面上大步前进而不用担心爆炸。然而，由于它只是近似的 hessian，最终收敛到最小值可能很慢。仅限线性模型。隐式执行 `convert_to_quantities`。此方法的另一个变体由 `dirichlet_mode` 触发。详细解释在技术参考章节中。默认为 OFF。

### SPARSE_CONSTRAINTS

切换在迭代和 hessian 命令中使用稀疏矩阵技术累积和处理体及量梯度。现在是默认值。

### SQUARED_GRADIENT

使 `hessian_seek` 命令最小化能量梯度的平方而非能量本身。用于收敛到不稳定临界点。默认为 OFF。

### STAR_FINAGLE

在 soapfilm 模型中，边或面的 `delete` 命令通常不会执行删除（如果它会导致创建具有相同端点的两条边）。某些导致这种情况的简单配置会被自动检测和处理，即"星形"配置——有三个面形成与被删除边相邻的三角形。此类星形通过在删除原始边之前删除其一条内部边来自动移除。但有时有更复杂的配置，此类去星无法处理，除非 `force_deletion` 开关开启，否则 Evolver 不会删除边。另一种方法是先细分将具有公共端点的边，这就是 `star_finagle` 开关启用的功能。默认为 OFF。

### THICKEN

显示加厚的曲面，用于面的不同侧面有不同颜色时。使用 `thickness := expr` 设置厚度。默认厚度为曲面最大线性尺寸的 0.001 倍。默认为 OFF。但看起来有点过时，因为没有图形显示注意到它，而是自动处理不同颜色。但 `thickness` 变量仍在使用。

### VERBOSE

打印 `pop edge`、`pop vertex`、`delete`、`notch`、`refine`、`dissolve`、`edgeswap` 和一些其他命令的操作消息。用于调试（如果某些操作没有预期效果）。默认为 OFF。

### VIEW_TRANSFORMS_USE_UNIQUE_POINT

当视图变换由 `transform_expr` 生成时，Evolver 会去除重复变换。默认情况下，"重复"意味着相同的变换矩阵，但在某些情况下，不同的变换矩阵将曲面带到相同的位置。`view_transforms_use_unique_point` 开关启用一种模式，其中两个变换矩阵如果将 `view_transforms_unique_point[]` 向量给出的点变换到相同的图像点，则被视为相同。标准用法是使 `view_transforms_unique_point[]` 成为被变换曲面上的一个顶点，例如：

```
view_transforms_unique_point := vertex[5].__x;
view_transforms_use_unique_point on;
transform_expr "abababa";
```

向量 `view_transforms_unique_point[]` 是预定义的，因此用户不需要定义它。默认为 OFF。

### VISIBILITY_TEST

切换使用画家算法产生 2D 输出（PostScript、Xwindows）的图形输出的遮挡三角形测试。这可以大大减小 PostScript 文件的大小，但请检查输出，因为算法的实现可能有缺陷。默认为 OFF。

### VOLGRADS_EVERY

切换在约束执行期间每个投影步骤重新计算体积约束梯度。适用于刚性问题。默认为 OFF。

### YSMP

在耶鲁稀疏矩阵包 (Yale Sparse Matrix Package) 例程分解 hessian 和我自己最小度分解之间切换。默认为 OFF。

### ZENER_DRAG

切换 Zener 拖拽特性，其中曲面的速度减小由变量 `zener_coeff` 给出的量级，如果速度小于 `zener_coeff` 则速度设为零。默认为 OFF。
