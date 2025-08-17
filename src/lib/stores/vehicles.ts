import { writable } from 'svelte/store';

export interface Vehicle {
	id: string;
	name: string;
	brand: string;
	model: string;
	year: number;
	plate: string;
	currentKm: number;
	createdAt: Date;
}

export interface FuelRecord {
	id: string;
	vehicleId: string;
	date: Date;
	km: number;
	value: number;
	fuelType: 'gasoline' | 'ethanol' | 'diesel' | 'flex';
	liters?: number;
}

export interface MaintenanceRecord {
	id: string;
	vehicleId: string;
	date: Date;
	km: number;
	type: string;
	description: string;
	status: 'completed' | 'scheduled';
	cost?: number;
}

export const vehicles = writable<Vehicle[]>([]);
export const fuelRecords = writable<FuelRecord[]>([]);
export const maintenanceRecords = writable<MaintenanceRecord[]>([]);

export const addVehicle = (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => {
	const newVehicle: Vehicle = {
		...vehicle,
		id: crypto.randomUUID(),
		createdAt: new Date()
	};

	vehicles.update((v) => [...v, newVehicle]);
	return newVehicle;
};

export const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
	vehicles.update((v) =>
		v.map((vehicle) => (vehicle.id === id ? { ...vehicle, ...updates } : vehicle))
	);
};

export const deleteVehicle = (id: string) => {
	vehicles.update((v) => v.filter((vehicle) => vehicle.id !== id));
	fuelRecords.update((f) => f.filter((record) => record.vehicleId !== id));
	maintenanceRecords.update((m) => m.filter((record) => record.vehicleId !== id));
};

export const addFuelRecord = (record: Omit<FuelRecord, 'id'>) => {
	const newRecord: FuelRecord = {
		...record,
		id: crypto.randomUUID()
	};

	fuelRecords.update((f) => [...f, newRecord]);

	// Atualiza a quilometragem do veículo se for maior
	vehicles.update((v) =>
		v.map((vehicle) =>
			vehicle.id === record.vehicleId && record.km > vehicle.currentKm
				? { ...vehicle, currentKm: record.km }
				: vehicle
		)
	);

	return newRecord;
};

export const addMaintenanceRecord = (record: Omit<MaintenanceRecord, 'id'>) => {
	const newRecord: MaintenanceRecord = {
		...record,
		id: crypto.randomUUID()
	};

	maintenanceRecords.update((m) => [...m, newRecord]);

	// Atualiza a quilometragem do veículo se for maior
	vehicles.update((v) =>
		v.map((vehicle) =>
			vehicle.id === record.vehicleId && record.km > vehicle.currentKm
				? { ...vehicle, currentKm: record.km }
				: vehicle
		)
	);

	return newRecord;
};
