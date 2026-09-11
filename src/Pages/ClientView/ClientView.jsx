import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import FabMenu from "../../Components/FAB/FabMenu"
import NewIncExpModal from "../../Components/NewIncExpModal/NewIncExpModal"
import { deleteTransactionById, getClientById} from "../../Server/Server"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { db } from "../../services/firebase/firebaseConfig"
import "./ClientView.css"
import DeleteItemModal from "../../Components/DeleteItemModal/DeleteItemModal"

export default function ClientView(){
    const {id} = useParams()
    const [client,setClient] = useState(undefined)
    const [clientTransactions,setClientTransactions] = useState(null)
    const [modalOpen,setModalOpen] = useState(false)
    const [deleteModalOpen,setDeleteModalOpen] = useState(false)
    const [itemToBeDeleted,setItemToBeDeleted] = useState(null)
    const [modalType,setModalType] = useState("income")

    const groups = {};

    // 1. Group and accumulate totals in a single pass
    for (const trans of (clientTransactions || [])) {
        const { date, type, amount } = trans;
        const numAmount = Number(amount) || 0;

        if (!groups[date]) {
            groups[date] = { 
                date, 
                incomes: [], 
                expenses: [],
                dayIncomeTotal: 0,
                dayExpenseTotal: 0,
                dayNetBalance: 0 // Will hold this specific day's balance
            };
        }

        if (type === "income") {
            groups[date].incomes.push(trans);
            groups[date].dayIncomeTotal += numAmount;
        } else if (type === "expenditure") {
            groups[date].expenses.push(trans);
            groups[date].dayExpenseTotal += numAmount;
            
        }
    }

    // 2. Map, clean decimals, and calculate dayNetBalance
    const groupedAndSortedTransactions = Object.values(groups)
    .map(day => {
        // Calculate net balance for this specific day
        const net = day.dayIncomeTotal - day.dayExpenseTotal;
        
        return {
        ...day,
        // Fix JavaScript floating-point issues by rounding to 2 decimals
        dayIncomeTotal: Number(day.dayIncomeTotal.toFixed(2)),
        dayExpenseTotal: Number(day.dayExpenseTotal.toFixed(2)),
        dayNetBalance: Number(net.toFixed(2)) 
        };
    })
    // 3. Sort by date newest to oldest
    .sort((a, b) => new Date(b.date) - new Date(a.date));

    


    useEffect(() => {
        // 1. Fetch the static client data first
        const fetchClient = async () => {
            try {
                const clientFromDb = await getClientById(id);
                setClient(clientFromDb);
            } catch (error) {
                console.error("Error fetching client:", error);
            }
        };
        fetchClient();

        // 2. Set up the real-time listener for transactions
        // Assuming getTractionsByCustomerId uses a query similar to this:
        const q = query(collection(db, "transaction"), where("clientId", "==", id));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            // Look at specific document changes
            snapshot.docChanges().forEach((change) => {
                const changedDoc = { id: change.doc.id, ...change.doc.data() };

                if (change.type === "added") {
                    setClientTransactions((prev) => [...(prev || []), changedDoc]);
                }
                if (change.type === "modified") {
                    setClientTransactions((prev) => 
                        prev?.map((tx) => tx.id === changedDoc.id ? changedDoc : tx)
                    );
                }
                if (change.type === "removed") {
                    setClientTransactions((prev) => 
                        prev?.filter((tx) => tx.id !== changedDoc.id)
                    );
                }
            });
        }, (error) => {
            console.error("Listener error:", error);
        });

        return () => unsubscribe();

    }, [id]);

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
    const openDeleteItemModal = (itemId) => {
        setItemToBeDeleted(itemId)
        setDeleteModalOpen(true)
    }
    const closeDeleteItemModal = () => {
        setItemToBeDeleted(null)
        setDeleteModalOpen(false)   
    }

    return (
        <section>
            <h1>Client {client?.name}</h1>
            
            <div className="transactions-timeline">
                {groupedAndSortedTransactions?.map(group => (
                <div key={group.date} className="date-group">
                    {/* Date Header for this specific group */}
                    <h2 className="date-header">{group.date}</h2>
                    
                    <div className="transactions">
                    {/* Incomes Section for this day */}
                    <div className="incomes">
                        <h3>Incomes</h3>
                        {group.incomes.length === 0 ? <p className="empty-text">No incomes today</p> : 
                        group.incomes.map((income, index) => (
                            <div key={income.id || index} className="item">
                            <div>
                                <span>{income.lineItem}</span>
                            </div>
                            <div>
                                <span>{income.amount}</span>
                            </div>
                            <button onClick={() => openDeleteItemModal(income.id)}>
                                X
                            </button>
                            </div>
                        ))
                        }
                        {
                            group.incomes.length !== 0 &&
                            <div className="total">
                                <strong>
                                    total incomes
                                </strong>
                                <span>{group.dayIncomeTotal}</span>
                            </div>
                        }
                        
                    </div>

                    {/* Expenditures Section for this day */}
                    <div className="expenditures">
                        <h3>Expenses</h3>
                        {group.expenses.length === 0 ? <p className="empty-text">No expenses today</p> : 
                        group.expenses.map((expense, index) => (
                            <div key={expense.id || index} className="item">
                                <div>
                                    <span>{expense.lineItem}</span>
                                </div>
                                <div>
                                    <span>{expense.amount}</span>
                                </div>
                                <button onClick={() => openDeleteItemModal(expense.id)}>
                                    X
                                </button>
                            </div>
                        ))
                        }
                        {
                            group.expenses.length !== 0 &&
                            <div className="total">
                                <strong>
                                    Total Expenses
                                </strong>
                                <span>
                                    {group.dayExpenseTotal}
                                </span>
                            </div>
                        }
                        
                    </div>
                    <div className={group.dayNetBalance < 0 ? "total net loss" : "total net profit"}>
                        <strong>
                            {group.date} {group.dayNetBalance < 0 ? "loss" : "profit"}
                        </strong>
                        <strong>
                            {group.dayNetBalance}
                        </strong>
                    </div>
                    </div>
                </div>
                ))}
            </div>

            <FabMenu items={fabItems}/>
            {modalOpen && <NewIncExpModal clientId={id} onClose={closeModal} type={modalType}/>}
            {deleteModalOpen && <DeleteItemModal itemId={itemToBeDeleted} onClose={closeDeleteItemModal}/>}
        </section>

    )
}