import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { Buffer } from 'buffer';
import { IdentificationResponse } from '../types';

export const uploadImageToR2 = async (uri: string): Promise<string> => {
  const imageFile = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  const key = `image-${Date.now()}.jpg`;
  const imageBuffer = Buffer.from(imageFile, 'base64');

  await axios.put(`https://print.mounirrouissi2.workers.dev/${key}`, imageBuffer, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'X-CF-Secret': '123456', // Replace with your secret
    },
  });

  return `https://print.mounirrouissi2.workers.dev/${key}`;
};

export const identifyImage = async (imageUrl: string): Promise<IdentificationResponse> => {
  const response = await axios.post<IdentificationResponse>('https://a0f7-197-31-151-246.ngrok-free.app/identify', { imageUrl });
  return response.data;
};