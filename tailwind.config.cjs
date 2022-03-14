const colors = require('tailwindcss/colors');

module.exports = {
	// mode: 'jit',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			calsans: [
				'Cal Sans',
				'ui-sans-serif',
				'-apple-system',
				'Helvetica Neue',
				'Segoe UI',
				'Roboto',
				'Arial',
				'Noto Sans',
				'sans-serif',
				'Apple Color Emoji',
				'Noto Color Emoji',
				'Segoe UI Emoji',
				'Segoe UI Symbol'
			],
			javanese: ['sans-serif', 'Javanese Text', 'sans-serif']
		},
		extend: {
			colors: {
				rose: colors.rose
			}
		}
	},
	variants: {
		animation: ['responsive', 'hover'],
		extend: {
			opacity: ['disabled'],
			pointerEvents: ['disabled']
		}
	},
	plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
};
