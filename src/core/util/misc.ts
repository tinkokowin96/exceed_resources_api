import { Location } from '../schema/common.schema';

export const calculateDistance = (loc1: Location, loc2: Location) => {
  //calculate changed distance.....
  const lat1 = (loc1.lat * Math.PI) / 180;
  const lon1 = (loc1.lng * Math.PI) / 180;
  const lat2 = (loc2.lat * Math.PI) / 180;
  const lon2 = (loc2.lng * Math.PI) / 180;

  //Hagersine Formula
  const dlon = lon2 - lon1;
  const dlat = lat2 - lat1;
  const a =
    Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

  const c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in meters
  const r = 6371000;
  return Math.round(c * r);
};

export const getNestedIndex = (arr: any[], key: string, find: number) => {
  const getSortedList = () => arr.filter((each) => find >= each[key]).sort((a, b) => a[key] - b[key]);
  const sorted = getSortedList();
  return sorted.findIndex((each) => each[key] === sorted[sorted.length - 1][key]);
};
