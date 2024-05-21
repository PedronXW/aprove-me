import { Answer } from '@/domain/enterprise/entities/answer'

export class AnswerPresenter {
  static toHTTP(answer: Answer) {
    return {
      id: answer.id.getValue(),
      content: answer.content,
      authorId: answer.authorId.getValue(),
      questionId: answer.questionId.getValue(),
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
