import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { themeDark, themeLight } from './utils/theme';
import Layout from './components/Layout';
import AppRoutes from './components/Routes';
import { UserProvider } from './hooks/useLoggedInUser';
import { useLocalStorage } from './hooks/useLocalStorage';

const App = () => {
	const [mode, setMode] = useLocalStorage('mode', false);

	const changeTheme = () => {
		setMode(prev => !prev);
	};

	return (
		<UserProvider>
			<ThemeProvider theme={mode ? themeLight : themeDark}>
				<BrowserRouter>
					<CssBaseline />
					<Layout changeTheme={changeTheme} mode={mode}>
						<AppRoutes />
					</Layout>
				</BrowserRouter>
			</ThemeProvider>
		</UserProvider>
	);
};

export default App;
