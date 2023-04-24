ddb-migration:
	aws dynamodb create-table --cli-input-yaml file://$(PWD)/dynamodb/create-table.yml --endpoint-url http://localhost:8000
	aws dynamodb batch-write-item --request-items file://$(PWD)/dynamodb/put-items.json --endpoint-url http://localhost:8000

ddb-clean:
	aws dynamodb delete-table --table-name Todos --endpoint-url http://localhost:8000

ddb-batch-write-test-data:
	aws dynamodb batch-write-item --request-items file://$(PWD)/dynamodb/put-items.json
