import { writable } from 'svelte/store';

export const sharedData = writable({
    x: [],
    y: []
});
