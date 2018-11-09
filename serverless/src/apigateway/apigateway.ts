import { Output, Stack, App } from '@aws-cdk/cdk';
import { ApiGatewayInput, ApiGatewayOutput, Api } from '.';
import { Schema, Type, safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { SAM, ApiProperties } from 'typings/sam';
import { LAMBDA_FILE, getResourceName } from '@const';
import { LambdaIntegration, IRestApiResource, RestApi, AuthorizationType, PassthroughBehavior } from '@aws-cdk/aws-apigateway';
import { getFunction } from '@utils/lambda';

export default class ApiGatewayStack extends Stack {
  public readonly apiOutput: ApiGatewayOutput;

  constructor(parent: App, name: string, props: ApiGatewayInput) {
    super(parent, name, props);

    const api = Api(this);

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
      const funcRef = getFunction(this, key, resource);

      // Lambda Function追加
      addMethod(api, Events[event].Properties, new LambdaIntegration(funcRef, {
        integrationResponses: [{
          statusCode: '200',
        }],
        passthroughBehavior: PassthroughBehavior.WhenNoTemplates,
      }));
    });

    // Ouput
    new Output(this, 'RestApiId', {
      export: getResourceName('RestApiId'),
      value: api.restApiId,
    });

    this.apiOutput = {
      restApi: api,
    };
  }
}

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
