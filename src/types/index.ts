export type PhotosType = {
  id: number,
  url: string,
};

export type AnswersType = {
  id: number,
  body: string,
  date: string,
  answerer_name: string,
  helpfulness: number,
  photos: PhotosType[]
};

export type QuestionType = {
  question_id: number,
  question_body: string,
  question_date: string,
  asker_name: string,
  question_helpfulness: number,
  reported: boolean,
  answers: {
    [x: number] : AnswersType
  }
};

export type GetQuestionsResultType = {
  product_id: string,
  results: QuestionType[]
};
