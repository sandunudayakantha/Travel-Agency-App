import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useClerkAuthContext } from '../../contexts/ClerkAuthContext.jsx';
import { SignIn } from '@clerk/clerk-react';
import SocialAuth from '../../components/auth/SocialAuth.jsx';

const scenicPhotos = [
  // Ella - Nine Arch Bridge
  'https://images.unsplash.com/photo-1704797389166-c7dac99fc633?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGxhJTIwYnJpZGdlJTIwc3JpJTIwbGFua2F8ZW58MXx8fHwxNzU2MDE2MjU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  
  // Beach side Sri Lanka - Mirissa Beach
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfG1pcmlzc2ElMjBiZWFjaCUyMHNyaSUyMGxhbmthfGVufDF8fHx8MTc1NjAxNjI2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  
  // Anuradhapura - Sacred City
  'https://images.unsplash.com/photo-1580889240912-c39ecefd3d95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfGFudXJhZGhhcHVyYSUyMHNyaSUyMGxhbmthfGVufDF8fHx8MTc1NjAxNjI2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  
  // Sigiriya - Lion Rock Fortress
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHNpZ2lyaXlhJTIwc3JpJTIwbGFua2F8ZW58MXx8fHwxNzU2MDE2MjYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  
  // Ella - Tea Plantations
  'https://images.unsplash.com/photo-1559372122-1a97b2d22c22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfGVsbGElMjB0ZWElMjBwbGFudGF0aW9ucyUyMHNyaSUyMGxhbmthfGVufDF8fHx8MTc1NjAxNjI2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
];

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading, error, clearError } = useAuth();
  const { isSignedIn: isClerkSignedIn } = useClerkAuthContext();

  const [localError, setLocalError] = useState('');
  const [currentBgIndex, setCurrentBgIndex] = useState(() => Math.floor(Math.random() * scenicPhotos.length));
  const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)' });
  const [typedText, setTypedText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [loginMethod, setLoginMethod] = useState('traditional'); // 'traditional' or 'social'
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const phrases = [
    'Discover Ella\'s Nine Arch Bridge',
    'Explore Sigiriya\'s ancient fortress',
    'Visit Anuradhapura\'s sacred temples',
    'Relax on Mirissa\'s pristine beaches',
    'Experience Sri Lanka\'s tea culture'
  ];

  const currentPhrase = phrases[currentPhraseIndex];

  useEffect(() => {
    if (isAuthenticated || isClerkSignedIn) {
      navigate('/');
    }
  }, [isAuthenticated, isClerkSignedIn, navigate]);

  // Typing animation effect
  useEffect(() => {
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseTime = 2000;

    if (!isDeleting && typedText === currentPhrase) {
      // Pause at end of phrase
      const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && typedText === '') {
      // Move to next phrase
      setIsDeleting(false);
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setTypedText(currentPhrase.slice(0, typedText.length - 1));
      } else {
        setTypedText(currentPhrase.slice(0, typedText.length + 1));
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentPhrase]);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Rotate background image every 7 seconds with smooth crossfade
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % scenicPhotos.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleFieldChange = (field) => (e) => {
    if (error) clearError();
    setLocalError('');
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleTraditionalLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }
    
    const result = await login(formData);
    if (result.success) {
      navigate('/');
    }
  };

  const handleTiltMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const percentX = (event.clientX - centerX) / (rect.width / 2);
    const percentY = (event.clientY - centerY) / (rect.height / 2);
    const maxRotate = 6; // degrees
    const rotateY = Math.max(Math.min(percentX * maxRotate, maxRotate), -maxRotate);
    const rotateX = Math.max(Math.min(-percentY * maxRotate, maxRotate), -maxRotate);
    setTiltStyle({ transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)` });
  };

  const handleTiltLeave = () => {
    setTiltStyle({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)' });
  };

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Local styles for subtle animations */}
      <style>{`
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes floatSlow { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        .animate-gradient { background-size: 200% 200%; animation: gradientShift 8s ease infinite; }
        .float-slow { animation: floatSlow 6s ease-in-out infinite; }
        
        /* Glass morphism input styles */
        input[type="email"], input[type="password"] {
          background: rgba(255, 255, 255, 0.05) !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          color: white !important;
        }
        
        input[type="email"]::placeholder, input[type="password"]::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }
        
        input[type="email"]:focus, input[type="password"]:focus {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2) !important;
        }
      `}</style>
      <div className="pointer-events-none select-none absolute inset-0">
        {scenicPhotos.map((url, idx) => (
          <img
            key={url}
            src={url}
            alt=""
            aria-hidden={idx !== currentBgIndex}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              idx === currentBgIndex ? 'opacity-100' : 'opacity-0'
            }`}
            loading={idx === currentBgIndex ? 'eager' : 'lazy'}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1c2e]/40 via-[#0c1c2e]/20 to-white/90" />

      {/* Floating travel icons for subtle motion */}
      

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-8 md:grid-cols-2">
          <div className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] hidden md:block">
            <p className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur">
              <span className="mr-2">🌴</span> Welcome back to Sri Lanka
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
              Find your next
              <span className="block text-2xl font-normal mt-2">
                <span className="text-white/90">{typedText}</span>
                <span className={`ml-1 inline-block w-0.5 h-6 bg-white ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-150`}></span>
              </span>
            </h1>
            <p className="mt-4 max-w-md text-white/90">
              Sign in to track your Sri Lankan adventures, manage bookings, and unlock exclusive
              deals for exploring the pearl of the Indian Ocean.
            </p>
          </div>

          <div className="md:ml-auto relative">
            {/* Aurora glow behind card */}
            <div className="absolute -inset-6 -z-10 blur-2xl opacity-50" aria-hidden>
              <div className="h-full w-full rounded-3xl bg-gradient-to-r from-[#0c1c2e]/30 via-[#0c1c2e]/20 to-white/10" />
            </div>

            {/* Glass morphism card wrapper */}
            <div
              className="rounded-3xl p-[2px] bg-gradient-to-r from-white/20 via-white/10 to-white/20 backdrop-blur-sm"
              onMouseMove={handleTiltMove}
              onMouseLeave={handleTiltLeave}
              style={tiltStyle}
            >
              <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-2xl min-w-[400px]">
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white shadow-lg">
                    🌍
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Sign in</h2>
                  <p className="text-white/80">Welcome back to your journey</p>
                </div>

                {/* Login Method Toggle */}
                <div className="mb-8 flex rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-1">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('traditional')}
                    className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 ${
                      loginMethod === 'traditional'
                        ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Email & Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('social')}
                    className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 ${
                      loginMethod === 'social'
                        ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Social Login
                  </button>
                </div>

                {(localError || error) && (
                  <div className="mb-6 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm p-4 text-sm text-red-200">
                    {localError || error}
                  </div>
                )}

                {loginMethod === 'traditional' ? (
                  /* Traditional Login Form */
                  <form onSubmit={handleTraditionalLogin} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleFieldChange('email')}
                        className="block w-full rounded-xl border border-white/20 bg-white/5 backdrop-blur-md px-4 py-3 text-white placeholder-white/50 shadow-lg outline-none ring-white/20 focus:border-white/30 focus:ring-2 focus:bg-white/10 transition-all duration-300"
                        placeholder="Enter your email"
                        required
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleFieldChange('password')}
                        className="block w-full rounded-xl border border-white/20 bg-white/5 backdrop-blur-md px-4 py-3 text-white placeholder-white/50 shadow-lg outline-none ring-white/20 focus:border-white/30 focus:ring-2 focus:bg-white/10 transition-all duration-300"
                        placeholder="Enter your password"
                        required
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)'
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 font-medium text-white shadow-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-80 transition-all duration-300 transform hover:scale-105"
                    >
                      {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                  </form>
                ) : (
                  /* Social Login */
                  <div className="space-y-6 min-h-[400px]">
                    <SignIn 
                      appearance={{
                        elements: {
                          formButtonPrimary: 'group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 font-medium text-white shadow-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-80 transition-all duration-300 transform hover:scale-105',
                          card: 'shadow-none bg-transparent',
                          headerTitle: 'text-3xl font-bold text-white mb-2',
                          headerSubtitle: 'text-white/80',
                          socialButtonsBlockButton: 'w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-3 text-white shadow-sm hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 transform hover:scale-105',
                          dividerLine: 'bg-white/30',
                          dividerText: 'bg-transparent px-4 text-white/70 text-sm',
                          formFieldInput: 'block w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-md pl-12 pr-4 py-3 text-white placeholder-white/50 shadow-lg outline-none ring-white/20 focus:border-white/30 focus:ring-2 focus:bg-white/10 transition-all duration-300',
                          formFieldLabel: 'mb-2 block text-sm font-medium text-white/90',
                          footerActionLink: 'font-medium text-white hover:opacity-80',
                          formFieldInputShowPasswordButton: 'text-white/70 hover:text-white',
                          formFieldInputShowPasswordButtonIcon: 'text-white/70',
                          formResendCodeLink: 'text-white hover:opacity-80',
                          identityPreviewText: 'text-white/90',
                          identityPreviewEditButton: 'text-white hover:opacity-80',
                          footer: 'text-white/70',
                          footerAction: 'text-white hover:opacity-80'
                        }
                      }}
                      redirectUrl="/"
                      signUpUrl="/register"
                    />
                  </div>
                )}

                <div className="mt-8 text-center text-sm text-white/80">
                  New here?{' '}
                  <Link to="/register" className="font-medium text-white hover:opacity-80 transition-opacity">
                    Create an account
                  </Link>
                </div>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="text-sm text-white/60 underline underline-offset-4 hover:text-white/80 transition-colors"
                  >
                    Continue as guest
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;