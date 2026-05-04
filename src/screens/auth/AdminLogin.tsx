import { useState } from 'react';
import type { Screen } from '../../types';
import { HMISGlobe, HMISShieldLogo, EyeOpen, EyeOff } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

interface Props { setScreen: (s: Screen) => void }

export function AdminLogin({ setScreen }: Props) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    if (!email || !password) { setError('Please fill in all fields'); return; }

    if (email !== 'admin@hmis.com' || password !== 'admin123') {
      setError('Invalid admin credentials');
      return;
    }

    setLoading(true);
    setError('');
    
    setTimeout(() => {
      login({
        uid: Math.random().toString(),
        email: email,
        name: 'Admin User',
        role: 'admin'
      });
      
      setScreen('admin-home');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="admin-login-screen">
      <div className="admin-login-bg-image" />
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <LanguageSwitcher />
      </div>
      
      <div className="admin-login-container">
        <div className="admin-logo-row">
          <HMISGlobe size={80} color="#0E5E7A" />
          <span className="admin-hmis-text">HMIS</span>
          <HMISShieldLogo size={52} color="#0E5E7A" />
        </div>

        <div className="admin-login-card">
          <h2 className="admin-login-heading">Admin Login</h2>

          {error && (
            <p style={{ color: '#d32f2f', fontFamily: 'Inter', fontSize: 14, textAlign: 'center', margin: '0 0 8px', fontWeight: 600 }}>
              {error}
            </p>
          )}

          <div className="admin-input-field">
            <input 
              type="email" 
              placeholder="Admin Email" 
              value={email}
              onChange={e => setEmail(e.target.value)} 
              className="admin-input" 
              dir="ltr"
            />
          </div>

          <div className="admin-input-field">
            <input 
              type={showPass ? 'text' : 'password'} 
              placeholder="Password"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="admin-input" 
              dir="ltr"
            />
            <button type="button" className="admin-eye-btn" onClick={() => setShowPass(p => !p)} aria-label="toggle password">
              {showPass ? <EyeOpen size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <p className="admin-forgot-link">Forget Password ?</p>
        </div>

        <div className="admin-submit-btn-wrap">
          <button
            className="admin-submit-btn"
            onClick={handleLogin}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
