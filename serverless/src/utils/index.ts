import { Function } from '@aws-cdk/aws-lambda';
import { StackProps } from '@aws-cdk/cdk';

export interface CommonProps extends StackProps {
  envType: string;
  project: string;
}

export interface LambdaDef {
  [key: string]: Function;
}

export * from './consts';
