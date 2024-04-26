const apiUrl = 'http://localhost:5000';

export const login = async (username, password) => {
    try {
        const response = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            const token = data.token;
            console.log('Authentication successful');
            return { success: true, token };
        } else {
            console.log('Authentication failed');
            throw new Error('Authentication failed');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const fetchAccountInfo = async (accountId) => {
    try {
        const response = await fetch(`${apiUrl}/account/${accountId}`, {
            credentials: 'include',
        });
        if (response.ok) {
            return response.json();
        } else {
            throw {message: 'Failed to fetch account information', status: response.status};
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const updateAccountInfo = async (accountId, accountData) => {
    try {
        const response = await fetch(`${apiUrl}/account/${accountId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(accountData),
            credentials: 'include',
        });
        if (!response.ok) {
            throw {message: 'Failed to update account information', status: response.status};
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};