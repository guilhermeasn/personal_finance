import localforage from "localforage";
import { useEffect, useState } from "react";
import type { Month } from "./types";

export function sortData(data: Month): Month {
  return data.sort((a, b) => a.date - b.date);
}

export function useData(key: string): [Month, (data: Month) => Promise<void>] {

  const [data, updateData] = useState<Month>([]);

  useEffect(() => {
    localforage.getItem<Month>(key).then((value) => {
      updateData(sortData(value ?? []));
    });
  }, []);

  const setData = async (data: Month) => {
    await localforage.setItem(key, data);
    updateData(sortData(data));
  };

  return [data, setData];

}
