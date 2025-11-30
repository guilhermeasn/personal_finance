import localforage from "localforage";
import { useEffect, useState } from "react";

export function useData<T>(key: string): [T | null, (data: T | null) => void] {

  const [data, updateData] = useState<T | null>(null);

  useEffect(() => {
    localforage.getItem<T>(key).then((value) => {
      updateData(value);
    });
  }, []);

  const setData = async (data: T | null) => {
    await localforage.setItem(key, data);
    updateData(data);
  };

  return [data, setData];

}
