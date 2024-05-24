export type Mail = {
  from: string
  to: string
  subject: string
  text: string
}

export abstract class MailRepository {
  abstract sendMail(mail: Mail): Promise<void>
}
