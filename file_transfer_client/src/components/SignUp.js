import { useEffect, useState } from "react"
import axios from 'axios'

function SignUp({setUserName}) {
    const [name, setName] = useState('')
    const [responseMessage, setResponseMessage] = useState('')

    useEffect(() => {
        return () => {
            setName('')
        }
    }, [])

    async function submit(e) {
        e.preventDefault()

        try {
            const response = await axios.post('http://localhost:3001/signup', {name})
            
            if (!response.status === '201') {
                // handle this
                setResponseMessage('something went wrong')
            }

            setResponseMessage('')
            setUserName(name)
        } catch(err) {
            setResponseMessage(err.response.data)
        }
    }

    return <div className="w-full h-screen border border-black flex flex-col justify-center items-center">
        <div className="w-1/3 border border-black p-10">
            <p className="pb-3">Sign up</p>
            <form onSubmit={submit} className="flex flex-col gap-3">
                <input type="text" onChange={e => setName(e.target.value)} className="border border-black px-3 py-1"/>
                {responseMessage && <label className="text-red-500 text-sm">{responseMessage}</label>}
                <button type="submit" className="border border-black px-3 py-1">Submit</button>
            </form>
        </div>
    </div>
}

export default SignUp