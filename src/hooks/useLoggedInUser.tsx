import {
	useEffect,
	createContext,
	FC,
	PropsWithChildren,
	useState,
	useContext
} from 'react';
import { User } from 'firebase/auth';

import { onAuthChanged } from '../utils/firebase';

type ContextState = { user: User | null };

const UserContext = createContext<ContextState | undefined>(undefined);

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const userValue = { user };

	useEffect(() => {
		onAuthChanged(user => setUser(user ?? null));
	}, []);

	return (
		<UserContext.Provider value={userValue}>{children}</UserContext.Provider>
	);
};

export const useLoggedInUser = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		return null;
	}
	return context.user;
};
