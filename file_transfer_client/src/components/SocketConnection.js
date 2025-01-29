import { useEffect } from "react";

function SocketConnection({ws, setWs, userName}) {

    useEffect(() => {
        const websocket = new WebSocket(`ws://localhost:8080?username=${userName}`);
        websocket.onopen = () => {
            console.log(`WebSocket is connected for ${userName}`);
          };

        websocket.onclose = () => {
        console.log('WebSocket is closed');
        };

        setWs(websocket) 

        return () => {}
    }, [])

    if (!ws) {
        return <p>Socket down</p>
    }

    return (<div>
        <p>Handle file transfer</p>
    </div>)
}

export default SocketConnection