import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

const UserContext = createContext(null);

export function useUser() {
    return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
    const { userId } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/user/userData/${userId}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setUser(data); // Assume this endpoint returns all user-related data
            console.log("Full user data fetched from userContext: ", data);
        } catch (e) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchUserData();
        }
    }, [userId, fetchUserData]);

    return (
        <UserContext.Provider value={{
            user, 
            isLoggedIn,
            isLoading,
            error,
            fetchUserData 
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
