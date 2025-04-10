import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

const Login = () => {
  const { login ,user} = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      // Redirect based on role
      const userRole = user.role;
      console.log(userRole);
      

      if (userRole === 'admin' || userRole === 'hr') {
        navigate('/admin/dashboard');
      } else if (userRole === 'employee') {
        navigate('/employee/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', paddingTop: '100px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: '10px' }}>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" style={{ marginTop: '15px' }}>Login</button>
      </form>
    </div>
  );
};

export default Login;
