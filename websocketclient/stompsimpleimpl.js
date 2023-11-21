/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

export class StompSimpleImpl {

  constructor(endpoint, access_token) {
    console.log(`StompSimpleImpl constructor endpoint=${endpoint}, access_token=${access_token}`)
    this.appendLog(`{{STOMP Implementation...., host=${endpoint}}}`)
    this.endpoint = endpoint
    this.access_token = access_token
  }

  connect() {
    const socket = new WebSocket(`${this.endpoint}?access_token=${this.access_token}`);
    this.stompClient = Stomp.over(socket);
    this.stompClient.debug =  this.onDebugCallback.bind(this)
    this.stompClient.connect({}, this.onConnectedCallback.bind(this));
  }


  disconnect() {
    console.log('Disconnected from WebSocket server');
    this.appendLog('Disconnected from WebSocket server')

    this.stompClient.disconnect(function () {
    });
  }
  onMessageReceivedCallback(message) {
    let log = `Received message: ${message.body}`
    console.log(log)
    this.appendLog(log)
  }

  onDebugCallback(message) {
    console.log(message);
    this.appendLog(message)
  }


  onConnectedCallback(e) {

    let log = `Connected to STOMP server.`
    console.log(log)
    this.appendLog(log)

    this.appendLog(`command=${e.command}, user-name=${e.headers['user-name']}, version=${e.headers['version']}, heart-beat=${e.headers['heart-beat']}`)

    // Subscribe to a destination (topic/queue) to receive messages
    this.stompClient.subscribe('/user/queue/userNotifications', this.onMessageReceivedCallback.bind(this));


    this.stompClient.ws.onclose = (event) => {
      // Handle the WebSocket connection closure  
      let log = `<<< DISCONNECTED : WebSocket connection closed: code=${event.code}, reason=${event.reason}, wasClean=${event.wasClean}, type=${event.type} \n`
      console.log(log)
      this.appendLog(log)
    };

  }

  appendLog(text, color) {
    let textarea = $("#id_console_log")
    let currentText = textarea.val()

    let currentdate = new Date();
    let datetime = currentdate.getDate() + "/"
      + (currentdate.getMonth() + 1) + "/"
      + currentdate.getFullYear() + "@"
      + currentdate.getHours() + ":"
      + currentdate.getMinutes() + ":"
      + currentdate.getSeconds();

    let newText = ""
    newText = currentText + datetime + "    " + text + "\n";
    textarea.val(newText);
  }

}
