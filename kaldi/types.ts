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
  body: {
    action: string;
    workflow_run: {
      name: string;
      head_branch: string;
      path: string;
      event: string;
      status: string;
      conclusion: string;
    };
  };
}

export interface Response {
  statusCode: 200 | 404 | 500;
  headers: { "Access-Control-Allow-Origin": "*" };
  body: string;
}
