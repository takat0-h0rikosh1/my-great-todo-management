build-frontend:
	$(MAKE) gen-dotenv-prod	
	(cd frontend && yarn run build)

build-backend:
	(cd backend && yarn run build)

build:
	$(MAKE) build-frontend
	$(MAKE) build-backend

stage := dev
deploy:
	$(MAKE) deploy-app stage=$(stage)
	$(MAKE) deploy-authorizeWithCognito stage=$(stage)

deploy-app:
	$(MAKE) build
	sls deploy --stage $(stage)
	$(MAKE) gen-dotenv-prod stage=$(stage)
	$(MAKE) build-frontend
	sls s3sync --stage $(stage)

deploy-authorizeWithCognito:
	$(MAKE) gen-authorizer-jsfile stage=${stage}
	sls deploy --config serverless-virginia.yml --stage ${stage}

gen-dotenv-prod:
	SERVICE_ENDPOINT=$(shell sls info --verbose --stage=$(stage) | grep ServiceEndpoint | grep -o 'https://[^ ]*'); \
	echo NEXT_PUBLIC_API_BASE_URL=$$SERVICE_ENDPOINT > frontend/.env.production.local

gen-authorizer-jsfile:
	COGNITO_USER_POOL_ID=$(shell sls info --verbose --stage=$(stage) | grep CognitoUserPoolId | sed 's/^.*: //'); \
	COGNITO_USER_POOL_APP_CLIENT_ID=$(shell sls info --verbose --stage=$(stage) | grep CognitoUserPoolAppClientId | sed 's/^.*: //'); \
	COGNITO_USER_POOL_DOMAIN=$(shell sls info --verbose --stage=$(stage) | grep CognitoUserPoolDomain | sed 's/^.*: //'); \
	sed -e s/USER_POOL_ID/$$COGNITO_USER_POOL_ID/g \
		-e s/USER_POOL_APP_ID/$$COGNITO_USER_POOL_APP_CLIENT_ID/g \
		-e s/USER_POOL_DOMAIN/$$COGNITO_USER_POOL_DOMAIN/g \
		./authorizeWithCognito/index.template.js > ./authorizeWithCognito/index.mjs
