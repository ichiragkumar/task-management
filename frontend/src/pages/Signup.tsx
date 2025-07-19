import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signup } from '../api/api';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({ email, password, role: 'USER' });
      toast.success('Signup successful');
      navigate('/login');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSignup} className="max-w-md mx-auto mt-20 space-y-4">
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full" />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 w-full" />
      <button type="submit" className="bg-green-600 text-white px-4 py-2">Signup</button>
    </form>
  );
}
