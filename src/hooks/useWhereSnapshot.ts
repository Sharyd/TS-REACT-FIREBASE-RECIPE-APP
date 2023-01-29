import React, { useEffect, useState } from 'react';
import {
	onSnapshot,
	query,
	QueryConstraint,
	Unsubscribe,
	where
} from 'firebase/firestore';
import { recipesCollection, Recipe } from '../utils/firebase';

const useWhereSnapshot = (
	field: string,
	item: string | null | undefined,
	sortByNewest?: QueryConstraint
) => {
	const [value, setValue] = useState<Recipe[]>([]);
	useEffect(() => {
		let unsubscribe: Unsubscribe;
		if (!sortByNewest) {
			unsubscribe = onSnapshot(
				query(recipesCollection, where(field, '==', item)),

				snapshot => {
					setValue(snapshot.docs.map(doc => doc.data()));
				}
			);
		} else {
			unsubscribe = onSnapshot(
				query(recipesCollection, where(field, '==', item), sortByNewest),

				snapshot => {
					setValue(snapshot.docs.map(doc => doc.data()));
				}
			);
		}
		return () => {
			unsubscribe();
		};
	}, [item]);
	return { value };
};

export default useWhereSnapshot;
