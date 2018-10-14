import { Construct } from '@aws-cdk/cdk';
import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3';
import { S3Input } from '.';
import { bucketName } from '../../utils/consts';

export default (parent: Construct, props: S3Input) => new Bucket(
  parent,
  'S3',
  {
    bucketName: bucketName(props),
    encryption: BucketEncryption.S3Managed,
    versioned: true,
  },
);
