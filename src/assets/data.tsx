import localforage from "localforage";
import { useEffect, useState } from "react";
import type { Month } from "./types";

export function useMonth(month: number | undefined, year: number | undefined): [Month, (month: Month) => Promise<void>] {

  const instance = localforage.createInstance({ name: 'personal_finance' });
  const key = `${month}-${year}`;
  const [data, updateData] = useState<Month>([]);
  const sortData = (data: Month): Month => data.sort((a, b) => a.day - b.day);

  useEffect(() => {
    if (!month || !year) return;
    instance.getItem<Month>(key).then((value) => {
      updateData(sortData(value ?? []));
    });
  }, [month, year]);

  const setData = async (data: Month) => {
    await instance.setItem(key, data);
    updateData(sortData(data));
  };

  return [data, setData];

}

export function useCategories(): [string[], (categories: string[]) => Promise<void>] {

  const instance = localforage.createInstance({ name: 'personal_finance' });
  const [categories, updateCategories] = useState<string[]>([]);

  useEffect(() => {
    instance.getItem<string[]>('categories').then((value) => {
      updateCategories(value ?? []);
    });
  }, []);

  const setCategories = async (categories: string[]) => {
    await instance.setItem('categories', categories);
    updateCategories(categories);
  };

  return [categories, setCategories];

}
