import { Stack, App } from '@aws-cdk/cdk';
import { CloudFrontWebDistribution, CloudFrontAllowedMethods, CfnCloudFrontOriginAccessIdentity, Behavior, ViewerProtocolPolicy, CloudFrontAllowedCachedMethods } from '@aws-cdk/aws-cloudfront';
import { CfProps, S3 } from '.';
// import { ApplicationLoadBalancer } from '@aws-cdk/aws-elasticloadbalancingv2';

export default class CloudFrontStack extends Stack {

  constructor(parent?: App, name?: string, props?: CfProps) {
    super(parent, name, props);

    if (!props) return;

    const s3 = S3(this);

    // const alb = ApplicationLoadBalancer.import(this, 'alb', props.albRefProps);

    new CloudFrontWebDistribution(this, 'distribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: s3,
            originAccessIdentity: new CfnCloudFrontOriginAccessIdentity(this, 'OAI', {
              cloudFrontOriginAccessIdentityConfig: {
                comment: 'nothing',
              }
            }),
          },
          behaviors: originBehaviors(),
        },
        {
          customOriginSource: {
            domainName: 'dev-3-dev3T-18I1P1Q19UFV5-1134451892.ap-northeast-1.elb.amazonaws.com',
          },
          behaviors: customBehaviors(),
        }
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
  }
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
  }
]);