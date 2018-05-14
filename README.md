typeorm-sample
===============
This is a sample application for [TypeORM](https://github.com/typeorm/typeorm) + [TypeDI](https://github.com/pleerock/typedi) + [routing-controllers](https://github.com/pleerock/routing-controllers) + [Angular](https://angular.io/).

[TypeORM](https://github.com/typeorm/typeorm) + [TypeDI](https://github.com/pleerock/typedi) + [routing-controllers](https://github.com/pleerock/routing-controllers) + [Angular](https://angular.io/) を使ったWebアプリのサンプルです。  
※ テーブル構成などはブログをイメージしていますが、最終的にブログっぽくはないです。管理画面的です。

## Environment
* CentOS 7
* Node.js v10.x
* nginx 1.12.x
* TypeScript 2.x
* TypeORM 0.2.5
* TypeDI 0.7.3
* routing-controllers 0.7.7
* Angular 6.x
    * webpack 4.x
    * ngx-translate 10.x
* swagger-jsdoc 1.x
* Mocha 5.x
    * Power-assert 1.x

### Development environment
* Vagrant 2.0.x - Virtual machine management
    * VirtualBox 5.1.x - Virtual machine
    * vagrant-vbguest - Vagrant plug-in
* Visual Studio Code - Editor

## Directory structure
* VM root
    * typeorm-sample - Node.js server application
        * config - Application configuration
    * typeorm-sample-web - Angular web application
    * vagrant-conf - Vagrant configuration

## Installation
1. Install Vagrant and the plug-in, and copy this repository to your computer.
2. Run `vagrant up`. (`vagrant provision` is automatically started.)

\* If `npm install` is failed, please retry `vagrant provision`.

1. Vagrantをインストールした後、ファイル一式をVMのフォルダとする場所に展開。
2. `vagrant up` でVM環境を構築（アプリの初回ビルド等も自動実行）。

※ `npm install` でエラーになる場合は `vagrant provision` でもう一度実行してみてください。

## Usage
The server application is automatically started.
You can access to the web application at http://[DHCP_IP]/ on default VM.

\* If the server application is not started, please run `npm start` command.

WebアプリはVM起動時に自動的に立ち上がります。
デフォルトのVMでは http://[DHCPで振られたIP]/ でアクセス可能です。

※ Microsoft EdgeだとプライベートIPはアクセスできない場合あり。  
※ 自動起動に失敗する場合は、後述の `npm start` コマンドを実行してください。

### Commands
You can use some commands for the applications.
Please use the commands in `typeorm-sample`, `typeorm-sample-web` directories.

Webアプリの操作用に、以下のようなサーバーコマンドを用意しています。
アプリのビルドや再起動などを行う場合は、VMにログインして `typeorm-sample`, `typeorm-sample-web` ディレクトリでコマンドを実行してください。

* `typeorm-sample`
    * `npm start` - start the application / アプリの起動
        * `npm run production` - start the application as production mode / アプリの起動（運用モード）
    * `npm restart` - restart the application / アプリの再起動
    * `npm stop` - stop the application / アプリの停止
* `typeorm-sample/typeorm-sample-web`
    * `npm run build` - build the application / アプリのビルド
    * `npm run watch` - build the application with watch / アプリのビルド（ファイル更新監視）
    * `npm run doc` - generate TypeDoc / アプリのAPIドキュメント生成
    * `npm test` - run unit test / アプリのユニットテスト実行
    * `npm run tslint` - run tslint / アプリの静的解析ツールの実行
    * `npm run clean` - clrean all output / 全ビルド生成物の削除

## Note
The server application output some logs to `/var/log/local/typeorm-sample`.
There are an access log, debug log, error log.

各種ログは `/var/log/local/typeorm-sample` 下に出力されます。
アクセスログ、デバッグログ、エラーログを出力します。

## License
[MIT](https://github.com/ktanakaj/typeorm-sample/blob/master/LICENSE)