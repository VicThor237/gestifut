import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';  // Importar Firestore
import { doc, getDoc } from 'firebase/firestore';  // Funciones para obtener datos de Firestore

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Estado del usuario
  const [loading, setLoading] = useState(true);  // Estado de carga

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Obtener el documento del usuario desde Firestore
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Debug para ver si los datos se están obteniendo
            console.log('Datos de Firestore del usuario:', userData);

            // Combinamos los datos de autenticación con los de Firestore
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              role: userData.role,
              firstName: userData.firstName,  // Añadir nombre
              lastName: userData.lastName,    // Añadir apellidos
              phone: userData.phone,          // Añadir teléfono si es necesario
            });
          } else {
            console.error('No se encontró el documento del usuario en Firestore');
          }
        } catch (error) {
          console.error('Error al obtener el documento del usuario:', error);
        }
      } else {
        setUser(null);  // Si no hay usuario autenticado
      }
      setLoading(false);  // Finalizar estado de carga
    });

    return () => unsubscribe();  // Limpiar el listener cuando se desmonte el componente
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder al contexto de autenticación
export const useAuth = () => useContext(AuthContext);
