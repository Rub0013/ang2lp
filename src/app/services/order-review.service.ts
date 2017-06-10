import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class OrderReviewService {
    privateProxies = new Subject<number>();
    premiumProxies = new Subject<number>();
    numberOfServerLoc = new Subject<number>();
    serverLocations = new Subject<any>();
    paymentMethod = new Subject<any>();
    totalCost = new Subject<number>();
}


