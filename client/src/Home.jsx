export function Home({ username }) {
    
    const WS_url = "ws://127.0.0.1:8000"
    const { sendJsonMessage } = WebSocket(WS_url, {
        queryParams: { users }
    })

    return <h1>Hello {username}</h1>
}