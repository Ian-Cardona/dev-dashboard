import { ENV } from './env';
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

console.log('ENV.AWS_REGION:', ENV.AWS_REGION);
console.log('ENV.AWS_DYNAMODB_ENDPOINT:', ENV.AWS_DYNAMODB_ENDPOINT);
console.log(
  'process.env.AWS_DYNAMODB_ENDPOINT:',
  process.env.AWS_DYNAMODB_ENDPOINT
);

const clientConfig: DynamoDBClientConfig = {
  region: ENV.AWS_REGION,
};

if (ENV.AWS_DYNAMODB_ENDPOINT) {
  if (!ENV.AWS_ACCESS_KEY_ID || !ENV.AWS_SECRET_ACCESS_KEY) {
    throw new Error(
      'AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are required when using local DynamoDB'
    );
  }

  clientConfig.endpoint = ENV.AWS_DYNAMODB_ENDPOINT;
  clientConfig.credentials = {
    accessKeyId: ENV.AWS_ACCESS_KEY_ID,
    secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
  };
}

const client = new DynamoDBClient(clientConfig);
const docClient = DynamoDBDocumentClient.from(client);

export { client, docClient };
