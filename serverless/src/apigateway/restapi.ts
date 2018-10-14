import { RestApi, EndpointType } from '@aws-cdk/aws-apigateway';
import { Construct } from "@aws-cdk/cdk";
import { ApiGatewayInput } from ".";

export default (parent: Construct, _props: ApiGatewayInput) => new RestApi(
  parent,
  'ApiGatewayResource',
  {
    restApiName: `prefix(props)-api`,
    endpointTypes: [
      EndpointType.Regional,
    ]
  },
);
