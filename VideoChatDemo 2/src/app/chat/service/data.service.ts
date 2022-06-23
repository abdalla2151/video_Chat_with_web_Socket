import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {environment} from '../../../environments/environment';
import {Message} from '../types/message';
import { SendRequest } from '../types/sendRequest';

export const WS_ENDPOINT = environment.wsEndpoint;   // wsEndpoint: 'ws://localhost:8081'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private socket$: WebSocketSubject<any>;

  private messagesSubject = new Subject<Message>();
  public messages$ = this.messagesSubject.asObservable();

  /**
   * Creates a new WebSocket subject and send it to the messages subject
   * @param cfg if true the observable will be retried.
   */
  public connect(): void {
    //debugger;

    if (!this.socket$ || this.socket$.closed) {

      //debugger;
      this.socket$ = this.getNewWebSocket();
      //this.messagesSubject.subscribe((v)=>{console.log(v);});


      this.socket$.subscribe(
        // Called whenever there is a message from the server
        msg => {
          console.log('Received message of type: ' + msg.type);
          this.messagesSubject.next(msg);
          console.log('4444444444444');
        }
      );

      console.log(this.messages$);
    }
  }

  sendMessager(request: SendRequest): void {
    //debugger;
    this.socket$.next(request);
  }

  sendMessage(msg: Message): void {
    //debugger;
    console.log('sending message: ' + msg.type);
    this.socket$.next(msg);
  }

  /**
   * Return a custom WebSocket subject which reconnects after failure
   */
  private getNewWebSocket(): WebSocketSubject<any> {
    //debugger;
    console.log('55555555555555');
    return webSocket({
      url: WS_ENDPOINT,

      openObserver: {
        next: () => {
          console.log('6666666666666666');
          console.log('[DataService]: connection ok');
          this.sendMessager(
            {
              messageType:'register',
              userData:'ahmed' ,
              message:{type: 'registerUserName', data: 'ahmed'}
            }
          );
        }
      },
      closeObserver: {
        next: () => {
          console.log('77777777777777');
          console.log('[DataService]: connection closed');
          this.socket$ = undefined;
          this.connect();
          //abdalla
          this.sendMessager(
            {
              messageType:'register',
              userData:'ahmed' ,
              message:{type: 'registerUserName', data: 'ahmed'}
            }
          );

        }
      }
    });
  }
}
