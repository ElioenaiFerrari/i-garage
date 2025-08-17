<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		Car,
		Plus,
		Fuel,
		Wrench,
		TrendingUp,
		Calendar,
		Activity,
		DollarSign
	} from 'lucide-svelte';

	export let data: {
		vehicles: any[];
		recentFuelRecords: any[];
		upcomingMaintenance: any[];
		stats: {
			totalVehicles: number;
			totalKm: number;
			recentExpenses: number;
			pendingMaintenance: number;
		};
	};

	let isLoaded = false;

	onMount(() => {
		setTimeout(() => {
			isLoaded = true;
		}, 100);
	});

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(value);
	};

	const formatKm = (km: number) => {
		return new Intl.NumberFormat('pt-BR').format(km) + ' km';
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
	};
</script>

<div class="space-y-8">
	<!-- Header -->
	<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
		<div>
			<h1 class="mb-2 text-3xl font-bold text-gray-900">Dashboard</h1>
			<p class="text-gray-600">Visão geral dos seus veículos</p>
		</div>
		<div class="mt-4 lg:mt-0">
			<button
				on:click={() => goto('/vehicles/new')}
				class="btn-primary flex items-center space-x-2"
			>
				<Plus size={20} />
				<span>Novo Veículo</span>
			</button>
		</div>
	</div>

	<!-- Statistics Cards -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		<!-- Total Vehicles -->
		<div class="card-automotive {isLoaded ? 'subtle-fade-in' : 'opacity-0'}">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600">
						<Car size={20} class="text-gray-900" />
					</div>
				</div>
				<div class="ml-5 w-0 flex-1">
					<dl>
						<dt class="truncate text-sm font-medium text-gray-600">Total de Veículos</dt>
						<dd class="text-lg font-medium text-gray-900">
							{data?.stats?.totalVehicles || 0}
						</dd>
					</dl>
				</div>
			</div>
		</div>

		<!-- Total KM -->
		<div class="card-automotive {isLoaded ? 'subtle-fade-in' : 'opacity-0'}">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600">
						<TrendingUp size={20} class="text-gray-900" />
					</div>
				</div>
				<div class="ml-5 w-0 flex-1">
					<dl>
						<dt class="truncate text-sm font-medium text-gray-600">KM Total</dt>
						<dd class="text-lg font-medium text-gray-900">
							{formatKm(data?.stats?.totalKm || 0)}
						</dd>
					</dl>
				</div>
			</div>
		</div>

		<!-- Recent Expenses -->
		<div class="card-automotive {isLoaded ? 'subtle-fade-in' : 'opacity-0'}">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600">
						<DollarSign size={20} class="text-gray-900" />
					</div>
				</div>
				<div class="ml-5 w-0 flex-1">
					<dl>
						<dt class="truncate text-sm font-medium text-gray-600">Gastos Recentes</dt>
						<dd class="text-lg font-medium text-gray-900">
							{formatCurrency(data?.stats?.recentExpenses || 0)}
						</dd>
					</dl>
				</div>
			</div>
		</div>

		<!-- Pending Maintenance -->
		<div class="card-automotive {isLoaded ? 'subtle-fade-in' : 'opacity-0'}">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600">
						<Activity size={20} class="text-gray-900" />
					</div>
				</div>
				<div class="ml-5 w-0 flex-1">
					<dl>
						<dt class="truncate text-sm font-medium text-gray-600">Manutenções Pendentes</dt>
						<dd class="text-lg font-medium text-gray-900">
							{data?.stats?.pendingMaintenance || 0}
						</dd>
					</dl>
				</div>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<!-- Recent Vehicles -->
		<div class="card-automotive {isLoaded ? 'subtle-fade-in' : 'opacity-0'}">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-bold text-gray-900">Meus Veículos</h2>
				<button
					on:click={() => goto('/vehicles')}
					class="text-sm font-medium text-purple-600 transition-colors hover:text-purple-700"
				>
					Ver todos
				</button>
			</div>

			<div class="space-y-4">
				{#each data?.vehicles || [] as vehicle}
					<div
						class="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
						on:click={() => goto(`/vehicles/${vehicle.id}`)}
						on:keypress={(e) => e.key === 'Enter' && goto(`/vehicles/${vehicle.id}`)}
						role="button"
						tabindex="0"
					>
						<div class="flex items-center justify-between">
							<div>
								<h3 class="font-semibold text-gray-900">{vehicle.name}</h3>
								<p class="text-sm text-gray-600">
									{vehicle.brand}
									{vehicle.model} ({vehicle.year})
								</p>
								<p class="text-xs text-gray-500">Placa: {vehicle.plate}</p>
							</div>
							<div class="text-right">
								<p class="text-sm font-medium text-gray-900">{formatKm(vehicle.currentKm)}</p>
								<Car size={24} class="mt-1 ml-auto text-purple-600" />
							</div>
						</div>
					</div>
				{/each}
			</div>

			<div class="mt-6 grid grid-cols-2 gap-4">
				<button
					on:click={() => goto('/fuel')}
					class="btn-secondary flex items-center justify-center space-x-2"
				>
					<Fuel size={16} />
					<span>Abastecer</span>
				</button>
				<button
					on:click={() => goto('/maintenance')}
					class="btn-secondary flex items-center justify-center space-x-2"
				>
					<Wrench size={16} />
					<span>Manutenção</span>
				</button>
			</div>
		</div>

		<!-- Recent Activity -->
		<div class="space-y-6">
			<!-- Recent Fuel Records -->
			<div class="card-automotive {isLoaded ? 'subtle-fade-in' : 'opacity-0'}">
				<div class="mb-6 flex items-center justify-between">
					<h2 class="text-xl font-bold text-gray-900">Abastecimentos Recentes</h2>
					<button
						on:click={() => goto('/fuel')}
						class="text-sm font-medium text-purple-600 transition-colors hover:text-purple-700"
					>
						Ver todos
					</button>
				</div>

				<div class="space-y-4">
					{#each data?.recentFuelRecords || [] as record}
						<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
							<div class="flex items-center justify-between">
								<div>
									<h3 class="font-semibold text-gray-900">{record.vehicleName}</h3>
									<p class="text-sm text-gray-600">{formatDate(record.date)}</p>
									<p class="text-xs text-gray-500">{formatKm(record.km)}</p>
								</div>
								<div class="text-right">
									<p class="text-sm font-medium text-gray-900">{formatCurrency(record.value)}</p>
									<p class="text-xs text-gray-600">{record.liters}L</p>
									<Fuel size={20} class="mt-1 ml-auto text-purple-600" />
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Upcoming Maintenance -->
			<div class="card-automotive {isLoaded ? 'subtle-fade-in' : 'opacity-0'}">
				<div class="mb-6 flex items-center justify-between">
					<h2 class="text-xl font-bold text-gray-900">Manutenções Próximas</h2>
					<button
						on:click={() => goto('/maintenance')}
						class="text-sm font-medium text-purple-600 transition-colors hover:text-purple-700"
					>
						Ver todas
					</button>
				</div>

				<div class="space-y-4">
					{#each data?.upcomingMaintenance || [] as maintenance}
						<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
							<div class="flex items-center justify-between">
								<div>
									<h3 class="font-semibold text-gray-900">{maintenance.vehicleName}</h3>
									<p class="text-sm text-gray-600">{maintenance.type}</p>
									<p class="text-xs text-gray-500">{formatDate(maintenance.date)}</p>
								</div>
								<div class="text-right">
									<p class="text-sm font-medium text-gray-900">{formatKm(maintenance.km)}</p>
									<div class="mt-1 flex items-center">
										<Calendar size={16} class="mr-1 text-purple-600" />
										<span class="text-xs text-gray-600">Programada</span>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
