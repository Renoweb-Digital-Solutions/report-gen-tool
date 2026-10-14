/** Google callback handoff page; resumes AuthModal using a private backend cookie result. */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import AuthModal from '@/app/components/AuthModal';
import { markSession } from '@/app/features/auth/api';
import { googleResult } from '@/app/features/auth/google';
import styles from '@/app/features/auth/google.module.css';

export default function GoogleCompletePage() {
  const router = useRouter();
  const [result, setResult] = useState(null);

  useEffect(() => {
    let active = true;
    // The backend endpoint is intentionally repeatable. React development mode
    // may mount effects twice; reading a result must not spend an OTP or create
    // another account. Only the separate verify endpoint completes authentication.
    googleResult().then(data => {
      if (!active) return;
      if (data.status === 'authenticated') {
        markSession();
        router.replace('/dashboard');
      } else {
        setResult(data);
      }
    }).catch(error => {
      if (active) setResult({ status: 'error', message: error.message || 'Google sign-in could not be completed. Please try again.' });
    });
    return () => { active = false; };
  }, [router]);

  return (
    <main className={styles.page}>
      {result ? (
        <AuthModal initialGoogleResult={result}
          onSuccess={() => router.replace('/dashboard')}
          onClose={() => router.replace('/?login=true')} />
      ) : (
        <div className={styles.loading} role="status" aria-live="polite">
          <Loader2 size={28} className={styles.spinner} style={{ position: 'static' }} aria-hidden="true" />
          <h1>Finishing your Google sign-in</h1>
          <p>We’re checking your account before the next step.</p>
        </div>
      )}
    </main>
  );
}
