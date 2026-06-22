export type EventStatus = "verify" | "correct" | "incorrect";

export interface AiEvent {
  id: number;
  status: EventStatus;
  event: string;
  datetime: string; // ISO string
  cam: string;
  updatedBy: string;
  note: string;
  imageUrl: string;
  channel: string;
}

export type VehicleType = "blacklist" | "vip";

export interface Vehicle {
  id: string;
  plate: string;
  province: string;
  type: VehicleType;
  brand: string;
  model: string;
  color: string;
  ownerName: string;
  reason: string;
  imageUrl: string; // data URL or remote
  createdAt: string; // ISO string
}

export interface LprEvent {
  id: number;
  plate: string;
  province: string;
  matchType: VehicleType | "unknown";
  cam: string;
  datetime: string; // ISO string
  imageUrl: string;
}
