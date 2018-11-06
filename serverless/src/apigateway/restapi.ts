import { RestApi, EndpointType } from '@aws-cdk/aws-apigateway';
import { Construct } from '@aws-cdk/cdk';
import { ApiGatewayInput } from '.';
import { prefix } from '@utils';
// import { PolicyDocument, PolicyStatement, PolicyStatementEffect } from '@aws-cdk/aws-iam';

export default (parent: Construct, props: ApiGatewayInput) => new RestApi(
  parent,
  'RestApiRestApi',
  {
    restApiName: `${prefix(props)}-api`,
    // endpointTypes
    endpointTypes: [
      EndpointType.Regional,
    ],
    // IP制限
    // policy: (() => {
    //   const policy = new PolicyDocument();

    //   policy.addStatement(
    //     new PolicyStatement(PolicyStatementEffect.Allow)
    //       .addAction('execute-api:Invoke')
    //       .addResource(`arn:aws:execute-api:${new AwsRegion()}:${new AwsAccountId()}:*`),
    //   );

    //   return policy;
    // })(),
  },
);
