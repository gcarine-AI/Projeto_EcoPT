import { beforeAll } from 'vitest';
import { ɵresolveComponentResources as resolveComponentResources } from '@angular/core';

beforeAll(async () => {
  await resolveComponentResources((url: string) => fetch(url));
});
