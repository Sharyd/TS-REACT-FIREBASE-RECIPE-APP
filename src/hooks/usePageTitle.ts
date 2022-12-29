import { useEffect } from 'react';

const usePageTitle = (title: string) => {
	useEffect(() => {
		document.title = `${title} | Recipes`;
	}, [title]);
};

export default usePageTitle;
