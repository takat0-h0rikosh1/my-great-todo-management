import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const isProduction = process.env.NODE_ENV === 'production';
const localEndpoint = 'http://localhost:8000';
const region = 'ap-northeast-1';

const config = isProduction
  ? {
      region: region,
    }
  : {
      region: 'localhost',
      endpoint: localEndpoint,
      credentials: {
        accessKeyId: 'local',
        secretAccessKey: 'local',
      },
    };

const client = new DynamoDBClient(config);

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: false, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};

const translateConfig = { marshallOptions, unmarshallOptions };

// Create the DynamoDB Document client.
const ddbDocClient = DynamoDBDocumentClient.from(client, translateConfig);

export { ddbDocClient };
