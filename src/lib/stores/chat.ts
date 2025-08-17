import { writable } from 'svelte/store';

export interface ChatMessage {
	id: string;
	content: string;
	isUser: boolean;
	timestamp: Date;
}

export const chatMessages = writable<ChatMessage[]>([]);
export const isTyping = writable(false);

export const addMessage = (content: string, isUser: boolean = false) => {
	const message: ChatMessage = {
		id: crypto.randomUUID(),
		content,
		isUser,
		timestamp: new Date()
	};

	chatMessages.update((messages) => [...messages, message]);
	return message;
};

export const clearChat = () => {
	chatMessages.set([]);
};

// Respostas automáticas do Tião Mecânico
export const tiaoResponses = {
	barulho: [
		'Hmm, barulho estranho no motor pode ser várias coisas, parceiro! Pode ser problema na correia, vela de ignição ou até mesmo óleo vencido. Quando foi a última revisão?',
		'Barulho no carro sempre me deixa preocupado! Pode ser desde algo simples como pedra na roda até problema mais sério no motor. Me fala mais detalhes!',
		'Olha, barulho estranho no carro é como dor no corpo - sempre tem uma causa! Pode ser freio, suspensão, motor... Onde você escuta esse barulho?'
	],
	freio: [
		'Freio é coisa séria, meu amigo! Se tá fazendo barulho ou vibrando, pode ser pastilha gasta ou disco empenado. Não ande com isso não!',
		'Problema no freio não é brincadeira! Pode ser desde pastilha gasta até vazamento no sistema. Leva num mecânico urgente!',
		'Freio chiando ou puxando pro lado? Isso aí precisa de atenção imediata! Pode ser pastilha, disco ou até fluido de freio.'
	],
	motor: [
		'Motor é o coração do carro! Se tá falhando, pode ser vela, filtro de ar sujo, combustível adulterado... Quantos quilômetros tem seu carro?',
		'Falha no motor pode ser muita coisa, chefe! Desde bobina queimada até problema na injeção eletrônica. Tá acendendo alguma luz no painel?',
		'Motor falhando é sinal de alerta! Pode ser desde falta de manutenção até problema mais grave. Me conta os sintomas direito!'
	],
	oleo: [
		'Óleo é a vida do motor! Tem que trocar a cada 10 mil km ou conforme o manual. Qual tipo de óleo você usa? Mineral, sintético?',
		'Óleo do motor não é só trocar, tem que ser o certo! Viscosidade errada pode causar problema. Sempre confira o manual do fabricante!',
		'Óleo queimado ou preto? Hora de trocar urgente! E não esquece do filtro, que trabalha junto com o óleo pra proteger o motor.'
	],
	default: [
		'Opa, sou o Tião! Mecânico há 30 anos e sempre pronto pra ajudar! Me fala qual o problema do seu carro que a gente resolve!',
		'E aí, parceiro! Aqui é o Tião Mecânico! Pode falar qual o pepino do seu carro que vou te ajudar a resolver!',
		'Salve! Tião na área! Conta aí qual o problema do seu carrinho que a gente dá um jeito!'
	]
};

export const getRandomResponse = (category: keyof typeof tiaoResponses = 'default') => {
	const responses = tiaoResponses[category] || tiaoResponses.default;
	return responses[Math.floor(Math.random() * responses.length)];
};
