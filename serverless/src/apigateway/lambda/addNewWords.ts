import { Construct } from '@aws-cdk/cdk';
import { Runtime, Function } from '@aws-cdk/aws-lambda';
import { LambdaRole } from '@utils/roles';
import { s3 } from '@utils/policy';
import { bucketName, prefix } from '@utils';
import { dummyCode } from '@utils/refs';
import { LambdaInput, getHandler } from '@lambda';

const service = 'api';
const functionName = 'addNewWords';
const handler = 'app.handler';
const runtime = Runtime.NodeJS810;
const memorySize = 256;
const timeout = 10;

export default (parent: Construct, props: LambdaInput): Function => {
  const role = LambdaRole(parent, {
    envType: props.envType,
    project: props.project,
    roleName: `${functionName}Role`,
  });

  role.attachInlinePolicy(s3(parent, `${functionName}Role`, bucketName(props)));

  return new Function(parent, functionName, {
    functionName: `${prefix(props)}-${functionName}`,
    runtime,
    handler: getHandler(props, `${service}/${functionName}`, handler),
    code: dummyCode(parent),
    role,
    memorySize,
    timeout,
    // environment: {
    //   S3_BUCKET: props.s3.bucketName,
    // },
  });
};
