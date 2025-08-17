<script lang="ts">
	import { goto } from '$app/navigation';
	import { login } from '$lib/stores/auth';
	import { Car, Mail, Lock, LogIn } from 'lucide-svelte';

	let email = '';
	let password = '';
	let isLoading = false;
	let error = '';

	const handleSubmit = async () => {
		if (!email || !password) {
			error = 'Por favor, preencha todos os campos.';
			return;
		}

		isLoading = true;
		error = '';

		try {
			// Simulação de login (em um app real, isso seria uma chamada à API)
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Mock user data
			const userData = {
				id: '1',
				email,
				name: email.split('@')[0]
			};

			login(userData);
			goto('/dashboard');
		} catch (err) {
			error = 'Erro ao fazer login. Tente novamente.';
		} finally {
			isLoading = false;
		}
	};

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			handleSubmit();
		}
	};
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 p-4">
	<!-- Background pattern -->
	<div class="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-purple-50"></div>

	<!-- Login form -->
	<div class="card-automotive relative z-10 w-full max-w-md">
		<!-- Header -->
		<div class="mb-8 text-center">
			<div class="mb-4 flex justify-center">
				<div class="text-purple-600">
					<Car size={48} />
				</div>
			</div>
			<h1 class="mb-2 text-3xl font-bold text-gray-900">i-Garage</h1>
			<p class="text-gray-600">Gestão Inteligente de Veículos</p>
		</div>

		<!-- Error message -->
		{#if error}
			<div class="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
				{error}
			</div>
		{/if}

		<!-- Form -->
		<form on:submit|preventDefault={handleSubmit} class="space-y-6">
			<!-- Email field -->
			<div>
				<label for="email" class="mb-2 block text-sm font-medium text-gray-700"> Email </label>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<Mail size={20} class="text-gray-400" />
					</div>
					<input
						id="email"
						type="email"
						bind:value={email}
						on:keypress={handleKeyPress}
						placeholder="seu@email.com"
						class="input-automotive w-full pl-10"
						required
					/>
				</div>
			</div>

			<!-- Password field -->
			<div>
				<label for="password" class="mb-2 block text-sm font-medium text-gray-700"> Senha </label>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<Lock size={20} class="text-gray-400" />
					</div>
					<input
						id="password"
						type="password"
						bind:value={password}
						on:keypress={handleKeyPress}
						placeholder="••••••••"
						class="input-automotive w-full pl-10"
						required
					/>
				</div>
			</div>

			<!-- Submit button -->
			<button
				type="submit"
				disabled={isLoading}
				class="btn-primary flex w-full items-center justify-center space-x-2 {isLoading
					? 'cursor-not-allowed opacity-50'
					: ''}"
			>
				{#if isLoading}
					<div
						class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
					></div>
					<span>Entrando...</span>
				{:else}
					<LogIn size={20} />
					<span>Entrar</span>
				{/if}
			</button>
		</form>

		<!-- Demo credentials -->
		<div class="mt-8 rounded-lg border border-purple-200 bg-purple-50 p-4">
			<p class="mb-2 text-center text-sm text-gray-700">
				<strong>Demo:</strong> Use qualquer email e senha para entrar
			</p>
			<p class="text-center text-xs text-gray-500">Ex: admin@igarage.com / 123456</p>
		</div>
	</div>
</div>
