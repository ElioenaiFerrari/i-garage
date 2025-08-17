export async function load() {
	// Mock data para veículos
	const mockVehicles = [
		{
			id: '1',
			name: 'Meu Civic',
			brand: 'Honda',
			model: 'Civic',
			currentKm: 45000
		},
		{
			id: '2',
			name: 'Corolla Work',
			brand: 'Toyota',
			model: 'Corolla',
			currentKm: 62000
		},
		{
			id: '3',
			name: 'HB20 da Família',
			brand: 'Hyundai',
			model: 'HB20',
			currentKm: 28000
		}
	];

	// Mock data para manutenções
	const maintenanceRecords = [
		{
			id: '1',
			vehicleId: '1',
			vehicleName: 'Meu Civic',
			date: new Date('2024-08-25'),
			km: 50000,
			type: 'Troca de óleo',
			description: 'Troca de óleo sintético e filtro',
			status: 'scheduled' as const,
			cost: 150.0
		},
		{
			id: '2',
			vehicleId: '1',
			vehicleName: 'Meu Civic',
			date: new Date('2024-07-10'),
			km: 40000,
			type: 'Revisão',
			description: 'Revisão dos 40.000 km - Troca de velas, filtros e fluidos',
			status: 'completed' as const,
			cost: 850.0
		},
		{
			id: '3',
			vehicleId: '2',
			vehicleName: 'Corolla Work',
			date: new Date('2024-08-20'),
			km: 60000,
			type: 'Pastilha de freio',
			description: 'Troca das pastilhas de freio dianteiras',
			status: 'completed' as const,
			cost: 320.0
		},
		{
			id: '4',
			vehicleId: '3',
			vehicleName: 'HB20 da Família',
			date: new Date('2024-09-01'),
			km: 30000,
			type: 'Revisão',
			description: 'Revisão dos 30.000 km',
			status: 'scheduled' as const,
			cost: 450.0
		},
		{
			id: '5',
			vehicleId: '2',
			vehicleName: 'Corolla Work',
			date: new Date('2024-09-15'),
			km: 65000,
			type: 'Troca de pneus',
			description: 'Troca dos 4 pneus - Bridgestone Turanza',
			status: 'scheduled' as const,
			cost: 1200.0
		}
	];

	return {
		vehicles: mockVehicles,
		maintenanceRecords: maintenanceRecords.sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		)
	};
}
