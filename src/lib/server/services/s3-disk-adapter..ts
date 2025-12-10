import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import type { ImageService } from './image-service';
import { extname } from 'path';
import { env } from '$env/dynamic/private';

export class S3DiskAdapter implements ImageService {
	private client: S3Client;
	private bucket: string;
	private publicUrlBase: string;

	constructor() {
		const {
			AWS_S3_BUCKET,
			AWS_REGION,
			AWS_ACCESS_KEY_ID,
			AWS_SECRET_ACCESS_KEY,
			AWS_S3_PUBLIC_URL
		} = env;

		if (
			!AWS_S3_BUCKET ||
			!AWS_REGION ||
			!AWS_ACCESS_KEY_ID ||
			!AWS_SECRET_ACCESS_KEY ||
			!AWS_S3_PUBLIC_URL
		) {
			throw new Error(
				'Missing one of AWS_S3_BUCKET, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, or AWS_S3_PUBLIC_URL'
			);
		}

		this.bucket = AWS_S3_BUCKET;
		this.publicUrlBase = AWS_S3_PUBLIC_URL.replace(/\/$/, '');

		this.client = new S3Client({
			region: AWS_REGION,
			credentials: {
				accessKeyId: AWS_ACCESS_KEY_ID,
				secretAccessKey: AWS_SECRET_ACCESS_KEY
			}
		});
	}

	/**
	 * Uploads the buffer to S3 under uploads/<filename>
	 * and returns its public URL.
	 */
	async upload(buffer: Buffer, filename: string) {
		const key = `uploads/${filename}-${Date.now()}`;

		const ext = this.getExtension(filename);
		const contentType = this.getContentType(filename);

		const contentDisposition = ext === '.pdf' ? 'inline' : undefined;

		await this.client.send(
			new PutObjectCommand({
				Bucket: this.bucket,
				Key: key,
				Body: buffer,
				ContentType: contentType,
				...(contentDisposition && { ContentDisposition: contentDisposition })
			})
		);

		return `${this.publicUrlBase}/${key}`;
	}

	private getContentType(filename: string): string {
		const ext = this.getExtension(filename);
		if (ext === '.pdf') return 'application/pdf';
		if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
		if (ext === '.png') return 'image/png';
		if (ext === '.gif') return 'image/gif';
		return 'application/octet-stream';
	}

	private getExtension(filename: string): string {
		return extname(filename).toLowerCase();
	}

	/**
	 * Deletes the object at that URL (strips the bucket base URL).
	 */
	async delete(url: string) {
		const key = url.replace(`${this.publicUrlBase}/`, '');

		await this.client.send(
			new DeleteObjectCommand({
				Bucket: this.bucket,
				Key: key
			})
		);
	}
}
