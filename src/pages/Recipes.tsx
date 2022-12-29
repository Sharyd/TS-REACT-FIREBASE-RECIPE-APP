import { FC, useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';

import ReviewRecipe from '../components/ReviewRecipe';
import AddRecipe from '../components/AddRecipe';
import { recipesCollection, Recipe } from '../utils/firebase';
import { useLoggedInUser } from '../hooks/useLoggedInUser';

const Recipes: FC = () => {
	const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
	const user = useLoggedInUser();

	useEffect(() => {
		const unsubscribe = onSnapshot(
			query(
				recipesCollection,
				where('by', '==', user?.email),
				orderBy('timestamp', 'desc')
			),
			snapshot => {
				setMyRecipes(snapshot.docs.map(doc => doc.data()));
			}
		);
		return () => {
			unsubscribe();
		};
	}, []);

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
					{myRecipes?.map((r, i) =>
						user?.email === r.by ? (
							<ReviewRecipe from="recipe" key={i} {...r} />
						) : (
							''
						)
					)}
				</Box>
			</Box>
		</>
	);
};

export default Recipes;
