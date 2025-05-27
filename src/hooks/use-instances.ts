'use client';

import { IInstance } from '@/models/IInstance';
import { useEffect, useState } from 'react';

export const useInstances = () => {
  const [instances, setInstances] = useState<IInstance[]>([]);

  useEffect(() => {
    const saved = sessionStorage.getItem('instances');

    if (saved) {
      try {
        const parsedInstances = JSON.parse(saved) as IInstance[];
        setInstances(parsedInstances);
      } catch (error) {
        console.error('Error parsing instances from sessionStorage:', error);
      }
    }
  }, []);

  const addInstance = (instance: IInstance) => {
    const updatedInstances = [...instances, instance];
    setInstances(updatedInstances);
    sessionStorage.setItem('instances', JSON.stringify(updatedInstances));
  };

  const deleteInstance = (id: string) => {
    const updatedInstances = instances.filter((instance) => instance.id !== id);
    setInstances(updatedInstances);
    sessionStorage.setItem('instances', JSON.stringify(updatedInstances));
  };

  const getInstanceById = (id: string): IInstance | undefined => {
    return instances.find((instance) => instance.id === id);
  };

  const setAllInstances = (newInstances: IInstance[]) => {
    setInstances(newInstances);
    sessionStorage.setItem('instances', JSON.stringify(newInstances));
  };

  return { instances, addInstance, deleteInstance, getInstanceById, setAllInstances };
};
