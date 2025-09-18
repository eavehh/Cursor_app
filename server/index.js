const http = require('http');
const WebSocketServer = require('ws');
const msgpack = require('@msgpack/msgpack');

const url = require('url');
const { json } = require('stream/consumers');
const uuid = require('uuid').v4;

const server = http.createServer();
const wsServer = new WebSocketServer.Server({ server });
const port = 8000;

connections = {}
const users = {}
const clientFormats = {}; // для настройки каждого клиента

// !!!
const broadcast = () => {
    Object.keys(connections).forEach(id => {
        const connection = connections[id];

        if (clientFormats[id]) {
            // отправка в MessagePack
            const packed = msgpack.encode(users);
            connection.send(packed);
        } else {
            // отправка в JSON (текст)
            connection.send(JSON.stringify(users));
        }
    });
}


// исправить проблему с буффером байтов
const handleMessage = (bytes, id) => {
    try {
        let message;
        if (clientFormats[id] === "msgpack") {
            message = msgpack.decode(bytes)
        } else {
            message = bytes.toString()
        }

        const user = users[id]
        user.state = message

        broadcast();
        console.log(message)
    } catch (e) {
        console.error("Invalid message from", id, e)
    }
}

const handleClose = (id) => {
    console.log(`${users[id].user} was disconnected`)
    delete connections[id]
    delete users[id]
    delete clientFormats[id]

    broadcast()
}

wsServer.on("connection", (connection, request) => {
    const username = url.parse(request.url, true).query.username
    const format = url.parse(request.url, true).query.format // для msgpack или json
    const id = uuid()
    console.log("connection from: ", username)
    console.log("id: ", id)

    connections[id] = connection
    // (TODO) для того чтобы когда пользователь отключится
    // можно удалить его из списка пользователей
    clientFormats[id] = format === "msgpack";

    users[id] = {
        user: username,
        state: {
            x: 0,
            y: 0
            //Если создавать другое приложение на подобии чата 
            // (нужен React) то можно добавить еще состояние печатает человек или нет
        }
    }

    connection.on("message", (message) => handleMessage(message, id))
    // обработка сообщений (координат) от клиента
    connection.on("close", (close) => handleClose(id))
    // обработка отключения
})

server.listen(port, () => {
    console.log(`WS server is listening on port ${port}`);
})

