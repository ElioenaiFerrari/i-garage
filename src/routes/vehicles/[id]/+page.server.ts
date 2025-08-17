import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const vehicleId = params.id;

  // Dados mockados dos veículos
  const vehicles = [
    {
      id: '1',
      name: 'Civic Turbo',
      brand: 'Honda',
      model: 'Civic',
      year: 2022,
      plate: 'ABC-1234',
      color: 'Preto',
      currentKm: 15420,
      fuelType: 'Gasolina',
      engine: '1.5 Turbo',
      transmission: 'CVT',
      doors: 4,
      seats: 5,
      tankCapacity: 47,
      avgConsumption: 12.5,
      purchaseDate: new Date('2022-03-15'),
      purchasePrice: 125000,
      currentValue: 115000,
      insurance: {
        company: 'Porto Seguro',
        policyNumber: 'PS-123456789',
        expirationDate: new Date('2025-03-15'),
        monthlyValue: 280
      },
      documentation: {
        licenseExpiration: new Date('2025-12-31'),
        inspectionExpiration: new Date('2025-06-30'),
        ipvaValue: 3200,
        ipvaPaid: true
      }
    },
    {
      id: '2',
      name: 'Corolla Cross',
      brand: 'Toyota',
      model: 'Corolla Cross',
      year: 2023,
      plate: 'XYZ-5678',
      color: 'Branco',
      currentKm: 8750,
      fuelType: 'Flex',
      engine: '2.0',
      transmission: 'CVT',
      doors: 4,
      seats: 5,
      tankCapacity: 50,
      avgConsumption: 13.2,
      purchaseDate: new Date('2023-01-20'),
      purchasePrice: 142000,
      currentValue: 138000,
      insurance: {
        company: 'Bradesco Seguros',
        policyNumber: 'BR-987654321',
        expirationDate: new Date('2025-01-20'),
        monthlyValue: 320
      },
      documentation: {
        licenseExpiration: new Date('2025-12-31'),
        inspectionExpiration: new Date('2025-08-15'),
        ipvaValue: 4100,
        ipvaPaid: true
      }
    }
  ];

  // Dados mockados de manutenções do veículo
  const maintenanceRecords = [
    {
      id: '1',
      vehicleId: vehicleId,
      date: new Date('2024-12-15'),
      km: 15000,
      type: 'Troca de óleo',
      description: 'Troca de óleo do motor e filtro',
      status: 'completed' as const,
      cost: 180,
      nextKm: 20000,
      nextDate: new Date('2025-06-15')
    },
    {
      id: '2',
      vehicleId: vehicleId,
      date: new Date('2024-10-10'),
      km: 12000,
      type: 'Revisão',
      description: 'Revisão dos 12.000 km',
      status: 'completed' as const,
      cost: 450,
      nextKm: 24000,
      nextDate: new Date('2025-10-10')
    },
    {
      id: '3',
      vehicleId: vehicleId,
      date: new Date('2025-03-15'),
      km: 20000,
      type: 'Troca de óleo',
      description: 'Próxima troca de óleo programada',
      status: 'scheduled' as const,
      cost: 200
    }
  ];

  // Dados mockados de abastecimentos do veículo
  const fuelRecords = [
    {
      id: '1',
      vehicleId: vehicleId,
      date: new Date('2025-01-15'),
      km: 15420,
      liters: 35.2,
      totalCost: 176.0,
      pricePerLiter: 5.0,
      fuelType: 'Gasolina',
      gasStation: 'Shell Express',
      fullTank: true,
      consumption: 12.8
    },
    {
      id: '2',
      vehicleId: vehicleId,
      date: new Date('2025-01-02'),
      km: 14970,
      liters: 32.8,
      totalCost: 163.84,
      pricePerLiter: 4.99,
      fuelType: 'Gasolina',
      gasStation: 'Petrobras',
      fullTank: true,
      consumption: 13.1
    },
    {
      id: '3',
      vehicleId: vehicleId,
      date: new Date('2024-12-20'),
      km: 14520,
      liters: 30.5,
      totalCost: 152.5,
      pricePerLiter: 5.0,
      fuelType: 'Gasolina',
      gasStation: 'Ipiranga',
      fullTank: true,
      consumption: 12.2
    }
  ];

  const vehicle = vehicles.find(v => v.id === vehicleId);

  if (!vehicle) {
    throw error(404, 'Veículo não encontrado');
  }

  // Estatísticas do veículo
  const stats = {
    totalFuelCost: fuelRecords.reduce((sum, record) => sum + record.totalCost, 0),
    totalMaintenanceCost: maintenanceRecords
      .filter(r => r.status === 'completed')
      .reduce((sum, record) => sum + (record.cost || 0), 0),
    avgConsumption: fuelRecords.length > 0 
      ? fuelRecords.reduce((sum, record) => sum + (record.consumption || 0), 0) / fuelRecords.length 
      : 0,
    totalExpenses: 0,
    kmSinceLastMaintenance: 0,
    nextMaintenanceKm: 0
  };

  // Calcular despesas totais
  stats.totalExpenses = stats.totalFuelCost + stats.totalMaintenanceCost;

  // Encontrar próxima manutenção
  const nextMaintenance = maintenanceRecords
    .filter(r => r.status === 'scheduled')
    .sort((a, b) => (a.nextKm || 0) - (b.nextKm || 0))[0];

  if (nextMaintenance) {
    stats.nextMaintenanceKm = nextMaintenance.nextKm || 0;
    stats.kmSinceLastMaintenance = vehicle.currentKm - (nextMaintenance.km || 0);
  }

  return {
    vehicle,
    maintenanceRecords: maintenanceRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    fuelRecords: fuelRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    stats
  };
};
