import { Stack, App, StackProps } from "@aws-cdk/cdk";
import { VpcNetwork, SecurityGroup } from "@ec2";
import { AmazonLinuxImage, AmazonLinuxGeneration, AmazonLinuxVirt, AmazonLinuxEdition, AmazonLinuxStorage } from "@aws-cdk/aws-ec2";

export default class EC2Stack extends Stack {

  constructor(parent?: App, name?: string, props?: StackProps) {
    super(parent, name, props);

    // VPC作成
    const vpc = VpcNetwork(this);

    // セキュリティグループ作成
    SecurityGroup(this, vpc);

    new AmazonLinuxImage({
      generation: AmazonLinuxGeneration.AmazonLinux2,
      virtualization: AmazonLinuxVirt.HVM,
      edition: AmazonLinuxEdition.Standard,
      storage: AmazonLinuxStorage.EBS,
    })
  }
}