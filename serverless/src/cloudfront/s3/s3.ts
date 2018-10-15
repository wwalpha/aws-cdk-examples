// import { Stack, App } from "@aws-cdk/cdk";
// import { cloudformation } from '@aws-cdk/aws-s3';
// import { S3Input, NewBucket, S3Output } from ".";


// // export default class S3Stack extends Stack {
// //   public readonly output: S3Output

// //   constructor(parent: App, name: string, props: S3Input) {
// //     super(parent, name, props);

// //     const bucket = NewBucket(this, props);

// //     const bucketResource = bucket.findChild('Resource') as cloudformation.BucketResource;

// //     this.output = {
// //       ...bucket.export(),
// //       bucketRef: bucketResource.ref,
// //     };
// //   }
// // }
