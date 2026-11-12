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