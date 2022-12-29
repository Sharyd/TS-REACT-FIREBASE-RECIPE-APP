import React, { useEffect, useState } from 'react';
import {
	Button,
	CardContent,
	ListItem,
	Typography,
	List,
	TextField
} from '@mui/material';
import { CommentsRecipe, Recipe } from '../utils/firebase';
import { Box } from '@mui/system';
import { capitalizeFirstLetters } from '../utils/helpers';
import Comments from './Comments';

import {
	addDoc,
	collection,
	onSnapshot,
	query,
	serverTimestamp,
	where
} from 'firebase/firestore';
import { useLoggedInUser } from '../hooks/useLoggedInUser';
import { commentsCollection } from '../utils/firebase';
enum type {
	DESCRIPTION,
	INGREDIENTS
}

const RecipeDetail = ({
	// from,
	id,
	title,
	description,
	ingredients,
	steps,
	stars,
	image,
	by
}: Recipe) => {
	const [active, setActive] = useState(type.DESCRIPTION);
	const [commentText, setCommentText] = useState('');
	const [commentsRecipe, setCommentsRecipe] = useState<CommentsRecipe[]>([]);
	const [showComments, setShowComments] = useState(false);
	const [submitError, setSubmitError] = useState<string>();
	const user = useLoggedInUser();

	const sendComment = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		if (commentText.trim() === '') return;
		try {
			await addDoc(commentsCollection, {
				comment: commentText,
				recipeId: id,
				userId: user?.uid,
				email: user?.email,
				timestamp: serverTimestamp()
			});
		} catch (err) {
			setSubmitError(
				(err as { message?: string })?.message ?? 'Unknown error occurred'
			);
		}
		setCommentText('');
		setSubmitError('');
	};

	useEffect(() => {
		const unsubscribe = onSnapshot(
			query(commentsCollection, where('recipeId', '==', id)),
			snapshot => {
				setCommentsRecipe(
					snapshot.docs.map(doc => ({
						...doc.data(),
						commentId: doc.id
					}))
				);
			}
		);
		return () => {
			unsubscribe();
		};
	}, [id, commentsCollection]);

	return (
		<CardContent>
			<Box
				sx={{
					display: 'flex',
					// alignItems: 'center',
					justifyContent: 'start',

					flexDirection: { xs: 'column', md: 'row' },
					gap: { xs: 4, md: 12 }
				}}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column',
						gap: 4
					}}
				>
					<Typography
						variant="h4"
						sx={{ fontSize: { xs: '1.5rem', md: '1.8rem' } }}
					>
						{capitalizeFirstLetters(title ?? '')}
					</Typography>
					<Box
						component="img"
						sx={{
							maxHeight: { xs: 180, md: 280, lg: 310 }
						}}
						alt="Image recipe"
						src={image}
					/>
				</Box>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'column',
						width: { xs: '100%', md: '270px' },
						maxHeight: { xs: '150px', md: '250px' },
						gap: 2
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							width: '100%',

							justifyContent: 'center',
							gap: 2
						}}
					>
						<Button
							onClick={() => setActive(type.DESCRIPTION)}
							sx={{ width: '100%' }}
						>
							Description
						</Button>
						<Button
							onClick={() => setActive(type.INGREDIENTS)}
							sx={{ width: '100%' }}
						>
							Ingredients
						</Button>
					</Box>
					{active === type.INGREDIENTS && (
						<List
							sx={{
								'width': '100%',

								'borderRadius': '10px',
								'height': { xs: '175px', md: '200px' },
								'overflowY': 'scroll',
								'scrollbarWidth': 'none',
								'&::-webkit-scrollbar': {
									display: 'none'
								}
							}}
						>
							{ingredients?.map(ing => (
								<ListItem key={ing.id}>{ing.ing}</ListItem>
							))}
						</List>
					)}
					{active === type.DESCRIPTION && (
						<Box
							sx={{
								'width': '100%',
								'height': { xs: '200px', md: '400px' },
								'borderRadius': '10px',
								'overflowY': 'scroll',
								'scrollbarWidth': 'none',
								'&::-webkit-scrollbar': {
									display: 'none'
								}
							}}
						>
							<Typography>{description}</Typography>
						</Box>
					)}
				</Box>
			</Box>

			<Typography sx={{ mt: 2, pl: 2 }}>Send a comment</Typography>
			<form onSubmit={sendComment}>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						width: { xs: '100%', md: '58%' },
						gap: 1
					}}
				>
					<TextField
						value={commentText}
						onChange={e => setCommentText(e.target.value)}
						sx={{ mt: 2 }}
						label="Send comment"
					/>
					{submitError && (
						<Typography variant="subtitle2" align="left" color="error">
							{submitError}
						</Typography>
					)}
					<Button type="submit" sx={{ alignSelf: 'center' }}>
						Send
					</Button>
				</Box>
			</form>
			<Button onClick={() => setShowComments(prev => !prev)}>
				Show comments
			</Button>
			{showComments && (
				<Box
					sx={{
						'overflowY': 'scroll',
						'scrollbarWidth': 'none',
						'&::-webkit-scrollbar': {
							display: 'none'
						},
						'maxHeight': { xs: '150px', md: '200px' },
						'width': { xs: '100%', md: '100%' }
					}}
				>
					{commentsRecipe?.map(comments => (
						<Comments key={comments.commentId} {...comments} />
					))}
				</Box>
			)}

			{showComments && commentsRecipe.length === 0 && (
				<Typography variant="subtitle2">No comments yet!</Typography>
			)}
		</CardContent>
	);
};

export default RecipeDetail;
