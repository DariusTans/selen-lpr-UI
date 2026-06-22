import type { Vehicle } from "./types";
import { MOCK_VEHICLES } from "./mock";

const KEY = "selen.vehicles.v1";

function read(): Vehicle[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(MOCK_VEHICLES));
      return [...MOCK_VEHICLES];
    }
    return JSON.parse(raw) as Vehicle[];
  } catch {
    return [...MOCK_VEHICLES];
  }
}

function write(vehicles: Vehicle[]) {
  localStorage.setItem(KEY, JSON.stringify(vehicles));
  // notify same-tab listeners
  window.dispatchEvent(new Event("selen:vehicles"));
}

export const vehicleStore = {
  getAll(): Vehicle[] {
    return read().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  add(vehicle: Omit<Vehicle, "id" | "createdAt">): Vehicle {
    const all = read();
    const created: Vehicle = {
      ...vehicle,
      id: `v-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    write([created, ...all]);
    return created;
  },
  remove(id: string) {
    write(read().filter((v) => v.id !== id));
  },
  subscribe(cb: () => void): () => void {
    const handler = () => cb();
    window.addEventListener("selen:vehicles", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("selen:vehicles", handler);
      window.removeEventListener("storage", handler);
    };
  },
};
