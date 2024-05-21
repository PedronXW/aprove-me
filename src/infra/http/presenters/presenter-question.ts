import { Question } from '@/domain/enterprise/entities/question'

export class QuestionPresenter {
  static toHTTP(question: Question) {
    return {
      id: question.id.getValue(),
      title: question.title,
      content: question.content,
      slug: question.slug.value,
      answeredByCurrentUser: question.answeredByCurrentUser,
      authorId: question.authorId.getValue(),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
