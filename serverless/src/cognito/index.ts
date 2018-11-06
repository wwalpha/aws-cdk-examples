import { CommonProps } from '@utils';

export { default as UserPool } from './userPool';
export { default as UserPoolClient } from './userPoolClient';
export { default as IdentityPool } from './identityPool';
export { default as IdentityPoolRoleAttachment } from './identityPoolRoleAttachment';


export interface CognitoInput extends CommonProps {
}

export interface CognitoOutput {
  userPoolId: string;
  userPoolClientId: string;
  identityPoolId: string;
}
