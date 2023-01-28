import { Box, Button, TextField, Typography } from '@mui/material';

import { FormEvent, useEffect, useState } from 'react';
import { onSnapshot, orderBy, query } from 'firebase/firestore';

import usePageTitle from '../hooks/usePageTitle';

import { Recipe, recipesCollection } from '../utils/firebase';
import ReviewRecipe from '../components/ReviewRecipe';
import SearchIcon from '@mui/icons-material/Search';

import { useNavigate } from 'react-router-dom';
import { arrayOfCategories } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
	usePageTitle('Home');

	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [searchText, setSearchText] = useState('');

	const navigate = useNavigate();

	useEffect(
		() =>
			onSnapshot(
				query(recipesCollection, orderBy('timestamp', 'desc')),
				snapshot => {
					setRecipes(snapshot.docs.map(doc => doc.data()));
				}
			),
		[recipesCollection]
	);
	const submitSearch = (e: FormEvent) => {
		e.preventDefault();

		navigate('/category/' + searchText);
	};

	return (
		<>
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
				<Typography variant="h2" fontWeight="bolder">
					Recipes
				</Typography>
			</Box>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
					mb: 4
				}}
			>
				<Typography variant="h5" sx={{ mb: 4 }}>
					Popular category
				</Typography>
				<Box
					sx={{
						display: 'flex',
						gap: 2,
						flexWrap: 'wrap',
						maxWidth: 650,
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					{arrayOfCategories.map(btnCategory => (
						<Button
							onClick={() => navigate('/category/' + btnCategory)}
							sx={{
								fontWeight: 'bold'
							}}
							key={btnCategory}
						>
							{btnCategory}
						</Button>
					))}
				</Box>
			</Box>

			<form onSubmit={e => submitSearch(e)}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'flex-end',
						mb: 2
					}}
				>
					<SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />

					<TextField
						label="Search by category & name"
						variant="standard"
						value={searchText}
						onChange={e => setSearchText(e.target.value)}
					/>
				</Box>
			</form>

			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
					height: '100%',
					gap: 4,
					width: { xs: '350px', md: '100%' },
					flexDirection: { xs: 'column', lg: 'row' }
				}}
			>
				{recipes?.map((r, i) => (
					<ReviewRecipe from="recipes" key={i} {...r} />
				))}
			</Box>
			{recipes?.length === 0 ? <LoadingSpinner /> : ''}
		</>
	);
};

export default Home;
