<script lang="ts">
	import { onMount } from 'svelte';
	import {
		chatMessages,
		isTyping,
		addMessage,
		getRandomResponse,
		tiaoResponses
	} from '$lib/stores/chat';
	import { Send, Bot, User } from 'lucide-svelte';

	let messageInput = '';
	let chatContainer: HTMLElement;

	const scrollToBottom = () => {
		if (chatContainer) {
			setTimeout(() => {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}, 100);
		}
	};

	const sendMessage = async () => {
		if (!messageInput.trim()) return;

		const userMessage = messageInput.trim();
		messageInput = '';

		// Adiciona mensagem do usuário
		addMessage(userMessage, true);
		scrollToBottom();

		// Simula o Tião digitando
		isTyping.set(true);

		// Analisa a mensagem para dar resposta apropriada
		let responseCategory: keyof typeof tiaoResponses = 'default';

		const lowerMessage = userMessage.toLowerCase();
		if (
			lowerMessage.includes('barulho') ||
			lowerMessage.includes('ruído') ||
			lowerMessage.includes('som')
		) {
			responseCategory = 'barulho';
		} else if (lowerMessage.includes('freio') || lowerMessage.includes('pedal')) {
			responseCategory = 'freio';
		} else if (
			lowerMessage.includes('motor') ||
			lowerMessage.includes('falha') ||
			lowerMessage.includes('engasga')
		) {
			responseCategory = 'motor';
		} else if (
			lowerMessage.includes('óleo') ||
			lowerMessage.includes('lubrificante') ||
			lowerMessage.includes('viscosidade')
		) {
			responseCategory = 'oleo';
		}

		// Simula tempo de resposta
		await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

		isTyping.set(false);

		// Adiciona resposta do Tião
		addMessage(getRandomResponse(responseCategory), false);
		scrollToBottom();
	};

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	};

	const formatTime = (date: Date) => {
		return new Intl.DateTimeFormat('pt-BR', {
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	};

	onMount(() => {
		// Mensagem de boas-vindas
		if ($chatMessages.length === 0) {
			setTimeout(() => {
				addMessage(
					'Opa! Aqui é o Tião Mecânico! 👋 Tenho mais de 30 anos mexendo com carro e tô aqui pra te ajudar! Qual o problema do seu carrinho hoje?',
					false
				);
				scrollToBottom();
			}, 500);
		}

		scrollToBottom();
	});

	// Sugestões rápidas
	const quickSuggestions = [
		'Meu carro está fazendo um barulho estranho',
		'O freio está chiando',
		'Motor está falhando',
		'Quando trocar o óleo?',
		'Carro não liga pela manhã',
		'Consumo de combustível alto'
	];

	const sendQuickMessage = (message: string) => {
		messageInput = message;
		sendMessage();
	};
</script>

<div class="mx-auto flex h-full max-w-4xl flex-col">
	<!-- Header -->
	<div class="mb-6 flex items-center space-x-4">
		<div class="subtle-fade-in">
			<Bot size={32} class="text-purple-600" />
		</div>
		<div>
			<h1 class="mb-2 text-3xl font-bold text-gray-900">Tião Mecânico</h1>
			<p class="text-gray-600">Seu assistente automotivo virtual • 30 anos de experiência</p>
		</div>
	</div>

	<!-- Chat Container -->
	<div class="card-automotive flex min-h-[600px] flex-1 flex-col">
		<!-- Messages Area -->
		<div bind:this={chatContainer} class="max-h-[500px] flex-1 space-y-4 overflow-y-auto p-4">
			{#each $chatMessages as message}
				<div class="flex {message.isUser ? 'justify-end' : 'justify-start'}">
					<div class="flex max-w-[80%] items-start space-x-3">
						{#if !message.isUser}
							<div
								class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-600"
							>
								<Bot size={16} class="text-gray-900" />
							</div>
						{/if}

						<div class="flex flex-col">
							<div
								class="bg-{message.isUser
									? 'purple-600'
									: 'purple-800/50'} rounded-lg px-4 py-3 {message.isUser
									? 'rounded-br-sm'
									: 'rounded-bl-sm'}"
							>
								<p class="text-sm leading-relaxed text-gray-900">{message.content}</p>
							</div>
							<span
								class="mt-1 text-xs text-purple-600 {message.isUser ? 'text-right' : 'text-left'}"
							>
								{formatTime(message.timestamp)}
							</span>
						</div>

						{#if message.isUser}
							<div
								class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-700"
							>
								<User size={16} class="text-gray-900" />
							</div>
						{/if}
					</div>
				</div>
			{/each}

			<!-- Typing Indicator -->
			{#if $isTyping}
				<div class="flex justify-start">
					<div class="flex max-w-[80%] items-start space-x-3">
						<div
							class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-600"
						>
							<Bot size={16} class="text-gray-900" />
						</div>
						<div class="rounded-lg rounded-bl-sm bg-gray-100 px-4 py-3">
							<div class="flex space-x-1">
								<div class="h-2 w-2 animate-bounce rounded-full bg-purple-400"></div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Quick Suggestions (only show when no messages) -->
		{#if $chatMessages.length <= 1}
			<div class="border-t border-gray-200/30 p-4">
				<p class="mb-3 text-sm text-gray-600">💡 Perguntas comuns:</p>
				<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
					{#each quickSuggestions as suggestion}
						<button
							on:click={() => sendQuickMessage(suggestion)}
							class="rounded-lg bg-gray-50 px-3 py-2 text-left text-sm text-purple-200 transition-all duration-200 hover:bg-purple-700/50 hover:text-gray-900"
						>
							{suggestion}
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Message Input -->
		<div class="border-t border-gray-200/30 p-4">
			<div class="flex space-x-3">
				<div class="flex-1">
					<textarea
						bind:value={messageInput}
						on:keypress={handleKeyPress}
						placeholder="Digite sua pergunta sobre problemas automotivos..."
						class="input-automotive h-12 w-full resize-none"
						rows="1"
						disabled={$isTyping}
					></textarea>
				</div>
				<button
					on:click={sendMessage}
					disabled={!messageInput.trim() || $isTyping}
					class="btn-primary px-4 py-3 {!messageInput.trim() || $isTyping
						? 'cursor-not-allowed opacity-50'
						: ''}"
				>
					<Send size={20} />
				</button>
			</div>
			<p class="mt-2 text-xs text-purple-600">
				💡 Pressione Enter para enviar, Shift + Enter para quebrar linha
			</p>
		</div>
	</div>

	<!-- Disclaimer -->
	<div class="mt-6 rounded-lg border border-gray-200/30 bg-gray-50 p-4">
		<p class="text-center text-sm text-gray-600">
			⚠️ <strong>Aviso:</strong> O Tião Mecânico oferece orientações gerais. Para problemas específicos,
			sempre consulte um mecânico profissional.
		</p>
	</div>
</div>
