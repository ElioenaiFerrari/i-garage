/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				automotive: {
					50: '#faf7ff',
					100: '#f3edff',
					200: '#e8ddff',
					300: '#d5c1ff',
					400: '#bb97ff',
					500: '#a167ff',
					600: '#8b3eff',
					700: '#7c2dff',
					800: '#6a1bdb',
					900: '#5a17b4',
					950: '#380b7a'
				},
				purple: {
					50: '#faf7ff',
					100: '#f3edff',
					200: '#e8ddff',
					300: '#d5c1ff',
					400: '#bb97ff',
					500: '#a167ff',
					600: '#8b3eff',
					700: '#7c2dff',
					800: '#6a1bdb',
					900: '#5a17b4',
					950: '#380b7a'
				}
			},
			animation: {
				'spin-slow': 'spin 3s linear infinite',
				'bounce-subtle': 'bounce 1s ease-in-out infinite',
				'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'slide-in': 'slideIn 0.3s ease-out',
				'slide-out': 'slideOut 0.3s ease-in',
				speedometer: 'speedometer 1s ease-out',
				'gear-spin': 'gearSpin 2s linear infinite',
				vibrate: 'vibrate 0.3s ease-in-out infinite alternate'
			},
			keyframes: {
				slideIn: {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				slideOut: {
					'0%': { transform: 'translateX(0)', opacity: '1' },
					'100%': { transform: 'translateX(-100%)', opacity: '0' }
				},
				speedometer: {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(90deg)' }
				},
				gearSpin: {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				vibrate: {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(2px)' }
				}
			},
			backgroundImage: {
				'car-pattern':
					'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23a167ff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')'
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
};
