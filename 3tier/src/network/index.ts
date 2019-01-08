import { SecurityGroupRefProps } from '@aws-cdk/aws-ec2';

export { default as NetworkStack } from './network';
export { default as VpcNetwork } from './vpc';
export { default as SecurityGroup } from './sg';

export interface SgProps {
  internet: SecurityGroupRefProps;
  internal: SecurityGroupRefProps;
  web: SecurityGroupRefProps;
  app: SecurityGroupRefProps;
  db: SecurityGroupRefProps;
}
