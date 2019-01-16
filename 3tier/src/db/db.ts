import { Stack, App } from '@aws-cdk/cdk';
import { DBStackProps, DBProps } from '@db';
import { VpcNetwork } from '@aws-cdk/aws-ec2';
import { CfnDBSubnetGroup, CfnDBInstance } from '@aws-cdk/aws-rds';
import { getResourceName } from '@const';
import { createSecurityGroup } from '@utils';

export default class DBStack extends Stack {

  public readonly outputs: DBProps;

  constructor(parent?: App, name?: string, props?: DBStackProps) {
    super(parent, name, props);

    if (!props) return;

    // Cross Stack Import
    const vpc = VpcNetwork.import(this, 'vpc', props.vpc);

    const subnetIds = vpc.isolatedSubnets
      .filter(item => item.node.id.startsWith('db'))
      .map(item => item.subnetId);

    const cfnSubnet = new CfnDBSubnetGroup(this, 'cfnSubnet', {
      dbSubnetGroupName: getResourceName('dbSubnet'),
      subnetIds,
      dbSubnetGroupDescription: 'DB Subnet Group',
    });

    const sg = createSecurityGroup(this, vpc, 'db-sg');
    // DatabaseCluster
    const db = new CfnDBInstance(this, 'RDS', {
      allowMajorVersionUpgrade: false,
      autoMinorVersionUpgrade: false,
      engine: 'postgres',
      engineVersion: '10.4',
      dbInstanceClass: 'db.t2.micro',
      dbInstanceIdentifier: getResourceName('postgres'),
      dbName: 'postgres',
      masterUsername: 'wwalpha',
      masterUserPassword: 'session10',
      allocatedStorage: '20',
      dbSubnetGroupName: cfnSubnet.dbSubnetGroupName,
      vpcSecurityGroups: [sg.securityGroupId],
      deletionProtection: false,
      multiAz: false,
      backupRetentionPeriod: '0',
    });

    this.outputs = {
      endpoint: db.dbInstanceEndpointAddress,
      dbSecurityGroup: sg,
    };
  }
}
