import { CommonProps } from '.';

// tslint:disable-next-line:variable-name
export const HttpMethod = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
};

export const bucketName = (props: CommonProps) => `${props.envType}-${props.project.toLowerCase()}-example`;

export const prefix = (props: CommonProps) => `${props.envType}-${props.project}`;
