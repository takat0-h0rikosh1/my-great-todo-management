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

![swagger-spec.yaml](https://github.com/takat0-h0rikosh1/my-great-todo-management/blob/main/backend/swagger-spec.yaml)の中身を https://editor-next.swagger.io/ に貼り付けるなどして見ていただくのが良いかもしれません。

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
yarn run start:dev
```

- http://localhost:3000 で立ち上がります。
- http://localhost:3000/api で swagger ui に遷移します。

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

### アプリケーション

プロジェクトのルートディレクトリで作業してください。  
`serverless.yml` の定義を反映します。 

```sh
# configure aws credentials
export AWS_PROFILE=my-profile

# deploy application resources
make deploy

# 【optional】insert dummy data to dynamodb
cd backend
make ddb-batch-write-test-data
```

### 認証基盤

プロジェクトのルートディレクトリで作業してください。  
`serverless-virginia.yml` の定義を反映します。

ここではCognitoへ認証リクエストを行うLambda@EdgeのデプロイとCloudFrontへの関連付けを行います。

Lambda@Edgeがバージニア北部リージョンでしか構成できなかった都合でデプロイ作業のステップが別れています。

もう少し良いやり方がないかどうかは要調査...。Lambda@Edgeが東京リージョンでサポートしてくれたら全て解決するのですが...。

#### ⚠注意事項⚠

以降の作業は以下のシチュエーションで作業が必要になることに注意。

- 初回のデプロイ作業
- CloudFrontのディストリビューションを変更したとき
- Cognitoのユーザープールやアプリクライアントを変更したとき

単にアプリケーションを更新したい場合はこの作業は不要です。

#### 実作業

```sh
sls deploy --config serverless-virginia.yml
```

上記が終わったら以下の作業を実施してください。

1. デプロイしたLambdaのバージョン付きARNをメモしておく
1. AWSのコンソールにてCloudFrontの管理画面を開く
1. アプリケーションのデプロイ作業で作成したディストリビューションの詳細画面へ移動
1. すでに作成されているビヘイビアの編集画面へ移動
1. 関数の関連付けを行う
   1. イベントはビューワーリクエスト
   2. 関数タイプにLambda@Edgeを選択
   3. 先程控えたLambdaのバージョン付きARNを入力
   4. 変更を保存をクリック