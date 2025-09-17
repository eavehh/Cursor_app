const http = require('http');
const WebSocketServer = require('ws');

const url = require('url');
const { json } = require('stream/consumers');
const { connect } = require('http2');
const uuid = require('uuid').v4;

const server = http.createServer();
const wsServer = new WebSocketServer.Server({ server });
const port = 8000;

connections = {}
const users = {}

// !!!
const broadcast = () => {
    Object.keys(connections).forEach(id => {
        const connection = connections[id]
        const message = JSON.stringify(users)
        connection.send(message)
    })
}

const handleMessage = (bytes, id) => {
    const message = JSON.parse(bytes.toString())
    const user = users[id]
    user.state = message

    broadcast() // !!!
    console.log(message)

}

const handleClose = (id) => {
    console.log(`${users[id].user} was disconnected`)
    delete connections[id]
    delete users[id]
    broadcast()
}

wsServer.on("connection", (connection, request) => {
    const username = url.parse(request.url, true).query.username
    const id = uuid()
    console.log("connection from: ", username)
    console.log("id: ", id)

    connections[id] = connection
    // (TODO) для того чтобы когда пользователь отключится
    // можно удалить его из списка пользователей

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