export const saveToLocalStorage = (key: string, data: any) => {
  if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
  }
};

export const getFromLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
  }
  return null;
};