import { Component, HostBinding, OnInit } from '@angular/core';
import { LimeProxiesService } from '../../services/limeproxies.service';
import { ActivatedRoute } from '@angular/router';
import { Comment } from '../../entities/comment';
import { Ticket } from '../../entities/ticket';
import * as moment from 'moment';

@Component({
    selector: 'chat',
    templateUrl: '../../templates/help/chat.template.html'
})

export class ChatComponent implements OnInit {
    @HostBinding('class') chatClass = 'page__content-inner';

    comments: any;
    ticketId: number;
    message = '';
    disabled = false;
    opened = false;
    closed = false;
    ticket: Ticket;
    loadComments = true;

    constructor(private limeProxiesService: LimeProxiesService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route
            .queryParams
            .switchMap((params) => {
                this.ticketId = params['id'];
                return this.limeProxiesService.getSupportComments(this.ticketId);
            })
            .switchMap((data) => {
                this.loadComments = false;
                this.comments = data.comments;
                return this.limeProxiesService.getTicket(this.ticketId);
            })
            .subscribe((data: any) => {
                this.ticket = data;
                if (this.ticket.status == 'closed' || this.ticket.status == 'solved') {
                    this.closed = true;
                } else {
                    this.opened = true;
                }
            });
    }

    formatDate(date: any) {
        return moment.utc(date).format('YYYY/MM/DD - hh:mm');
    }

    sendMessage() {
        if (this.message) {
            this.disabled = true;
            this.limeProxiesService.sendComment(this.ticketId, this.message).subscribe(data => {
                if (data._user_message_type == 'success') {
                    let date = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
                    let comment = new Comment('user', this.message, date);
                    this.comments.push(comment);
                    this.message = '';
                }
                this.disabled = false;
            });
        }
    }

    getNotification(evt) {
        this.opened = false;
        this.closed = true;
    }

}