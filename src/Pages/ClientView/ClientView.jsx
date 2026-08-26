import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import FabMenu from "../../Components/FAB/FabMenu"
import NewIncExpModal from "../../Components/NewIncExpModal/NewIncExpModal"
import { getClientById, getTractionsByCustomerId } from "../../Server/Server"

export default function ClientView(){
    const {id} = useParams()
    const [client,setClient] = useState(undefined)
    const [clientTransactions,setClientTransactions] = useState(null)
    const [modalOpen,setModalOpen] = useState(false)
    const [modalType,setModalType] = useState("income")

    const clientIncomes = clientTransactions?.filter(trans => trans.type === "income")
    const clientExpenses = clientTransactions?.filter(trans => trans.type === "expenditure")
    console.log(clientIncomes)


    useEffect(() => {
        (async () => {
            try {
                const clientFromDb = await getClientById(id)
                const transactionsFromDb = await getTractionsByCustomerId(id)
                setClient(clientFromDb)
                setClientTransactions(transactionsFromDb)

            } catch (error) {
                console.error(error)
            }
        })()
    },[])

    const fabItems = [
        {
            label:"income",
            onClick:() => {
                setModalType("income")
                setModalOpen(true)
            },
            icon:"inc"
        },
        {
            label:"expenditure",
            onClick:() => {
                setModalType("expenditure")
                setModalOpen(true)
            },
            icon:"exp"
        }
    ]

    const closeModal = () => setModalOpen(false)

    return (
        <section>
            <h1> Client {client?.name}</h1>
            <div className="transactions">
                <div className="incomes">
                    <h2>Incomes</h2>
                    {
                        clientIncomes?.map(income => 
                        (<div>
                            <div>
                                <strong>
                                    item
                                </strong>
                                <span>
                                    {income.lineItem}
                                </span>
                            </div>
                            <div>
                                <strong>
                                    Amount
                                </strong>
                                <span>
                                    {income.amount}
                                </span>
                            </div>
                        </div>)
                        )
                    }
                </div>
                <div className="expenditures">
                    <h2>Expenses</h2>
                    {
                        clientExpenses?.map(expense => 
                        (<div>
                            <div>
                                <strong>
                                    item
                                </strong>
                                <span>
                                    {expense.lineItem}
                                </span>
                            </div>
                            <div>
                                <strong>
                                    Amount
                                </strong>
                                <span>
                                    {expense.amount}
                                </span>
                            </div>
                        </div>)
                        )
                    }
                </div>
            </div>
            <FabMenu items={fabItems}/>
            {modalOpen && <NewIncExpModal clientId={id} onClose={closeModal}type={modalType}/>}
        </section>
    )
}