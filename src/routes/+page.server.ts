import { redirect } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';

export async function load({ cookies }: { cookies: Cookies }) {
	// Verifica se o usuário já está logado
	const user = cookies.get('user');
	if (user) {
		throw redirect(302, '/dashboard');
	}

	return {};
}
