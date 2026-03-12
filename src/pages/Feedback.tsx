import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';

export function Feedback() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        name,
        email,
        message,
        createdAt: new Date().toISOString()
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-serif font-bold text-slate-900">Get in Touch</h1>
        <p className="text-slate-500 text-sm">We'd love to hear your thoughts and suggestions.</p>
      </header>

      {submitted ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100 text-center space-y-4"
        >
          <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-serif font-bold text-emerald-900">Message Sent!</h3>
            <p className="text-emerald-600 text-sm">Thank you for your feedback. We'll get back to you soon.</p>
          </div>
          <button 
            onClick={() => setSubmitted(false)}
            className="text-emerald-700 text-xs font-bold uppercase tracking-widest underline"
          >
            Send another message
          </button>
        </motion.div>
      ) : (
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Message</label>
            <textarea 
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what's on your mind..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none text-sm resize-none"
            />
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className="w-full bg-accent text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Send size={18} />
                Send Message
              </>
            )}
          </button>
        </motion.form>
      )}

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
          <Mail size={24} />
        </div>
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Direct Email</p>
          <p className="text-slate-900 font-medium">hello@editorialblog.com</p>
        </div>
      </div>
    </div>
  );
}
