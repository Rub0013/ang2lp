import { Routes }   from '@angular/router';

import { FaqComponent } from './faq.component';
import { TicketsComponent } from './tickets.component';
import { HelpSidebarComponent } from './help-sidebar.component';
import { ChatInfoComponent } from './chat-info.component';
import { ChatComponent } from './chat.component';

export const helpRoutes: Routes = [
    {path: '', component: FaqComponent},
    {path: 'faq', component: FaqComponent},
    {path: 'tickets', component: TicketsComponent},
    {path: 'chat', component: ChatComponent}
];