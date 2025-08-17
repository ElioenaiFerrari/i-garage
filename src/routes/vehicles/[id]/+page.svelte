<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft,
    Car,
    Calendar,
    Gauge,
    Fuel,
    Wrench,
    DollarSign,
    FileText,
    Shield,
    Edit,
    Plus,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Clock
  } from 'lucide-svelte';

  export let data;

  let isLoaded = false;
  let activeTab = 'overview'; // overview, maintenance, fuel, documentation

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

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  };

  const formatConsumption = (consumption: number) => {
    return consumption.toFixed(1) + ' km/l';
  };

  const isDocumentExpiring = (date: Date | string, days = 30) => {
    const expirationDate = new Date(date);
    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days && diffDays > 0;
  };

  const isDocumentExpired = (date: Date | string) => {
    const expirationDate = new Date(date);
    const now = new Date();
    return expirationDate < now;
  };

  const handleEditVehicle = () => {
    goto(`/vehicles/${data.vehicle.id}/edit`);
  };

  const handleAddMaintenance = () => {
    goto(`/maintenance?vehicle=${data.vehicle.id}`);
  };

  const handleAddFuel = () => {
    goto(`/fuel?vehicle=${data.vehicle.id}`);
  };
</script>

<svelte:head>
  <title>{data.vehicle.name} - Detalhes | i-Garage</title>
</svelte:head>

<div class="space-y-8">
  <!-- Header -->
  <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
    <div class="flex items-center space-x-4">
      <button
        onclick={() => goto('/vehicles')}
        class="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
      >
        <ArrowLeft size={24} />
      </button>
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{data.vehicle.name}</h1>
        <p class="text-gray-600">{data.vehicle.brand} {data.vehicle.model} {data.vehicle.year}</p>
      </div>
    </div>
    <div class="mt-4 lg:mt-0 flex space-x-3">
      <button
        onclick={handleEditVehicle}
        class="btn-secondary flex items-center space-x-2"
      >
        <Edit size={20} />
        <span>Editar</span>
      </button>
      <button
        onclick={handleAddMaintenance}
        class="btn-primary flex items-center space-x-2"
      >
        <Plus size={20} />
        <span>Nova Manutenção</span>
      </button>
    </div>
  </div>

  <!-- Vehicle Info Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Basic Info -->
    <div class="card-automotive">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Car size={20} class="text-white" />
          </div>
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-600 truncate">
              Quilometragem Atual
            </dt>
            <dd class="text-lg font-medium text-gray-900">
              {formatKm(data.vehicle.currentKm)}
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <!-- Consumption -->
    <div class="card-automotive">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Fuel size={20} class="text-white" />
          </div>
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-600 truncate">
              Consumo Médio
            </dt>
            <dd class="text-lg font-medium text-gray-900">
              {formatConsumption(data.stats.avgConsumption)}
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <!-- Total Expenses -->
    <div class="card-automotive">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <DollarSign size={20} class="text-white" />
          </div>
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-600 truncate">
              Gastos Totais
            </dt>
            <dd class="text-lg font-medium text-gray-900">
              {formatCurrency(data.stats.totalExpenses)}
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <!-- Next Maintenance -->
    <div class="card-automotive">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
            <Wrench size={20} class="text-white" />
          </div>
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-600 truncate">
              Próxima Manutenção
            </dt>
            <dd class="text-lg font-medium text-gray-900">
              {data.stats.nextMaintenanceKm > 0 ? formatKm(data.stats.nextMaintenanceKm) : 'N/A'}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>

  <!-- Tabs -->
  <div class="border-b border-gray-200">
    <nav class="-mb-px flex space-x-8" aria-label="Tabs">
      <button
        onclick={() => activeTab = 'overview'}
        class="{activeTab === 'overview' 
          ? 'border-purple-500 text-purple-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
      >
        Visão Geral
      </button>
      <button
        onclick={() => activeTab = 'maintenance'}
        class="{activeTab === 'maintenance' 
          ? 'border-purple-500 text-purple-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
      >
        Manutenções
      </button>
      <button
        onclick={() => activeTab = 'fuel'}
        class="{activeTab === 'fuel' 
          ? 'border-purple-500 text-purple-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
      >
        Abastecimentos
      </button>
      <button
        onclick={() => activeTab = 'documentation'}
        class="{activeTab === 'documentation' 
          ? 'border-purple-500 text-purple-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
      >
        Documentação
      </button>
    </nav>
  </div>

  <!-- Tab Content -->
  {#if activeTab === 'overview'}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Vehicle Details -->
      <div class="card-automotive">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Informações do Veículo</h3>
        <dl class="space-y-4">
          <div class="flex justify-between">
            <dt class="text-sm text-gray-600">Placa:</dt>
            <dd class="text-sm font-medium text-gray-900">{data.vehicle.plate}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-600">Cor:</dt>
            <dd class="text-sm font-medium text-gray-900">{data.vehicle.color}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-600">Combustível:</dt>
            <dd class="text-sm font-medium text-gray-900">{data.vehicle.fuelType}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-600">Motor:</dt>
            <dd class="text-sm font-medium text-gray-900">{data.vehicle.engine}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-600">Transmissão:</dt>
            <dd class="text-sm font-medium text-gray-900">{data.vehicle.transmission}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-600">Capacidade do Tanque:</dt>
            <dd class="text-sm font-medium text-gray-900">{data.vehicle.tankCapacity}L</dd>
          </div>
        </dl>
      </div>

      <!-- Financial Info -->
      <div class="card-automotive">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Informações Financeiras</h3>
        <dl class="space-y-4">
          <div class="flex justify-between">
            <dt class="text-sm text-gray-600">Data da Compra:</dt>
            <dd class="text-sm font-medium text-gray-900">{formatDate(data.vehicle.purchaseDate)}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-600">Valor de Compra:</dt>
            <dd class="text-sm font-medium text-gray-900">{formatCurrency(data.vehicle.purchasePrice)}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-600">Valor Atual:</dt>
            <dd class="text-sm font-medium text-gray-900">{formatCurrency(data.vehicle.currentValue)}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-600">Gastos com Combustível:</dt>
            <dd class="text-sm font-medium text-gray-900">{formatCurrency(data.stats.totalFuelCost)}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-600">Gastos com Manutenção:</dt>
            <dd class="text-sm font-medium text-gray-900">{formatCurrency(data.stats.totalMaintenanceCost)}</dd>
          </div>
          <div class="flex justify-between border-t pt-4">
            <dt class="text-sm font-semibold text-gray-900">Total de Gastos:</dt>
            <dd class="text-sm font-semibold text-gray-900">{formatCurrency(data.stats.totalExpenses)}</dd>
          </div>
        </dl>
      </div>
    </div>
  {/if}

  {#if activeTab === 'maintenance'}
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900">Histórico de Manutenções</h3>
        <button
          onclick={handleAddMaintenance}
          class="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nova Manutenção</span>
        </button>
      </div>

      {#if data.maintenanceRecords.length === 0}
        <div class="text-center py-12">
          <Wrench size={64} class="text-gray-400 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Nenhuma manutenção registrada</h3>
          <p class="text-gray-600 mb-6">Comece registrando a primeira manutenção do seu veículo</p>
          <button
            onclick={handleAddMaintenance}
            class="btn-primary flex items-center space-x-2 mx-auto"
          >
            <Plus size={20} />
            <span>Registrar Manutenção</span>
          </button>
        </div>
      {:else}
        <div class="space-y-4">
          {#each data.maintenanceRecords as record}
            <div class="card-automotive">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0">
                    {#if record.status === 'completed'}
                      <div class="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <CheckCircle size={20} class="text-white" />
                      </div>
                    {:else}
                      <div class="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                        <Clock size={20} class="text-white" />
                      </div>
                    {/if}
                  </div>
                  <div>
                    <div class="flex items-center space-x-2">
                      <h4 class="font-semibold text-gray-900">{record.type}</h4>
                      <span class="text-xs px-2 py-1 rounded-full {record.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                        {record.status === 'completed' ? 'Realizada' : 'Programada'}
                      </span>
                    </div>
                    {#if record.description}
                      <p class="text-sm text-gray-600 mt-1">{record.description}</p>
                    {/if}
                    <div class="flex items-center space-x-4 mt-2">
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
  {/if}

  {#if activeTab === 'fuel'}
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900">Histórico de Abastecimentos</h3>
        <button
          onclick={handleAddFuel}
          class="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Novo Abastecimento</span>
        </button>
      </div>

      {#if data.fuelRecords.length === 0}
        <div class="text-center py-12">
          <Fuel size={64} class="text-gray-400 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Nenhum abastecimento registrado</h3>
          <p class="text-gray-600 mb-6">Registre os abastecimentos para acompanhar o consumo</p>
          <button
            onclick={handleAddFuel}
            class="btn-primary flex items-center space-x-2 mx-auto"
          >
            <Plus size={20} />
            <span>Registrar Abastecimento</span>
          </button>
        </div>
      {:else}
        <div class="space-y-4">
          {#each data.fuelRecords as record}
            <div class="card-automotive">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Fuel size={20} class="text-white" />
                    </div>
                  </div>
                  <div>
                    <div class="flex items-center space-x-2">
                      <h4 class="font-semibold text-gray-900">{record.gasStation}</h4>
                      <span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        {record.fuelType}
                      </span>
                    </div>
                    <div class="flex items-center space-x-4 mt-2">
                      <div class="flex items-center space-x-1 text-xs text-gray-600">
                        <Calendar size={12} />
                        <span>{formatDate(record.date)}</span>
                      </div>
                      <div class="flex items-center space-x-1 text-xs text-gray-600">
                        <Gauge size={12} />
                        <span>{formatKm(record.km)}</span>
                      </div>
                      {#if record.consumption}
                        <div class="flex items-center space-x-1 text-xs text-gray-600">
                          <TrendingUp size={12} />
                          <span>{formatConsumption(record.consumption)}</span>
                        </div>
                      {/if}
                    </div>
                  </div>
                </div>
                
                <div class="mt-4 lg:mt-0 lg:text-right">
                  <p class="text-lg font-bold text-gray-900">{formatCurrency(record.totalCost)}</p>
                  <p class="text-xs text-gray-600">{record.liters}L × {formatCurrency(record.pricePerLiter)}</p>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  {#if activeTab === 'documentation'}
    <div class="space-y-6">
      <h3 class="text-lg font-semibold text-gray-900">Documentação e Seguros</h3>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Insurance -->
        <div class="card-automotive">
          <div class="flex items-center mb-4">
            <Shield size={24} class="text-purple-600 mr-3" />
            <h4 class="text-lg font-semibold text-gray-900">Seguro</h4>
          </div>
          <dl class="space-y-3">
            <div class="flex justify-between">
              <dt class="text-sm text-gray-600">Seguradora:</dt>
              <dd class="text-sm font-medium text-gray-900">{data.vehicle.insurance.company}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-gray-600">Apólice:</dt>
              <dd class="text-sm font-medium text-gray-900">{data.vehicle.insurance.policyNumber}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-gray-600">Vencimento:</dt>
              <dd class="text-sm font-medium flex items-center {isDocumentExpiring(data.vehicle.insurance.expirationDate) ? 'text-yellow-600' : isDocumentExpired(data.vehicle.insurance.expirationDate) ? 'text-red-600' : 'text-gray-900'}">
                {formatDate(data.vehicle.insurance.expirationDate)}
                {#if isDocumentExpiring(data.vehicle.insurance.expirationDate) || isDocumentExpired(data.vehicle.insurance.expirationDate)}
                  <AlertCircle size={16} class="ml-1" />
                {/if}
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-gray-600">Valor Mensal:</dt>
              <dd class="text-sm font-medium text-gray-900">{formatCurrency(data.vehicle.insurance.monthlyValue)}</dd>
            </div>
          </dl>
        </div>

        <!-- Documentation -->
        <div class="card-automotive">
          <div class="flex items-center mb-4">
            <FileText size={24} class="text-purple-600 mr-3" />
            <h4 class="text-lg font-semibold text-gray-900">Documentação</h4>
          </div>
          <dl class="space-y-3">
            <div class="flex justify-between">
              <dt class="text-sm text-gray-600">Licenciamento:</dt>
              <dd class="text-sm font-medium flex items-center {isDocumentExpiring(data.vehicle.documentation.licenseExpiration) ? 'text-yellow-600' : isDocumentExpired(data.vehicle.documentation.licenseExpiration) ? 'text-red-600' : 'text-gray-900'}">
                {formatDate(data.vehicle.documentation.licenseExpiration)}
                {#if isDocumentExpiring(data.vehicle.documentation.licenseExpiration) || isDocumentExpired(data.vehicle.documentation.licenseExpiration)}
                  <AlertCircle size={16} class="ml-1" />
                {/if}
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-gray-600">Vistoria:</dt>
              <dd class="text-sm font-medium flex items-center {isDocumentExpiring(data.vehicle.documentation.inspectionExpiration) ? 'text-yellow-600' : isDocumentExpired(data.vehicle.documentation.inspectionExpiration) ? 'text-red-600' : 'text-gray-900'}">
                {formatDate(data.vehicle.documentation.inspectionExpiration)}
                {#if isDocumentExpiring(data.vehicle.documentation.inspectionExpiration) || isDocumentExpired(data.vehicle.documentation.inspectionExpiration)}
                  <AlertCircle size={16} class="ml-1" />
                {/if}
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-gray-600">IPVA:</dt>
              <dd class="text-sm font-medium text-gray-900">
                {formatCurrency(data.vehicle.documentation.ipvaValue)}
                <span class="ml-2 text-xs px-2 py-1 rounded-full {data.vehicle.documentation.ipvaPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                  {data.vehicle.documentation.ipvaPaid ? 'Pago' : 'Pendente'}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  {/if}
</div>
