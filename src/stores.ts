import { writable } from 'svelte/store';

export const loginStatus = writable(0);
export const token = writable('');
