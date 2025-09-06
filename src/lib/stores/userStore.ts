import { writable, type Writable } from 'svelte/store';

export type User = {
	id: number;
	name: string;
	email: string;
	subdomain: string;
	profilePictureUrl: string | null;
	linkedInUrl: string | null;
	resumeUrl: string | null;
	blogHeadline: string | null;
};

class UserStore {
	private currentUser: Writable<User>;
	private loggedIn: Writable<boolean>;

	constructor() {
		this.currentUser = writable<User>();
		this.loggedIn = writable(false);
	}

	async refreshUser() {
		try {
			const res = await fetch('/api/user', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			});

			if (!res.ok) {
				console.error('Failed to fetch user', res.statusText);
				return;
			}

			const { user, isLoggedIn } = await res.json();
			this.currentUser.set(user);
			this.loggedIn.set(isLoggedIn);
		} catch (err) {
			console.error('Error refreshing user', err);
		}
	}

	setUser(user: User) {
		this.currentUser.set(user);
	}

	setIsLoggedIn(isLogin: boolean) {
		this.isLoggedIn.set(isLogin);
	}

	get user() {
		return this.currentUser;
	}

	get isLoggedIn() {
		return this.loggedIn;
	}
}

export const userStore = new UserStore();
