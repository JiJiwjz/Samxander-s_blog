---
title: 'PyTorch Tutorials'
publishDate: 2026-03-20
description: 'PyTorch 官方教程的中文翻译版本，添加了一些官网没有描述清楚的内容。通过这个教程，可以入门 PyTorch 的基本操作。'
tags:
  - PyTorch
  - Deep Learning
language: 'Chinese'
heroImage: { src: '', color: '#D58388' }
---

# Tensors

# Tensors

`Tensors` 是一种特殊的数据结构，和**数组**，**矩阵**非常像。在 Pytorch 里面，我们使用 `Tensors` 来编码模型的输入和输出，以及模型的参数。

`Tensors` 和 NumPy 的 `ndarrays` 很像，不同之处在于 `Tensors` 可以在 GPU 或者其他硬件加速器上运行。事实上，Tensors 和 NumPy 的 arrays 可以经常可以共享相同的底层内存，而无需复制数据。Tensors 也在自动微分上有所优化。

```python
import torch
import numpy as np
```

# 初始化一个 Tensor

Tensors 可以用多种方式进行初始化。如下所示：

## 基于数据

Tensors 可以直接用数据创建，数据类型会被自动推断：

```python
data = [[1, 2], [3, 4]]
x_data = torch.tensor(data)
```

## 基于 NumPy 数组

Tensors 可以由 NumPy 数组创建：

```python
np_array = np.array(data)
x_np = torch.from_numpy(np_array)
```

## 基于其它 Tensor

新的 Tensor 会保留参数 Tensor 的特性（比如形状，数据类型），除非显式重写：

```python
x_ones = torch.ones_like(x_data) # 保留 x_data 的特征
print(f"Ones Tensor: \n {x_ones} \n")

x_rand = torch.rand_like(x_data, dtype=torch.float) # 重写了 x_data 的数据类型
print(f"Random Tensor: \n {x_rand} \n")
```

结果：

```python
Ones Tensor: 
 tensor([[1, 1],
        [1, 1]]) 

Random Tensor: 
 tensor([[0.7747, 0.9149],
        [0.9874, 0.9062]])
```

## 有随机/恒定值

`shape` 是 Tensor 维度的元组。在下面的函数里，它决定了输出 Tensor 的维度。

```python
shape = (2, 3,)
rand_tensor = torch.rand(shape)
ones_tensor = torch.ones(shape)
zeros_tensor = torch.zeros(shape)

print(f"Random Tensor: \n {rand_tensor} \n")
print(f"Ones Tensor: \n {ones_tensor} \n")
print(f"Zeros Tensor: \n {zero_tensor}")
```

结果：

```bash
Random Tensor: 
 tensor([[0.7213, 0.6873, 0.5590],
        [0.9143, 0.2970, 0.9141]]) 

Ones Tensor: 
 tensor([[1., 1., 1.],
        [1., 1., 1.]]) 

Zeros Tensor: 
 tensor([[0., 0., 0.],
        [0., 0., 0.]])
```

# Tensor 的属性

Tensor 的属性描述了它们的形状，数据类型，以及在什么设备上储存的。

```python
tensor = torch.rand(3, 4)

print(f"Shape of tensor: {tensor.shape}")
print(f"Datatype of tensor: {tensor.dtype}")
print(f"Device tensor is stored on: {tensor.device}")
```

结果：

```bash
Shape of tensor: torch.Size([3, 4])
Datatype of tensor: torch.float32
Devicd tensor is stored on: cpu
```

# 对 Tensors 进行操作

对 Tensor 进行的操作超过 1200 种，其中包括算术，线性代数，矩阵操作（转置，索引和切片），采样。更多内容见下方链接：

上述每种操作都能在 CPU 和加速器（如 CUDA，MPS，MTIA 或者 XPU）上运行。默认状态下，Tensor 在 CPU 上进行创建。要显性的把 Tensors 移动到加速器上，我们用 `.to` 方法。记住，把大 Tensors 跨设备复制，是非常耗费时间和内存的！

```python
if torch.accelerator.is_available():
    tensor = tensor.to(torch.accelerator.current_accelerator())
```

## 像 numpy 一样索引和切片

```python
tensor = torch.ones(4, 4)
print(f"First row: {tensor[0]}")
print(f"First column: {tensor[:, 0]}")
print(f"Last column: {tensor[..., -1]}")
tensor[:, 1] = 0
print(tensor)
```

> [!TIP]

- 这里，`:` 代表 “**选所有**”，因此 `tensor[:, 0]` 代表第一列所有元素。
- Python 支持**负索引**，`-1` 表示最后一个，`-2` 表示倒数第二个。
- `...` (ellipsis) 表示 “前面的**所有维度**”。

结果为：

```python
First row: tensor([1., 1., 1., 1.]) 

First column: tensor([1., 1., 1., 1.]) 

Last column: tensor([1., 1., 1., 1.]) 

tensor([[1., 0., 1., 1.],
        [1., 0., 1., 1.],
        [1., 0., 1., 1.],
        [1., 0., 1., 1.]])
```

## Tensor 拼接

你可以使用 `torch.cat` 来沿着给定的维度，把一系列 Tensor 拼接起来。`torch.stack` 也是一个向量拼接操作，但是和 `torch.cat` 有微妙的差别。

- `cat` 要求我们除了拼接维度，其他维度必须完全一样；
- `stack` 会在最前面增加一个新维度。

当我们在拼接 feature 的时候，用 `cat`；当我们在增加 batch / 时间维度的时候，用 `stack`。

```python
t1 = torch.cat([tensor, tensor, tensor], dim=1)
print(t1)

t2 = torch.stack([tensor, tensor, tensor], dim=1)、
print(t2)
```

> [!TIP]
> 在这里，`dim` 代表我们**要沿着哪个方向操作**。

- dim=0 代表 **行增加**方向（纵）
- dim=1 代表 **列增加**方向（横）
  所以 `dim` 实际上就是**坐标轴编号**。

结果为：

```python
Cat tensors:

tensor([[1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1.],
        [1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1.],
        [1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1.]])

Stack tensors:

tensor([[[1., 1., 1., 1.],
         [1., 1., 1., 1.],
         [1., 1., 1., 1.]],

        [[1., 1., 1., 1.],
         [1., 1., 1., 1.],
         [1., 1., 1., 1.]],

        [[1., 1., 1., 1.],
         [1., 1., 1., 1.],
         [1., 1., 1., 1.]]])
```

## 代数操作

PyTorch 里有两种不同的运算，分别是**矩阵乘法**和**逐元素乘法**。

### 矩阵乘法

```python
# 下面的代码会演示三种不同实现矩阵乘法的形式
# y1, y2 和 y3 都实现了矩阵乘法：
y1 = tensor @ tensor.T

y2 = tensor.matmul(tensor.T)

y3 = torch.rand_like(y1)
torch.matmul(tensor, tensor.T, out=y3)
```

- `tensor.T` 表示 `tensor` 的**转置（transpose）**；
- `@` 是 Python 的矩阵乘法符号；
- `.matmul()` 是 Tensor 的方法形式，与 `@` 等价；
- `torch.matmul()` 是函数形式，它支持 **out 参数**。在上面的例子里面，结果直接写入 y3。这样做能减少 GPU memory allocation。

### 逐元素乘法

```python
# 下面的代码会演示三种不同实现矩阵逐元素乘法的形式
z1 = tensor * tensor

z2 = tensor.mul(tensor)

z3 = torch.rand_like(tensor)
torch.mul(tensor, tensor, out=z3)
```

示例结果：

```python
Origin matrix: 
 tensor([[0.1613, 0.1999, 0.2241],
        [0.6339, 0.9811, 0.5498]]) 

Result of matrix multipulation: 
 tensor([[0.1162, 0.4216],
        [0.4216, 1.6666]]) 

Result of matrix multipulation: 
 tensor([[0.1162, 0.4216],
        [0.4216, 1.6666]]) 

Result of matrix multipulation: 
 tensor([[0.1162, 0.4216],
        [0.4216, 1.6666]]) 

Result of matrix element-wise product: 
 tensor([[0.0260, 0.0400, 0.0502],
        [0.4018, 0.9626, 0.3022]]) 

Result of matrix element-wise product: 
 tensor([[0.0260, 0.0400, 0.0502],
        [0.4018, 0.9626, 0.3022]]) 

Result of matrix element-wise product: 
 tensor([[0.0260, 0.0400, 0.0502],
        [0.4018, 0.9626, 0.3022]])
```

## 单元素 Tensors

如果有一个单元素的 Tensor（比如把一个 Tensor 的所有值聚合在一起了），可以用 `item()` 把它转换为 Python 数值。

```python
agg = tensor.sum()  # 这一步会把 tensor 里的所有元素加起来
agg_item = agg.item()
print(agg_item, type(agg_item))
```

结果：

```python
3.21058988571167 <class 'float'>
```

## In-place 操作

把结果存在操作数里的操作，叫做 `in-place`。他们用下划线 `_` 表示。比如：

```python
print(f"{tensor} \n")
tensor.add_(5)
print(tensor)
```

结果为：

```python
Original Tensor: 
 tensor([[1., 1., 1.],
        [1., 1., 1.]]) 

Tensor after in-place operation: 
 tensor([[6., 6., 6.],
        [6., 6., 6.]])
```

> [!TIP]
> In-place 操作能够节省一些内存，但由于其会立即丢失历史，在计算导数时可能会出现问题。因此，不建议使用 In-place 操作。

# 与 NumPy 的转换

在 CPU 上的 Tensors 和 NumPy arrays 可以共享底层内存地址，**改变其中一个也会影响另外一个**。

## Tensor 转换为 NumPy 数组

```python
t = torch.ones(5)
print(f"t: {t}")
n = t.numpy()
print(f"n: {n}")
```

结果：

```python
t: tensor([1., 1., 1., 1., 1.]) 
n: [1. 1. 1. 1. 1.]
```

在 Tensor 里的改变，也会反映到 NumPy 数组里：

```python
t.add_(1)
print(f"t: {t}")
print(f"n: {n}")
```

结果：

```python
t: tensor([2., 2., 2., 2., 2.]) 
n: [2. 2. 2. 2. 2.]
```

## NumPy 数组转换为 Tensor

```python
n = np.ones(5)
t = torch.from_numpy(n)
```

同样的，NumPy 数组的变化，也会同步反映在 Tensor 上：

```python
np.add(n, 1, out=n)
print(f"t: {t}")
print(f"n: {n}")
```

结果：

```python
t: tensor([3., 3., 3., 3., 3.]) 
n: [3. 3. 3. 3. 3.]
```

# Datasets & DataLoaders

处理数据样本的代码可能很复杂，且难以维护。我们理想地希望我们的数据集代码能从训练代码中解耦，以取得更好的可读性和模块化程度。

PyTorch 提供了两个东西：`torch.utils.data.DataLoader` 和 `torch.utils.data.Dataset`，允许我们使用预先加载好的数据集和我们自己的数据。`Dataset` 存储样本和它们对应的标签，`DataLoader` 则把 `Dataset` 包装成一个 “可迭代的批数据处理器”。

PyTorch 领域库提供了很多预先加载的数据集，比如 FashionMNIST 等。

# 加载数据集

下面这个例子展示了如何从 TorchVision 里加载 Fashion-MNIST 数据集。这个数据集由 60,000 个训练样例和 10,000 个测试样例组成，每个样例为一个 28*28 的灰度图和 1 个标签（总共 10 个标签）。

我们用下面的参数加载 FashionMNIST 数据集：

- `root` 为训练/测试数据的存储路径；
- `train` 指定是训练集还是测试集；
- `download=True` 会在 `root` 不可用时，从网络上下载数据；
- `transform` 和 `target_transform` 指定特征变换和标签变换。

```python
import torch
from torch.utils.data import Dataset
from torchvision import datasets
from torchvision.transforms import ToTensor
import matplotlib.pyplot as plt

training_data = datasets.FashionMNIST(
    root="data",
    train=True,
    download=True,
    transform=ToTensor()
)

test_data = datasets.FashionMNIST(
    root="data",
    train=False,
    download=True,
    transform=ToTensor()
)
```

> [!TIP]
> `transform=ToTensor()` 的意思是，对数据做了预处理。它做了两件事：

1. 把**图像转为了 Tensor**。原始数据是 PIL Image，它把数据转换成了 `torch.Tensor`。
2. **像素归一化**。原始像素为 0~255，转换后则变成了 0~1，也就是 `pixel / 255`。这样更适合神经网络训练。

# 数据集的迭代和可视化

我们可以像创建列表一样手动为 `Datasets` 添加索引：`training_data[index]`。我们使用 `matplotlib` 来可视化我们训练数据中的一些例子。

```python
labels_map = { # 建立映射
    0: "T-Shirt",
    1: "Trouser",
    2: "Pullover",
    3: "Dress",
    4: "Coat",
    5: "Sandal",
    6: "Shirt",
    7: "Sneaker",
    8: "Bag",
    9: "Ankle Boot",
}

figure = plt.figure(figsize=(8, 8))
cols, rows = 3, 3
for i in range(1, cols * rows + 1): # 相当于 range(1, 10)
    sample_idx = torch.randint(len(traning_data), size(1,)).item() # 取随机数，注意这里有个转换
    img, label = training_data[sample_idx]
    figure.add_subplot(rows, cols, i)
    plt.title(labels_map[label])
    plt.axis("off")
    plt.imshow(img.squeeze(), cmap="gray") # squeeze 会删除大小为 1 的维度
plt.show()
```

结果大致如下：

![Dataset_preview](./images/dataset_preview.png)

# 为你的文件创建自定义数据集

自定义数据集类必须包含三个函数：`__init__`，`__len__` 和 `__getitem__`。可以参考下面的实现方式，FashionMNIST 的图像存在 `img_dir` 下，它们的标签分别存储在叫做 `annotations_file` 的 CSV 文件里。

在下一节，我们会详细分析每一个函数里面发生的情况。

```python
import os
import pandas as pd
from torchvision.io import decode_image

class CustomImageDataset(Dataset):
    def __init__(self, annotations_file, img_dir, transform=None, target_transform=None):
        self.img_labels = pd.read_csv(annotations_file)
        self.img_dir = img_dir
        self.transform = transform
        self.target_transform = target_transform

    def __len__(self):
        return len(self.image_labels)

    def __getitem__(self, idx):
        img_path = os.path.join(self.img_dir, self.img_labels.iloc[idx, 0])
        image = decode_image(img_path)
        label = self.img_labels.iloc[idx, 1]
        if self.transform:
            image = self.transform(image)
        if self.target_transform:
            label = self.target_transform(label)
        return image, label
```

## `__init__`

`__init__` 函数在实例化数据集对象时运行一次。我们初始化目录包括**图像**，**标记文件**和**两种变换**（下一节会详细介绍）。

文件 `label.csv` 看起来类似：

```
tshirt1.jpg, 0
tshirt2.jpg, 0
......
ankleboot999.jpg, 9
```

```python
def __init__(self, annotations_file, img_dir, transform=None, target_transform=None):
    self.img_labels = pd.read_csv(annotations_file)
    self.img_dir = img_dir
    self.transform = transform
    self.target_transform = target_transform
```

## `__len__`

`__len__` 函数返回我们数据集的**样本总数**，示例：

```python
def __len__(self):
    return len(self.img_labels)
```

## `__getitem__`

`__getitem__` 函数可以**加载**或**返回**数据集里，索引为 `idx` 的那个样本。基于索引，它能确定图像在磁盘上的位置，使用 `decode_image` 将其转换为 Tensor，从 `self.img_labels` 这个 `.csv` 文件中检索相应的标签，调用变换函数（如果适用的话），并将张量图像和相应的标签以**元组**的形式返回。

```python
def __getitem__(self, idx):
    img_path = os.path.join(self.img_dir, self.img_labels.iloc[idx, 0])
    image = decode_image(img_path)
    label = self.img_labels.iloc[idx, 1]
    if self.transform:
        image = self.transform(image)
    if self.target_transform:
        image = self.target_transform(label)
    return image, label
```

> [!TIP]
> 结构可以理解为：

- __init__ -> 初始化数据
- __len__ -> 数据数量
- __getitem__ -> 取一条数据

# 用 DataLoaders 准备用于训练的数据

`Dataset` 一次检索一个样本的特征并进行标记。在训练模型时，我们通常希望以 “minibatches” 的形式传递样本，在每个 epoch 对数据进行重新打乱顺序，以减少模型过拟合，并使用 Python 的 `multiprocessing` 来加速数据检索。

`DataLoader` 是一个可迭代对象，用简单的 API 帮我们简化了这种复杂的过程。

```python
from torch.utils.data import DataLoader

train_dataloader = DataLoader(training_data, batch_size=64, shuffle=True)
test_dataloader = DataLoader(test_data, batch_size=64, shuffle=True)
```

# 用 DataLoader 进行迭代

我们已经把数据集加载到 `DataLoader` 里，并能够根据需要对数据集进行迭代。下面的每次迭代都会返回一个 batch 的 `train_features` 和 `train_labels`（分别包括 `batch=64` 个特征和标签）。由于我们指定了 `shuffle=True`，在我们迭代之后，所有数据都被打乱了。

```python
train_features, train_labels = next(iter(train_dataloader))

# 一个 batch 里面有 64 张图片，因此第一个 64 表示图片张数。它们是由 torch.stack 堆叠起来的。
print(f"Feature batch shape: {train_features.size()}")
print(f"Labels batch shape: {train_labels.size()}")
img = train_features[0].squeeze()
label = train_labels[0]
plt.imshow(img, cmap="gray")
plt.show()
print(f"Label: {label}")
```

结果：

```bash
Feature batch shape: torch.Size([64, 1, 28, 28])
Labels batch shape: torch.Size([64])
Label: 2
```

# Transforms

# Transforms

训练机器学习算法所需要的数据形式千变万化，因此，数据不总是以算法所需要的形式出现。我们使用 `transforms` 来对数据进行一些操作，使之更适合用于训练。

所有 `TorchVision` 的数据集都有两个参数：

- `transform` 用于调整**特征**_（特征是一个更通用的说法，在 CV 领域，可以直接理解为数据的特征即是图像）_；
- `target_transform` 用于调整**标签**。

它接收包含变换逻辑的可调用对象（函数等）。`torchvision.transforms` 模块提供了一些开箱即用的常用变换。

FashionMNIST 的特征采用 PIL 图像格式，标签为整数。训练的时候，我们需要将特征转换为归一化后的 Tensor，将标签转换为 One-hot 编码的 Tensors。为了实现这些转换，我们使用了 `ToTensor` 和 `Lambda` 函数。

```python
import torch
from torchvision import datasets
from torchvision.transforms import ToTensor, Lambda

ds = datasets.FashionMNIST(
    root="data",
    train=True,
    download=True,
    transform=ToTensor(),
    target_transform=Lambda(lambda y: torch.zeros(10, dtype=torch.float).scatter_(0, torch.tensor(y), value=1))
)
```

# ToTensor()

ToTensor 可以把 PIL image 或者 NumPy `ndarry` 转换成 `FloatTensor`。并且把图片的像素归一化到 0~1 的范围内。

# Lambda Transforms

Lambda transforms 可以应用任何用户定义的 `lambda` 函数。这里，我们定义了一个函数，将整数转换为了独热编码 Tensor。它首先创建了一个大小为 10 的零张量（即数据集中的标签数量），然后调用 `scatter_` 函数，这个函数将标签 `y` 对应的索引赋值为 1。

# 模型搭建

# 搭建神经网络

神经网络由多个层 / 模块组成，这些层 / 模块可以对数据执行操作。`torch.nn` 这个命名空间可以提供我们所需要的所有模块，来搭建我们自己的神经网络。

PyTorch 里面的每个模块，都继承自 `nn.Module` 。神经网络本身就是一个模块，它由其他模块（层）组成。这种嵌套结构，使得构建和管理复杂的网络架构变得非常容易。

在下面几节，我们会搭建一个神经网络，来实现对 FashionMNIST 数据集里的图像进行分类。

```python
import os
import torch
from torch import nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms
```

## 获取训练设备

我们想让我们的模型能够在加速器上（如 CUDA，MPS，MTIA 或 XPU）训练。如果现有的加速器是可用的，我们就使用它，否则就使用 CPU。

```python
device = torch.accelerator.current_accelerator().type if torch.accelerator.is_available() else "cpu"
print(f"Using {device} device")
```

结果为：

```python
Using cuda device
```

## 定义 Class

我们继承 `nn.Module` 定义我们的神经网络，并且用 `__init__` 初始化我们的神经网络层。每个 `nn.Module` 子类都在 `forward` 里实现了对输入数据的操作。

```python
class NeuralNetwork(nn.Module): # 必须继承 nn.Module，这是 PyTorch 所有网络的基类
    def __init__(self):
        super().__init__() # 必须运行父类的初始化，以便 PyTorch 追踪这个模型

        # 零件1：展平层。作用：把 2D 图像变成 1D 向量
        self.flatten = nn.Flatten()

        # 零件2：顺序容器。把多个层像乐高一样按顺序垒起来
        self.linear_relu_stack = nn.Sequential(
            # 输入：28*28=784 个特征；输出：512 个神经元
            nn.Linear(28 * 28, 512),
            nn.ReLU(),

            nn.Linear(512, 512),
            nn.ReLU(),

            nn.Linear(512, 10),
        )

    def forward(self, x): # “正式开工”：定义数据进入模型后，怎么一步步流过零件
        x = self.flatten(x) # 第一步：把图片拉直
        logits = self.linear_relu_stack(x) # 第二步：通过那一叠全连接层
        return logits
```

我们创建一个 `NeuralNetwork` 的实例，把它移到 `device` 上，并打印出其结构。

```python
model = NeuralNetwork().to(device)
print(model)
```

结果为：

```bash
NeuralNetwork(
  (flatten): Flatten(start_dim=1, end_dim=-1)
  (linear_relu_stack): Sequential(
    (0): Linear(in_features=784, out_features=512, bias=True)
    (1): ReLU()
    (2): Linear(in_features=512, out_features=512, bias=True)
    (3): ReLU()
    (4): Linear(in_features=512, out_features=10, bias=True)
  )
)
```

为了使用这个模型，我们会让输入的数据经过它。这样会执行模型的 `forward`，以及一些后台操作。

请勿直接调用 `model.forward()` ！！！

对输入数据调用模型，会返回一个二维张量，其中 dim=0 对应于每个类别的 10 个原始预测值，dim=1 对应于每个输出的单个值。我们通过将其传递给 `nn.Softmax` 模块的实例来获得预测概率。

```python
X = torch.rand(1, 28, 28, device=device)
logits = model(X)
pred_probab = nn.Softmax(dim=1)(logits) # 沿着“类别”这个维度进行计算,里面的数值现在可以理解为“概率”
y_pred = pred_probab.argmax(1) # 在第一个维度（类别维度）上寻找**最大值所在的索引**。
print(f"Predicted class: {y_pred}")
```

结果为：

```bash
Predicted class: tensor([1], device='cuda:0')
```

# 模型层

让我们分解 `FashionMNIST` 模型的所有层。为了便于说明，我们会以包含 3 张图的 minibatch 为例，每张图大小为 28 * 28，看看如果我们让它通过网络，会发生什么。

```python
input_image = torch.rand(3, 28, 28)
print(input_image.size())
```

结果：

```bash
torch.Size([3, 28, 28])
```

## nn.Flatten

我们初始化 `nn.Flatten` 层，来把二维的 28 * 28 大小的图像转换成一个有 784 像素值的连续数组（minibatch 维度（dim=0）保留）。

```python
flatten = nn.Flatten()
flat_image = flatten(input_image)
print(flat_image.size())
```

结果：

```python
torch.Size([3, 784])
```

## nn.Linear

线性层是一个模块，它用它所储存的权重和偏置，对 **输入** 应用一个线性的变换。

```python
layer1 = nn.Linear(in_features=28*28, out_features=20)
hidden1 = layer1(flat_image)
print(hidden1.size)
```

结果为：

```bash
torch.Size([3, 20])
```

## nn.ReLU

非线性激活函数创建了模型输入输出之间的复杂映射关系。它们在线性变换之后被应用，来增加模型的非线性性，帮助神经网络学习各种各样的现象。

补充 `ReLU` 函数：

$$
\text{ReLU}(x) = (x)^+ = \max(0, x)
$$

![](file:///home/samxander/feishu/feishu2md/static/LiugbaqiPoJ3axxEc4hcXaMqnZd.png?msec=1774000227779)

```python
print(f"Before ReLU: {hidden1} \n\n")
hidden1 = nn.ReLU()(hidden1) # 这里第一个括号相当于先实例化了
print(f"After ReLU: {hidden1}")
```

输出：

```bash
Before ReLU: tensor([[-0.1008,  0.4621, -0.0274,  0.4787, -0.1797,  0.3044, -0.0914, -0.2500,
         -0.5978, -0.0596,  0.4518,  0.6692,  0.1610, -0.4244, -0.2449,  0.1680,
         -0.1191,  0.4322, -0.0718,  0.1390],
        [-0.1494,  0.5776, -0.1268, -0.1705,  0.0150,  0.1012, -0.4508,  0.0015,
         -0.5633,  0.0243,  0.3209,  0.3368,  0.2364, -1.0598, -0.1698, -0.0122,
         -0.0496,  0.6913,  0.3770,  0.0529],
        [-0.2312,  0.5046, -0.1109,  0.5788,  0.0750,  0.4080, -0.1071, -0.1798,
         -0.8835, -0.2366,  0.1466,  0.4536,  0.0690, -0.4291, -0.5442,  0.3025,
         -0.3139,  0.3642,  0.0794,  0.1836]], grad_fn=<AddmmBackward0>) 


After ReLU: tensor([[0.0000, 0.4621, 0.0000, 0.4787, 0.0000, 0.3044, 0.0000, 0.0000, 0.0000,
         0.0000, 0.4518, 0.6692, 0.1610, 0.0000, 0.0000, 0.1680, 0.0000, 0.4322,
         0.0000, 0.1390],
        [0.0000, 0.5776, 0.0000, 0.0000, 0.0150, 0.1012, 0.0000, 0.0015, 0.0000,
         0.0243, 0.3209, 0.3368, 0.2364, 0.0000, 0.0000, 0.0000, 0.0000, 0.6913,
         0.3770, 0.0529],
        [0.0000, 0.5046, 0.0000, 0.5788, 0.0750, 0.4080, 0.0000, 0.0000, 0.0000,
         0.0000, 0.1466, 0.4536, 0.0690, 0.0000, 0.0000, 0.3025, 0.0000, 0.3642,
         0.0794, 0.1836]], grad_fn=<ReluBackward0>)
```

## nn.Sequential

`nn.Sequential` 是一个有序的模块容器。数据会按照定义的顺序，在所有模块中传递。你可以使用顺序容器快速构建类似 `seq_modules` 的网络。

```python
seq_modules = nn.Sequential(
    flatten, 
    layer1,
    nn.ReLU(),
    nn.Linear(20, 10)
)
input_image = torch.rand(3, 28, 28)
logits = seq_modules(input_image)
```

## nn.Softmax

神经网络的最后一个线性层会返回 `[-infty, +infty]` 范围内的原始 logits 值，这些值被传递给 `nn.Softmax` 模块。logits 值被缩放到 `[0, 1]` 范围内，表示模型对每个类别的预测概率。`dim` 参数指示值之和必须为 1 的维度。

```python
softmax = nn.Softmax(dim=1)
pred_probab = softmax(logits)
```

# 模型参数

神经网络中的很多层都是参数化的，即他们都有相关的权重和偏置，这些权重会在训练过程中进行优化。继承 `nn.Module` 类会自动跟踪模型对象中定义的所有字段，并使得所有参数都可以通过模型的 `parameters()` 或 `named_parameters()` 方法访问。在本例中，我们将遍历每个参数，并打印其大小和值的预览。

```python
print(f"Model structure: {model}\n\n")

for name, param in model.named_parameters():
    print(f"Layer: {name} | Size: {param.size()} | Values : {param[:2]} \n")
```

结果：

```bash
Name: linear_relu_stack.0.weight | Size: torch.Size([512, 784]) | Value: tensor([[-0.0055,  0.0331,  0.0240,  ...,  0.0095,  0.0134,  0.0010],
        [-0.0041,  0.0240,  0.0202,  ..., -0.0352,  0.0035,  0.0062]],
       device='cuda:0', grad_fn=<SliceBackward0>)
Name: linear_relu_stack.0.bias | Size: torch.Size([512]) | Value: tensor([ 0.0213, -0.0331], device='cuda:0', grad_fn=<SliceBackward0>)
Name: linear_relu_stack.2.weight | Size: torch.Size([512, 512]) | Value: tensor([[-0.0345,  0.0245,  0.0192,  ..., -0.0362, -0.0162,  0.0035],
        [-0.0301, -0.0192,  0.0354,  ...,  0.0313,  0.0041,  0.0024]],
       device='cuda:0', grad_fn=<SliceBackward0>)
Name: linear_relu_stack.2.bias | Size: torch.Size([512]) | Value: tensor([0.0013, 0.0384], device='cuda:0', grad_fn=<SliceBackward0>)
Name: linear_relu_stack.4.weight | Size: torch.Size([10, 512]) | Value: tensor([[ 0.0199,  0.0226, -0.0361,  ...,  0.0328, -0.0347, -0.0042],
        [-0.0148,  0.0246, -0.0339,  ..., -0.0405, -0.0363, -0.0051]],
       device='cuda:0', grad_fn=<SliceBackward0>)
Name: linear_relu_stack.4.bias | Size: torch.Size([10]) | Value: tensor([0.0377, 0.0124], device='cuda:0', grad_fn=<SliceBackward0>)
```

> [!TIP]
> 为什么结果只有 0，2，4？因为 1 和 3 都是 `ReLU()`，没有参数！

1. 第一层：输入层（`linear_relu_stack.0`）
  1. **Weight [512, 784] **表示有 512 个神经元，每个神经元连接 784 个输入像素。实际上可以理解为 784 维的图像向量进来后，会和 512 * 784 的矩阵相乘，最后变成 512 维。每个神经元都有 一个偏置分数，总共 512 个。
2. 第二层：中间层（`linear_relu_stack.2`）
  1. **Weight [512, 512] **是一个方阵，它把前一层的 512 个特征进一步加工，映射到另一组 512 个特征中。
3. 第三层：输出层（`linear_relu_stack.4`）
  1. **Weight [10, 512]** 表示最后把 512 个抽象特征压缩成 10 个数字。

# 自动求导

# 用 `torch.autograd` 实现自动微分

在训练神经网络时，最常使用的算法就是**反向传播**。在这个算法里，参数（模型权重）会根据损失函数相对于给定参数的梯度，进行调整。

为了计算这些梯度，`PyTorch` 有一个叫做 `torch.autograd` 的内置的微分引擎。它支持对任意计算图的梯度进行自动计算。

考虑一个最简单的单层神经网络，有一个输入 `x`，参数 `w` 和 `b`，以及一些损失函数。它可以用下面的约定，在 PyTorch 里进行定义：

```python
import torch

x = torch.ones(5) # 输入 tensor
y = torch.zeros(3) # 期望输出
w = torch.randn(5, 3, required_grad=True)
b = torch.randn(3, required_grad=True)
z = torch.matmul(x, w) + b
loss = torch.nn.functional.binary_cross_entropy_with_logits(z, y)
```

# Tensors, 函数和计算图

上面的代码定义了下面的**计算图**：

![](file:///home/samxander/feishu/feishu2md/static/KtP5bvMXPobuvSxJhPicLMjnn1c.png?msec=1774000280856)

在这个网络里，`w` 和 `b` 都是我们需要优化的参数。因此，我们需要能够计算损失函数相对于这些参数的梯度。为了实现这个目标，我们设置了这些 Tensors 的 `required_grad` 属性。

> [!TIP]
> 你可以在创建一个 tensor 时，设定 `requires_grad` 的值；或者后面使用 `x.requires_grad_(True)` 方法。

我们用于构建计算图的张量函数，实际上是 `Function` 类的对象。这个对象知道在前向过程中如何计算函数，以及如何在反向传播阶段计算它们的导数。Tensor 的 `grad_fn` 属性存储着对反向传播函数的引用。

```python
print(f"Gradient function for z = {z.grad_fn}")
print(f"Gradient function for loss = {loss.grad_fn}")
```

结果：

```bash
Gradient function for z: <AddBackward0 object at 0x7f81c8cd4640>
Gradient function for loss: <BinaryCrossEntropyWithLogitsBackward0 object at 0x7f81c8cd4640>
```

# 计算梯度

为了优化神经网络里参数的权重，我们需要计算损失函数相对于参数的导数，也就是说，在固定的 `x` 和 `y` 值下，我们需要 $\frac{\partial \text{loss}}{\partial w}$ 和 $\frac{\partial \text{loss}}{\partial b}$。为了计算这些导数，我们调用 `loss.backward()`，然后从 `w.grad` 和 `b.grad` 中检索值：

```python
loss.backward()
print(w.grad)
print(b.grad)
```

结果是：

```bash
tensor([[0.2349, 0.2967, 0.2756],
        [0.2349, 0.2967, 0.2756],
        [0.2349, 0.2967, 0.2756],
        [0.2349, 0.2967, 0.2756],
        [0.2349, 0.2967, 0.2756]])
tensor([0.2349, 0.2967, 0.2756])
```

> [!TIP]

- 我们只能获取计算图中叶节点的 `grad` 属性，这些叶节点的 `required_grad` 属性设定为 `True`。对于图中的其他节点，梯度信息无法获取；
- 出于性能的考量，在一张给定的计算图上，我们只能用一次 `backward` 来进行梯度计算。如果我们需要在同一个图上进行多次 `backward` 的调用，我们需要把 `retain_graph=True` 传递给 `backward` 调用。

> [!TIP]
> 在 PyTorch 的计算图中，节点分为**叶子节点**（Leaf Nodes）和**中间节点**。

1. **叶子结点：**直接创建的，不是由任何数学操作（如加减乘除，矩阵相乘）生成的张量；
2. 在上面的例子中，`x, y, w, b` 都是叶节点；`z` 不是叶节点，它是通过矩阵乘法和 + 计算出来的；`loss` 不是叶节点，它是通过 `binary_cross_entropy_with_logits` 计算出来的。

只有 `requires_grad=True` 的叶子节点才有 `.grad`。PyTorch 的原则是：**为了节省内存，只保留你最需要的东西。**在训练中，我们最终需要更新的是**权重**和**偏置**。因此，当调用 `loss.backward()` 后：

- `w.grad` 会有值。
- `b.grad` 会有值。
- `z.grad` 虽然在链式法则中被计算过，但它会被**立即销毁**，结果为 `None`（因为它不是叶子节点）。
- `x.grad` 为 `None`（虽然它是叶子节点，但它的 `requires_grad=False`）。

# 禁止梯度追踪