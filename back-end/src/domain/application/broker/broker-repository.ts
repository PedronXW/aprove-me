export abstract class BrokerRepository {
  abstract sendMessage(message: string)
  abstract sendMessageToDeadQueue(message: string): void
}
