import { useCallback, useMemo, useState } from 'react'

export function useBooleans(initialValues: boolean[] = []) {
  const [values, setValues] = useState<boolean[]>(initialValues)

  const setTrue = useCallback((index: number) => {
    setValues((prev) => {
      const newValues = [...prev]
      newValues[index] = true
      return newValues
    })
  }, [])

  const setFalse = useCallback((index: number) => {
    setValues((prev) => {
      const newValues = [...prev]
      newValues[index] = false
      return newValues
    })
  }, [])

  const toggle = useCallback((index: number) => {
    setValues((prev) => {
      const newValues = [...prev]
      newValues[index] = !newValues[index]
      return newValues
    })
  }, [])

  const setAll = useCallback((value: boolean) => {
    setValues((prev) => prev.map(() => value))
  }, [])

  // Helper to update a specific index
  const setBooleanAt = useCallback((index: number, value: boolean) => {
    setValues((prev) => {
      const newValues = [...prev]
      newValues[index] = value
      return newValues
    })
  }, [])

  const setters = useMemo(() => {
    return values.map((_, index) => (value: boolean) => setBooleanAt(index, value))
  }, [values, setBooleanAt])

  // Factory function to create a setter for a specific index
  const createSetter = useCallback(
    (index: number) => (value: boolean) => {
      setBooleanAt(index, value)
    },
    [setBooleanAt]
  )

  return {
    values,
    setValues,
    setTrue,
    setFalse,
    toggle,
    setAll,
    setBooleanAt,
    createSetter,
    setters,
  }
}

// Standalone hook for creating boolean state setters
export function useCreateBooleanSetter(setBooleanAt: (index: number, value: boolean) => void) {
  return useCallback(
    (index: number) => (value: boolean) => {
      setBooleanAt(index, value)
    },
    [setBooleanAt]
  )
}
