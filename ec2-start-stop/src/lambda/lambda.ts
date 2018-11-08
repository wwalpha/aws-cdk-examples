import { Construct } from '@aws-cdk/cdk';
import { Function, Code, Runtime, FunctionRef } from '@aws-cdk/aws-lambda';
import { join } from 'path';
import { cloudwatch } from '@utils/policy';
import { Role, ServicePrincipal, Policy, PolicyStatement, PolicyStatementEffect } from '@aws-cdk/aws-iam';

export default (parent: Construct): FunctionRef => {
  const role = new Role(parent, 'LambdaRole', {
    roleName: 'EC2-Auto-StartStop-Role',
    assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
  });

  // EC2 FullAccess
  role.attachInlinePolicy(new Policy(parent, 'EC2', {
    statements: [
      new PolicyStatement(PolicyStatementEffect.Allow)
        .addAction('ec2:*')
        .addAllResources(),
    ],
  }));

  // Lambda Basic
  role.attachInlinePolicy(cloudwatch(parent, 'EC2-Auto-StartStop-Role'));

  return new Function(parent, 'ec2-start-stop', {
    code: Code.file(join(__dirname, '../start-stop.zip')),
    handler: 'index.handler',
    runtime: Runtime.NodeJS810,
    memorySize: 256,
    timeout: 5,
    functionName: 'EC2-Auto-StartStop',
    environment: {
      START_INSTANCES: '',
    },
    role,
  });
};
