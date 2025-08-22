import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useClerkAuthContext } from '../../contexts/ClerkAuthContext.jsx';
import { SignUp } from '@clerk/clerk-react';
import SocialAuth from '../../components/auth/SocialAuth.jsx';

const scenicPhotos = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop',
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

  const phrases = [
    'Start your journey',
    'Create memories',
    'Build your profile',
    'Join the community',
    'Begin exploring'
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

  // Background crossfade every 7s
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % scenicPhotos.length);
    }, 7000);
    return () => clearInterval(intervalId);
  }, []);

  const handleFieldChange = (setter) => (e) => {
    if (error) clearError();
    setLocalError('');
    setter(e.target.value);
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
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      <style>{`
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes floatSlow { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        .animate-gradient { background-size: 200% 200%; animation: gradientShift 8s ease infinite; }
        .float-slow { animation: floatSlow 6s ease-in-out infinite; }
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
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1c2e]/40 via-[#0c1c2e]/20 to-white/90" />

      {/* Floating icons */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[18%] text-2xl opacity-70 float-slow">🧭</div>
        <div className="absolute right-[10%] top-[25%] text-3xl opacity-70 float-slow" style={{ animationDelay: '0.8s' }}>🏔️</div>
        <div className="absolute left-[12%] bottom-[18%] text-3xl opacity-60 float-slow" style={{ animationDelay: '0.4s' }}>🚣‍♀️</div>
        <div className="absolute right-[14%] bottom-[20%] text-2xl opacity-60 float-slow" style={{ animationDelay: '1.2s' }}>🏝️</div>
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-8 md:grid-cols-2">
          <div className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] hidden md:block">
            <p className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur">
              <span className="mr-2">🧳</span> Join the journey
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
              Create your traveler profile
              <span className="block text-2xl font-normal mt-2">
                <span className="text-white/90">{typedText}</span>
                <span className={`ml-1 inline-block w-0.5 h-6 bg-white ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-150`}></span>
              </span>
            </h1>
            <p className="mt-4 max-w-md text-white/90">
              Build your account to save favorites, manage bookings, and receive
              curated offers made for explorers.
            </p>
          </div>

          <div className="md:ml-auto relative">
            {/* Aurora glow */}
            <div className="absolute -inset-6 -z-10 blur-2xl opacity-50" aria-hidden>
              <div className="h-full w-full rounded-3xl bg-gradient-to-r from-[#0c1c2e]/30 via-[#0c1c2e]/20 to-white/10" />
            </div>

            {/* Gradient border + tilt */}
            <div
              className="rounded-2xl p-[1.2px] animate-gradient bg-gradient-to-r from-[#0c1c2e] via-[#0c1c2e] to-[#0c1c2e]"
              onMouseMove={handleTiltMove}
              onMouseLeave={handleTiltLeave}
              style={tiltStyle}
            >
              <div className="rounded-2xl bg-white/90 p-6 shadow-2xl backdrop-blur sm:p-8">
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#0c1c2e] text-white shadow">
                    🌍
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Create an account</h2>
                  <p className="mt-1 text-sm text-gray-600">Start your next adventure</p>
                </div>

                {(localError || error) && (
                  <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {localError || error}
                  </div>
                )}

                {/* Clerk SignUp Component */}
                <div className="flex justify-center">
                  <SignUp 
                    appearance={{
                      elements: {
                        formButtonPrimary: 'group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0c1c2e] px-4 py-2.5 font-medium text-white shadow hover:bg-[#0a1626] focus:outline-none focus:ring-4 focus:ring-[#0c1c2e]/30 disabled:cursor-not-allowed disabled:opacity-80',
                        card: 'shadow-none',
                        headerTitle: 'text-2xl font-semibold text-gray-900',
                        headerSubtitle: 'text-sm text-gray-600',
                        socialButtonsBlockButton: 'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-[#0c1c2e]/30 transition-colors',
                        dividerLine: 'bg-gray-300',
                        dividerText: 'bg-white px-2 text-gray-500 text-sm',
                        formFieldInput: 'block w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2.5 text-gray-900 shadow-sm outline-none ring-[#0c1c2e]/20 focus:border-[#0c1c2e] focus:ring-4',
                        formFieldLabel: 'mb-1 block text-sm font-medium text-gray-700',
                        footerActionLink: 'font-medium text-[#0c1c2e] hover:opacity-80'
                      }
                    }}
                    redirectUrl="/"
                    signInUrl="/login"
                  />
                </div>

                <div className="mt-6 text-center text-sm text-gray-700">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-[#0c1c2e] hover:opacity-80">
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;