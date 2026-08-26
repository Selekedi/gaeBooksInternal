import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import FabLink from "../../Components/FAB/FabLink"
import { getClients } from "../../Server/Server"

export default function ClientList(){
    const [clients,setClients] = useState(undefined)

    useEffect(() => {
        (async () => {
            try {
                const clientsFromDb = await getClients()
                console.log(clientsFromDb)
                if(clientsFromDb.length === 0){
                    setClients(null)
                    return
                }
                setClients(clientsFromDb)
            } catch (error) {
                console.error(error)
                setClients(null)
            }
        })()
    },[])

    return (
        <section id="client-list">
            <h1>Clients</h1>
            {clients === undefined ? 
            (
                <div>
                    Clients Loading
                </div>
            )
            :
            (
                <div>
                    {clients === null && <div>No Clients</div>}
                    {clients && (
                        <ul>
                            {clients.map(client => <li><Link to={"/client/"+ client.id}>{client.name}</Link></li>)}
                        </ul>
                    )}
                </div>
            )
        }
        <FabLink label="add client" to={"/add-client"}/>
        </section>
    )
}