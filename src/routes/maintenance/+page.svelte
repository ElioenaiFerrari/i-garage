<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import {
		Wrench,
		Plus,
		Car,
		Calendar,
		DollarSign,
		Gauge,
		CheckCircle,
		Clock,
		Activity
	} from 'lucide-svelte';

	export let data;

	let isLoaded = false;
	let showAddForm = false;
	let selectedVehicleId = '';
	let filterStatus = 'all'; // all, scheduled, completed

	// Form data
	let maintenanceData = {
		vehicleId: '',
		date: new Date().toISOString().split('T')[0],
		km: 0,
		type: '',
		description: '',
		status: 'scheduled' as 'scheduled' | 'completed',
		cost: 0
	};

	const maintenanceTypes = [
		'Troca de óleo',
		'Revisão',
		'Pastilha de freio',
		'Troca de pneus',
		'Correia dentada',
		'Suspensão',
		'Sistema elétrico',
		'Ar condicionado',
		'Câmbio',
		'Embreagem',
		'Outros'
	];

	onMount(() => {
		// Verifica se há um veículo selecionado via query parameter
		const vehicleParam = $page.url.searchParams.get('vehicle');
		if (vehicleParam) {
			selectedVehicleId = vehicleParam;
			maintenanceData.vehicleId = vehicleParam;
			showAddForm = true;

			// Define a quilometragem atual do veículo selecionado
			const selectedVehicle = data.vehicles.find((v) => v.id === vehicleParam);
			if (selectedVehicle) {
				maintenanceData.km = selectedVehicle.currentKm;
			}
		}

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

	const handleSubmit = async () => {
		// Validações básicas
		if (
			!maintenanceData.vehicleId ||
			!maintenanceData.date ||
			!maintenanceData.type ||
			maintenanceData.km <= 0
		) {
			alert('Por favor, preencha todos os campos obrigatórios.');
			return;
		}

		// Simula salvamento
		console.log('Salvando manutenção:', maintenanceData);

		// Reset form
		maintenanceData = {
			vehicleId: '',
			date: new Date().toISOString().split('T')[0],
			km: 0,
			type: '',
			description: '',
			status: 'scheduled',
			cost: 0
		};

		showAddForm = false;

		// Em uma aplicação real, recarregaria os dados
		alert('Manutenção registrada com sucesso!');
	};

	$: filteredRecords = (data?.maintenanceRecords || []).filter((record) => {
		if (filterStatus === 'all') return true;
		return record.status === filterStatus;
	});

	$: totalCost = data.maintenanceRecords
		.filter((r) => r.status === 'completed')
		.reduce((acc, record) => acc + (record.cost || 0), 0);

	$: scheduledCount = (data?.maintenanceRecords || []).filter(
		(r) => r.status === 'scheduled'
	).length;
	$: completedCount = (data?.maintenanceRecords || []).filter(
		(r) => r.status === 'completed'
	).length;
</script>

<div class="space-y-8">
	<!-- Header -->
	<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
		<div>
			<h1 class="mb-2 text-3xl font-bold text-gray-900">Manutenções</h1>
			<p class="text-gray-600">Acompanhe a manutenção dos seus veículos</p>
		</div>
		<div class="mt-4 lg:mt-0">
			<button
				onclick={() => (showAddForm = !showAddForm)}
				class="btn-primary flex items-center space-x-2"
			>
				<Plus size={20} />
				<span>Registrar Manutenção</span>
			</button>
		</div>
	</div>

	<!-- Add Maintenance Form -->
	{#if showAddForm}
		<div class="card-automotive subtle-fade-in">
			<div class="mb-6 flex items-center space-x-3">
				<div class="subtle-fade-in">
					<Wrench size={32} class="text-purple-600" />
				</div>
				<h2 class="text-xl font-bold text-gray-900">Nova Manutenção</h2>
			</div>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				class="space-y-6"
			>
				<!-- Vehicle Selection -->
				<div>
					<label for="vehicle" class="mb-2 block text-sm font-medium text-gray-700">
						Veículo *
					</label>
					<select
						id="vehicle"
						bind:value={maintenanceData.vehicleId}
						onchange={() => {
							const vehicle = data.vehicles.find((v) => v.id === maintenanceData.vehicleId);
							if (vehicle) maintenanceData.km = vehicle.currentKm;
						}}
						class="input-automotive w-full"
						required
					>
						<option value="">Selecione o veículo</option>
						{#each data?.vehicles || [] as vehicle}
							<option value={vehicle.id}>{vehicle.name} - {vehicle.brand} {vehicle.model}</option>
						{/each}
					</select>
				</div>

				<!-- Type and Status -->
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<label for="type" class="mb-2 block text-sm font-medium text-gray-700">
							Tipo de Manutenção *
						</label>
						<select
							id="type"
							bind:value={maintenanceData.type}
							class="input-automotive w-full"
							required
						>
							<option value="">Selecione o tipo</option>
							{#each maintenanceTypes as type}
								<option value={type}>{type}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="status" class="mb-2 block text-sm font-medium text-gray-700">
							Status *
						</label>
						<select
							id="status"
							bind:value={maintenanceData.status}
							class="input-automotive w-full"
							required
						>
							<option value="scheduled">Programada</option>
							<option value="completed">Realizada</option>
						</select>
					</div>
				</div>

				<!-- Date and KM -->
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<label for="date" class="mb-2 block text-sm font-medium text-gray-700"> Data * </label>
						<input
							id="date"
							type="date"
							bind:value={maintenanceData.date}
							class="input-automotive w-full"
							required
						/>
					</div>

					<div>
						<label for="km" class="mb-2 block text-sm font-medium text-gray-700">
							Quilometragem *
						</label>
						<input
							id="km"
							type="number"
							bind:value={maintenanceData.km}
							min="0"
							step="1"
							placeholder="Quilometragem da manutenção"
							class="input-automotive w-full"
							required
						/>
					</div>
				</div>

				<!-- Description -->
				<div>
					<label for="description" class="mb-2 block text-sm font-medium text-gray-700">
						Descrição
					</label>
					<textarea
						id="description"
						bind:value={maintenanceData.description}
						placeholder="Descreva os detalhes da manutenção..."
						class="input-automotive h-24 w-full resize-none"
						rows="3"
					></textarea>
				</div>

				<!-- Cost -->
				<div>
					<label for="cost" class="mb-2 block text-sm font-medium text-gray-700">
						Custo {maintenanceData.status === 'scheduled' ? '(Estimado)' : ''}
					</label>
					<input
						id="cost"
						type="number"
						bind:value={maintenanceData.cost}
						min="0"
						step="0.01"
						placeholder="0.00"
						class="input-automotive w-full"
					/>
				</div>

				<!-- Action Buttons -->
				<div class="flex flex-col gap-4 pt-6 sm:flex-row">
					<button
						type="button"
						onclick={() => (showAddForm = false)}
						class="btn-secondary w-full sm:w-auto"
					>
						Cancelar
					</button>

					<button
						type="submit"
						class="btn-primary flex w-full items-center justify-center space-x-2 sm:flex-1"
					>
						<Wrench size={20} />
						<span>Registrar Manutenção</span>
					</button>
				</div>
			</form>
		</div>
	{/if}

	<!-- Statistics Cards -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-4">
		<!-- Total Maintenance -->
		<div class="card-automotive">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600">
						<Activity size={20} class="text-white" />
					</div>
				</div>
				<div class="ml-5 w-0 flex-1">
					<dl>
						<dt class="truncate text-sm font-medium text-gray-600">Total de Manutenções</dt>
						<dd class="text-lg font-medium text-gray-900">
							{data?.maintenanceRecords?.length || 0}
						</dd>
					</dl>
				</div>
			</div>
		</div>

		<!-- Completed Maintenance -->
		<div class="card-automotive">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
						<CheckCircle size={20} class="text-white" />
					</div>
				</div>
				<div class="ml-5 w-0 flex-1">
					<dl>
						<dt class="truncate text-sm font-medium text-gray-600">Realizadas</dt>
						<dd class="text-lg font-medium text-gray-900">
							{completedCount}
						</dd>
					</dl>
				</div>
			</div>
		</div>

		<!-- Scheduled Maintenance -->
		<div class="card-automotive">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-600">
						<Clock size={20} class="text-white" />
					</div>
				</div>
				<div class="ml-5 w-0 flex-1">
					<dl>
						<dt class="truncate text-sm font-medium text-gray-600">Programadas</dt>
						<dd class="text-lg font-medium text-gray-900">
							{scheduledCount}
						</dd>
					</dl>
				</div>
			</div>
		</div>

		<!-- Total Cost -->
		<div class="card-automotive">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600">
						<DollarSign size={20} class="text-white" />
					</div>
				</div>
				<div class="ml-5 w-0 flex-1">
					<dl>
						<dt class="truncate text-sm font-medium text-gray-600">Gasto Total</dt>
						<dd class="text-lg font-medium text-gray-900">
							{formatCurrency(totalCost)}
						</dd>
					</dl>
				</div>
			</div>
		</div>
	</div>

	<!-- Filter Buttons -->
	<div class="flex flex-wrap gap-2">
		<button
			onclick={() => (filterStatus = 'all')}
			class="{filterStatus === 'all' ? 'btn-primary' : 'btn-secondary'} text-sm"
		>
			Todas ({data?.maintenanceRecords?.length || 0})
		</button>
		<button
			onclick={() => (filterStatus = 'scheduled')}
			class="{filterStatus === 'scheduled' ? 'btn-primary' : 'btn-secondary'} text-sm"
		>
			Programadas ({scheduledCount})
		</button>
		<button
			onclick={() => (filterStatus = 'completed')}
			class="{filterStatus === 'completed' ? 'btn-primary' : 'btn-secondary'} text-sm"
		>
			Realizadas ({completedCount})
		</button>
	</div>

	<!-- Maintenance Records List -->
	<div class="card-automotive">
		<div class="mb-6 flex items-center justify-between">
			<h2 class="text-xl font-bold text-gray-900">Histórico de Manutenções</h2>
		</div>

		{#if filteredRecords.length === 0}
			<div class="py-12 text-center">
				<div class="subtle-fade-in mx-auto mb-4">
					<Wrench size={64} class="text-purple-600" />
				</div>
				<h3 class="mb-2 text-xl font-semibold text-gray-900">
					{filterStatus === 'all'
						? 'Nenhuma manutenção registrada'
						: filterStatus === 'scheduled'
							? 'Nenhuma manutenção programada'
							: 'Nenhuma manutenção realizada'}
				</h3>
				<p class="mb-6 text-gray-600">
					{filterStatus === 'all'
						? 'Comece registrando sua primeira manutenção'
						: filterStatus === 'scheduled'
							? 'Programe uma manutenção para seus veículos'
							: 'Registre as manutenções já realizadas'}
				</p>
				<button
					onclick={() => (showAddForm = true)}
					class="btn-primary mx-auto flex items-center space-x-2"
				>
					<Plus size={20} />
					<span>Registrar Manutenção</span>
				</button>
			</div>
		{:else}
			<div class="space-y-4">
				{#each filteredRecords as record, index}
					<div
						class="rounded-lg bg-gray-50 p-4 transition-all duration-200 hover:bg-gray-100 {isLoaded
							? 'subtle-fade-in'
							: 'opacity-0'}"
					>
						<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
							<div class="flex items-start space-x-4">
								<div class="flex-shrink-0">
									<div
										class="h-10 w-10 {record.status === 'completed'
											? 'bg-green-600'
											: 'bg-yellow-600'} flex items-center justify-center rounded-lg"
									>
										{#if record.status === 'completed'}
											<CheckCircle size={20} class="text-white" />
										{:else}
											<Clock size={20} class="text-white" />
										{/if}
									</div>
								</div>
								<div>
									<div class="flex items-center space-x-2">
										<h3 class="font-semibold text-gray-900">{record.type}</h3>
										<span
											class="rounded-full px-2 py-1 text-xs {record.status === 'completed'
												? 'bg-green-100 text-green-800'
												: 'bg-yellow-100 text-yellow-800'}"
										>
											{record.status === 'completed' ? 'Realizada' : 'Programada'}
										</span>
									</div>
									<p class="text-sm text-gray-600">{record.vehicleName}</p>
									{#if record.description}
										<p class="mt-1 text-xs text-gray-600">{record.description}</p>
									{/if}
									<div class="mt-2 flex items-center space-x-4">
										<div class="flex items-center space-x-1 text-xs text-gray-600">
											<Calendar size={12} />
											<span>{formatDate(record.date)}</span>
										</div>
										<div class="flex items-center space-x-1 text-xs text-gray-600">
											<Gauge size={12} />
											<span>{formatKm(record.km)}</span>
										</div>
									</div>
								</div>
							</div>

							<div class="mt-4 lg:mt-0 lg:text-right">
								{#if record.cost}
									<p class="text-lg font-bold text-gray-900">{formatCurrency(record.cost)}</p>
									<p class="text-xs text-gray-600">
										{record.status === 'completed' ? 'Valor pago' : 'Estimativa'}
									</p>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
