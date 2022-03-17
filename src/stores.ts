import { type Writable, writable } from "svelte/store";
import type { Assignment, Competition, Match } from "./db";

export const page: Writable<string> = writable("");
export const modal: Writable<string> = writable("");
export const activeComp: Writable<Competition> = writable({id: -1, name: "", active: 0});

export const matches: Writable<Record<number, Record<number, Assignment>>> = writable({});