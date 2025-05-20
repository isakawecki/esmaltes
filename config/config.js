import { Platform } from 'react-native';

export const baseURL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://192.168.15.166:8080';
