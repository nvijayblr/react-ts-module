import { isNil } from 'lodash';

export function getUpdatedObjectProperties<T>(oldObject: T, newPartialObject: T): T {
  const updatedValuesObject: T = {} as T;

  for (const key in newPartialObject) {
    if (!isNil(newPartialObject[key]) && oldObject[key] !== newPartialObject[key]) {
      updatedValuesObject[key] = newPartialObject[key];
    }
  }

  return updatedValuesObject;
}
