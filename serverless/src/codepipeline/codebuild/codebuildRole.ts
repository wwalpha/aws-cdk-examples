import { Construct } from '@aws-cdk/cdk';
import { Role, Policy, ServicePrincipal, PolicyStatement, PolicyStatementEffect } from '@aws-cdk/aws-iam';
import { prefix } from '@utils';
import { CodeBuildInput } from '.';

export default (parent: Construct, props: CodeBuildInput): Role => {
  const role = new Role(parent, 'CodeBuildRole', {
    roleName: `${prefix(props)}-CodeBuildRole`,
    assumedBy: new ServicePrincipal('codebuild.amazonaws.com'),
  });

  const stmt1 = new PolicyStatement(PolicyStatementEffect.Allow)
    .addAction('logs:CreateLogGroup')
    .addAction('logs:CreateLogStream')
    .addAction('logs:PutLogEvents')
    .addResource('arn:aws:logs:ap-northeast-1:562849865336:log-group:/aws/codebuild/test')
    .addResource('arn:aws:logs:ap-northeast-1:562849865336:log-group:/aws/codebuild/test:*');

  const stmt2 = new PolicyStatement(PolicyStatementEffect.Allow)
    .addAction('s3:PutObject')
    .addAction('s3:GetObject')
    .addAction('s3:GetObjectVersion')
    .addResource('arn:aws:s3:::codepipeline-ap-northeast-1-*');

  const policy = new Policy(parent, 'CodeBuildPolicy', {
    policyName: `${prefix(props)}-CodeBuildPolicy`,
    statements: [stmt1, stmt2],
  });

  policy.attachToRole(role);

  return role;
};
