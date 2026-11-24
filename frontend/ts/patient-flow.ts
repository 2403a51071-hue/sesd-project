import { Patient } from './app.js';

export interface KanbanBoardState {
  waiting: Patient[];
  admitted: Patient[];
  underTreatment: Patient[];
  readyForDischarge: Patient[];
  discharged: Patient[];
}
