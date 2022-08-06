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

export interface HookRequest {
  body: string;
}

export interface HookRequestBody {
  action: string;
  workflow_run: {
    name: string;
    head_branch: string;
    path: string;
    status: string;
    conclusion: string;
  };
}

export interface Response {
  statusCode: 200 | 400 | 500;
  headers: { "Access-Control-Allow-Origin": "*" };
  body: string;
}

export interface Content {
  name: string;
  url: string;
}
