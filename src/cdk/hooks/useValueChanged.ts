import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useValueChanged<T>(value: T | null): {
  isChanged: boolean;
  isNotChanged: boolean;
  setOriginalValue: (value: T) => void;
  originalValue: T;
} {
  const previousValueRef = useRef(value);
  const isOriginalValueSetRef = useRef(false);
  const [changed, setChanged] = useState(false);

  const setOriginalValue = useCallback((value: T) => {
    previousValueRef.current = value;
    isOriginalValueSetRef.current = true;
    // Check if current value differs from new original value
    const isEqual = _.isEqual(previousValueRef.current, value);
    setChanged(!isEqual);
  }, []);

  // Check if value has changed from the initial value
  useEffect(() => {
    if (isOriginalValueSetRef.current) {
      const isEqual = _.isEqual(previousValueRef.current, value);
      setChanged(!isEqual);
    }
  }, [value]);

  // If initial value was specified as `null` - it means that `setOriginalValue` expected to be called manually from code
  useEffect(() => {
    if (value !== null) {
      isOriginalValueSetRef.current = true;
    }
  }, []);

  return {
    isChanged: changed,
    isNotChanged: !changed,
    setOriginalValue,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    originalValue: previousValueRef.current!,
  };
}
