import { useSyncExternalStore } from "react";
import { vehicleStore } from "@/data/store";
import type { Vehicle } from "@/data/types";

let cache: Vehicle[] = vehicleStore.getAll();

function subscribe(cb: () => void) {
  return vehicleStore.subscribe(() => {
    cache = vehicleStore.getAll();
    cb();
  });
}

function getSnapshot() {
  return cache;
}

export function useVehicles(): Vehicle[] {
  return useSyncExternalStore(subscribe, getSnapshot);
}
