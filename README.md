# my-great-todo-management

とてもシンプルなTODOリスト管理アプリ。

## スタック

- Backend(REST API)
  - NestJS, API Gateway, AWS Lambda
- Frontend
  - Next.js, Recoil, S3(Static Web Hosting), CloudFront
- Authorization/Authentication
  - Cognito, Lambda@Edge
- IaC
  - Serverless Framework
- Storage
  - DynamoDB
- API Document
  - Swagger

## アーキテクチャ

![my-great-todo drawio](https://user-images.githubusercontent.com/17715952/236977697-7d4d2d58-8afe-4552-a79c-a07b95a2159f.png)

## プロジェクト構成

```sh
.
├── allowCors # Preflight対策のLambda
├── authorizeWithCognito # Cognitoへ認証リクエストを行うLambda@Edge
├── backend # TODOアプリのバックエンド
├── frontend # TODOアプリのフロントエンド
├── serverless-virginia.yml # authorizeWithCognitoのIaC
└── serverless.yml # TODOアプリ全般の構成管理
```

## API仕様

[swagger-spec.yaml](https://github.com/takat0-h0rikosh1/my-great-todo-management/blob/main/backend/swagger-spec.yaml)の中身を https://editor-next.swagger.io/ に貼り付けるなどして見ていただくのが良いかもしれません。

お手元の環境で確認する場合は後段に手順の記載があるのでそちらをご参照ください。

## 開発の準備

#### Backend

```sh
cd backend

# start dynamodb
docker compose up -d

# create table and insert dummy data
make ddb-migration

# install dependencies libs
yarn install

# start nestjs
yarn start:dev
```

- http://localhost:3000 で立ち上がります。
- http://localhost:3000/api で swagger ui に遷移します。


以下のコマンドで e2e テストが走ります。

```sh
yarn test:e2e
```

#### Frontend

```sh
cd frontend

# install dependencies libs
yarn install

# start next.js
yarn dev
```

http://localhost:3001 で立ち上がります。

## デプロイ

### 各種コマンド実行

プロジェクトのルートディレクトリで作業してください。  

```sh
# configure aws credentials
export AWS_PROFILE=my-profile

# deploy application resources. The stage is set to 'dev' by default.
make deploy stage=${env}

# 【optional】insert dummy data to dynamodb
cd backend
make ddb-batch-write-test-data
```

### AWSコンソール作業

ここではCognitoへ認証リクエストを行うLambda@Edgeとコンテンツを配信するCloudFrontとの関連付けを行います。

Lambda@Edgeがバージニア北部リージョンでしか構成できなかった都合でこのようなマニュアル作業が発生してしまっています。

もう少し良いやり方がないかどうかは要調査...。Lambda@Edgeが東京リージョンでサポートしてくれたら全て解決するのですが...。

#### ⚠注意事項⚠

以降の作業は以下のシチュエーションで作業が必要になることに注意。

- 初回のデプロイ作業
- Lambdaのソースを更新したとき
- CloudFrontのディストリビューションを変更したとき

単にアプリケーションを更新したい場合はこの作業は不要です。

#### 実作業

1. [Lambdaの管理画面(region=us-east-1)](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/functions)を開く
1. デプロイしたLambdaを選択
1. アプリケーションのデプロイ作業で作成したディストリビューションの詳細画面へ移動
1. 関数の概要のトリガーを追加を選択
1. ソースを選択でCloudFrontを選択
1. Lambda@Edgeへのデプロイをクリック
1. 新しい CloudFront のトリガーの設定を選択（すでにトリガーがある場合は既存のトリガーを使用でも良い）
1. 入力フォーム更新
   1. ディストリビューションでSPAを配信するCloudFrontを選択
   2. Lambda@Edgeへのデプロイを確認にチェックを入れる
2. デプロイをクリック


## Clean up

1. cloudfront の管理画面から Lambda@Edge の関連付け削除してください
2. 以下のコマンドを順に実施してください
   - ```sh
     sls remove --config serverless-virginia.yml
     sls remove
     ``` 
   - 失敗したら CloudFormation のスタックを直接消してください
