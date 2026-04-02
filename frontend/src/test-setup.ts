import { beforeAll } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { ɵresolveComponentResources as resolveComponentResources } from '@angular/core';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { globSync } from 'glob';

TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

beforeAll(async () => {
  const htmlFiles = globSync('src/**/*.html', { cwd: process.cwd() });
  const cssFiles = globSync('src/**/*.css', { cwd: process.cwd() });

  const fileMap = new Map<string, string>();
  [...htmlFiles, ...cssFiles].forEach((f) => {
    const filename = f.split('/').pop()!;
    fileMap.set(filename, resolve(process.cwd(), f));
  });

  await resolveComponentResources((url: string) => {
    const filename = url.replace(/^\.\//, '');
    const filePath = fileMap.get(filename);
    if (!filePath) return Promise.resolve(new Response(''));
    const content = readFileSync(filePath, 'utf-8');
    return Promise.resolve(new Response(content));
  });
});
