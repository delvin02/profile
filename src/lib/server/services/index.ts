import { LocalDiskAdapter } from './local-disk-adapter';
import { S3DiskAdapter } from './s3-disk-adapter.';
import { env } from '$env/dynamic/private';

const fileService = env.PRODUCTION === '1' ? new S3DiskAdapter() : new LocalDiskAdapter();
export default fileService;
