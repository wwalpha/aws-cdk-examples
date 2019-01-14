import { VpcNetwork, SubnetType } from '@aws-cdk/aws-ec2';
import { Construct } from '@aws-cdk/cdk';

export default (parent: Construct) => new VpcNetwork(
  parent,
  'VPC',
  {
    cidr: '10.101.0.0/16',
    maxAZs: 2,
    enableDnsHostnames: true,
    enableDnsSupport: true,
    subnetConfiguration: [
      {
        cidrMask: 24,
        name: 'web',
        subnetType: SubnetType.Public,
      },
      {
        cidrMask: 24,
        name: 'app',
        subnetType: SubnetType.Isolated,
      },
      {
        cidrMask: 24,
        name: 'db',
        subnetType: SubnetType.Isolated,
      },
    ],
    tags: {
      Name: '3tier-vpc',
    },
  },
);
