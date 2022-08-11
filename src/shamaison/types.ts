export interface Building {
  name: string;
  address: string;
  access: string;
  yearBuilt: string;
  numberOfStairs: string;
  url: string;
  rooms: Room[];
}

export interface Room {
  roomNo: string;
  rent: string;
  floorPlan: string;
  area: string;
  url: string;
}

export interface Station {
  name: string;
  url: string;
}
