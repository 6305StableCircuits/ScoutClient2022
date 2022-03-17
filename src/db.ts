// db.ts
import Dexie, { type Table } from 'dexie';
import { indexedDB, IDBKeyRange } from "fake-indexeddb";

export interface Competition {
  id: number;
  name: string;
  active: number;
}

export interface Student {
  id: number;
  competitions: Array<number>;
  
}

export interface Match {
  matchNum: number;
  competition: number;
  teams: Array<number>;
  students: Array<number>;
  studentAssignments: Record<number, Assignment>;
  quantitativeData: Record<number, QuantitativeData>;
  qualitativeData: Record<number, QualitativeData>;
}

export interface QuantitativeData {
  alliance: 'b' | 'r';
  autoLeave: boolean;
  autoLow: number;
  autoHigh: number;
  teleopLow: number;
  teleopHigh: number;
  rung: -1 | 0 | 1 | 2 | 3 | 4;
  fouls: number;
  techFouls: number;
  incap: number;
}


export interface QualitativeData {
  alliance: 'b' | 'r';
  driverSkill: number;
  sturdiness: number;
  compatibility: number;
  notes: string;
}

export interface Assignment {
  team?: number;
  matchNum: number;
  alliance: 'b' | 'r';
  type: 'quant' | 'qual';
}

export interface Result {
  id: number,
  matchNum: number;
  team: number;
  data: QualitativeData | QuantitativeData;
}

export class Database extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  matches!: Table<Match>;
  results!: Table<Result>;


  constructor() {
    super('myDatabase');
    this.version(1.2).stores({
      matches: 'matchNum, competition, teams, students',
      results: 'matchNum, team'
    });
  }
}

export const db = new Database();

console.log(db)