import { Stack, App } from '@aws-cdk/cdk';
import { CloudFrontWebDistribution, CloudFrontAllowedMethods, CfnCloudFrontOriginAccessIdentity, Behavior, ViewerProtocolPolicy, CloudFrontAllowedCachedMethods } from '@aws-cdk/aws-cloudfront';
import { CfProps, S3 } from '.';

export default class CloudFrontStack extends Stack {

  constructor(parent?: App, name?: string, props?: CfProps) {
    super(parent, name, props);

    if (!props) return;

    // S3新規
    const s3 = S3(this);

    // CloudFront
    new CloudFrontWebDistribution(this, 'distribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: s3,
            originAccessIdentity: new CfnCloudFrontOriginAccessIdentity(this, 'OAI', {
              cloudFrontOriginAccessIdentityConfig: {
                comment: 'nothing',
              },
            }),
          },
          behaviors: originBehaviors(),
        },
        {
          customOriginSource: {
            domainName: props.dnsName,
          },
          behaviors: customBehaviors(),
        },
      ],
      viewerProtocolPolicy: ViewerProtocolPolicy.AllowAll,
    });

  }
}

const originBehaviors = (): Behavior[] => ([
  {
    pathPattern: '/js/*',
    allowedMethods: CloudFrontAllowedMethods.GET_HEAD,
    compress: true,
  },
  {
    pathPattern: '/css/*',
    allowedMethods: CloudFrontAllowedMethods.GET_HEAD,
    compress: true,
  },
]);

const customBehaviors = () => ([
  {
    maxTtlSeconds: 0,
    minTtlSeconds: 0,
    defaultTtlSeconds: 0,
    allowedMethods: CloudFrontAllowedMethods.ALL,
    cachedMethods: CloudFrontAllowedCachedMethods.GET_HEAD_OPTIONS,
    // forwardedValues: CfnDistribution.
    compress: false,
    isDefaultBehavior: true,
  },
]);
