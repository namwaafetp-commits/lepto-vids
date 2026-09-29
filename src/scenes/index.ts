import type {FC} from 'react';
import type {ChapterId} from '../data/timings';
import {Ch0Hook} from './Ch0Hook';
import {Ch1Wade} from './Ch1Wade';
import {Ch2Invisible} from './Ch2Invisible';
import {Ch3Source} from './Ch3Source';
import {Ch4Entry} from './Ch4Entry';
import {Ch5Incubation} from './Ch5Incubation';
import {Ch6Symptoms} from './Ch6Symptoms';
import {Ch7Prevention} from './Ch7Prevention';
import {Ch8Cta} from './Ch8Cta';
import type {SceneProps} from './types';

export const SCENES: Readonly<Record<ChapterId, FC<SceneProps>>> = {
  hook: Ch0Hook,
  wade: Ch1Wade,
  invisible: Ch2Invisible,
  source: Ch3Source,
  entry: Ch4Entry,
  incubation: Ch5Incubation,
  symptoms: Ch6Symptoms,
  prevention: Ch7Prevention,
  cta: Ch8Cta,
};
