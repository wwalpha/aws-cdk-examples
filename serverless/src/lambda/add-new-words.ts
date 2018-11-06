// import { Construct } from '@aws-cdk/cdk';
// import { Runtime, Function } from '@aws-cdk/aws-lambda';
// import { s3 } from '@utils/policy';
// import { getHandler, LambdaInput } from '.';
// import { LambdaRole } from '@utils/roles';
// import { bucketName, prefix } from '@utils';

// const service = 'appsync';
// const functionName = 'add-new-words';
// const handler = 'app.handler';
// const runtime = Runtime.NodeJS810;
// const memorySize = 256;
// const timeout = 10;

// export default (parent: Construct, props: LambdaInput): Function => {
//   const role = LambdaRole(parent, {
//     envType: props.envType,
//     project: props.project,
//     roleName: `${functionName}Role`,
//   });

//   role.attachInlinePolicy(s3(parent, `${functionName}Role`, bucketName(props)));

//   return new Function(parent, functionName, {
//     functionName: `${prefix(props)}-${functionName}`,
//     runtime,
//     handler: getHandler(props, `${service}/${functionName}`, handler),
//     code: dummyCode(parent),
//     role,
//     memorySize,
//     timeout,
//     environment: {
//       // S3_BUCKET: props.s3.bucketName,
//     },
//   });
// };
