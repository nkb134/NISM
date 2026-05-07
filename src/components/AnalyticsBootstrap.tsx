'use client';

import { useEffect } from 'react';
import { identify, track } from '@/lib/analytics';

type Props = {
  userId: string | null;
  email?: string;
  /** Server flag: was this account created in the last 5 minutes? If so we
   *  fire the `signup` event (once per user, gated by a localStorage flag). */
  isNewSignup?: boolean;
};

const SIGNUP_FIRED_KEY = 'ph_signup_fired';

export function AnalyticsBootstrap({ userId, email, isNewSignup }: Props) {
  useEffect(() => {
    if (!userId) return;
    identify(userId, email ? { email } : {});
    if (isNewSignup) {
      const flag = `${SIGNUP_FIRED_KEY}:${userId}`;
      if (!window.localStorage.getItem(flag)) {
        track('signup', email ? { email } : {});
        window.localStorage.setItem(flag, '1');
      }
    }
  }, [userId, email, isNewSignup]);

  return null;
}
