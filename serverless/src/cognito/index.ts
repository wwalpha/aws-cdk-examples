import { StackProps } from '@aws-cdk/cdk';

export { default as UserPool } from './userPool';
export { default as UserPoolClient } from './userPoolClient';
export { default as IdentityPool } from './identityPool';
export { default as IdentityPoolRoleAttachment } from './identityPoolRoleAttachment';

export interface CognitoInput extends StackProps {
}

export interface CognitoOutput {
  userPoolId: string;
  userPoolClientId: string;
  identityPoolId: string;
}
