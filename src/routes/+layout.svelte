<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { isAuthenticated, checkAuth, logout } from '$lib/stores/auth';
	import { Car, Home, Fuel, Wrench, MessageCircle, LogOut, Menu, X, Gauge } from 'lucide-svelte';

	let { children } = $props();
	let isDrawerOpen = $state(false);

	const toggleDrawer = () => {
		isDrawerOpen = !isDrawerOpen;
	};

	const handleLogout = () => {
		logout();
		goto('/login');
		isDrawerOpen = false;
	};

	const navigation = [
		{ name: 'Dashboard', href: '/dashboard', icon: Home },
		{ name: 'Veículos', href: '/vehicles', icon: Car },
		{ name: 'Abastecimento', href: '/fuel', icon: Fuel },
		{ name: 'Manutenção', href: '/maintenance', icon: Wrench },
		{ name: 'Tião Mecânico', href: '/tiao', icon: MessageCircle }
	];

	onMount(() => {
		checkAuth();
	});

	const isLoginPage = $derived($page.url.pathname === '/login' || $page.url.pathname === '/');
	const currentPath = $derived($page.url.pathname);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>i-Garage - Gestão Automotiva</title>
</svelte:head>

{#if !isLoginPage && $isAuthenticated}
	<!-- Mobile menu button -->
	<div class="fixed top-4 left-4 z-50 lg:hidden">
		<button onclick={toggleDrawer} class="btn-primary rounded-lg p-2">
			{#if isDrawerOpen}
				<X size={24} />
			{:else}
				<Menu size={24} />
			{/if}
		</button>
	</div>

	<!-- Overlay for mobile -->
	{#if isDrawerOpen}
		<div
			class="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden"
			onclick={toggleDrawer}
			onkeydown={(e) => e.key === 'Escape' && toggleDrawer()}
			role="button"
			tabindex="0"
		></div>
	{/if}

	<!-- Drawer -->
	<div
		class={`navbar-automotive fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
			isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
		} lg:translate-x-0`}
	>
		<div class="flex h-full flex-col">
			<!-- Logo -->
			<div class="flex items-center border-b border-gray-200 p-6">
				<div class="flex items-center space-x-3">
					<div class="text-purple-600">
						<Gauge size={32} />
					</div>
					<div>
						<h1 class="text-xl font-bold text-gray-900">i-Garage</h1>
						<p class="text-sm text-gray-600">Gestão Automotiva</p>
					</div>
				</div>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 space-y-2 px-4 py-6">
				{#each navigation as item}
					<a
						href={item.href}
						class={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 ${
							currentPath === item.href
								? 'bg-purple-600 text-gray-900 shadow-sm'
								: 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
						}`}
						onclick={() => (isDrawerOpen = false)}
					>
						<svelte:component this={item.icon} class="mr-3" size={20} />
						{item.name}
					</a>
				{/each}
			</nav>

			<!-- User section -->
			<div class="border-t border-gray-200 p-4">
				<button
					onclick={handleLogout}
					class="flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
				>
					<LogOut class="mr-3" size={20} />
					Sair
				</button>
			</div>
		</div>
	</div>

	<!-- Main content -->
	<div class="min-h-screen bg-gray-50 lg:ml-64">
		<main class="p-4 lg:p-8">
			{@render children?.()}
		</main>
	</div>
{:else}
	<!-- Login layout -->
	<main class="min-h-screen bg-gray-50">
		{@render children?.()}
	</main>
{/if}

{#if !isLoginPage && $isAuthenticated}
	<!-- Mobile menu button -->
	<div class="fixed top-4 left-4 z-50 lg:hidden">
		<button onclick={toggleDrawer} class="btn-primary rounded-lg p-2">
			{#if isDrawerOpen}
				<X size={24} />
			{:else}
				<Menu size={24} />
			{/if}
		</button>
	</div>

	<!-- Overlay for mobile -->
	{#if isDrawerOpen}
		<div
			class="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden"
			onclick={toggleDrawer}
			onkeydown={(e) => e.key === 'Escape' && toggleDrawer()}
			role="button"
			tabindex="0"
		></div>
	{/if}

	<!-- Drawer -->
	<div
		class={`navbar-automotive fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
			isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
		} lg:translate-x-0`}
	>
		<div class="flex h-full flex-col">
			<!-- Logo -->
			<div class="flex items-center border-b border-gray-200 p-6">
				<div class="flex items-center space-x-3">
					<div class="text-purple-600">
						<Gauge size={32} />
					</div>
					<div>
						<h1 class="text-xl font-bold text-gray-900">i-Garage</h1>
						<p class="text-sm text-gray-600">Gestão Automotiva</p>
					</div>
				</div>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 space-y-2 px-4 py-6">
				{#each navigation as item}
					<a
						href={item.href}
						class={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 ${
							currentPath === item.href
								? 'bg-purple-600 text-white shadow-sm'
								: 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
						}`}
						onclick={() => (isDrawerOpen = false)}
					>
						<svelte:component this={item.icon} class="mr-3" size={20} />
						{item.name}
					</a>
				{/each}
			</nav>

			<!-- User section -->
			<div class="border-t border-gray-200 p-4">
				<button
					onclick={handleLogout}
					class="flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
				>
					<LogOut class="mr-3" size={20} />
					Sair
				</button>
			</div>
		</div>
	</div>

	<!-- Main content -->
	<div class="min-h-screen bg-gray-50 lg:ml-64">
		<main class="p-4 lg:p-8">
			{@render children?.()}
		</main>
	</div>
{:else}
	<!-- Login layout -->
	<main class="min-h-screen bg-gray-50">
		{@render children?.()}
	</main>
{/if}
