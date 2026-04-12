import { Winery } from './types';
import fs from 'fs';
import path from 'path';

export async function loadWineries(): Promise<Winery[]> {
  const dataPath = path.join(process.cwd(), 'public/data/wineries.json');
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data);
}
