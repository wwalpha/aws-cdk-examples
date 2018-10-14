import * as path from 'path';
import { Stack, App } from '@aws-cdk/cdk';
import { cloudformation } from '@aws-cdk/aws-dynamodb';
import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { DynamodbOutput, DynamodbInput, Table } from '.';

const configs: any = safeLoad(readFileSync(path.join('./configs', 'dynamodb-tables.yml'), 'utf8'));

export default class DynamodbStack extends Stack {
  public readonly output: DynamodbOutput

  constructor(parent: App, name: string, props: DynamodbInput) {
    super(parent, name, props);

    Object.keys(configs).forEach((key) => {
      const tableProps: cloudformation.TableResourceProps = configs[key];

      Table(this, {
        ...props,
        table: tableProps,
      });
    });

    this.output = {}
  }
}

