export interface Sale {
  activeSale: string;
  shopName: string;
  shopAddress: string;
  saleName: string;
  salePeriod: string;
  saleDetail: string;
}

export interface MessagingApiRequest {
  messages: Message[];
}
export interface Message {
  type: string;
  text: string;
}

export interface HookScrapingRequest {
  hoge: string;
}

export interface HookScrapingResponse {
  statusCode: 200 | 404 | 500;
  headers: { "Access-Control-Allow-Origin": "*" };
  body: string;
}
