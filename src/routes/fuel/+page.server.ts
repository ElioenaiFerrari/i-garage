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

	// Mock data para abastecimentos
	const fuelRecords = [
		{
			id: '1',
			vehicleId: '1',
			vehicleName: 'Meu Civic',
			date: new Date('2024-08-15'),
			km: 45000,
			value: 85.5,
			fuelType: 'gasoline' as const,
			liters: 15.2,
			pricePerLiter: 5.63
		},
		{
			id: '2',
			vehicleId: '2',
			vehicleName: 'Corolla Work',
			date: new Date('2024-08-14'),
			km: 62000,
			value: 120.0,
			fuelType: 'flex' as const,
			liters: 22.5,
			pricePerLiter: 5.33
		},
		{
			id: '3',
			vehicleId: '1',
			vehicleName: 'Meu Civic',
			date: new Date('2024-08-10'),
			km: 44650,
			value: 80.0,
			fuelType: 'gasoline' as const,
			liters: 14.2,
			pricePerLiter: 5.63
		},
		{
			id: '4',
			vehicleId: '3',
			vehicleName: 'HB20 da Família',
			date: new Date('2024-08-08'),
			km: 27800,
			value: 95.0,
			fuelType: 'ethanol' as const,
			liters: 20.8,
			pricePerLiter: 4.57
		}
	];

	return {
		vehicles: mockVehicles,
		fuelRecords: fuelRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	};
}
