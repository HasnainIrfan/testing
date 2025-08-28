import { useMemo } from 'react'

import debounce from 'debounce'

type SetSearchFunction = (search: string) => void
type SetIsLoadingFunction = ((isLoading: boolean) => void) | undefined

export function generateRandomId() {
  return Math.floor(Math.random() * 9000) + 1000
}

export function generateUniqueId() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0')

  const randomPart = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')

  const uniqueId = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}${randomPart}`
  return uniqueId
}

export function useDebouncedSearch(
  setSearch?: SetSearchFunction,
  setIsLoading?: SetIsLoadingFunction,
  setPage?: (page: number) => void
): SetSearchFunction {
  return useMemo(
    () =>
      debounce((search: string) => {
        if (setSearch) {
          setSearch(search)
        }
        if (setIsLoading) {
          setIsLoading(false)
        }
        if (setPage) {
          setPage(1)
        }
      }, 800),
    [setSearch, setIsLoading, setPage]
  )
}
