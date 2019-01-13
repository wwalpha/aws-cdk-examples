import { SecurityGroupRefProps, VpcNetworkRefProps } from '@aws-cdk/aws-ec2';
import { StackProps } from '@aws-cdk/cdk';

export { default } from './db';

export interface DBStackProps extends StackProps {
  // WEBのセキュリティーグループ
  vpc: VpcNetworkRefProps;
  appSg: SecurityGroupRefProps;
}
