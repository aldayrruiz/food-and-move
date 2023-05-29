import { SetMetadata } from '@nestjs/common';

export async function asyncForEach(array: any[], callback: any) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export function newRandomPassword(length = 8) {
  const abecedario = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '.',
    '-',
    '_',
    '$',
    '&',
    '#',
    '@',
  ];
  let password = '';
  for (let i = 0; i < length; i++) {
    let randomNumber = Math.round(Math.random() * abecedario.length);
    if (randomNumber == abecedario.length) randomNumber = 0;
    password += abecedario[randomNumber];
  }
  return password;
}

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
