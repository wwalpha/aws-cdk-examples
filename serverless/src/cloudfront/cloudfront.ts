import { CloudFrontOriginAccessIdentity, CloudFrontInput, BucketPolicy } from '.';
import { Stack, App } from '@aws-cdk/cdk';
import { NewBucket } from './s3';
import { cloudformation } from '@aws-cdk/aws-s3';

export default class CloudFrontStack extends Stack {

  constructor(parent: App, name: string, props: CloudFrontInput) {
    super(parent, name, props);

    // S3 Bucket
    const bucket = NewBucket(this, props);
    const bucketResource = bucket.findChild('Resource') as cloudformation.BucketResource;

    // Origin Access Identity
    const identity = CloudFrontOriginAccessIdentity(this);

    // Bucket Policy
    BucketPolicy(this, {
      ...props,
      bucketRef: bucketResource.ref,
      ...bucket.export(),
    }, identity.ref);

    // Distribution(this, props, identity.ref);
  }
}

