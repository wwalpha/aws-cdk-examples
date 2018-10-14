import { Construct } from "@aws-cdk/cdk";
import { Code } from "@aws-cdk/aws-lambda";
import { BucketRef } from "@aws-cdk/aws-s3";

export const dummyCode = (parent: Construct) => Code.bucket(BucketRef.import(parent, 'Bucket',
  {
    bucketArn: 'arn:aws:s3:::deployment-projects',
  }),
  `test/dummy.zip`
);
