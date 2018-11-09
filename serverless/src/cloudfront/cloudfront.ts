import { CloudFrontOriginAccessIdentity, CloudFrontInput, Distribution, NewBucket, ResourcePolicy } from '.';
import { Stack, App, Output, Construct } from '@aws-cdk/cdk';
import { cloudformation, Bucket } from '@aws-cdk/aws-s3';
import { getResourceName } from '@const';

export default class CloudFrontStack extends Stack {

  constructor(parent: App, name: string, props: CloudFrontInput) {
    super(parent, name, props);

    // S3 Bucket
    const bucket = NewBucket(this, 'front');
    const bucketResource = bucket.findChild('Resource') as cloudformation.BucketResource;

    // Origin Access Identity
    const identity = CloudFrontOriginAccessIdentity(this);

    // Bucket Resource Policy
    bucket.addToResourcePolicy(ResourcePolicy(bucket.bucketArn, identity.ref));

    const s3Dist = Distribution(this, bucket.domainName, identity.ref);
    // Dependency
    s3Dist.addDependency(...bucketResource.dependencyElements);

    output(this, bucket);
  }
}

const output = (parent: Construct, bucket: Bucket) => {
  new Output(parent, 'OutputBucketArn', {
    export: getResourceName('BucketArn'),
    value: bucket.bucketArn,
  });

  new Output(parent, 'OutputDomainName', {
    export: getResourceName('DomainName'),
    value: bucket.domainName,
  });

  new Output(parent, 'OutputBucketName', {
    export: getResourceName('BucketName'),
    value: bucket.bucketName,
  });
};
