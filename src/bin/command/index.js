var app = require('cmdu');
var version = require('../../lib/utils/version');

app.language = 'zh-CN';
app.version = version();
app.allowUnknowns = true;
app.allowTolerance = {
    include: {
        'isntall': 'install',
    },
    exclude: [
        'c',    // alias for config, not cache
    ]
};

app
    .describe('51前端内部包管理工具。')
    .action('commands/npm')
    .customHelp('commands/help');

app
    .command('use [npm|yarn]', '选择或查看当前使用的是npm还是yarn')
    .describe('npm|yarn', '指定使用npm或者yarn, 如果为其它值则输出当前使用的是npm还是yarn')
    .option('--local', '查看当前项目将会使用npm还是yarn来安装依赖')
    .option('--save', '当查看当前项目使用的引擎时，假设使用--save', true)
    .option('-g, --global', '当查看当前项目使用的引擎时，假设使用--global')
    .option('--npm', '当查看当前项目使用的引擎时，假设使用--npm')
    .option('--yarn', '当查看当前项目使用的引擎时，假设使用--yarn')
    .action('commands/use');

app
    .command('install [...packages]', '安装模块包')
    .alias('i')
    .describe('packages', '要安装的依赖包名')
    .option('-D, --save-dev', '将依赖写入devDependencies')
    .option('-O, --save-optional', '将依赖写入optionalDependencies')
    .option('-B, --save-bundle', '将依赖写入bundleDependencies. 使用yarn时将忽略此选项')
    .option('-P, --save-peer', '将依赖写入peerDependencies')
    .option('-E, --save-exact', '将精确的版本匹配写入package.json(如1.2.3), 默认是匹配主要版本(如^1.2.3)')
    .option('-T, --save-tilde', '将次要的版本匹配写入package.json(如~1.2.3)')
    .option('-g, --global', '是否全局安装, 使用全局安装时会强制使用npm')
    .option('-f, --force', '强制重新安装所有依赖')
    .option('--tag [tag]', '安装指定tag的依赖, 默认为最新版')
    .option('--dry-run', '是否使用模拟安装. 使用yarn时将忽略此选项')
    .option('--global-style', '只将直接依赖放在顶层的node_modules目录中, 这将产生部分重复依赖. 使用yarn时将忽略此选项')
    .option('--legacy-bundling', '以旧版本npm的方式安装依赖, 这将产生大量重复依赖. 使用yarn时将忽略此选项')
    .option('--ignore-scripts', '是否忽略package.json中定义的脚本文件')
    .option('--link', '在某些情况下直接将全局的依赖包link到本地的node_modules目录中. 使用yarn时将忽略此选项')
    .option('--bin-links', '是否允许自动为命令生成快捷方式到本地的node_modules/.bin目录中, 默认为true', true)
    .option('--optional', '是否安装可选依赖, 默认为true. 使用yarn时将忽略此选项', true)
    .option('--shrinkwrap', '是否以锁文件为准而忽略package.json, 默认为true. 使用yarn时将忽略此选项', true)
    .option('--lock', '是否生成lock文件, 默认为true.', true)
    .option('--package-lock', '是否生成lock文件, 默认为true.', true)
    .option('--save', '是否写入依赖信息, 默认为true. 如果为--no-save则不写入, 这时将强制使用npm来执行安装操作', true)
    .option('--check-files', '验证node_modules目录中未移除的包. 使用npm时将忽略此选项')
    .option('--flat', '所有依赖都只安装一个版本. 使用npm时将忽略此选项')
    .option('--offline', '使用离线模式安装. 使用npm时将忽略此选项')
    .option('--non-interactive', '禁用交互提示. 使用npm时将忽略此选项')
    .option('--silent', '静默安装，不打印警告日志')
    .option('--prod', '只安装生产依赖')
    .option('--production', '只安装生产依赖')
    .option('--ignore-engines', '忽略检测engines定义. 使用npm时将忽略此选项')
    .option('--only [prod[uction]|dev[elopment]]', '只安装生产依赖或开发依赖. 使用yarn时将忽略此选项')
    .option('--registry [registry]', '自定义安装源, 通常不需要指定')
    .option('--npm', '强制使用npm执行此次操作')
    .option('--yarn', '强制使用yarn执行此次操作')
    .action('commands/install');

app
    .command('uninstall [...packages]', '删除模块包')
    .alias('un,remove,rm,r')
    .describe('packages', '要卸载的依赖包名')
    .option('-g, --global', '是否全局卸载, 使用全局卸载时会强制使用npm')
    .option('-f, --force', '强制重新安装所有依赖')
    .option('--ignore-scripts', '是否忽略package.json中定义的脚本文件')
    .option('--shrinkwrap', '是否以锁文件为准而忽略package.json, 默认为true. 使用yarn时将忽略此选项', true)
    .option('--lock', '是否生成lock文件, 默认为true.', true)
    .option('--package-lock', '是否生成lock文件, 默认为true.', true)
    .option('--save', '是否移除依赖信息, 默认为true. 如果为--no-save则不移除, 这时将强制使用npm来执行卸载操作', true)
    .option('--check-files', '验证node_modules目录中未移除的包. 使用npm时将忽略此选项')
    .option('--flat', '所有依赖都只安装一个版本. 使用npm时将忽略此选项')
    .option('--offline', '使用离线模式安装. 使用npm时将忽略此选项')
    .option('--non-interactive', '禁用交互提示. 使用npm时将忽略此选项')
    .option('--silent', '静默安装，不打印警告日志')
    .option('--registry [registry]', '自定义安装源, 通常不需要指定')
    .option('--ignore-engines', '忽略检测engines定义. 使用npm时将忽略此选项')
    .option('--only [prod[uction]|dev[elopment]]', '只卸载生产依赖或开发依赖. 使用yarn时将忽略此选项')
    .option('--npm', '强制使用npm执行此次操作')
    .option('--yarn', '强制使用yarn执行此次操作')
    .action('commands/uninstall');

app
    .command('update [...packages]', '更新模块包')
    .alias('up,upgrade')
    .describe('packages', '要更新的依赖包名')
    .option('--depth [depth]', '指定更新的依赖层级, 默认只更新最顶层的依赖. 使用yarn时将忽略此选项')
    .option('--pattern [pattern]', '更新匹配指定表达式的包')
    .option('--scope [@scope]', '更新指定scope的包')
    .option('--latest', '忽略package.json中的规则, 强制更新到最新版')
    .option('-C, --save-caret', '当指定--latest时, 更新package.json中的匹配规则为^')
    .option('-T, --save-tilde', '当指定--latest时, 更新package.json中的匹配规则为~')
    .option('-E, --save-exact', '当指定--latest时, 更新package.json中的匹配规则为确定版本')
    .option('-g, --global', '是否全局升级, 使用全局升级时会强制使用npm')
    .option('--ignore-scripts', '是否忽略package.json中定义的脚本文件')
    .option('--save', '是否更新依赖信息, 默认为true. 如果为--no-save则不更新, 这时将使用npm来执行更新操作', true)
    .option('--registry [registry]', '自定义安装源, 通常不需要指定')
    .option('--ignore-engines', '忽略检测engines定义. 使用npm时将忽略此选项')
    .option('--npm', '强制使用npm执行此次操作')
    .option('--yarn', '强制使用yarn执行此次操作')
    .action('commands/update');

app
    .command('publish [tarball|folder]', '发布一个包到仓库')
    .alias('pu')
    .describe('tarball|folder', '发布的文件或目录, 默认为当前目录')
    .option('--access [public|restricted]', '对于@scope包，指定是否对外开放，该功能只对发布到npm仓库有效')
    .option('--tag [tag]', '以指定tag发布, 默认为最新版')
    .option('--registry [url]', '要发布的源，默认为官方源')
    .action('commands/publish');

app
    .command('cache <action>', '缓存操作')
    .describe('action', 'add, verify, dir, list(ls), clean')
    .option('--npm', '强制使用npm执行此次操作, 当action=clean时有效')
    .option('--yarn', '强制使用yarn执行此次操作, 当action=clean时有效')
    .action('commands/cache');

app
    .command('clean')
    .describe('清空当前项目下的node_modules及锁文件')
    .action('commands/clean');

app
    .command('last [...packages]', '查看某个包的最新版本号')
    .describe('packages', '要查看的包名, 可以同时查看多个')
    .option('-t, --tag [string]', '指定tag，如: latest, beta, dev, test' , 'latest')
    .action('commands/last');

app
    .command('find [...packages]', '检测当前项目下的依赖, 包括生产依赖和开发依赖')
    .describe('packages', '要检测的包名')
    .action('commands/find');

app.listen();
