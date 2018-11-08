import { Construct, AwsRegion, AwsAccountId } from '@aws-cdk/cdk';
import { Role, Policy, ServicePrincipal, PolicyStatement, PolicyStatementEffect } from '@aws-cdk/aws-iam';
import { RoleProps } from '.';
import { prefix } from '@utils';

const getRole = (parent: Construct, props: RoleProps): Role => new Role(parent, `${props.roleName}Resource`, {
  roleName: `${prefix(props)}-AppSync-${props.roleName}Role`,
  assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
});

export const lambdaDataSourceRole = (parent: Construct, props: RoleProps): Role => {
  const role = getRole(parent, props);

  const policy = new Policy(parent, `${props.roleName}Policy`, {
    statements: [
      new PolicyStatement(PolicyStatementEffect.Allow)
        .addAction('lambda:invokeFunction')
        .addResource(`arn:aws:lambda:${new AwsRegion()}:${new AwsAccountId()}:function:prefix(props)*`),
    ],
  });

  role.attachInlinePolicy(policy);

  return role;
};

export const dynamodbDataSourceRole = (parent: Construct, props: RoleProps, tableName: string): Role => {
  const role = getRole(parent, props);

  const policy = new Policy(parent, `${props.roleName}-policy`, {
    statements: [
      new PolicyStatement(PolicyStatementEffect.Allow)
        .addAction('dynamodb:DeleteItem')
        .addAction('dynamodb:GetItem')
        .addAction('dynamodb:PutItem')
        .addAction('dynamodb:Scan')
        .addAction('dynamodb:Query')
        .addAction('dynamodb:UpdateItem')
        .addResource(`arn:aws:dynamodb:${new AwsRegion()}:*:table/prefix(props)-${tableName}`)
        .addResource(`arn:aws:dynamodb:${new AwsRegion()}:*:table/prefix(props)-${tableName}/*`),
    ],
  });

  role.attachInlinePolicy(policy);

  return role;
};
