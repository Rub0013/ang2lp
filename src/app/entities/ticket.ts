//app/entities/ticket.ts

export class Ticket{
    created_at: any;
    description: string;
    id: number;
    status: string;
    subject: any;
    updated_at: any


    constructor(description,status,subject,date,id) {
        this.description = description;
        this.status = status;
        this.subject = subject;
        this.created_at = date;
        this.id = id;
    }
}
