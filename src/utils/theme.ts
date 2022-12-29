import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
	interface Palette {
		playerX?: string;
		playerO?: string;
	}

	interface PaletteOptions {
		playerX?: string;
		playerO?: string;
	}
}

export const themeDark = createTheme({
	palette: {
		primary: { main: '#f2d45c' },
		playerX: '#f25a5a',
		playerO: '#5a8cf2',
		mode: 'dark'
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				'body, #root': {
					display: 'flex',
					flexDirection: 'column',
					minHeight: '100vh'
				}
			}
		}
	}
});

export const themeLight = createTheme({
	palette: {
		background: {
			default: 'rgba(0, 0, 0, 0.08)'
		},
		primary: { main: '#f2d45c' },
		secondary: { main: 'rgba(0, 0, 0, 0.87)' },
		playerX: '#f25a5a',
		playerO: '#5a8cf2',
		mode: 'light'
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				'body, #root': {
					display: 'flex',
					flexDirection: 'column',
					minHeight: '100vh'
				}
			}
		}
	}
});
