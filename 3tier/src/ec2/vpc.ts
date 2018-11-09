import { VpcNetwork, SubnetType } from '@aws-cdk/aws-ec2';
import { Construct } from '@aws-cdk/cdk';

export default (parent: Construct) => new VpcNetwork(
  parent,
  'VPC',
  {
    cidr: '10.100.0.0/16',
    subnetConfiguration: [
      {
        cidrMask: 24,
        name: 'Ingress',
        subnetType: SubnetType.Public,
      },
      {
        cidrMask: 24,
        name: 'App',
        subnetType: SubnetType.Private,
      },
      {
        cidrMask: 28,
        name: 'DB',
        subnetType: SubnetType.Isolated,
      }
    ]
  },
);
