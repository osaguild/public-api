type Building = {
  name: string;
  address: string;
  station: string;
  distance: string;
  yearBuilt: string;
  numberOfStairs: number;
  url: string;
  rooms: Room[];
};

type Room = {
  roomNo: string;
  rent: number;
  floorPlan: FloorPlan;
  space: number;
  url: string;
};

type Station = {
  name: string;
  url: string;
};

type ShamaisonBuildingInfo = {
  createdAt: string;
  stations: Station[];
  data: Building[];
};

type FloorPlan =
  | "1R"
  | "1K"
  | "1DK"
  | "1LDK"
  | "2K"
  | "2DK"
  | "2LDK"
  | "3K"
  | "3DK"
  | "3LDK"
  | "4K"
  | "4DK"
  | "4LDK"
  | "5K"
  | "5DK"
  | "5LDK";

export { Building, Room, Station, ShamaisonBuildingInfo, FloorPlan };
