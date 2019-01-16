import { Construct } from '@aws-cdk/cdk';
import { SecurityGroup, IVpcNetwork } from '@aws-cdk/aws-ec2';
import { getResourceName } from '@const';

export default (parent: Construct, vpc: IVpcNetwork, name: string): SecurityGroup => new SecurityGroup(
  parent,
  name,
  {
    vpc,
    allowAllOutbound: true,
    groupName: getResourceName(name),
    tags: {
      Name: getResourceName(name),
    },
  },
);
