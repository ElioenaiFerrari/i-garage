<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Car, Plus, Fuel, Wrench, Eye, Trash2, Calendar } from 'lucide-svelte';

	export let data;

	let isLoaded = false;

	onMount(() => {
		setTimeout(() => {
			isLoaded = true;
		}, 100);
	});

	const formatKm = (km: number) => {
		return new Intl.NumberFormat('pt-BR').format(km) + ' km';
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
	};

	const handleDeleteVehicle = (vehicleId: string, vehicleName: string) => {
		if (confirm(`Tem certeza que deseja excluir o veículo "${vehicleName}"?`)) {
			// Em uma aplicação real, isso seria uma chamada à API
			console.log('Excluindo veículo:', vehicleId);
			// Aqui você removeria o veículo da lista
		}
	};
</script>

<div class="space-y-8">
	<!-- Header -->
	<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
		<div>
			<h1 class="mb-2 text-3xl font-bold text-gray-900">Meus Veículos</h1>
			<p class="text-gray-600">Gerencie sua frota de veículos</p>
		</div>
		<div class="mt-4 lg:mt-0">
			<button
				on:click={() => goto('/vehicles/new')}
				class="btn-primary flex items-center space-x-2"
			>
				<Plus size={20} />
				<span>Cadastrar Veículo</span>
			</button>
		</div>
	</div>

	<!-- Vehicles Grid -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each data.vehicles as vehicle, index}
			<div class="card-automotive {isLoaded ? 'subtle-fade-in' : 'opacity-0'}">
				<!-- Vehicle Header -->
				<div class="mb-4 flex items-start justify-between">
					<div class="flex items-center space-x-3">
						<div>
							<Car size={32} class="text-purple-600" />
						</div>
						<div>
							<h3 class="text-lg font-bold text-gray-900">{vehicle.name}</h3>
							<p class="text-sm text-gray-600">{vehicle.brand} {vehicle.model}</p>
						</div>
					</div>

					<!-- Actions Dropdown -->
					<div class="group relative">
						<button
							class="rounded p-1 text-gray-500 transition-colors hover:text-gray-700"
							aria-label="Opções do veículo"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
								<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
								<path d="M10 4a2 2 0 100-4 2 2 0 000 4z" />
								<path d="M10 20a2 2 0 100-4 2 2 0 000 4z" />
							</svg>
						</button>

						<div
							class="invisible absolute top-8 right-0 z-10 w-40 rounded-lg border border-gray-200 bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100"
						>
							<button
								on:click={() => handleDeleteVehicle(vehicle.id, vehicle.name)}
								class="flex w-full items-center space-x-2 rounded-lg px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
							>
								<Trash2 size={16} />
								<span>Excluir</span>
							</button>
						</div>
					</div>
				</div>

				<!-- Vehicle Info -->
				<div class="mb-6 space-y-3">
					<div class="flex items-center justify-between">
						<span class="text-sm text-gray-600">Ano:</span>
						<span class="font-medium text-gray-900">{vehicle.year}</span>
					</div>

					<div class="flex items-center justify-between">
						<span class="text-sm text-gray-600">Placa:</span>
						<span class="font-medium text-gray-900">{vehicle.plate}</span>
					</div>

					<div class="flex items-center justify-between">
						<span class="text-sm text-gray-600">KM Atual:</span>
						<span class="font-medium text-gray-900">{formatKm(vehicle.currentKm)}</span>
					</div>

					<div class="flex items-center justify-between">
						<span class="text-sm text-gray-600">Cadastrado:</span>
						<span class="text-xs font-medium text-gray-900">{formatDate(vehicle.createdAt)}</span>
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="space-y-3">
					<button
						on:click={() => goto(`/vehicles/${vehicle.id}`)}
						class="btn-primary flex w-full items-center justify-center space-x-2"
					>
						<Eye size={16} />
						<span>Ver Detalhes</span>
					</button>

					<div class="grid grid-cols-2 gap-3">
						<button
							on:click={() => goto(`/fuel?vehicle=${vehicle.id}`)}
							class="btn-secondary flex items-center justify-center space-x-2 text-sm"
						>
							<Fuel size={14} />
							<span>Abastecer</span>
						</button>

						<button
							on:click={() => goto(`/maintenance?vehicle=${vehicle.id}`)}
							class="btn-secondary flex items-center justify-center space-x-2 text-sm"
						>
							<Wrench size={14} />
							<span>Manutenção</span>
						</button>
					</div>
				</div>
			</div>
		{/each}

		<!-- Add New Vehicle Card -->
		<div
			class="card-automotive cursor-pointer border-2 border-dashed border-gray-200 transition-colors hover:border-purple-500 {isLoaded
				? 'subtle-fade-in'
				: 'opacity-0'}"
			on:click={() => goto('/vehicles/new')}
			on:keypress={(e) => e.key === 'Enter' && goto('/vehicles/new')}
			role="button"
			tabindex="0"
		>
			<div class="flex h-full min-h-[200px] flex-col items-center justify-center space-y-4">
				<div>
					<Plus size={48} class="text-purple-600" />
				</div>
				<div class="text-center">
					<h3 class="mb-2 text-lg font-semibold text-gray-900">Cadastrar Novo Veículo</h3>
					<p class="text-sm text-gray-600">Adicione um novo veículo à sua garagem</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Empty State -->
	{#if data.vehicles.length === 0}
		<div class="py-12 text-center">
			<div class="mx-auto mb-4">
				<Car size={64} class="mx-auto text-purple-600" />
			</div>
			<h3 class="mb-2 text-xl font-semibold text-gray-900">Nenhum veículo cadastrado</h3>
			<p class="mb-6 text-gray-600">Comece cadastrando seu primeiro veículo</p>
			<button
				on:click={() => goto('/vehicles/new')}
				class="btn-primary mx-auto flex items-center space-x-2"
			>
				<Plus size={20} />
				<span>Cadastrar Primeiro Veículo</span>
			</button>
		</div>
	{/if}
</div>
