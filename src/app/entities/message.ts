//app/entities/message.ts
export class Message{
    message:string;
    success:boolean;

    constructor(message,isSuccess) {
      this.message = message;
      this.success = isSuccess;
    }
}