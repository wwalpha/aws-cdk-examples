import { SecurityGroupRefProps, VpcNetworkRefProps } from '@aws-cdk/aws-ec2';
import { StackProps } from '@aws-cdk/cdk';

export { default } from './app';

export interface AppProps {
  // WEBのセキュリティーグループ
  appSg: SecurityGroupRefProps;
}

export interface AppStackProps extends StackProps {
  // WEBのセキュリティーグループ
  vpc: VpcNetworkRefProps;
  webSg: SecurityGroupRefProps;
}
