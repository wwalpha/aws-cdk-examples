import { Construct } from "@aws-cdk/cdk";
import { AwsIntegration, AuthorizationType, MethodOptions } from "@aws-cdk/aws-apigateway";
import { Role, ServicePrincipal } from "@aws-cdk/aws-iam";
import { HttpMethod, bucketName, prefix, } from "../utils/consts";
import { s3 } from "../utils/policy";
import { RestApi, ApiGatewayInput, ApiGatewayOutput } from ".";

export default (parent: Construct, props: ApiGatewayInput): ApiGatewayOutput => {
  const api = RestApi(parent, props);

  const upload = api.root.addResource('upload');

  // upload.addMethod(HttpMethod.POST, new LambdaIntegration(functionRef(parent, props.lambda['ImageToWord'])), {
  //   authorizationType: AuthorizationType.IAM,
  // });

  upload.addMethod(HttpMethod.PUT, new AwsIntegration({
    service: 's3',
    path: '{bucket}/users/{userId}/{item}',
    options: {
      credentialsRole: uploadRole(parent, props),
      requestParameters: {
        'integration.request.header.bucket': "'test'"
      },
      integrationResponses: [{
        statusCode: '200',
      }],
    }
  }), IAM);

  return {}
}

const IAM: MethodOptions = { authorizationType: AuthorizationType.IAM };

const uploadRole = (parent: Construct, props: ApiGatewayInput): Role => {
  const role = new Role(parent, `${prefix(props)}-UploadMethodRole`, {
    assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
  });

  role.attachInlinePolicy(s3(parent, `UploadMethodPolicy`, bucketName(props)));

  return role;
}
