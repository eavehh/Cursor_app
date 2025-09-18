import { useState } from "react"

export function Login({ onSubmit }) {
    const [username, setUsername] = useState("")
    const [format, setFormat] = useState("json") // <-- добавлено: выбор формата

    return (
        <>
            <h1>Welcome</h1>
            <p>What should people call you?</p>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    onSubmit(username, format) // изменено: передаём формат вместе с именем
                }}
            >
                <input
                    type="text"
                    value={username}
                    placeholder="username"
                    onChange={(e) => setUsername(e.target.value)}
                />

                { /* добавлено: выбор формата */}
                <div>
                    <label>
                        <input
                            type="radio"
                            value="json"
                            checked={format === "json"}
                            onChange={(e) => setFormat(e.target.value)}
                        />
                        JSON
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="msgpack"
                            checked={format === "msgpack"}
                            onChange={(e) => setFormat(e.target.value)}
                        />
                        MessagePack
                    </label>
                </div>

                <input type="submit" />
            </form>
        </>
    )
}
