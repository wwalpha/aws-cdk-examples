import { StackProps } from '@aws-cdk/cdk';
import { VpcNetworkRefProps } from '@aws-cdk/aws-ec2';
import { SgProps } from '@network';

export { default as EC2Stack } from './ec2';

export interface NetworkProps extends StackProps {
  vpc: VpcNetworkRefProps;
  sg: SgProps;
}

export interface ELBProps {
  internetFacing?: boolean;
  deletionProtection?: boolean;
  ami: string;
  port: number;
  elbName: string;
  asgName: string;
}
