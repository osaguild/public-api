export interface Sale {
  activeSale: ActiveSale;
  shopName: string;
  shopAddress: string;
  saleName: string;
  saleFrom: string;
  saleTo: string;
  saleDetail: string;
}

export interface File {
  createdAt: string;
  data: Sale[];
}

export type ActiveSale = "ACTIVE _SALE" | "SALE_NOTICE";
