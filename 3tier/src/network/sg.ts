import { Construct } from '@aws-cdk/cdk';
import { SecurityGroup, VpcNetwork } from '@aws-cdk/aws-ec2';

export default (parent: Construct, vpc: VpcNetwork, name: string): SecurityGroup => new SecurityGroup(
  parent,
  name,
  {
    vpc,
    allowAllOutbound: true,
    tags: {
      Name: name,
    },
  },
);
