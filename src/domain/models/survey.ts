export interface SurveyModel {
  question: string
  answers: SurveyAnswerModel[]
  date: Date
  id: string
}

export interface SurveyAnswerModel {
  image?: string
  answer: string
}
