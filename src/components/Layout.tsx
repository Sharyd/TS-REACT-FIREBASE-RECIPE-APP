import { FC, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Container, Toolbar, Button, Box } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { useLoggedInUser } from '../hooks/useLoggedInUser';
import { signOut } from '../utils/firebase';
import DarkModeIcon from '@mui/icons-material/DarkMode';

type Props = {
	children: ReactNode;
	changeTheme: () => void;
	mode: boolean;
};

const Layout: FC<Props> = ({ children, changeTheme, mode }) => {
	const user = useLoggedInUser();
	const navigate = useNavigate();

	return (
		<>
			<AppBar sx={{ position: 'sticky', top: 0 }} color="secondary">
				<Container maxWidth="sm">
					<Toolbar disableGutters sx={{ gap: 2 }}>
						<Button component={Link} to="/">
							Recipes
						</Button>
						{user ? (
							<Button component={Link} to="/recipes">
								My Recipes
							</Button>
						) : (
							''
						)}
						<Box sx={{ flexGrow: 1 }} />
						{!user ? (
							<Button component={Link} to="/login">
								Login
							</Button>
						) : (
							<Button
								onClick={() => {
									signOut();
									navigate('/login');
								}}
							>
								Logout
							</Button>
						)}
						<Button onClick={changeTheme}>
							{!mode ? (
								<WbSunnyIcon sx={{ height: '1rem', width: '1rem' }} />
							) : (
								<DarkModeIcon sx={{ height: '1rem', width: '1rem' }} />
							)}
						</Button>
					</Toolbar>
				</Container>
			</AppBar>

			<Container
				maxWidth="lg"
				component="main"
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					height: '100%',
					alignItems: 'center',
					flexGrow: 1,
					gap: 2,
					py: 2
				}}
			>
				{children}
			</Container>
		</>
	);
};
export default Layout;
