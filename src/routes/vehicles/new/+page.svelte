<script lang="ts">
	import { goto } from '$app/navigation';
	import { addVehicle } from '$lib/stores/vehicles';
	import { Car, Save, ArrowLeft } from 'lucide-svelte';

	let isLoading = false;
	let error = '';
	let success = false;

	// Form data
	let vehicleData = {
		name: '',
		brand: '',
		model: '',
		year: new Date().getFullYear(),
		plate: '',
		currentKm: 0
	};

	const popularBrands = [
		'Chevrolet',
		'Volkswagen',
		'Fiat',
		'Ford',
		'Toyota',
		'Honda',
		'Hyundai',
		'Nissan',
		'Renault',
		'Peugeot',
		'Jeep'
	];

	const handleSubmit = async () => {
		if (!vehicleData.name || !vehicleData.brand || !vehicleData.model || !vehicleData.plate) {
			error = 'Por favor, preencha todos os campos obrigatórios.';
			return;
		}

		if (vehicleData.year < 1900 || vehicleData.year > new Date().getFullYear() + 1) {
			error = 'Ano inválido.';
			return;
		}

		if (vehicleData.currentKm < 0) {
			error = 'Quilometragem não pode ser negativa.';
			return;
		}

		isLoading = true;
		error = '';

		try {
			// Simulação de salvamento
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Adiciona o veículo ao store
			addVehicle(vehicleData);

			success = true;

			setTimeout(() => {
				goto('/vehicles');
			}, 1500);
		} catch (err) {
			error = 'Erro ao cadastrar veículo. Tente novamente.';
		} finally {
			isLoading = false;
		}
	};

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key === 'Enter' && event.ctrlKey) {
			handleSubmit();
		}
	};
</script>

<div class="mx-auto max-w-2xl space-y-8">
	<!-- Header -->
	<div class="flex items-center space-x-4">
		<button
			on:click={() => goto('/vehicles')}
			class="btn-secondary p-2"
			aria-label="Voltar para veículos"
		>
			<ArrowLeft size={20} />
		</button>
		<div>
			<h1 class="mb-2 text-3xl font-bold text-gray-900">Cadastrar Veículo</h1>
			<p class="text-gray-600">Adicione um novo veículo à sua garagem</p>
		</div>
	</div>

	<!-- Success Message -->
	{#if success}
		<div
			class="subtle-fade-in rounded-lg border border-green-200 bg-green-50 px-6 py-4 text-green-800"
		>
			<div class="flex items-center space-x-3">
				<div>
					<Car size={24} class="text-green-600" />
				</div>
				<div>
					<h3 class="font-semibold">Veículo cadastrado com sucesso!</h3>
					<p class="text-sm">Redirecionando...</p>
				</div>
			</div>
		</div>
	{/if}

	<!-- Error Message -->
	{#if error}
		<div class="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-red-800">
			{error}
		</div>
	{/if}

	<!-- Form -->
	<div class="card-automotive">
		<div class="mb-8 flex items-center space-x-3">
			<div>
				<Car size={32} class="text-purple-600" />
			</div>
			<h2 class="text-xl font-bold text-gray-900">Dados do Veículo</h2>
		</div>

		<form on:submit|preventDefault={handleSubmit} class="space-y-6">
			<!-- Vehicle Name -->
			<div>
				<label for="name" class="mb-2 block text-sm font-medium text-gray-700">
					Nome do Veículo *
				</label>
				<input
					id="name"
					type="text"
					bind:value={vehicleData.name}
					on:keypress={handleKeyPress}
					placeholder="Ex: Meu Civic, Carro da Família..."
					class="input-automotive w-full"
					required
				/>
				<p class="mt-1 text-xs text-gray-500">Nome para identificar o veículo</p>
			</div>

			<!-- Brand and Model -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<label for="brand" class="mb-2 block text-sm font-medium text-gray-700"> Marca * </label>
					<select
						id="brand"
						bind:value={vehicleData.brand}
						class="input-automotive w-full"
						required
					>
						<option value="">Selecione a marca</option>
						{#each popularBrands as brand}
							<option value={brand}>{brand}</option>
						{/each}
						<option value="outro">Outro</option>
					</select>
				</div>

				<div>
					<label for="model" class="mb-2 block text-sm font-medium text-gray-700"> Modelo * </label>
					<input
						id="model"
						type="text"
						bind:value={vehicleData.model}
						on:keypress={handleKeyPress}
						placeholder="Ex: Civic, Corolla, Onix..."
						class="input-automotive w-full"
						required
					/>
				</div>
			</div>

			<!-- Year and Plate -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<label for="year" class="mb-2 block text-sm font-medium text-gray-700"> Ano * </label>
					<input
						id="year"
						type="number"
						bind:value={vehicleData.year}
						on:keypress={handleKeyPress}
						min="1900"
						max={new Date().getFullYear() + 1}
						class="input-automotive w-full"
						required
					/>
				</div>

				<div>
					<label for="plate" class="mb-2 block text-sm font-medium text-gray-700"> Placa * </label>
					<input
						id="plate"
						type="text"
						bind:value={vehicleData.plate}
						on:keypress={handleKeyPress}
						placeholder="ABC-1234 ou ABC1D23"
						class="input-automotive w-full"
						pattern="[A-Za-z]{3}-?[0-9]{4}|[A-Za-z]{3}[0-9][A-Za-z][0-9]{2}"
						required
					/>
					<p class="mt-1 text-xs text-gray-500">Formato antigo (ABC-1234) ou Mercosul (ABC1D23)</p>
				</div>
			</div>

			<!-- Current KM -->
			<div>
				<label for="currentKm" class="mb-2 block text-sm font-medium text-gray-700">
					Quilometragem Atual *
				</label>
				<input
					id="currentKm"
					type="number"
					bind:value={vehicleData.currentKm}
					on:keypress={handleKeyPress}
					min="0"
					step="1"
					placeholder="0"
					class="input-automotive w-full"
					required
				/>
				<p class="mt-1 text-xs text-gray-500">Quilometragem atual do veículo</p>
			</div>

			<!-- Submit Button -->
			<div class="flex flex-col gap-4 pt-6 sm:flex-row">
				<button
					type="button"
					on:click={() => goto('/vehicles')}
					class="btn-secondary w-full sm:w-auto"
					disabled={isLoading}
				>
					Cancelar
				</button>

				<button
					type="submit"
					disabled={isLoading}
					class="btn-primary flex w-full items-center justify-center space-x-2 sm:flex-1 {isLoading
						? 'cursor-not-allowed opacity-50'
						: ''}"
				>
					{#if isLoading}
						<div>
							<div
								class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
							></div>
						</div>
						<span>Salvando...</span>
					{:else}
						<Save size={20} />
						<span>Cadastrar Veículo</span>
					{/if}
				</button>
			</div>
		</form>

		<!-- Keyboard Shortcut Hint -->
		<div class="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
			<p class="text-center text-sm text-gray-600">
				💡 <strong>Dica:</strong> Use Ctrl + Enter para salvar rapidamente
			</p>
		</div>
	</div>
</div>
