import { useParams } from 'react-router-dom';
import { Box } from '@mui/system';
import ReviewRecipe from '../components/ReviewRecipe';
import { Typography } from '@mui/material';
import { capitalizeFirstLetters } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

import useWhereSnapshot from '../hooks/useWhereSnapshot';
import usePageTitle from '../hooks/usePageTitle';

const Category = () => {
	usePageTitle('Category');

	const { searchText } = useParams();

	const { value: searchByCategory } = useWhereSnapshot('category', searchText);
	const { value: searchByTitle } = useWhereSnapshot('title', searchText);

	return (
		<>
			{searchByCategory.length !== 0 || searchByTitle.length !== 0 ? (
				<>
					{searchByCategory.length !== 0 || searchByTitle.length !== 0 ? (
						<Typography variant="h2" sx={{ mb: 4 }}>
							{capitalizeFirstLetters(searchText ?? '')}
						</Typography>
					) : (
						''
					)}
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
							width: { xs: '410px', md: '100%' },
							flexDirection: { xs: 'column', lg: 'row' }
						}}
					>
						{searchByCategory.length !== 0 &&
							searchByCategory?.map((r, i) => (
								<ReviewRecipe from="home" key={i} {...r} />
							))}
						{searchByTitle.length !== 0 &&
							searchByTitle?.map((r, i) => (
								<ReviewRecipe from="home" key={i} {...r} />
							))}
					</Box>
				</>
			) : (
				<Typography variant="h5">
					No {capitalizeFirstLetters(searchText ?? '')} recipe found
				</Typography>
			)}
		</>
	);
};

export default Category;
