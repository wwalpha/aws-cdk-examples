import { Construct } from '@aws-cdk/cdk';
import { cloudformation } from '@aws-cdk/aws-dynamodb';
import { CommonProps } from '../utils';

export default (parent: Construct, props: TableInput) => new cloudformation.TableResource(
  parent,
  `${props.table.tableName}Resource`,
  {
    tableName: `prefix(props)-${props.table.tableName}`,
    keySchema: props.table.keySchema,
    attributeDefinitions: props.table.attributeDefinitions,
    globalSecondaryIndexes: props.table.globalSecondaryIndexes,
    localSecondaryIndexes: props.table.localSecondaryIndexes,
    pointInTimeRecoverySpecification: props.table.pointInTimeRecoverySpecification,
    provisionedThroughput: props.table.provisionedThroughput,
    sseSpecification: props.table.sseSpecification,
    streamSpecification: props.table.streamSpecification,
    tags: props.table.tags,
    timeToLiveSpecification: props.table.timeToLiveSpecification,
  },
);

export interface TableInput extends CommonProps {
  table: cloudformation.TableResourceProps
}