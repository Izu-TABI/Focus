import { doc, getDoc } from 'firebase/firestore'
import { db, auth } from './firebase'


//databaseの情報を返す(Promiseでラップされた値)
export async function getDatabaseInfo() {

     //usersのdocumentを取得
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const docSnap = await getDoc(userRef)
    const data = docSnap.data();
    return data;
}