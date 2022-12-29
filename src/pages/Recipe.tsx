import { Card, CardContent, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { onSnapshot, query, where } from 'firebase/firestore';
import { recipesCollection, Recipe } from '../utils/firebase';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RecipeDetail from '../components/RecipeDetail';

const RecipePage = () => {
	const { recipeId } = useParams();
	const [recipe, setRecipe] = useState<Recipe[]>([]);
	useEffect(() => {
		const unsubscribe = onSnapshot(
			query(recipesCollection, where('id', '==', recipeId)),
			snapshot => {
				setRecipe(snapshot.docs.map(doc => doc.data()));
			}
		);
		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<Card
			sx={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				minHeight: '600px',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			{recipe?.map((recipe: Recipe) => (
				<RecipeDetail key={recipe.id} {...recipe} />
			))}
		</Card>
	);
};

export default RecipePage;
