export interface Course {
    id: number;
    name: string;
}

export interface Module {
    id: number;
    name: string;
}

export interface RoomAssignment {
    id: number;
    roomId: number;
    moduleId: number;
    startTime: Date;
    endTime: Date;
}

export interface TimetableEvent {
  id: number;
  day: 1 | 2 | 3 | 4 | 5;
  startMinute: number;
  endMinute: number;
  moduleName: string;
  roomName: string;
};