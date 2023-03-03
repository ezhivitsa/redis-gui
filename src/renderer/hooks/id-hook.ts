import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useIdHook(initialId?: string): string | undefined {
  const [id, setId] = useState<string | undefined>(initialId);

  useEffect(() => {
    if (!id) {
      setId(uuidv4());
    }
  }, [id]);

  return id;
}
