import { Construct } from '@aws-cdk/cdk';
import { ApiGatewayInput, ApiGatewayOutput, Api } from '.';
import { Schema, Type, safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { SAM, ApiProperties } from 'typings/sam';
import { LAMBDA_FILE } from '@const';
import { getFunction } from '@lambda';
import { LambdaIntegration, IRestApiResource, RestApi, AuthorizationType, PassthroughBehavior } from '@aws-cdk/aws-apigateway';

export default (parent: Construct, props: ApiGatewayInput): ApiGatewayOutput => {
  const api = Api(parent, props);

  const subType = new Type('!Sub', {
    kind: 'scalar',
    resolve: data => (data),
  });

  const config: SAM = safeLoad(readFileSync(LAMBDA_FILE, 'utf-8'), {
    schema: Schema.create([subType]),
  });

  Object.keys(config.Resources).forEach((key) => {
    const resource = config.Resources[key];

    // Lambda Function以外処理しない
    if ('AWS::Serverless::Function' !== resource.Type) return;

    const { Events } = resource.Properties;
    // Event情報なし、対象外
    if (!Events) return;

    const event = Object.keys(Events).find(item => Events[item].Type === 'Api');
    // Api Eventなし
    if (!event) return;

    // Lambda Function作成
    const funcRef = getFunction(parent, props, key, resource);

    // Lambda Function追加
    addMethod(api, Events[event].Properties, new LambdaIntegration(funcRef, {
      integrationResponses: [{
        statusCode: '200',
      }],
      passthroughBehavior: PassthroughBehavior.WhenNoTemplates,
    }));
  });

  // config.
  // const authorizer = Authorizer(parent, {
  //   restApiId: api.restApiId,
  //   ...props,
  // });

  // const lambda = new Function(parent, 'xxxx', {
  //   code: dummyCode(parent),
  //   handler: 'app.handler',
  //   runtime: Runtime.NodeJS810,
  // });
  // const process = api.root.addResource('process');
  // process.addMethod(
  //   HttpMethod.GET, new LambdaIntegration(lambda, {

  //   }), {
  //     authorizationType: 'COGNITO_USER_POOLS' as AuthorizationType,
  //     apiKeyRequired: false,
  //     authorizerId: authorizer.ref,
  //   });

  // upload.addMethod(HttpMethod.POST, new LambdaIntegration(functionRef(parent, props.lambda['ImageToWord'])), {
  //   authorizationType: AuthorizationType.IAM,
  // });

  // upload.addMethod(HttpMethod.PUT, new AwsIntegration({
  //   service: 's3',
  //   path: '{bucket}/users/{userId}/{item}',
  //   options: {
  //     credentialsRole: uploadRole(parent, props),
  //     requestParameters: {
  //       'integration.request.header.bucket': "'test'"
  //     },
  //     integrationResponses: [{
  //       statusCode: '200',
  //     }],
  //   }
  // }), IAM);
  // new Output(parent, 'RestApi', {
  //   export: `${prefix(props)}-RestApi`,
  //   value: api.restApiId,
  // });

  return { restApi: api };
};

const apis = {} as any;

/** Lambda Function */
const addMethod = (api: RestApi, { Method, Path }: ApiProperties, funcRef: LambdaIntegration) => {
  const paths = Path.split('/');

  let item: IRestApiResource = api.root;

  // Pathごとリソースを作成する
  paths.forEach((path) => {
    if (path === '') return;

    if (apis[path]) {
      item = apis[path].resource;
      return;
    }

    // 存在しないの場合、Rootから作成
    item = item ? item.addResource(path) : api.root.addResource(path);
    apis[path] = {
      resource: item,
    };
  });

  item.addMethod(Method, funcRef, {
    authorizationType: AuthorizationType.IAM,
  });
};
