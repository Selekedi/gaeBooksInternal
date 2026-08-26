import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore"
import { db } from "../services/firebase/firebaseConfig"

const clientsRef = collection(db,"clients")
const transactionsRef = collection(db,"transaction")

export const getClients = async () => {
    try {
        const clientsSnapshot = await getDocs(clientsRef)
        const clientDocs = clientsSnapshot.docs.map(doc => ({
            id:doc.id,
            ...doc.data()
        }))
        return clientDocs
    } catch (error) {
        throw error
    }
}

export const addClient = async (name) => {
    try {
        const clientRef = doc(clientsRef)
        await setDoc(clientRef,{
            name:name
        })
        return clientRef.id
    } catch (error) {
        throw error
    }
}

export const getClientById = async (id) => {
    try {
        const clientRef = doc(db,"clients",id)
        const clientSnapShot =  await getDoc(clientRef)
        if(clientSnapShot.exists){
            return ({id:clientSnapShot.id,...clientSnapShot.data()})
        }
    } catch (error) {
        
    }
}

export const getTractionsByCustomerId = async (clientId) => {
    try {
        const q = query(transactionsRef,
            where("clientId","==",clientId)
        )
        const transactionsSnapshot = await getDocs(q)
        if(!transactionsSnapshot.empty){
            return transactionsSnapshot.docs.map(doc => ({
                id:doc.id,
                ...doc.data()
            }))
        } else {
            return []
        }
    } catch (error) {
           console.error(error)
    }
}

export const addTransaction = async ({clientId, type, details}) => {
    try {
        const transactionRef = doc(transactionsRef)
        const newTransactiion = await setDoc(transactionRef,{
            clientId,
            type,
            ...details,
            createdAt:serverTimestamp()
        })
        return transactionRef.id
    } catch (error) {
        console.error(error)
    }
}