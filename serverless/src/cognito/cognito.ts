import { cloudformation } from '@aws-cdk/aws-cognito';
import { Stack, App } from '@aws-cdk/cdk';
import { UserPool, UserPoolClient, IdentityPool, IdentityPoolRoleAttachment, CognitoInput, CognitoOutput } from '.';
import { AuthenticatedRole, UnauthenticatedRole } from '@utils/roles';

export default class CognitoStack extends Stack {
  public readonly output: CognitoOutput;

  constructor(parent: App, name: string, props: CognitoInput) {
    super(parent, name, props);

    // User Pool
    const userPool = UserPool(this, props);
    // User Pool Client
    const userPoolClient = UserPoolClient(this, userPool.ref);

    // Cognito Provider
    const provider: cloudformation.IdentityPoolResource.CognitoIdentityProviderProperty = {
      clientId: userPoolClient.userPoolClientId,
      providerName: userPool.userPoolProviderName,
    };

    // Identity Pool
    const identityPool = IdentityPool(this, provider, props);

    IdentityPoolRoleAttachment(this, {
      identityPoolId: identityPool.ref,
      authenticated: AuthenticatedRole(this, identityPool.ref, {
        envType: props.envType,
        project: props.project,
        roleName: 'AuthenticatedRole',
        policyName: 'AuthenticatedPolicy',
      }).roleArn,
      unauthenticated: UnauthenticatedRole(this, identityPool.ref, {
        envType: props.envType,
        project: props.project,
        roleName: 'UnauthenticatedRole',
        policyName: 'UnauthenticatedPolicy',
      }).roleArn,
    });

    this.output = {
      identityPoolId: identityPool.identityPoolId,
      userPoolId: userPool.userPoolId,
      userPoolClientId: userPoolClient.userPoolClientId,
    };
  }
}
