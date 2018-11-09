import { Construct } from '@aws-cdk/cdk';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { getRoleName, getResourceName } from '@const';
import { cloudwatch, warmup } from '@utils/policy';
import { Code, Runtime, Function } from '@aws-cdk/aws-lambda';
import { readFileSync } from 'fs';
import { EventRule } from '@aws-cdk/aws-events';
import { safeLoad } from 'js-yaml';
import { join } from 'path';

const config: LambdaWarmup = safeLoad(readFileSync(join('configs/lambda-warmup.yml'), 'utf8'));

export default (parent: Construct) => {
  // Role
  const role = new Role(parent, 'WarmupRole', {
    assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    roleName: getRoleName('Warmup', 'Lambda'),
  });

  // Basic
  role.attachInlinePolicy(cloudwatch(parent, 'WarmupRole'));
  role.attachInlinePolicy(warmup(parent, 'WarmupRole'));

  // Lambda Function
  const functionRef = new Function(parent, 'LambdaWarmup', {
    code: Code.file(join(__dirname, 'app.zip')),
    functionName: getResourceName(config.Lambda.FunctionName),
    handler: 'index.handler',
    runtime: Runtime.NodeJS810,
    memorySize: config.Lambda.MemorySize,
    timeout: config.Lambda.Timeout,
    environment: {
      ENVIRONMENT: config.Lambda.TargetEnv,
    },
    role,
  });

  // Rule作成
  new EventRule(parent, getResourceName('RuleName'), {
    enabled: true,
    ruleName: config.Rule.Name,
    scheduleExpression: `cron(${config.Rule.Schedule})`,
    description: config.Rule.Description,
    targets: [functionRef],
  });
};

export interface LambdaWarmup {
  Rule: RuleProps;
  Lambda: LambdaProps;
}

export interface RuleProps {
  Name: string;
  Schedule: string;
  Description?: string;
}

export interface LambdaProps {
  FunctionName: string;
  MemorySize: number;
  Timeout: number;
  TargetEnv: string;
}
