export const capitalizeFirstLetters = (text: string) => {
	return text
		.split(' ')
		.map(t => t.replace(t[0], t[0].toUpperCase()))
		.join(' ');
};

export const arrayOfCategories = [
	'burger',
	'pizza',
	'english',
	'chinese',
	'mexican',
	'czech',
	'beef',
	'pasta',
	'seafood'
];
