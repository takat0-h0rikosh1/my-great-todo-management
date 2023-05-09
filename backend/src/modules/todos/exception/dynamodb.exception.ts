export default class DynamoDBException extends Error {
  public originalError: Error;
  constructor(message: string, originalError?: Error) {
    super(message);
    this.name = 'DynamoDBException';
    this.originalError = originalError;
    Error.captureStackTrace(this, this.constructor);
  }
}
