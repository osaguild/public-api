type Sale = {
  activeSale: "ACTIVE _SALE" | "SALE_NOTICE";
  shopName: string;
  shopAddress: string;
  saleName: string;
  saleFrom: string;
  saleTo: string;
  saleDetail: string;
  isNew: boolean;
};

type KaldiSaleInfo = {
  createdAt: string;
  data: Sale[];
};

export { Sale, KaldiSaleInfo };
