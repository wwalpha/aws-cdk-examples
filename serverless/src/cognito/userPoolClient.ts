import { cloudformation } from '@aws-cdk/aws-cognito';
import { Construct } from '@aws-cdk/cdk';

export default (parent: Construct, userPoolId: string) => new cloudformation.UserPoolClientResource(
  parent,
  'UserPoolClientResource',
  {
    clientName: 'mobile-client',
    generateSecret: false,
    userPoolId,
    explicitAuthFlows: [
      'ADMIN_NO_SRP_AUTH'
    ],
    refreshTokenValidity: 6,
  },
);
