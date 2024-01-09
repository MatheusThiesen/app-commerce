import { useEffect, useState } from "react";

export function useLocalStore(storage: string) {
  const [data, setData] = useState(undefined);
  useEffect(() => {
    const storageData = localStorage.getItem(storage);

    setData(storageData ? JSON.parse(storageData) : undefined);
  }, []);

  return {
    onGet: () => {
      const storageData = localStorage.getItem(storage);

      return storageData ? JSON.parse(storageData) : undefined;
    },
    onSet: (value: any) => localStorage.setItem(storage, JSON.stringify(value)),
    onRemove: () => localStorage.removeItem(storage),
    data: data,
  };
}
