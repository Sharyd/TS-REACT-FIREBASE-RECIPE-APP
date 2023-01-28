import { Box, Button, Typography } from '@mui/material';
import { orderBy } from 'firebase/firestore';

import ReviewRecipe from '../components/ReviewRecipe';
import AddRecipe from '../components/AddRecipe';

import { useLoggedInUser } from '../hooks/useLoggedInUser';
import usePageTitle from '../hooks/usePageTitle';
import useWhereSnapshot from '../hooks/useWhereSnapshot';

const Recipes = () => {
	usePageTitle('Recipes');
	const user = useLoggedInUser();
	const { value: myRecipes } = useWhereSnapshot(
		'by',
		user?.email,
		orderBy('timestamp', 'desc')
	);

	return (
		<>
			<Typography variant="h2" sx={{ mb: 6 }} fontWeight="bolder">
				My recipes
			</Typography>
			<AddRecipe>
				{open => (
					<Button onClick={open} variant="contained" sx={{ mb: 4 }}>
						Add recipe
					</Button>
				)}
			</AddRecipe>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					width: '100%'
				}}
			>
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: {
							xs: '1fr',
							md: '1fr 1fr',
							lg: '1fr 1fr 1fr'
						},
						height: '100%',
						gap: 4,
						width: { xs: '380px', md: '100%' },
						flexDirection: { xs: 'column', lg: 'row' }
					}}
				>
					{myRecipes?.map((recipe, i) =>
						user?.email === recipe.by ? (
							<ReviewRecipe from="myRecipes" key={i} {...recipe} />
						) : (
							''
						)
					)}
				</Box>
				{/* {myRecipes?.length === 0 ? <LoadingSpinner /> : ''} */}
			</Box>
		</>
	);
};

export default Recipes;
