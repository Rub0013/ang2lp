//app/entities/comment.ts

export class Comment{
    id: number;
    created_at: any;
    author: string;
    body: string;
    attachments: any

    constructor(author,comment,date) {
        this.author = author;
        this.body = comment;
        this.created_at = date;
    }
}