import { VpcNetwork, SubnetType } from '@aws-cdk/aws-ec2';
import { Construct } from '@aws-cdk/cdk';
import { getResourceName } from '@const';

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
        tags: {
          Name: getResourceName('web'),
        },
      },
      {
        cidrMask: 24,
        name: 'app',
        subnetType: SubnetType.Public,
        tags: {
          Name: getResourceName('app'),
        },
      },
      {
        cidrMask: 24,
        name: 'db',
        subnetType: SubnetType.Isolated,
        tags: {
          Name: getResourceName('db'),
        },
      },
    ],
    tags: {
      Name: '3tier-vpc',
    },
  },
);
