import { Construct } from '@aws-cdk/cdk';
import { cloudformation } from '@aws-cdk/aws-cloudfront';

export default (parent: Construct, domainName: string, identity: string) => new cloudformation.DistributionResource(
  parent,
  'DistributionResource',
  {
    distributionConfig: {
      origins: [
        {
          domainName,
          id: 'S3Origin',
          s3OriginConfig: {
            originAccessIdentity: `origin-access-identity/cloudfront/${identity}`,
          },
        },
      ],
      enabled: true,
      defaultRootObject: 'index.html',
      defaultCacheBehavior: {
        allowedMethods: [
          'GET', 'HEAD',
        ],
        targetOriginId: 'S3Origin',
        forwardedValues: {
          queryString: false,
          cookies: {
            forward: 'none',
          },
        },
        viewerProtocolPolicy: 'https-only',
      },
    },
  },
);
