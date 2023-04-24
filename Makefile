build-frontend:
	$(MAKE) gen-dotenv-prod	
	(cd frontend && yarn run build)

build-backend:
	(cd backend && yarn run build)

build:
	$(MAKE) build-frontend
	$(MAKE) build-backend

deploy:
	$(MAKE) build
	sls deploy 
	$(MAKE) gen-dotenv-prod
	$(MAKE) build-frontend
	sls s3sync

retrieve-service-endpoint := $(shell sls info --verbose | grep ServiceEndpoint | grep -o 'https://[^ ]*')
gen-dotenv-prod:
	echo NEXT_PUBLIC_API_BASE_URL=$(retrieve-service-endpoint) > frontend/.env.production.local

retrieve-cognito-user-pool-id := $(shell sls info --verbose | grep CognitoUserPoolId | sed 's/^.*: //')
retrieve-cognito-user-pool-app-client-id := $(shell sls info --verbose | grep CognitoUserPoolAppClientId | sed 's/^.*: //')
retrieve-cognito-user-pool-domain := $(shell sls info --verbose | grep CognitoUserPoolDomain | sed 's/^.*: //')
gen-authorizer-jsfile:
	sed -e 's/USER_POOL_ID/$(retrieve-cognito-user-pool-id)/g' \
		-e 's/USER_POOL_APP_ID/$(retrieve-cognito-user-pool-app-client-id)/g' \
		-e 's/USER_POOL_DOMAIN/$(retrieve-cognito-user-pool-domain)/g' \
		./authorizeWithCognito/index.template.js > ./authorizeWithCognito/index.js

deploy-authorizeWithCognito:
	$(MAKE) gen-authorizer-jsfile
	sls deploy --config serverless-virginia.yml