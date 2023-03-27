import { ConfigModule } from '@nestjs/config';

export async function getStorageModule() {
  await ConfigModule.envVariablesLoaded; // ensures that the file was loaded before interacting with the process.env object
  return process.env.STORAGE === 'S3' ? 'S3StorageModule' : 'DefaultStorageModule';
}
