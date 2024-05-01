import { useEffect, useState } from "react";

export function useLocalStore<T>(storage: string) {
  const [data, setData] = useState(undefined);
  useEffect(() => {
    const storageData = localStorage.getItem(storage);

    setData(storageData ? JSON.parse(storageData) : undefined);
  }, []);

  return {
    onGet: (): T => {
      const storageData = localStorage.getItem(storage);

      return storageData ? JSON.parse(storageData) : undefined;
    },
    onSet: (value: T) => localStorage.setItem(storage, JSON.stringify(value)),
    onRemove: () => localStorage.removeItem(storage),
    data: data,
  };
}
