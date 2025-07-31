import { useState, useEffect } from 'react';

const KEY: string = 'assetClassFavorites';

interface FavoriteItem {
	class_type: string;
	name?: string;
}

interface FavoritesMap {
	[key: string]: FavoriteItem;
}

const useFavorites = <T extends { id: string; class_type: string, name?: string }>() => {
	const [favorites, setFavorites] = useState<FavoritesMap>({});
	
	useEffect(() => {
		const stored = localStorage.getItem(KEY);
		if (stored) {
			setFavorites(JSON.parse(stored));
		}
	}, []);
	
	const toggleFavorite = (item: T) => {
		const newFavorites = { ...favorites };
		
		if (item.id in newFavorites) {
			delete newFavorites[item.id];
		} else {
			newFavorites[item.id] = { class_type: item.class_type, name: item.name };
		}
		
		localStorage.setItem(KEY, JSON.stringify(newFavorites));
		setFavorites(newFavorites);
	};
	
	const isFavorite = (id: string) => id in favorites;
	
	return { favorites, toggleFavorite, isFavorite };
};

export default useFavorites;
