import { cloudformation } from '@aws-cdk/aws-cognito';
import { Construct } from '@aws-cdk/cdk';
import { CognitoInput } from '.';
import { getResourceName } from '@const';

export default (parent: Construct, provider: cloudformation.IdentityPoolResource.CognitoIdentityProviderProperty, _: CognitoInput): cloudformation.IdentityPoolResource =>
  new cloudformation.IdentityPoolResource(parent, 'IdentityPoolResource', {
    identityPoolName: getResourceName('IdentityPool', '_'),
    // 未認証もアクセス可能
    allowUnauthenticatedIdentities: true,
    // Provider：Cognito
    cognitoIdentityProviders: [
      provider,
    ],
  });
