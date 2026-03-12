import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Github, Chrome } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      let result;
      if (isSignUp) {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      
      const userResult = result.user;
      const userDoc = await getDoc(doc(db, 'users', userResult.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', userResult.uid), {
          uid: userResult.uid,
          email: userResult.email,
          role: 'reader'
        });
      }
      navigate('/');
    } catch (error: any) {
      console.error("Email auth error:", error);
      setErrorMsg(error.message);
    }
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    handleLogin(provider);
  };

  const handleLogin = async (provider: GoogleAuthProvider | GithubAuthProvider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user profile exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          role: 'reader',
          photoURL: user.photoURL
        });
      }
      
      navigate('/');
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center space-y-6">
        <h1 className="text-3xl font-serif font-bold">You are logged in</h1>
        <p className="text-slate-500">Welcome back, {user.displayName}</p>
        <button 
          onClick={() => auth.signOut()}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto text-accent">
          <Mail size={40} />
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl font-serif font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 text-sm">Sign in to continue to Editorial</p>
        </div>
      </div>

      <div className="space-y-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-4 rounded-xl font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <Chrome size={20} className="text-red-500" />
          Continue with Google
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleLogin(new GithubAuthProvider())}
          className="w-full flex items-center justify-center gap-3 bg-slate-900 py-4 rounded-xl font-bold text-white shadow-lg shadow-slate-900/20"
        >
          <Github size={20} />
          Continue with GitHub
        </motion.button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
            <span className="bg-white px-4 text-slate-400">Or with email</span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleEmailAuth}>
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
              {errorMsg}
            </div>
          )}
          <input 
            type="email" 
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none text-sm"
            required
          />
          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none text-sm"
            required
          />
          <button type="submit" className="w-full bg-accent text-white py-4 rounded-xl font-bold shadow-lg shadow-accent/20 hover:bg-accent/90 transition-colors">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
          <div className="text-center text-sm pt-2">
            <button 
              type="button" 
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-bold text-slate-500 hover:text-slate-900"
            >
              {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
            </button>
          </div>
        </form>
      </div>

      <p className="text-center text-xs text-slate-400">
        By continuing, you agree to our <span className="text-slate-900 font-bold underline">Terms of Service</span> and <span className="text-slate-900 font-bold underline">Privacy Policy</span>.
      </p>
    </div>
  );
}
