/** Branded Google authorization button consumed by the existing AuthModal. */
'use client';

import Image from 'next/image';
import { Google_Sans } from 'next/font/google';
import { Loader2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from '../google.module.css';

// Google's current button typography is Google Sans Medium. next/font hosts the
// font with the application, following the existing Flawdits font-loading pattern.
// The bundled G asset is downloaded from Google's official branding documentation.
// Next's bundled metrics do not include Google Sans. Disable only its automatic
// size-adjust calculation, which otherwise warns on every compilation. Continue
// self-hosting the requested font and use explicit local fallbacks while loading.
const googleSans = Google_Sans({
  subsets: ['latin'], weight: '500', display: 'swap',
  adjustFontFallback: false, fallback: ['Arial', 'sans-serif'],
});

export default function GoogleAuthButton({ intent = 'login', busy = false, disabled = false, onClick }) {
  const reduceMotion = useReducedMotion();
  const label = intent === 'signup' ? 'Sign up with Google' : 'Sign in with Google';

  // Keep the logo, text, white face, and spacing recognizable. The distinctive
  // visual treatment lives OUTSIDE that compliant face: a moving light border,
  // soft surrounding glow, gentle hover lift, and a spring press response.
  // The animation layers have no pointer events and never cover the label.
  return (
    <motion.div className={styles.shell}
      whileHover={disabled || reduceMotion ? undefined : { y: -2 }}
      whileTap={disabled || reduceMotion ? undefined : { scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 360, damping: 24 }}>
      <span className={styles.halo} aria-hidden="true" />
      <span className={styles.orbit} aria-hidden="true" />
      <button type="button" className={`${styles.button} ${googleSans.className}`}
        disabled={disabled || busy} onClick={onClick} aria-busy={busy}>
        <Image src="/auth/google-g.png" width={20} height={20} alt="" className={styles.logo} />
        <span>{label}</span>
        {busy && <Loader2 size={16} className={styles.spinner} aria-hidden="true" />}
      </button>
    </motion.div>
  );
}
