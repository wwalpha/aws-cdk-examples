import { Construct } from '@aws-cdk/cdk';
import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3';
import { getBucketName } from '@const';

export default (parent: Construct, name: string) => new Bucket(
  parent,
  'S3',
  {
    bucketName: getBucketName(name),
    encryption: BucketEncryption.S3Managed,
    versioned: true,
  },
);
