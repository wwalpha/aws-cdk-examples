import { Construct } from '@aws-cdk/cdk';
import { cloudformation } from '@aws-cdk/aws-cloudfront';
import { S3Output } from './s3';

export default (parent: Construct, props: S3Output, identity: string) => new cloudformation.DistributionResource(
  parent,
  'DistributionResource',
  {
    distributionConfig: {
      origins: [
        {
          domainName: props.bucketDomainName as string,
          id: 'S3Origin',
          s3OriginConfig: {
            originAccessIdentity: identity,
          }
        }
      ],
      enabled: true,
      defaultRootObject: 'index.html',
      defaultCacheBehavior: {
        allowedMethods: [
          'GET', 'HEAD'
        ],
        targetOriginId: 'S3Origin',
        forwardedValues: {
          queryString: false,
          cookies: {
            forward: 'none',
          }
        },
        viewerProtocolPolicy: 'https-only'
      },
    }
  }
);
