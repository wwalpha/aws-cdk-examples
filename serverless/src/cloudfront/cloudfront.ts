import { CloudFrontOriginAccessIdentity, CloudFrontInput, BucketPolicy, Distribution } from '.';
import { Stack, App, Output } from '@aws-cdk/cdk';
import { NewBucket, S3Output } from './s3';
import { cloudformation } from '@aws-cdk/aws-s3';
import { ApiGateway } from '..';

export default class CloudFrontStack extends Stack {
  public readonly s3Output: S3Output;

  constructor(parent: App, name: string, props: CloudFrontInput) {
    super(parent, name, props);

    // S3 Bucket
    const bucket = NewBucket(this, props);
    const bucketResource = bucket.findChild('Resource') as cloudformation.BucketResource;

    const s3Output: S3Output = {
      bucketRef: bucketResource.ref,
      bucketArn: bucket.bucketArn,
      bucketDomainName: bucket.domainName,
      bucketName: bucket.bucketName,
    };

    // Origin Access Identity
    const identity = CloudFrontOriginAccessIdentity(this);

    // Bucket Policy
    BucketPolicy(this, s3Output, identity.ref);

    const s3Dist = Distribution(this, s3Output, identity.ref);

    // Dependency
    s3Dist.addDependency(...bucketResource.dependencyElements);

    // api gateway 作成
    ApiGateway(this, {
      project: props.project,
      envType: props.envType,
    });

    new Output(this, 'cloudFrontOriginAccessIdentityId', {
      export: 'cloudFrontOriginAccessIdentityId',
      value: identity.cloudFrontOriginAccessIdentityId,
    });
    new Output(this, 'cloudFrontOriginAccessIdentityS3CanonicalUserId', {
      export: 'cloudFrontOriginAccessIdentityS3CanonicalUserId',
      value: identity.cloudFrontOriginAccessIdentityS3CanonicalUserId,
    });

    this.s3Output = s3Output;
  }
}
