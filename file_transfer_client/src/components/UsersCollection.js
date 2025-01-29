import { useState } from "react"
import axios from 'axios'

function UsersCollection({userName}) {
    const [connectTo, setConnectTo] = useState('')
    const [collection, setCollection] = useState([])
    const [responseMessage, setResponseMessage] = useState('')

    async function submit(e) {
        e.preventDefault()


        if (!connectTo) {
            setResponseMessage("missing user")
            return
        }

        if (connectTo === userName) {
            setResponseMessage("you can't add yourself")
            return
        }

        if (collection.includes(connectTo)) {
            setResponseMessage("name already exists")
            return
        }
        
        try {
            const response = await axios.get(`http://localhost:3001/check_user?user=${connectTo}`)
            if (response.status !== 200 && response.data !== 'ok') {
                setResponseMessage('something went wrong')
                return
            }

            setCollection((prevValue) => ([...prevValue, connectTo]))
            setResponseMessage('')
            setConnectTo('')
        } catch(err) {
            setResponseMessage(err.response.data)
        }
        
        // If all good, file transfer can appear
    }

    return <div className="w-full p-7 border border-black">
        <p>Add user to send files to</p>
         <form onSubmit={submit} className="flex flex-col gap-3 mt-3">
            <input type="text" value={connectTo} onChange={e => setConnectTo(e.target.value)} className="border border-black px-3 py-1"/>
            {responseMessage && <label className="text-red-500 text-sm">{responseMessage}</label>}
            <button type="submit" className="border border-black px-3 py-1">Submit</button>
        </form>
        
        <div className="w-full border border-red mt-10 p-3">
            {
                collection.length > 0 ? 
                <ul>
                    {collection.map(o => <li key={o} className="list-disc list-inside text-green-500">{o}</li>)}
                </ul> :
                <p>Empty collection</p>
            }
        </div>
    </div>
}

export default UsersCollection