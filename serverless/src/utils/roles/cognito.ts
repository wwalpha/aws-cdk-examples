import { Role, Policy, FederatedPrincipal, PolicyStatement, PolicyStatementEffect } from '@aws-cdk/aws-iam';
import { Construct } from '@aws-cdk/cdk';
import { RoleProps } from '.';
import { prefix } from '@utils';

/** Cognito未認証ロール */
export const unauthenticatedRole = (parent: Construct, identityPool: string, props: UnauthenticatedRoleProps): Role => {
  const principal = new FederatedPrincipal(
    'cognito-identity.amazonaws.com',
    {
      StringEquals: { 'cognito-identity.amazonaws.com:aud': identityPool },
      'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'unauthenticated' },
    },
    'sts:AssumeRoleWithWebIdentity',
  );

  const role = new Role(parent, props.roleName, {
    roleName: `${prefix(props)}-Cognito-${props.roleName}`,
    assumedBy: principal,
  });

  const policyStmt = new PolicyStatement(PolicyStatementEffect.Allow);
  policyStmt.addActions('mobileanalytics:PutEvents', 'cognito-sync:*');
  policyStmt.addResource('*');

  const policy = new Policy(parent, props.policyName, {
    policyName: `${prefix(props)}-${props.policyName}`,
    statements: [policyStmt],
  });

  policy.attachToRole(role);

  return role;
};

/** Cognito認証済 */
export const authenticatedRole = (parent: Construct, identityPool: string, props: AuthenticatedRoleProps): Role => {
  const principal = new FederatedPrincipal(
    'cognito-identity.amazonaws.com',
    {
      StringEquals: { 'cognito-identity.amazonaws.com:aud': identityPool },
      'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'authenticated' },
    },
    'sts:AssumeRoleWithWebIdentity',
  );

  const role = new Role(parent, props.roleName, {
    roleName: `${prefix(props)}-Cognito-${props.roleName}`,
    assumedBy: principal,
  });

  const stmt = new PolicyStatement(PolicyStatementEffect.Allow);
  stmt.addActions('mobileanalytics:PutEvents', 'cognito-sync:*', 'cognito-identity:*', 'execute-api:Invoke');
  stmt.addResource('*');

  const policy = new Policy(parent, props.policyName, {
    policyName: `${prefix(props)}-${props.policyName}`,
    statements: [stmt],
  });

  policy.attachToRole(role);

  return role;
};

export interface UnauthenticatedRoleProps extends RoleProps {
  // UnauthenticatedPolicy
  policyName: string;
}

export interface AuthenticatedRoleProps extends RoleProps {
  // UnauthenticatedPolicy
  policyName: string;
}
