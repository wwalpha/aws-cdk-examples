import { Construct } from '@aws-cdk/cdk';
import { cloudformation } from '@aws-cdk/aws-cloudfront';

export default (parent: Construct) => new cloudformation.CloudFrontOriginAccessIdentityResource(
  parent,
  'CloudFrontOriginAccessIdentityResource',
  {
    cloudFrontOriginAccessIdentityConfig: {
      comment: '',
    },
  },
);
