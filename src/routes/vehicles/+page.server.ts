export async function load() {
	// Mock data para veículos
	const mockVehicles = [
		{
			id: '1',
			name: 'Meu Civic',
			brand: 'Honda',
			model: 'Civic',
			year: 2020,
			plate: 'ABC-1234',
			currentKm: 45000,
			createdAt: new Date('2023-01-15')
		},
		{
			id: '2',
			name: 'Corolla Work',
			brand: 'Toyota',
			model: 'Corolla',
			year: 2019,
			plate: 'XYZ-5678',
			currentKm: 62000,
			createdAt: new Date('2023-03-20')
		},
		{
			id: '3',
			name: 'HB20 da Família',
			brand: 'Hyundai',
			model: 'HB20',
			year: 2021,
			plate: 'DEF-9012',
			currentKm: 28000,
			createdAt: new Date('2023-06-10')
		},
		{
			id: '4',
			name: 'Onix Plus',
			brand: 'Chevrolet',
			model: 'Onix Plus',
			year: 2022,
			plate: 'GHI-3456',
			currentKm: 15000,
			createdAt: new Date('2023-08-05')
		}
	];

	return {
		vehicles: mockVehicles
	};
}
