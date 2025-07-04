import { mkdir, writeFile, rm } from 'fs/promises';
import path from 'path';
import type { ImageService } from './image-service';

export class LocalDiskAdapter implements ImageService {
	private uploadDir = path.join(process.cwd(), 'static', 'uploads');

	constructor() {
		mkdir(this.uploadDir, { recursive: true }).catch(() => {});
	}

	async upload(buffer: Buffer, filename: string) {
		const dest = path.join(this.uploadDir, filename);
		await writeFile(dest, buffer);
		return `/uploads/${filename}`;
	}

	async delete(url: string) {
		// strip leading slash and any query
		const key = url.replace(/^\//, '').split('?')[0];
		await rm(path.join(process.cwd(), key), { force: true });
	}
}
