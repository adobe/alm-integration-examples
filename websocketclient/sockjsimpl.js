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

export class SockJsImpl {

    constructor(endpoint, access_token) {
        console.log(`SockJsImpl constructor endpoint=${endpoint}, access_token=${access_token}`)
        this.appendLog(`{{SockJS Implementation...., host=${endpoint}}}`)
        this.endpoint = endpoint
        this.access_token = access_token
      }

    connect() {
        this.socket = new SockJS(`${this.endpoint}?access_token=${this.access_token}`, null, { transports: ["websocket"] });
        this.socket.onopen = this.onOpenCallback.bind(this)
        this.socket.onmessage = this.onMessageReceivedCallback.bind(this)
    }

    disconnect() {
        
        console.log('Disconnected from WebSocket server');
        this.appendLog('Disconnected from WebSocket server')

        // Construct the STOMP disconnect frame
        const disconnectFrame = 'DISCONNECT\n\n\u0000';
        // Send the disconnect frame over the WebSocket
        this.socket.send(disconnectFrame);
        // Close the WebSocket connection
        this.socket.close();
    }

    onOpenCallback() {
        console.log('WebSocket connection established.');
        this.appendLog('WebSocket connection established.')

        const connectFrame = 'CONNECT\naccept-version:1.2,1.1,1.0\n\n\u0000';
        this.socket.send(connectFrame);

    }

    onMessageReceivedCallback(event) {
        console.log('Received message:', event.data);
        this.appendLog(`Received message:${event.data}`)
        const message = event.data;

        let command = this.extractCommand(message)

        if (command == 'CONNECTED') {
            // Replace 'your-destination' with the actual STOMP topic/queue you want to subscribe to
            this.subscribe('/user/queue/userNotifications', 'vk-sockjs-0');
        }
    }

    onDebugCallback(message) {

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



    // Function to send a STOMP message to the server
    sendMessage(destination, body) {
        // Construct the STOMP message
        const stompMessage = `SEND\ndestination:${destination}\n\n${body}\u0000`;
        // Send the STOMP message over the WebSocket
        this.socket.send(stompMessage);
    }

    // Function to subscribe to a STOMP topic
    subscribe(destination, subscriptionId) {
        // Construct the STOMP subscription frame with the 'id' header
        const subscribeFrame = `SUBSCRIBE\ndestination:${destination}\nid:${subscriptionId}\n\n\u0000`;
        // Send the subscription frame over the WebSocket
        this.socket.send(subscribeFrame);
    }

    // Function to unsubscribe from a STOMP topic
    unsubscribe(destination) {
        // Construct the STOMP unsubscribe frame
        const unsubscribeFrame = `UNSUBSCRIBE\ndestination:${destination}\n\n\u0000`;
        // Send the unsubscribe frame over the WebSocket
        this.socket.send(unsubscribeFrame);
    }


    parseStompFrame(frameString) {
        const parts = frameString.split('\n\n'); // Split the frame into header and body sections

        const headerSection = parts[0];
        const bodySection = parts[1];

        // Extract the command and headers
        const [commandLine, ...headerLines] = headerSection.split('\n');
        const [command, ...headers] = headerLines;

        // Create an object to store the command and headers
        const frame = {
            command: command.trim(),
            headers: {},
        };

        // Extract headers and populate the frame object
        headers.forEach(headerLine => {
            const [headerKey, headerValue] = headerLine.split(':');
            frame.headers[headerKey.trim()] = headerValue.trim();
        });

        // Extract the body if it exists
        if (bodySection) {
            frame.body = bodySection.trim();
        }

        return frame;
    }

    extractCommand(frameString) {
        const parts = frameString.split('\n\n');

        const headerSection = parts[0];

        // Extract the command from the header section
        const [commandLine] = headerSection.split('\n');
        const [command] = commandLine.split(':');

        return command.trim();
    }




}