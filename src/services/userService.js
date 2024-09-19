import { auth, db } from '../firebase';  // Importar Firebase Auth y Firestore
import { doc, getDoc } from 'firebase/firestore';

// Función para obtener el rol del usuario autenticado
export const getUserRole = async () => {
  const user = auth.currentUser;  // Obtener el usuario autenticado
  if (user) {
    const userDoc = await getDoc(doc(db, 'users', user.uid));  // Obtener el documento del usuario desde Firestore
    if (userDoc.exists()) {
      const userData = userDoc.data();  // Obtener los datos del usuario
      return userData.role;  // Retornar el rol del usuario
    }
  }
  return null;  // Si no existe el usuario o no tiene rol, retorna null
};
