import { Construct } from '@aws-cdk/cdk';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { RoleProps } from '.';
import { prefix } from '@utils';
import { cloudwatch } from '@utils/policy';

/** Lambda基本ロール */
export default (parent: Construct, props: RoleProps): Role => {
  const role = new Role(parent, `${props.roleName}`, {
    roleName: `${prefix(props)}-Lambda-${props.roleName}`,
    assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
  });

  role.attachInlinePolicy(cloudwatch(parent, props.roleName));

  return role;
};
