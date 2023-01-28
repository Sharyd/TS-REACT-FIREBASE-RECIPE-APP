import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut as authSignOut,
	onAuthStateChanged,
	User
} from 'firebase/auth';
import {
	collection,
	CollectionReference,
	doc,
	DocumentReference,
	getFirestore,
	Timestamp
} from 'firebase/firestore';

initializeApp({
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID
});

const auth = getAuth();

export const signUp = (email: string, password: string) =>
	createUserWithEmailAndPassword(auth, email, password);

export const signIn = (email: string, password: string) =>
	signInWithEmailAndPassword(auth, email, password);

export const signOut = () => authSignOut(auth);

export const onAuthChanged = (callback: (u: User | null) => void) =>
	onAuthStateChanged(auth, callback);

export const db = getFirestore();
export const storage = getStorage();
export type Ing = {
	id: string;
	ing: string;
}[];

export type Recipe = {
	id?: string;
	title: string;
	description?: string;
	ingredients?: Ing;
	image?: string;
	stars?: number;
	category: string;
	by: string;
	timestamp: Timestamp;
};
export type CommentsRecipe = {
	commentId?: string;
	comment: string;
	recipeId: string | undefined;
	userId: string | undefined;
	email: string | null | undefined;
	timestamp: Timestamp;
};

export type ReviewRecipe = {
	id?: string | undefined;
	email: string | null | undefined;
	stars: number;
};

export type CommentsLike = {
	id?: string | undefined;
	email: string | null | undefined;
};

export const recipesCollection = collection(
	db,
	'recipes'
) as CollectionReference<Recipe>;

export const recipeReviewCollection = (id: string) =>
	collection(db, 'recipes', id, 'review') as CollectionReference<ReviewRecipe>;

export const commentsCollection = collection(
	db,
	'comments'
) as CollectionReference<CommentsRecipe>;

export const commentsLikesCollection = (id: string) =>
	collection(db, 'comments', id, 'likes') as CollectionReference<CommentsLike>;

export const recipeReviewDocument = (id: string, userId: string) =>
	doc(db, 'recipes', id, 'review', userId) as DocumentReference<ReviewRecipe>;

export const recipesDocument = (id: string) =>
	doc(db, 'recipes', id) as DocumentReference<Recipe>;

export const commentsLikesDocument = (commentId: string, userId: string) =>
	doc(
		db,
		'comments',
		commentId,
		'likes',
		userId
	) as DocumentReference<CommentsLike>;

export const commentDocument = (id: string) =>
	doc(db, 'comments', id) as DocumentReference<CommentsRecipe>;
