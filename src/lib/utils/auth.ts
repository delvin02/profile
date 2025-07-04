import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

/**
 * Hash a plaintext password.
 * @param password the user’s raw password
 * @returns a bcrypt hash you can safely store in your database
 */
export async function hashPassword(password: string): Promise<string> {
	return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plaintext password against a stored hash.
 * @param password the user’s raw password attempt
 * @param hash the bcrypt hash from your DB
 * @returns true if they match, false otherwise
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return await bcrypt.compare(password, hash);
}
