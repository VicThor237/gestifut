import { auth, db } from '../firebase';  // Importamos Firebase Auth y Firestore
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';


export const registerUser = async (email, password, firstName, lastName, phone, role = 'player') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Guardar el usuario en Firestore con los nuevos campos
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,  // Guardar el teléfono con el formato del código de país
        role: role,
        teamId: null
      });
  
      console.log('Usuario registrado con éxito con el rol:', role);
    } catch (error) {
      console.error('Error al registrar el usuario: ', error);
      throw error;
    }
  };


// Función para iniciar sesión
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Inicio de sesión exitoso para el usuario: ', user.email);
    return user;
  } catch (error) {
    console.error('Error al iniciar sesión: ', error);
    throw error;
  }
};

// Función para cerrar sesión
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('Cierre de sesión exitoso');
  } catch (error) {
    console.error('Error al cerrar sesión: ', error);
    throw error;
  }
};

// Función para obtener los datos del usuario desde Firestore
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();  // Devuelve los datos del usuario (incluido el rol)
    } else {
      console.log('No se encontró el usuario en la base de datos');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener los datos del usuario: ', error);
    throw error;
  }
};
