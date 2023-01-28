import { Box, Button, Tooltip, Typography } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import {
	commentDocument,
	CommentsLike,
	commentsLikesCollection,
	commentsLikesDocument,
	CommentsRecipe,
	db
} from '../utils/firebase';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useLoggedInUser } from '../hooks/useLoggedInUser';
import { deleteDoc, onSnapshot, query, setDoc } from 'firebase/firestore';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
const Comments: FC<CommentsRecipe> = ({
	comment,
	commentId,
	email,
	userId
}) => {
	const user = useLoggedInUser();
	const [liked, setLiked] = useState(false);
	const [likes, setLikes] = useState<CommentsLike[]>([]);

	useEffect(
		() => setLiked(likes.findIndex(like => like?.email === user?.email) !== -1),
		[likes]
	);
	useEffect(
		() =>
			onSnapshot(query(commentsLikesCollection(commentId ?? '')), snapshot => {
				setLikes(snapshot.docs.map(doc => doc.data()));
			}),
		[db]
	);

	const sendLike = async () => {
		if (liked) {
			await deleteDoc(commentsLikesDocument(commentId ?? '', user?.uid ?? ''));
		} else {
			await setDoc(commentsLikesDocument(commentId ?? '', user?.uid ?? ''), {
				email: user?.email
			});
		}
	};

	return (
		<Box
			sx={{
				borderTop: '1px solid rgba(255, 255, 255, 0.336)',
				width: '100%',
				maxHeight: '200px',

				mt: 2
			}}
		>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					flexWrap: 'wrap',
					mt: 2
				}}
			>
				<Typography variant="subtitle2" sx={{ whiteSpace: 'pre-wrap' }}>
					{comment}
				</Typography>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<Typography variant="subtitle2">{email}</Typography>
					{user?.uid === userId && (
						<Button
							onClick={() =>
								deleteDoc(commentDocument(commentId ?? ''))
									.then(() => {
										console.log('Comment successfully deleted.');
									})
									.catch(error => {
										console.log(error);
									})
							}
						>
							<HighlightOffIcon />
						</Button>
					)}
					{user?.uid !== userId && (
						<Tooltip
							title={`${likes
								.map(like => like.email)
								.slice(0, 8)
								.join('\n')} ${likes.length === 6 ? '...' : ''} ${
								likes.length === 0 ? 'No like' : ''
							}`}
						>
							<Button onClick={sendLike}>
								{liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
							</Button>
						</Tooltip>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default Comments;
