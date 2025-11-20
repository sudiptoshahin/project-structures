'use client';

import { useState, useEffect } from 'react';
// Assuming the path and exports are correct for the API and types
import { userApi } from '../api/userApi'; 
import { User } from '../types/user'; 

// Define the shape of the form data for better type safety
interface FormData {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
}

export default function UserList() {
    // 1. Fix: Add type assertion for User[]
    const [users, setUsers] = useState<User[]>([]); 
    const [loading, setLoading] = useState(true);
    // 2. Fix: Explicitly type error state to allow string or null
    const [error, setError] = useState<string | null>(null); 
    // 3. Fix: Use the defined FormData interface
    const [formData, setFormData] = useState<FormData>({ 
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        is_active: true,
    });
    // 4. Fix: Explicitly type editingId to allow number (for user ID) or null
    const [editingId, setEditingId] = useState<number | null>(null); 

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // Assuming userApi.getAll() returns User[]
            const data: User[] = await userApi.getAll(); 
            setUsers(data);
            setError(null);
        } catch (err) {
            // It's safer to cast err to Error and log its message, or check its type
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError('Failed to fetch users: ' + errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Use React.FormEvent<HTMLFormElement> for better typing on form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault();
        try {
            if (editingId) {
                // Assuming userApi.update expects a number for ID and FormData
                await userApi.update(editingId, formData); 
            } else {
                // Assuming userApi.create expects FormData
                await userApi.create(formData); 
            }
            // Reset form data and editing state
            setFormData({
                username: '',
                email: '',
                first_name: '',
                last_name: '',
                is_active: true,
            });
            setEditingId(null);
            fetchUsers(); // Refresh list
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError('Failed to save user: ' + errorMessage);
            console.error(err);
        }
    };

    // Ensure user object has 'id' property which is required for deletion/editing setup
    const handleEdit = (user: User) => {
        if (user.id === undefined) {
            console.error("User ID is missing for edit operation.");
            return;
        }
        setFormData({
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            is_active: user.is_active,
        });
        setEditingId(user.id); // user.id is assumed to be a number
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                // Assuming userApi.delete expects a number for ID
                await userApi.delete(id); 
                fetchUsers();
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                setError('Failed to delete user: ' + errorMessage);
                console.error(err);
            }
        }
    };

    const handleCancel = () => {
        setFormData({
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            is_active: true,
        });
        setEditingId(null);
    };

    // 5. Fix: If error is set, it should return a valid JSX element
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">Error: {error}</div>;

    // 6. Fix: Enclose the entire return content in a single parent JSX element (e.g., div)
    // 7. Fix: Wrap form elements within a <form> tag and use correct HTML structure
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>

            {/* User Create/Edit Form */}
            {/* 7. Fix: Form structure and binding handleSubmit */}
            <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                    {editingId ? '✏️ Edit User' : '✨ Create New User'}
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="border rounded px-3 py-2 w-full"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="border rounded px-3 py-2 w-full"
                        required
                    />
                    <input
                        type="text"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className="border rounded px-3 py-2 w-full"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className="border rounded px-3 py-2 w-full"
                        required
                    />
                </div>

                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        id="is_active_checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="rounded mr-2"
                    />
                    <label htmlFor="is_active_checkbox">Active</label>
                </div>

                <div className="flex space-x-4">
                    {/* Use <button type="submit"> for form submission */}
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        {editingId ? 'Update' : 'Create'}
                    </button>

                    {/* 7. Fix: Cancel button needs proper structure */}
                    {editingId && (
                        <button
                            type="button" // Use type="button" to prevent form submission
                            onClick={handleCancel}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* User List Table */}
            <h2 className="text-xl font-semibold mb-4">User List</h2>
            <div className="overflow-x-auto">
                {/* 7. Fix: Table structure */}
                <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            // 7. Fix: Use a unique 'key' for list elements
                            <tr key={user.id}> 
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.first_name} {user.last_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span 
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                    >
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {/* 7. Fix: Button structure and ensure user.id exists */}
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => user.id && handleDelete(user.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}