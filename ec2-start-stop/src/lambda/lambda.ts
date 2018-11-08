import { Construct } from '@aws-cdk/cdk';
import { Function, Code, Runtime, FunctionRef } from '@aws-cdk/aws-lambda';
import { readFileSync } from 'fs';
import { cloudwatch } from '@utils/policy';
import { Role, ServicePrincipal, Policy, PolicyStatement, PolicyStatementEffect } from '@aws-cdk/aws-iam';

export default (parent: Construct): FunctionRef => {
  const role = new Role(parent, 'LambdaRole', {
    roleName: 'EC2-Auto-StartStop-Role',
    assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
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
    code: Code.inline(readFileSync('./start-stop.js', 'utf-8')),
    handler: 'start-stop.handler',
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
