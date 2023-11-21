# Push notifications reference implementation
Adobe Learning Managers introduces support for push notifications in milestone M39. Prior to this, clients rely on polling mechanism to fetch the latest notifications and this approach is prone to incorrect implementation by making too many api calls intentionally or unintentionally. With push notifications approach, it enables us to deliver notifications to learners in near real-time there by enhancing user experience.

### Keywords
Websocket, SockJS, STOMP
- [Websocket specification](https://datatracker.ietf.org/doc/html/rfc6455)
- [What is STOMP?](https://stomp.github.io/stomp-specification-1.1.html)
- [What is SockJS all about?](https://github.com/sockjs/sockjs-client)

## Server side implementation
Websocket implementation has different choices on both server and client side implementations. Websocket specification does not support subscribe and unsubscribe semantics. But from Adobe Learning Manager api standpoint, since it is all about notifications, it is good to have support for subscribe and unsubscribe semantics. And so, we decided to go ahead with STOMP subprotocol that is well accepted in the Websocket eco-system. To know more details on STOMP subprotocol, please go through the specification here - [STOMP 1.1](https://stomp.github.io/stomp-specification-1.1.html)

We also decided to support backward compatibility just in case websocket is not supported is by any of the older versions of browsers. And so we went with most popular choice of SockJS. Essentially, server side implementation is frozen with STOMP subprotocol and SockJS library. To know more about SockJS client side usage, please go through this link here - [SockJS client](https://github.com/sockjs/sockjs-client)

## Client side support
On the client, various implementations are possible
- With STOMP and SockJS (Recommended) 
- Only STMOP
- Only SockJS
- No STOMP, No SockJS

## Reference implementation details
- [Code sample for Websocket over STOMP with SockJS](/websocketclient/stompsockjsimpl.js)
- [Code sample using Websocket over STOMP only](/websocketclient/stompsimpleimpl.js)
- [Code sample using Websocket over SockJS only](/websocketclient/sockjsimpl.js)
- [Code sample using plain Websocket](/websocketclient/plainwebsocketimpl.js)

## Tryout
In the sample apple you need to enter

- Domain Url (For various regions, domain url is different. Please choose the right domain url for the account)
  - US region - leariningmanager.adobe.com
  - Europe region - leariningmanagereu.adobe.com
  - APAC region leariningmanagerapac.adobe.com

- Access Token - Have the access token handy from swagger page or Adobe Learning Manager token helper utility

- Choice of implementation to try out - Select one of the sample implementation and monitor the websocket logs


