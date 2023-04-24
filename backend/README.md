## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## DDB Tips

```sh
aws dynamodb list-tables --endpoint-url http://localhost:8000

aws dynamodb query --table-name Todos \
  --index-name StatusIndex \
  --key-conditions file://$PWD/dynamodb/key-conditions.json \
  --endpoint-url http://localhost:8000 
```