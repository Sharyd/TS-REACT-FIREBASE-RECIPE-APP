import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { useLoggedInUser } from '../hooks/useLoggedInUser';
import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Recipes from '../pages/Recipes';
import Recipe from '../pages/Recipe';
import Category from '../pages/Category';

const AppRoutes = () => {
	const user = useLoggedInUser();

	return (
		<Routes>
			<Route path="/" element={<Home />} />
			{!user && <Route path="/login" element={<Login />} />}
			{user && <Route path="/recipes" element={<Recipes />} />}
			<Route path="/recipes/:recipeId" element={<Recipe />} />
			<Route path="/category/:searchText" element={<Category />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
};
export default AppRoutes;
