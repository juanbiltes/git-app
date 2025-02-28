import { useState, useEffect } from "react"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const storedFavorites = localStorage.getItem("githubFavorites")
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites))
      } catch (e) {
        console.error("Failed to parse favorites from localStorage:", e)
        setFavorites([])
      }
    }
  }, [])

  const addFavorite = (username: string) => {
    const newFavorites = [...favorites, username]
    setFavorites(newFavorites)
    localStorage.setItem("githubFavorites", JSON.stringify(newFavorites))
  }

  const removeFavorite = (username: string) => {
    const newFavorites = favorites.filter((fav) => fav !== username)
    setFavorites(newFavorites)
    localStorage.setItem("githubFavorites", JSON.stringify(newFavorites))
  }

  const isFavorite = (username: string) => favorites.includes(username)

  return { favorites, addFavorite, removeFavorite, isFavorite }
}
