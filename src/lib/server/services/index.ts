import { LocalDiskAdapter } from './local-disk-adapter';
import { S3DiskAdapter } from './s3-disk-adapter.';
import { env } from '$env/dynamic/private';

console.log('hagha', env.PRODUCTION === '1');
const imageService = env.PRODUCTION === '1' ? new S3DiskAdapter() : new LocalDiskAdapter();
export default imageService;
