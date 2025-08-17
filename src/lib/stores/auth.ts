import { writable } from 'svelte/store';

export interface User {
	id: string;
	email: string;
	name: string;
}

export const user = writable<User | null>(null);
export const isAuthenticated = writable(false);

export const login = (userData: User) => {
	user.set(userData);
	isAuthenticated.set(true);
	localStorage.setItem('user', JSON.stringify(userData));
};

export const logout = () => {
	user.set(null);
	isAuthenticated.set(false);
	localStorage.removeItem('user');
};

export const checkAuth = () => {
	const storedUser = localStorage.getItem('user');
	if (storedUser) {
		const userData = JSON.parse(storedUser);
		user.set(userData);
		isAuthenticated.set(true);
	}
};
