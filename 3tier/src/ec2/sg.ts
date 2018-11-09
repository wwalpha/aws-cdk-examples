import { Construct } from "@aws-cdk/cdk";
import { SecurityGroup, VpcNetwork, TcpPort, AnyIPv4 } from "@aws-cdk/aws-ec2";

export default (parent: Construct, vpc: VpcNetwork) => {
  const sg1 = new SecurityGroup(
    parent,
    'SecurityGroup',
    {
      vpc,
      allowAllOutbound: true,
    },
  );

  // route rule
  sg1.addIngressRule(new AnyIPv4(), new TcpPort(22));
}