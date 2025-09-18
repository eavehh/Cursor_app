import useWebSocket from "react-use-websocket"
import { useEffect, useRef } from "react"
import throttle from "lodash.throttle"
import * as msgpack from "@msgpack/msgpack"

export function Home({ username, format }) {
    const WS_url = "ws://127.0.0.1:8000"

    const { sendMessage } = useWebSocket(`${WS_url}?username=${username}&format=${format}`)

    const THROTTLE = 50

    const sendData = (data) => {
        if (format === "msgpack") {
            sendMessage(msgpack.encode(data))
        } else {
            sendMessage(JSON.stringify(data))
        }
    }

    const sendThrottled = useRef(throttle(sendData, THROTTLE))

    useEffect(() => {
        const handler = (e) => {
            sendThrottled.current({
                x: e.clientX,
                y: e.clientY
            })
        }
        window.addEventListener("mousemove", handler)

        return () => window.removeEventListener("mousemove", handler) // <-- очистка
    }, [])

    return <h1>Hello {username}</h1>
}
