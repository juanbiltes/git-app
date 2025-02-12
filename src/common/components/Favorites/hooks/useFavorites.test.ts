import { renderHook, act } from "@testing-library/react"
import { useFavorites } from "./useFavorites"

describe("useFavorites", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  })

  it("should initialize with empty favorites when localStorage is empty", () => {
    const { result } = renderHook(() => useFavorites())
    
    expect(result.current.favorites).toEqual([])
  })

  it("should load existing favorites from localStorage", () => {
    const existingFavorites = ["user1", "user2"]
    localStorage.setItem("githubFavorites", JSON.stringify(existingFavorites))

    const { result } = renderHook(() => useFavorites())
    
    expect(result.current.favorites).toEqual(existingFavorites)
  })

  it("should handle invalid JSON in localStorage", () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem("githubFavorites", "invalid-json")
    
    const { result } = renderHook(() => useFavorites())
    
    expect(result.current.favorites).toEqual([])
    expect(console.error).toHaveBeenCalledWith("Failed to parse favorites from localStorage:", expect.any(SyntaxError));
  })

  it("should add a favorite", () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.addFavorite("testuser")
    })

    expect(result.current.favorites).toContain("testuser")
    expect(JSON.parse(localStorage.getItem("githubFavorites") || "[]")).toContain("testuser")
  })

  it("should remove a favorite", () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.addFavorite("testuser")
      result.current.removeFavorite("testuser")
    })

    expect(result.current.favorites).not.toContain("testuser")
    expect(JSON.parse(localStorage.getItem("githubFavorites") || "[]")).not.toContain("testuser")
  })

  it("should check if username is in favorites", () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.addFavorite("testuser")
    })

    expect(result.current.isFavorite("testuser")).toBe(true)
    expect(result.current.isFavorite("nonexistent")).toBe(false)
  })

  it("should persist favorites to localStorage when adding", () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.addFavorite("testuser")
    })

    const storedFavorites = JSON.parse(localStorage.getItem("githubFavorites") || "[]")
    expect(storedFavorites).toEqual(["testuser"])
  })
}) 