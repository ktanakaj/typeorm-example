typeorm-sample
===============
[TypeORM](https://github.com/typeorm/typeorm) + [TypeDI](https://github.com/pleerock/typedi) + [routing-controllers](https://github.com/pleerock/routing-controllers) を使ったWeb API（ブログ）のサンプルです。

## 環境
* CentOS 7
* Node.js v6.x
* nginx 1.10.x
* TypeScript 2.x
* TypeORM 0.0.11
* TypeDI 0.5.2
* routing-controllers 0.7.0-alpha.13
* Angular 4.x
    * webpack 2.x
    * ngx-translate 6.x
* Mocha 3.x
    * Power-assert 1.x

### 開発環境
* Vagrant 1.9.x - 仮想環境管理
    * VirtualBox 5.1.x - 仮想環境
    * vagrant-vbguest - Vagrantプラグイン
* Visual Studio Code - アプリ開発用エディター

## フォルダ構成
* VMルートフォルダ
    * typeorm-sample - Node.js Webサーバーソース
        * config - アプリ設定
    * typeorm-sample-web - Angular Webアプリソース
    * vagrant-conf - Vagrant関連ファイル

## 環境構築手順
1. Vagrantをインストールした後、ファイル一式をVMのフォルダとする場所に展開。
* `vagrant up` でVM環境を構築（アプリの初回ビルド等も自動実行）。

※ `npm install` でエラーになる場合は `vagrant provision` でもう一度実行してみてください。

## 実行方法
Web APIはVM起動時に自動的に立ち上がります。

デフォルトのVMでは http://DHCPで振られたIPアドレス/swagger/?url=/api-docs.json でアクセス可能です。

※ Microsoft EdgeだとプライベートIPはアクセスできない場合あり。  
※ 自動起動に失敗する場合は、後述の `npm start` コマンドを実行してください。

### サーバーコマンド
Webアプリの操作用に、以下のようなサーバーコマンドを用意しています。
アプリのビルドや再起動などを行う場合は、VMにログインして `typeorm-sample`, `typeorm-sample-web` ディレクトリでコマンドを実行してください。

* `typeorm-sample`
    * `npm start` - アプリの起動
        * `npm run production` アプリの起動（運用モード）
    * `npm restart` - アプリの再起動
    * `npm stop` - アプリの停止
* `typeorm-sample/typeorm-sample-web`共通
    * `npm run build` - アプリのビルド
    * `npm run watch` - アプリのビルド（ファイル更新監視）
    * `npm run doc` - アプリのAPIドキュメント生成
    * `npm test` - アプリのユニットテスト実行
    * `npm run tslint` - アプリの静的解析ツールの実行
    * `npm run clean` - 全ビルド生成物の削除

## その他
各種ログは `/var/log/local/typeorm-sample` 下に出力されます。
アクセスログ、デバッグログ、エラーログを出力します。

## ライセンス
[MIT](https://github.com/ktanakaj/typeorm-sample/blob/master/LICENSE)