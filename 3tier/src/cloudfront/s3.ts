import { Construct } from '@aws-cdk/cdk';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { Bucket } from '@aws-cdk/aws-s3';
import { getBucketName } from '@const';

export default (parent: Construct) => {
  const s3 = new Bucket(parent, 'Bucket', {
    bucketName: getBucketName('distribution'),
    publicReadAccess: false,
    versioned: false,
  });

  new BucketDeployment(parent, 'BucketDeployment', {
    source: Source.asset('./static'),
    destinationBucket: s3,
  });

  return s3;
};
