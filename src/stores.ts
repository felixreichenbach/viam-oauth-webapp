import { writable } from 'svelte/store';
import type { RobotClient } from '@viamrobotics/sdk';

export const robotClientStore = writable<RobotClient | null>(null);
