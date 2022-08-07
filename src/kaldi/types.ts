export interface Sale {
  activeSale: string;
  shopName: string;
  shopAddress: string;
  saleName: string;
  salePeriod: string;
  saleDetail: string;
}
export interface Content {
  name: string;
  url: string;
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
