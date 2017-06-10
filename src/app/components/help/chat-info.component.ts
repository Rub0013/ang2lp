import { Component, HostBinding, OnInit, Output, EventEmitter } from '@angular/core';
import { LimeProxiesService } from '../../services/limeproxies.service';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from '../../entities/ticket';


@Component({
    selector: 'chat-info',
    templateUrl: '../../templates/help/chat-info.template.html'
})

export class ChatInfoComponent implements OnInit {

    @Output() notifyParent: EventEmitter<any> = new EventEmitter();

    buttonShow = true;

    ticket: Ticket;


    @HostBinding('class') chatInfoClass = 'chat__info block block--with-header';

    constructor(private limeProxiesService: LimeProxiesService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.ticket = this.limeProxiesService.getCachedTicket();
        if (this.ticket.status === 'closed' || this.ticket.status === 'solved') {
            this.buttonShow = false;
        }
    }

    close(ticket: Ticket) {
        this.limeProxiesService.closeTicket(ticket.id).subscribe( data => {
            if (data._user_message_type === 'success') {
                this.limeProxiesService.removeFromOpened(ticket);
                this.limeProxiesService.cacheTicket(ticket);
                this.buttonShow = false;
                this.notifyParent.emit();
            }
        });
    }

}