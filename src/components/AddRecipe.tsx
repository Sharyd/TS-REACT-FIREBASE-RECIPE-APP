import {
	Box,
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	List,
	ListItem,
	TextField,
	Typography
} from '@mui/material';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { ReactNode, useState } from 'react';
import { addDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Ing, storage } from '../utils/firebase';
import useField from '../hooks/useField';
import { db, recipesCollection } from '../utils/firebase';
import { useLoggedInUser } from '../hooks/useLoggedInUser';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { arrayOfCategories } from '../utils/helpers';
import LoadingSpinner from './LoadingSpinner';
type Props = {
	children: (open: () => void) => ReactNode;
};

const AddRecipe = ({ children }: Props) => {
	const user = useLoggedInUser();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [submitError, setSubmitError] = useState<string>();

	const [title, titleProps] = useField('title');
	const [description, descriptionProps] = useField('description');
	const [ingredients, ingredientsProps] = useField('ingredients');
	const [category, setCategory] = useState('');

	const [ingredientsArray, setIngredientsArray] = useState<Ing>([]);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const closeDialog = () => {
		setOpen(false);
		descriptionProps.onChange({ target: { value: '' } } as never);
		setSubmitError(undefined);
	};

	const addIngredients = () => {
		if (ingredients.trim() === '') return;
		setIngredientsArray(prev => [
			...prev,
			{ ing: ingredients, id: Date.now().toString() }
		]);
		ingredientsProps.onChange({ target: { value: '' } } as never);
	};
	const deleteIngredients = (id: string) => {
		setIngredientsArray(prev => prev.filter(ing => ing.id !== id));
	};

	const addImage = (e: { target: { files: any } }) => {
		const file = e.target.files[0] as File;
		const type = file.type as string;

		if (
			type === 'image/png' ||
			type === 'image/jpg' ||
			type === 'image/jpeg' ||
			type === 'image/webp' ||
			type === 'image/svg' ||
			type === 'image/avif'
		) {
			setSelectedFile(file);
		} else {
			setSubmitError('Wrong image format');
		}
	};

	const handleSubmit = async () => {
		setLoading(true);
		if (!user?.email) {
			setSubmitError('You are not signed in');
			return;
		}
		if (
			description.trim() === '' ||
			title.trim() === '' ||
			ingredientsArray.length === 0 ||
			selectedFile === null
		) {
			setLoading(false);
			setSubmitError('Fields must not be empty!');
			return;
		}

		try {
			const { id } = await addDoc(recipesCollection, {
				title: title.toLowerCase(),
				description,
				ingredients: ingredientsArray,
				image: '',
				category: category.toLowerCase(),
				by: user.email,
				timestamp: serverTimestamp()
			});

			const docRef = doc(db, 'recipes', id);
			const storageRef = ref(storage, `posts/${docRef?.id}/${selectedFile}`);

			if (selectedFile) {
				await uploadBytes(storageRef, selectedFile).then(async () => {
					const downloadURL = await getDownloadURL(storageRef);
					await updateDoc(doc(db, 'recipes', docRef.id), {
						image: downloadURL
					});
				});
			}

			updateDoc(docRef, { id })
				.then(docRef => {
					console.log('Successfully updated.');
				})
				.catch(error => {
					console.log(error);
				});

			closeDialog();
		} catch (err) {
			setSubmitError(
				(err as { message?: string })?.message ?? 'Unknown error occurred'
			);
		}
		setLoading(false);
		ingredientsProps.onChange({ target: { value: '' } } as never);
		setIngredientsArray([]);
		descriptionProps.onChange({ target: { value: '' } } as never);
		titleProps.onChange({ target: { value: '' } } as never);
		setCategory('');
		setSelectedFile(null);
	};

	if (loading) return <LoadingSpinner />;

	return (
		<>
			{children(() => setOpen(true))}
			<Dialog open={open} onClose={closeDialog}>
				<DialogTitle>Add Recipe</DialogTitle>
				<DialogContent
					sx={{
						'display': 'flex',
						'flexDirection': 'column',
						'gap': 2,
						'minWidth': { xs: 300, md: 450 },
						'overflowY': 'scroll',
						'scrollbarWidth': 'none',
						'&::-webkit-scrollbar': {
							display: 'none'
						}
					}}
				>
					<TextField label="Title" fullWidth {...titleProps} />
					<TextField label="Description" fullWidth {...descriptionProps} />
					<TextField label="Category" fullWidth value={category} />
					<Typography variant="subtitle1">Choose category:</Typography>
					<Box>
						{arrayOfCategories.map((category, i) => (
							<Button key={i} onClick={() => setCategory(category)}>
								{category}
							</Button>
						))}
					</Box>

					<Container
						sx={{
							display: 'flex',
							gap: 2,
							width: '100%'
						}}
						disableGutters
					>
						<TextField
							label="Ingredients"
							{...ingredientsProps}
							sx={{
								width: '100%'
							}}
						/>
						<Button
							sx={{ width: '10%', ml: 'auto', fontSize: '1.5rem' }}
							onClick={addIngredients}
						>
							+
						</Button>
					</Container>

					<List
						sx={{
							width: '100%',
							height: '100%',
							display: 'flex',
							flexDirection: 'column'
						}}
					>
						{ingredientsArray.length !== 0 && (
							<Box
								sx={{
									'maxHeight': 125,
									'overflowY': 'scroll',
									'scrollbarWidth': 'none',
									'&::-webkit-scrollbar': {
										display: 'none'
									}
								}}
							>
								{ingredientsArray?.map(
									(ing: { id: string; ing: string }, i) => (
										<Container
											key={ing.id}
											disableGutters
											sx={{
												display: 'flex',
												gap: 2,
												width: '100%',
												alignItems: 'center',
												justifyContent: 'space-between'
											}}
										>
											<ListItem disableGutters>{ing.ing}</ListItem>
											<Button>
												<HighlightOffIcon
													onClick={() => deleteIngredients(ing.id)}
												/>
											</Button>
										</Container>
									)
								)}
							</Box>
						)}
					</List>

					<Button variant="contained" component="label">
						Upload Image
						<input type="file" hidden onChange={addImage} />
					</Button>
				</DialogContent>
				<DialogActions>
					{submitError && (
						<Typography variant="subtitle2" align="left" color="error">
							{submitError}
						</Typography>
					)}

					<Button onClick={closeDialog}>Cancel</Button>

					<Button onClick={handleSubmit} variant="contained">
						Add
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default AddRecipe;
