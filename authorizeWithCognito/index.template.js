// see: https://github.com/awslabs/cognito-at-edge
import { Authenticator } from 'cognito-at-edge';

const authenticator = new Authenticator({
  // Replace these parameter values with those of your own environment
  region: "ap-northeast-1", // user pool region
  userPoolId: "USER_POOL_ID", // user pool ID
  userPoolAppId: "USER_POOL_APP_ID", // user pool app client ID
  userPoolDomain: "USER_POOL_DOMAIN", // user pool domain
});

export const handler = async (event) => {
  const result = await authenticator.handle(event);
  return result;
};