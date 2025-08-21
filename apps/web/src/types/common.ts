export type Nullable<T> = T | null
export type EmptyStringOr<T> = T | ''

export interface RouteType {
  path: string
  Component: React.ComponentType
}
