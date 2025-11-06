import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistStorage } from 'zustand/middleware';
import { State } from '../type';

const asyncStorageWrapper: PersistStorage<State> = {
  getItem: async (name: string) => {
    const value = await AsyncStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name: string, value: any) => {
    /**
     * value is actually of type { state: State, version?: number } in Zustand v4
     * So we store the whole object
     */
    await AsyncStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name);
  },
};

export default asyncStorageWrapper;
