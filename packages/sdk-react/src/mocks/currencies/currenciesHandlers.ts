import { delay } from '@/mocks/utils';
import { CURRENCIES_ENDPOINT, CurrencyDetails } from '@monite/sdk-api';

import { http, HttpResponse } from 'msw';

import { currenciesFixture } from './currenciesFixture';

const currenciesPath = `*/${CURRENCIES_ENDPOINT}`;
export const currenciesHandlers = [
  http.get<{}, undefined, Record<string, CurrencyDetails>>(
    currenciesPath,
    async () => {
      await delay();

      return HttpResponse.json(currenciesFixture);
    }
  ),
];
