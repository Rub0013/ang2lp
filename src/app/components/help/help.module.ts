import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';


import { FaqComponent } from './faq.component';
import { TicketsComponent } from './tickets.component';
import { ChatInfoComponent } from './chat-info.component';
import { ChatComponent } from './chat.component';
import {HelpSidebarComponent} from "./help-sidebar.component";
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [FaqComponent, TicketsComponent, HelpSidebarComponent, ChatInfoComponent, ChatComponent], // components, pipes and directives that are part of this module
    imports: [CommonModule, RouterModule, FormsModule], //importing other modules ,
    providers: [] // providers eg services that are part of this module
})

export class HelpModule {

}