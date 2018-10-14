// import { S3EventInput, S3EventOutput } from '.';
// import { cloudformation, BucketRef } from '@aws-cdk/aws-s3';
// import { Construct, AwsRegion, AwsAccountId } from '@aws-cdk/cdk';

// export default (_parent: Construct, props: S3EventInput): S3EventOutput => {
//   const prefixArn = `arn:aws:lambda:${new AwsRegion()}:${new AwsAccountId()}:function:prefix(props)`;

//   const bucket = BucketRef.import(_parent, UUID_V4(), props.s3.bucket).findChild('Resource') as cloudformation.BucketResource;

//   // イベント
//   addCreatedEvent(bucket, `${prefixArn}-image-to-word`, {
//     name: 'prefix',
//     value: 'users'
//   });

//   return {};
// };

// const addCreatedEvent = (bucket: cloudformation.BucketResource, lambdaArn: string, ...rules: cloudformation.BucketResource.FilterRuleProperty[]): void => {
//   bucket.propertyOverrides.notificationConfiguration = {
//     lambdaConfigurations: [
//       {
//         event: 's3:ObjectCreated:*',
//         function: lambdaArn,
//         filter: {
//           s3Key: {
//             rules: rules
//           }
//         }
//       }
//     ]
//   };
// }
