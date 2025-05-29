'use client';

import { IInstance } from '@/models/IInstance';
import { useStorage } from '@/context/StorageContext';

export const useInstances = () => {
  const { getData, setData } = useStorage();
  const KEY = 'instances';

  const instances = getData<IInstance>(KEY);

  const addInstance = (instance: IInstance) => {
    setData(KEY, [...instances, instance]);
  };

  const deleteInstance = (id: string) => {
    setData(
      KEY,
      instances.filter((instance) => instance.id !== id)
    );
  };

  const getInstanceById = (id: string): IInstance | undefined => {
    return instances.find((instance) => instance.id === id);
  };

  const setAllInstances = (newInstances: IInstance[]) => {
    setData(KEY, newInstances);
  };

  return { instances, addInstance, deleteInstance, getInstanceById, setAllInstances };
};
