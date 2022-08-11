export interface Message {
  type: string;
  text: string;
}

export interface MessagingApiRequest {
  messages: Message[];
}

export type AppType = "KALDI" | "SHAMAISON";
