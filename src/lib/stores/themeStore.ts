import { writable } from 'svelte/store';
import type { Theme } from '../server/db/schema';

export const themeStore = writable<Theme>('default');
