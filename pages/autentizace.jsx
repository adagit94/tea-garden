import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import PasswordReset from 'components/user/authentication/PasswordReset';

export default function Authentication() {
  const router = useRouter();

  const { mode, oobCode } = router.query;

  useEffect(() => {
    router.prefetch('/prihlaseni');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  switch (mode) {
    case 'resetPassword':
      return <PasswordReset actionCode={oobCode} />;

    default:
      return null;
  }
}
