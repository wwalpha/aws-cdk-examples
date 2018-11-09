import { StackProps } from '@aws-cdk/cdk';


export interface DynamodbInput extends StackProps {
}

export interface DynamodbOutput {
}

export { default as Table } from './table';
