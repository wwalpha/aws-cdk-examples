import { StackProps } from '@aws-cdk/cdk';
import { ApplicationLoadBalancerRefProps } from '@aws-cdk/aws-elasticloadbalancingv2';

export { default as EC2Stack } from './cloudfront';
export { default as S3 } from './s3';

export interface CfProps extends StackProps {
  albRefProps: ApplicationLoadBalancerRefProps;
}
