import { Star, StarBorder } from '@mui/icons-material';
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Tooltip,
	Typography
} from '@mui/material';
import { deleteDoc, onSnapshot, query, setDoc } from 'firebase/firestore';
import { FC, PropsWithChildren } from 'react';

import { useLoggedInUser } from '../hooks/useLoggedInUser';
import {
	Recipe,
	recipeReviewCollection,
	recipeReviewDocument,
	recipesDocument,
	ReviewRecipe as ReviewRecipeType
} from '../utils/firebase';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { capitalizeFirstLetters } from '../utils/helpers';
import { useCallback } from 'react';
type Props = PropsWithChildren<{
	from: string;
}>;

const ReviewRecipe: FC<Recipe & Props> = ({ from, id, title, image }) => {
	const user = useLoggedInUser();

	const [reviewStarsFromFirebase, setReviewStarsFromFirebase] = useState<
		ReviewRecipeType | undefined
	>(undefined);
	const [reviews, setReviews] = useState<ReviewRecipeType[]>([]);
	const [hoverStars, setHoverStars] = useState<number>(0);
	const [userReviewed, setUserReviewed] = useState(false);

	useEffect(
		() =>
			setReviewStarsFromFirebase(
				reviews?.find(reviews => reviews.email === user?.email && reviews.stars)
			),

		[reviews, user]
	);

	useEffect(
		() =>
			setUserReviewed(
				reviews?.findIndex(review => review.id === user?.uid) !== -1
			),

		[reviews, user]
	);

	const sendReview = useCallback(
		async (i: number) => {
			try {
				if (userReviewed) {
					await deleteDoc(recipeReviewDocument(id ?? '', user?.uid ?? ''));
				} else {
					await setDoc(recipeReviewDocument(id ?? '', user?.uid ?? ''), {
						email: user?.email,
						stars: i + 1
					});
				}
			} catch (err) {
				console.log(err);
			}
		},
		[userReviewed, user, id]
	);

	useEffect(() => {
		if (!id) return;

		onSnapshot(query(recipeReviewCollection(id ?? '')), snapshot => {
			setReviews(snapshot.docs.map(doc => doc?.data()));
		});
	}, [recipeReviewCollection, id]);

	return (
		<Card
			sx={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				alignItems: 'center'
			}}
		>
			<CardContent
				sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
			>
				<Typography variant="h5" color="textSecondary">
					{capitalizeFirstLetters(title ?? '')}
				</Typography>
				<Box
					my={2}
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					{[...Array(5).keys()].map(i =>
						i < ((hoverStars || reviewStarsFromFirebase?.stars) ?? '') ? (
							<Star
								onClick={() => {
									user ? sendReview(i) : alert('You are not authenticated');
								}}
								key={i}
								color="primary"
								sx={{ cursor: 'pointer' }}
								onMouseEnter={() => setHoverStars(i + 1)}
								onMouseLeave={() => setHoverStars(0)}
							/>
						) : (
							<StarBorder
								key={i}
								color="primary"
								sx={{ cursor: 'pointer' }}
								onMouseEnter={() => setHoverStars(i + 1)}
								onMouseLeave={() => setHoverStars(0)}
							/>
						)
					)}
					<Tooltip
						title={`${reviews
							.map(rev => rev.email)
							.slice(0, 10)
							.join('\n')} ${reviews?.length === 10 ? '...' : ''}
							${reviews.length === 0 ? 'No reviews' : ''}`}
					>
						<Typography
							color="primary"
							sx={{
								textDecoration: 'underline',
								ml: 0.5,
								fontSize: '1.15rem',
								position: 'relative'
							}}
						>
							{reviews?.length}
						</Typography>
					</Tooltip>
				</Box>
				<Box
					component="img"
					sx={{
						height: 190,
						objectFit: 'contain'
					}}
					alt="Image recipe"
					src={image}
				/>
				{/* {description && <Typography>{description}</Typography>} */}
				<Button component={Link} to={`/recipes/${id}`} sx={{ mt: 2 }}>
					Show more
				</Button>
			</CardContent>
			{from === 'myRecipes' && (
				<CardActions sx={{ pb: 2 }}>
					<Button
						variant="contained"
						color="error"
						onClick={() =>
							deleteDoc(recipesDocument(id ?? ''))
								.then(() => {
									console.log('Recipe successfully deleted.');
								})
								.catch(error => {
									console.log(error);
								})
						}
					>
						Delete recipe
					</Button>
				</CardActions>
			)}
		</Card>
	);
};

export default ReviewRecipe;
