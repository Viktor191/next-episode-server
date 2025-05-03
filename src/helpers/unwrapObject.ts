import { FindByIDResponse } from 'types/common';

export const unwrapObject = (data: FindByIDResponse): Record<string, any> | null => {
  for (const key in data) {
    const value = data[key as keyof FindByIDResponse]; // Указываем тип поля

    if (Array.isArray(value) && value.length > 0) {
      return value[0]; // Возвращаем первый объект из массива
    }
  }
  return null;
};
