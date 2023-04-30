import { firebaseApp } from "../firebase"
import { getDatabase, ref } from "firebase/database"

const database = getDatabase(firebaseApp)

export const questionBankRef = ref(database, 'root/questionBank');
