import { Card } from '@mui/material';
import { Recipe } from '../utils/firebase';
import { useParams } from 'react-router-dom';
import RecipeDetail from '../components/RecipeDetail';
import usePageTitle from '../hooks/usePageTitle';
import useWhereSnapshot from '../hooks/useWhereSnapshot';
import LoadingSpinner from '../components/LoadingSpinner';

const RecipePage = () => {
	usePageTitle('Recipe');
	const { recipeId } = useParams();

	const { value: recipe } = useWhereSnapshot('id', recipeId);

	if (recipe?.length === 0) return <LoadingSpinner />;
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
