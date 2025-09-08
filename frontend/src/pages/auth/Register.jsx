import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useClerkAuthContext } from '../../contexts/ClerkAuthContext.jsx';
import SocialAuth from '../../components/auth/SocialAuth.jsx';
import TravelLoading from '../../components/TravelLoading';
import { useLoading } from '../../hooks/useLoading';

const scenicPhotos = [
  // Galle Fort - Historic Dutch Fortress
  '/src/pages/Images/galle-fort-1050x700-1.jpg',
  
  // Temple of the Tooth - Kandy
  '/src/pages/Images/temple-sacred-tooth-relic-kandy-sri-lanka.jpg',
  
  // Nuwara Eliya - Tea Plantations & Waterfalls
  '/src/pages/Images/nuwara-eliya-highlights-waterfall-tea-and-picturesque-train-ride-4058.webp',
  
  // Jaffna - Northern Sri Lanka
  '/src/pages/Images/Jaffna,_srilanka.jpg',
  
  // Elephant Family - Wildlife
  '/src/pages/Images/pexels-freestockpro-319879.jpg',
  
  // Ella Nine Arch Bridge
  '/src/pages/Images/Ella-Nine-Arch-Bridge-1-scaled.jpg',
  
  // Anuradhapura - Sacred City
  '/src/pages/Images/photo-1580889240912-c39ecefd3d95.jpeg',
];

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading, error, clearError } = useAuth();
  const { isSignedIn: isClerkSignedIn } = useClerkAuthContext();

  const [localError, setLocalError] = useState('');
  const [currentBgIndex, setCurrentBgIndex] = useState(() => Math.floor(Math.random() * scenicPhotos.length));
  const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)' });
  const [typedText, setTypedText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [registerMethod, setRegisterMethod] = useState('traditional'); // 'traditional' or 'social'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { isLoading: pageLoading, startLoading, stopLoading, progress, message } = useLoading();

  const phrases = [
    'Explore historic Galle Fort',
    'Visit the sacred Temple of the Tooth',
    'Discover Nuwara Eliya\'s tea estates',
    'Experience Jaffna\'s unique culture',
    'Meet majestic elephant families',
    'Cross Ella\'s Nine Arch Bridge',
    'Wander through ancient Anuradhapura'
  ];

  const currentPhrase = phrases[currentPhraseIndex];

  useEffect(() => {
    if (isAuthenticated || isClerkSignedIn) {
      // Stop loading if user is already authenticated
      stopLoading();
      navigate('/');
    }
  }, [isAuthenticated, isClerkSignedIn, navigate, stopLoading]);

  // Handle AuthContext loading state
  useEffect(() => {
    if (loading && !pageLoading) {
      // If AuthContext is loading but our page loading is not active, start it
      startLoading("Checking authentication...", 1500);
    } else if (!loading && pageLoading) {
      // If AuthContext finished loading but our page loading is still active, stop it
      stopLoading();
    }
  }, [loading, pageLoading, startLoading, stopLoading]);

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

  // Rotate background image every 5 seconds with smooth crossfade
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

  const handleTraditionalRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }
    
    // Clear any previous errors
    setLocalError('');
    clearError();
    
    // Start loading animation
    startLoading("Creating your account...", 3000);
    
    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        // Registration successful - loading will continue until navigation
        setTimeout(() => {
          navigate('/');
        }, 1000); // Give time for loading animation to complete
      } else {
        // Registration failed - stop loading and show error
        stopLoading();
        setLocalError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      // Handle unexpected errors
      stopLoading();
      setLocalError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', error);
    }
  };



  const handleTiltMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const percentX = (event.clientX - centerX) / (rect.width / 2);
    const percentY = (event.clientY - centerY) / (rect.height / 2);
    const maxRotate = 6;
    const rotateY = Math.max(Math.min(percentX * maxRotate, maxRotate), -maxRotate);
    const rotateX = Math.max(Math.min(-percentY * maxRotate, maxRotate), -maxRotate);
    setTiltStyle({ transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)` });
  };

  const handleTiltLeave = () => {
    setTiltStyle({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)' });
  };

  return (
    <>
      {pageLoading && (
        <TravelLoading 
          message={message}
          progress={progress}
          size="medium"
        />
      )}
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

      {/* Background slideshow */}
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
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1c2e]/40 via-[#0c1c2e]/20 to-[#0c1c2e]/30" />

      {/* Floating travel icons for subtle motion */}

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-8 md:grid-cols-2">
          <div className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] hidden md:block">
            <p className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur">
              <span className="mr-2">🌴</span> Welcome to Sri Lanka
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
              Start your next
              <span className="block text-2xl font-normal mt-2">
                <span className="text-white/90">{typedText}</span>
                <span className={`ml-1 inline-block w-0.5 h-6 bg-white ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-150`}></span>
              </span>
            </h1>
            <p className="mt-4 max-w-md text-white/90">
              Create your account to track your Sri Lankan adventures, manage bookings, and unlock exclusive
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
              <div className="rounded-3xl bg-black/20 backdrop-blur-sm border border-white/20 p-8 shadow-2xl min-w-[400px] hover:bg-black/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20">
                <div className="mb-8 text-center">

                  <h2 className="text-3xl font-bold text-white mb-2">Create an account</h2>
                  <p className="text-white/80">Start your journey with us</p>
                </div>

                {(localError || error) && (
                  <div className="mb-6 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm p-4 text-sm text-red-200">
                    {localError || error}
                  </div>
                )}

                {/* Registration Method Toggle */}
                <div className="mb-8 flex rounded-xl border border-white/20 bg-black/20 backdrop-blur-sm p-1">
                  <button
                    type="button"
                    onClick={() => setRegisterMethod('traditional')}
                    className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 ${
                      registerMethod === 'traditional'
                        ? 'bg-orange-500/20 text-orange-300 shadow-lg backdrop-blur-sm border border-orange-400/50'
                        : 'text-white/70 hover:text-white hover:bg-black/30'
                    }`}
                  >
                    Email & Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegisterMethod('social')}
                    className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 ${
                      registerMethod === 'social'
                        ? 'bg-orange-500/20 text-orange-300 shadow-lg backdrop-blur-sm border border-orange-400/50'
                        : 'text-white/70 hover:text-white hover:bg-black/30'
                    }`}
                  >
                    Social Register
                  </button>
                </div>

                {registerMethod === 'traditional' ? (
                  /* Traditional Registration Form */
                  <form onSubmit={handleTraditionalRegister} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleFieldChange('name')}
                        className="block w-full rounded-xl border border-white/20 bg-black/20 backdrop-blur-sm px-4 py-3 text-white placeholder-white/50 shadow-lg outline-none ring-white/20 focus:border-orange-400 focus:ring-2 focus:bg-black/30 transition-all duration-300 hover:bg-black/30"
                        placeholder="Enter your full name"
                        required
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)'
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleFieldChange('email')}
                        className="block w-full rounded-xl border border-white/20 bg-black/20 backdrop-blur-sm px-4 py-3 text-white placeholder-white/50 shadow-lg outline-none ring-white/20 focus:border-orange-400 focus:ring-2 focus:bg-black/30 transition-all duration-300 hover:bg-black/30"
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
                        className="block w-full rounded-xl border border-white/20 bg-black/20 backdrop-blur-sm px-4 py-3 text-white placeholder-white/50 shadow-lg outline-none ring-white/20 focus:border-orange-400 focus:ring-2 focus:bg-black/30 transition-all duration-300 hover:bg-black/30"
                        placeholder="Enter your password"
                        required
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)'
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleFieldChange('confirmPassword')}
                        className="block w-full rounded-xl border border-white/20 bg-black/20 backdrop-blur-sm px-4 py-3 text-white placeholder-white/50 shadow-lg outline-none ring-white/20 focus:border-orange-400 focus:ring-2 focus:bg-black/30 transition-all duration-300 hover:bg-black/30"
                        placeholder="Confirm your password"
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
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500/20 backdrop-blur-sm border border-orange-400/50 px-6 py-3 font-medium text-orange-300 shadow-lg hover:bg-orange-500/30 focus:outline-none focus:ring-2 focus:ring-orange-400/30 disabled:cursor-not-allowed disabled:opacity-80 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20"
                    >
                      {loading ? 'Creating account...' : 'Create account'}
                    </button>
                  </form>
                ) : (
                  /* Social Registration */
                  <div className="space-y-6 min-h-[400px]">
                    <SocialAuth />
                  </div>
                )}

                <div className="mt-8 text-center text-sm text-white/80">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-white hover:opacity-80 transition-opacity">
                    Sign in
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
    </>
  );
};

export default Register;