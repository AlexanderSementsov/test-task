const apiUrl = 'http://localhost:5000';

export const login = async (username, password) => {
    try {
        const response = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
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

export const fetchAccountInfo = async (accountId, token) => {
    try {
        const response = await fetch(`${apiUrl}/account/${accountId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch account information');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const updateAccountInfo = async (accountId, accountData, token) => {
    try {
        const response = await fetch(`${apiUrl}/account/${accountId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(accountData)
        });
        if (!response.ok) {
            throw new Error('Failed to update account information');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
