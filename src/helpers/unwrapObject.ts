import { FindByIDResponse } from "types/common";

export const unwrapObject = (
  data: FindByIDResponse
): Record<string, any> | null => {
  for (const key in data) {
    // @ts-ignore
    if (Array.isArray(data[key]) && data[key].length > 0) {
      // @ts-ignore
      return data[key][0]; // Возвращаем первый объект из массива
    }
  }

  return null; // Если ни одно из полей не содержит объекта, возвращаем null
};
