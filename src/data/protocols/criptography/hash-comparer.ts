export interface HashComparer {
  compare: (password: string, passwordToCompare: string) => Promise<boolean>
}
