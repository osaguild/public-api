export interface Message {
  type: string;
  text: string;
}

export interface MessagingApiRequest {
  messages: Message[];
}
