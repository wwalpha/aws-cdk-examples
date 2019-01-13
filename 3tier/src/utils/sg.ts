import { Construct } from '@aws-cdk/cdk';
import { SecurityGroup, VpcNetworkRef } from '@aws-cdk/aws-ec2';

export default (parent: Construct, vpc: VpcNetworkRef, name: string): SecurityGroup => new SecurityGroup(
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
