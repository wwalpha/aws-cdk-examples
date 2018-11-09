import { Construct } from '@aws-cdk/cdk';
import { Resource, FunctionEnvironment } from 'typings/sam';
import { Code, Runtime, Function } from '@aws-cdk/aws-lambda';
import { getResourceName } from '@const';

/** SAM Templateの元でLambda Function作成 */
export const getFunction = (parent: Construct, name: string, { Properties }: Resource) => new Function(parent, name, {
  code: Code.inline('dummy'),
  handler: Properties.Handler,
  runtime: getRuntime(Properties.Runtime),
  functionName: getResourceName(getName(Properties.FunctionName)),
  timeout: Properties.Timeout,
  memorySize: Properties.MemorySize,
  environment: getEnvironment(Properties.Environment),
  description: Properties.Description,
  // deadLetterQueue: Properties.DeadLetterQueue,
});

/** 環境設定 */
const getEnvironment = (env?: FunctionEnvironment) => {
  if (!env || !env.Variables) return undefined;

  Object.keys(env.Variables).forEach((key) => {
    if (env.Variables[key]) {
      env.Variables[key] = getResourceName(getName(env.Variables[key]));
    }
  });

  return env.Variables;
};

/** 名称変更 */
const getName = (name?: string) => {
  if (!name) return '';

  const splits = name.split('-');

  return splits[splits.length - 1];
};

/** Runtime変換 */
const getRuntime = (runtime: string): Runtime => {
  if (runtime === 'nodejs8.10') return Runtime.NodeJS810;
  if (runtime === 'python3.6') return Runtime.Python36;
  if (runtime === 'python2.7') return Runtime.Python27;
  if (runtime === 'java8') return Runtime.Java8;

  throw new Error('UnSupported Runtime');
};
