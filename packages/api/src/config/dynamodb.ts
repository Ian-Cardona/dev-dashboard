import { ENV } from './env';
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const clientConfig: DynamoDBClientConfig = {
  region: ENV.AWS_REGION,
  requestHandler: {
    requestTimeout: 25000,
    connectionTimeout: 5000,
  },
};

if (ENV.NODE_ENV !== 'production') {
  if (!ENV.AWS_ACCESS_KEY_ID || !ENV.AWS_SECRET_ACCESS_KEY) {
    throw new Error(
      'AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are required in development'
    );
  }

  clientConfig.credentials = {
    accessKeyId: ENV.AWS_ACCESS_KEY_ID,
    secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
  };

  if (ENV.AWS_DYNAMODB_ENDPOINT) {
    clientConfig.endpoint = ENV.AWS_DYNAMODB_ENDPOINT;
  }
}

const client = new DynamoDBClient(clientConfig);
const docClient = DynamoDBDocumentClient.from(client);

export { client, docClient };
