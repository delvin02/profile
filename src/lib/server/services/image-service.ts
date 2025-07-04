export interface ImageService {
	upload(buffer: Buffer, filename: string): Promise<string>;
	delete(url: string): Promise<void>;
}
