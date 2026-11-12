export interface Ticket {
    id: number;
    startedOn: Date;
    endedOn: Date | undefined;
    chatName: string;
    active: boolean;
}

export interface TicketMessage {
    id: number;
}

export interface TicketConclusion {
    chatId: number;
    adminId: number;
    concludedAt: Date;
    outcome: string;
}