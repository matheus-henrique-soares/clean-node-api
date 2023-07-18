// obrigo as clases a possuirem um padrao de recebimento e envio, impedindo erros de compilacao
export interface HttpResponse {
  statusCode: number
  body: any
}
// clases do tipo get nao precisam de um body necessariamente, podendo ser null
export interface HttpRequest {
  body?: any
  headers?: any
}
