import { join } from 'path';

export const DISTRIBUTION_FILE = join(__dirname, '../configs/cloudfront-distribution.yml');
export const LAMBDA_FILE = join(__dirname, '../configs/lambda/template.yml');

const ENV_TYPE = 'dev';
const PROJECT_NAME = 'Serverless';

/** Project Name */
export const getProjectName = () => `${ENV_TYPE}-${PROJECT_NAME}`;
/** Bucket Name */
export const getBucketName = (name: string) => `${ENV_TYPE}-${PROJECT_NAME.toLowerCase()}-${name}`;
/** Resource Name */
export const getResourceName = (name: string, split: string = '-') => `${ENV_TYPE}${split}${PROJECT_NAME}${split}${name}`;
/** Role Name */
export const getRoleName = (name: string, service: string, split: string = '-') => `${ENV_TYPE}${split}${PROJECT_NAME}${split}${service}${split}${name}`;
