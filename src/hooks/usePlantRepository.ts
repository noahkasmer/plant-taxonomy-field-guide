import { useEffect, useState } from 'react';

import { getPlantFromDatabaseById, getPlantsFromDatabase } from '@/storage/plantDatabase';
import type { Plant } from '@/types/plant';

type PlantRepositoryState = {
  plants: Plant[];
  isLoading: boolean;
  error: Error | null;
};

export function useSearchablePlants(searchQuery: string): PlantRepositoryState {
  const [state, setState] = useState<PlantRepositoryState>({
    plants: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    setState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
    }));

    getPlantsFromDatabase(searchQuery)
      .then((plants) => {
        if (isMounted) {
          setState({ plants, isLoading: false, error: null });
        }
      })
      .catch((error: Error) => {
        if (isMounted) {
          setState({ plants: [], isLoading: false, error });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery]);

  return state;
}

export function usePlantById(id: string | undefined) {
  const [plant, setPlant] = useState<Plant | undefined>();
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!id) {
      setPlant(undefined);
      setIsLoading(false);
      setError(null);
      return () => {
        isMounted = false;
      };
    }

    setIsLoading(true);
    setError(null);

    getPlantFromDatabaseById(id)
      .then((nextPlant) => {
        if (isMounted) {
          setPlant(nextPlant);
          setIsLoading(false);
        }
      })
      .catch((nextError: Error) => {
        if (isMounted) {
          setPlant(undefined);
          setError(nextError);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { plant, isLoading, error };
}
