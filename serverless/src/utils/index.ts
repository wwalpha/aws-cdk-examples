import { Function } from '@aws-cdk/aws-lambda';

export interface LambdaDef {
  [key: string]: Function;
}

export * from './consts';
