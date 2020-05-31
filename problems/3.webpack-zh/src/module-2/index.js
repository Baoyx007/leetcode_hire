import { shuffle, keys } from 'lodash';
import { sample } from '../common';

export function logData(data) {
  console.log('2');
  return sample(shuffle(keys(data)));
}
