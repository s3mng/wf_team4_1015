import type { Domain } from '../domain';
import type { PositionType } from '../types';

export const POSITION_CATEGORIES = {
  DEV: {
    label: '개발',
    values: ['FRONT', 'APP', 'BACKEND', 'DATA', 'OTHERS'] as PositionType[],
  },
  DESIGN: {
    label: '디자인',
    values: ['DESIGN'] as PositionType[],
  },
  PLANNER: {
    label: '기획',
    values: ['PLANNER'] as PositionType[],
  },
  MARKETING: {
    label: '마케팅',
    values: ['MARKETING'] as PositionType[],
  },
} as const;

export const DOMAINS: Domain[] = [
  'FINTECH',
  'HEALTHTECH',
  'EDUCATION',
  'ECOMMERCE',
  'FOODTECH',
  'MOBILITY',
  'CONTENTS',
  'B2B',
  'OTHERS',
];

export const ORDER_OPTIONS = [
  { label: '최신순', value: 0 },
  { label: '마감일순', value: 1 },
] as const;
