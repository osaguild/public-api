export interface Building {
  name: string;
  address: string;
  station: string;
  distance: string;
  yearBuilt: string;
  numberOfStairs: number;
  url: string;
  rooms: Room[];
}

export interface Room {
  roomNo: string;
  rent: number;
  floorPlan: string;
  space: number;
  url: string;
}

export interface Station {
  name: string;
  url: string;
}

export interface File {
  createdAt: string;
  stations: Station[];
  data: Building[];
}
