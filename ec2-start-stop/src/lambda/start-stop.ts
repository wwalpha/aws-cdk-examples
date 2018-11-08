import { EC2 } from 'aws-sdk';
import { Callback } from 'aws-lambda';

const ec2 = new EC2();

export const handler = (event: any, _: any, callback: Callback) => {
  // EC2起動
  if (event.action === 'start') {
    start()
      .then(() => callback(null, 'Instances Started...'))
      .catch((err) => {
        console.log(err);
        callback(err, null);
      });
  }
  // EC2停止
  if (event.action === 'stop') {
    stop()
      .then(() => callback(null, 'Instances Stoped...'))
      .catch((err) => {
        console.log(err);
        callback(err, null);
      });
  }
};

/** EC2停止 */
const stop = async () => {
  const { Reservations: reservations } = await ec2.describeInstances().promise();

  if (!reservations) return;

  const stopInstances: string[] = [];

  reservations.forEach((item) => {
    if (!item.Instances) return;

    item.Instances.forEach((instance) => {
      // 0 : pending
      // 16 : running
      // 32 : shutting-down
      // 48 : terminated
      // 64 : stopping
      // 80 : stopped
      if (!instance.State || !instance.InstanceId) return;

      if (instance.State.Code === 16) {
        stopInstances.push(instance.InstanceId);
      }
    });
  });

  // 停止対象あり
  if (stopInstances.length > 0) {
    await ec2.stopInstances({
      InstanceIds: stopInstances,
      Force: true,
    }).promise();
  }
};

/** EC2起動 */
const start = async () => {
  // 環境変数から起動対象を取得する
  const instances = (process.env.START_INSTANCES as string).split(',');

  // EC2起動する
  await ec2.startInstances({
    InstanceIds: instances,
  }).promise();
};
