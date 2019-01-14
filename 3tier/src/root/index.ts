import { VpcNetworkRefProps } from '@aws-cdk/aws-ec2';

export { default } from './root';
export { default as VpcNetwork } from './vpc';

export interface WebProps {
  // VPC情報
  vpc: VpcNetworkRefProps;
}
