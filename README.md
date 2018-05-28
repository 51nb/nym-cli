# nym-cli

## Feature

* 集成[`npm5`](https://docs.npmjs.com/)和[`yarn`](https://yarnpkg.com/zh-Hans/)，无需升级nodejs，无需全局安装yarn；
* 统一的`npm`或者`yarn`版本管理，避免在不同机器上造成差异；
* 使用npm相同的命令来执行`yarn`相应的操作，无需额外的学习成本；
* 自动选择`npm`或`yarn`，确保同一个项目在不同的环境下安装的依赖一致；
* 接入常用需要编译的依赖(如node-sass，phantom.js等)的二进制文件镜像，加快依赖安装速度；
* 兼容brew、nvm、n、安装文件等各种方式安装的nodejs；
* 对常用命令添加了详细帮助说明，使用`nym [命令名] -h`查看；
* 增加一些额外的实用的辅助命令。

## Install

```bash
npm i -g nym-cli
```

> 带`sudo`安装`nym-cli`会导致`nym-cli`无法正常使用。解决方案是，执行以下命令：

```bash
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

或者参考：https://docs.npmjs.com/getting-started/fixing-npm-permissions。

## NPM5 vs Yarn

### How to use

`nym`在决策该使用哪种引擎时，会依据以下规则：

> 注意：目前只有install，uninstall，update和cache这几个命令是支持使用`yarn`的。

**显式声明**

在命令后面加`--npm`或者`--yarn`来强制指定，这种方式具有最高的优先级。

**锁文件**

项目下有yarn.lock或者package-lock.json文件时，将根据锁文件来确定使用`yarn`还是`npm`，注意不要同时存在这两个文件，否则`nym`会拒绝执行此次操作。

**全局设置**

使用`nym use`命令可以指定默认是使用`yarn`还是`npm`，此种情况下的优先级最低。

## Command

除了以下列出的命令进行了增强之外，其它`npm`既有的命令仍然可以通过`nym`来调用，对于`npx`命令，可以通过`nbx`来调用，对于`yarn`的其它命令，可以通过`nby`来调用。

### use

设置或查看当前是使用的`yarn`还是`npm`。

```bash
$ nym use -h

  关于

    选择或查看当前使用的是npm还是yarn

  用法

    nym use [npm|yarn] [选项]

  参数

    npm|yarn        指定使用npm或者yarn, 如果为其它值则输出当前使用的是npm还是yarn

  选项

    --local         查看当前项目将会使用npm还是yarn来安装依赖
    --save          当查看当前项目使用的引擎时，假设使用--save
    -g, --global    当查看当前项目使用的引擎时，假设使用--global
    --npm           当查看当前项目使用的引擎时，假设使用--npm
    --yarn          当查看当前项目使用的引擎时，假设使用--yarn
    -h, --help      显示帮助信息
```

### install

```bash
$ nym i -h

  关于

    安装模块包

  用法

    nym install|i [packages] [选项]

  参数

    packages                               要安装的依赖包名

  选项

    -D, --save-dev                         将依赖写入devDependencies
    -O, --save-optional                    将依赖写入optionalDependencies
    -B, --save-bundle                      将依赖写入bundleDependencies. 使用yarn时将忽略此选项
    -P, --save-peer                        将依赖写入peerDependencies
    -E, --save-exact                       将精确的版本匹配写入package.json(如1.2.3), 默认是匹配主要版本(如^1.2.3)
    -T, --save-tilde                       将次要的版本匹配写入package.json(如~1.2.3)
    -g, --global                           是否全局安装, 使用全局安装时会强制使用npm
    -f, --force                            强制重新安装所有依赖
    --tag [tag]                            安装指定tag的依赖, 默认为最新版
    --dry-run                              是否使用模拟安装. 使用yarn时将忽略此选项
    --global-style                         只将直接依赖放在顶层的node_modules目录中, 这将产生部分重复依赖. 使用yarn时将忽略此选项
    --legacy-bundling                      以旧版本npm的方式安装依赖, 这将产生大量重复依赖. 使用yarn时将忽略此选项
    --ignore-scripts                       是否忽略package.json中定义的脚本文件
    --link                                 在某些情况下直接将全局的依赖包link到本地的node_modules目录中. 使用yarn时将忽略此选项
    --bin-links                            是否允许自动为命令生成快捷方式到本地的node_modules/.bin目录中, 默认为true
    --optional                             是否安装可选依赖, 默认为true. 使用yarn时将忽略此选项
    --shrinkwrap                           是否以锁文件为准而忽略package.json, 默认为true. 使用yarn时将忽略此选项
    --lock                                 是否生成lock文件, 默认为true.
    --package-lock                         是否生成lock文件, 默认为true.
    --save                                 是否写入依赖信息, 默认为true. 如果为--no-save则不写入, 这时将强制使用npm来执行安装操作
    --check-files                          验证node_modules目录中未移除的包. 使用npm时将忽略此选项
    --flat                                 所有依赖都只安装一个版本. 使用npm时将忽略此选项
    --offline                              使用离线模式安装. 使用npm时将忽略此选项
    --non-interactive                      禁用交互提示. 使用npm时将忽略此选项
    --silent                               静默安装，不打印警告日志
    --prod                                 只安装生产依赖
    --production                           只安装生产依赖
    --ignore-engines                       忽略检测engines定义. 使用npm时将忽略此选项
    --only [prod[uction]|dev[elopment]]    只安装生产依赖或开发依赖. 使用yarn时将忽略此选项
    --registry [registry]                  自定义安装源, 通常不需要指定
    --npm                                  强制使用npm执行此次操作
    --yarn                                 强制使用yarn执行此次操作
    -h, --help                             显示帮助信息
```

### uninstall

```bash
$ nym un -h

  关于

    删除模块包

  用法

    nym uninstall|un|remove|rm|r [packages] [选项]

  参数

    packages                               要卸载的依赖包名

  选项

    -g, --global                           是否全局卸载, 使用全局卸载时会强制使用npm
    -f, --force                            强制重新安装所有依赖
    --ignore-scripts                       是否忽略package.json中定义的脚本文件
    --shrinkwrap                           是否以锁文件为准而忽略package.json, 默认为true. 使用yarn时将忽略此选项
    --lock                                 是否生成lock文件, 默认为true.
    --package-lock                         是否生成lock文件, 默认为true.
    --save                                 是否移除依赖信息, 默认为true. 如果为--no-save则不移除, 这时将强制使用npm来执行卸载操作
    --check-files                          验证node_modules目录中未移除的包. 使用npm时将忽略此选项
    --flat                                 所有依赖都只安装一个版本. 使用npm时将忽略此选项
    --offline                              使用离线模式安装. 使用npm时将忽略此选项
    --non-interactive                      禁用交互提示. 使用npm时将忽略此选项
    --silent                               静默安装，不打印警告日志
    --registry [registry]                  自定义安装源, 通常不需要指定
    --ignore-engines                       忽略检测engines定义. 使用npm时将忽略此选项
    --only [prod[uction]|dev[elopment]]    只卸载生产依赖或开发依赖. 使用yarn时将忽略此选项
    --npm                                  强制使用npm执行此次操作
    --yarn                                 强制使用yarn执行此次操作
    -h, --help                             显示帮助信息
```

### update

也可以通过`--scope @scope`或者`--pattern`来指定要更新的包。

```bash
nym update --scope @u51
```

```bash
nym update --pattern ^@u51\/
```

除此之外，还可以使用`--latest`来忽略`package.json`中的规则来强制更新到最新版。

```bash
$ nym up -h

  关于

    更新模块包

  用法

    nym update|up|upgrade [packages] [选项]

  参数

    packages                 要更新的依赖包名

  选项

    --depth [depth]          指定更新的依赖层级, 默认只更新最顶层的依赖. 使用yarn时将忽略此选项
    --pattern [pattern]      更新匹配指定表达式的包
    --scope [@scope]         更新指定scope的包
    --latest                 忽略package.json中的规则, 强制更新到最新版
    -C, --save-caret         当指定--latest时, 更新package.json中的匹配规则为^
    -T, --save-tilde         当指定--latest时, 更新package.json中的匹配规则为~
    -E, --save-exact         当指定--latest时, 更新package.json中的匹配规则为确定版本
    -g, --global             是否全局升级, 使用全局升级时会强制使用npm
    --ignore-scripts         是否忽略package.json中定义的脚本文件
    --save                   是否更新依赖信息, 默认为true. 如果为--no-save则不更新, 这时将使用npm来执行更新操作
    --registry [registry]    自定义安装源, 通常不需要指定
    --ignore-engines         忽略检测engines定义. 使用npm时将忽略此选项
    --npm                    强制使用npm执行此次操作
    --yarn                   强制使用yarn执行此次操作
    -h, --help               显示帮助信息
```

### publish

当执行`nym publish`的时候，`nym`还会检测版本号中是否含有`-(alpha|beta|dev|test|...).0`，如果有，将自动添加tag或者提示需要指定tag。例如：在`package.json`中指定的版本号为`1.0.0-alpha.1`，则会直接指定`--tag=alpha`。

```bash
$ nym pu -h

  关于

    发布一个包到仓库

  用法

    nym publish|pu [tarball|folder] [选项]

  参数

    tarball|folder                  发布的文件或目录, 默认为当前目录

  选项

    --access [public|restricted]    对于@scope包，指定是否对外开放，该功能只对发布到npm仓库有效
    --tag [tag]                     以指定tag发布, 默认为最新版
    -n, --npm                       是否发布到npm仓库
    -h, --help                      显示帮助信息
```

### cache

当执行`nym cache <action>`的时候，如果执行的是`clean`操作，则需要使用`--npm`或`--yarn`来显式声明，否则会同时清除`npm`和`yarn`的缓存。

```bash
$ nym ca -h

  关于

    缓存操作

  用法

    nym cache <action> [选项]

  参数

    action        add, verify, dir, list(ls), clean

  选项

    --npm         强制使用npm执行此次操作, 当action=clean时有效
    --yarn        强制使用yarn执行此次操作, 当action=clean时有效
    -h, --help    显示帮助信息
```

### clean

清除当前项目下的`node_modules`和锁文件。

```bash
$ nym clean -h

  关于

    清空当前项目下的node_modules及锁文件

  用法

    nym clean  [选项]

  选项

    -h, --help    显示帮助信息
```

### last

查看某个包的最新版本号。

```bash
$ nym last -h

  关于

    查看某个包的最新版本号

  用法

    nym last [packages] [选项]

  参数

    packages              要查看的包名, 可以同时查看多个

  选项

    -t, --tag [string]    指定tag，如: latest, beta, dev, test
    -h, --help            显示帮助信息
```

### find

检测当前项目下是否存在某个模块，这将遍历查找所有子目录(不仅仅限于node_modules)。

```bash
$ nym find -h

  关于

    检测当前项目下的依赖, 包括生产依赖和开发依赖

  用法

    nym find [packages] [选项]

  参数

    packages      要检测的包名

  选项

    -h, --help    显示帮助信息
```
