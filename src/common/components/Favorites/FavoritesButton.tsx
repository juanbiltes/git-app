import { useFavorites } from "./hooks/useFavorites"
import styles from "./FavoritesButton.module.css"

interface FavoriteButtonProps {
  username: string
}

export function FavoriteButton({ username }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const favorite = isFavorite(username)

  const handleToggleFavorite = () => {
    if (favorite) {
      removeFavorite(username)
    } else {
      addFavorite(username)
    }
  }

  return (
    <button aria-label={favorite ? "Remove from favorites" : "Add to favorites"} onClick={handleToggleFavorite} className={`${styles.favoriteButton} ${favorite ? styles.favorite : ""}`}>
        {favorite ? "★" : "☆"}
    </button>
  )
}

