export interface TokenGenerator {
  generate: (id: string) => string
}
