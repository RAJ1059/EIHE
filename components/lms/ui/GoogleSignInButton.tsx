"use client";

import { useEffect, useRef, useState } from "react";
import { getGoogleClientId, loadGoogleIdentityScript, type GoogleCredentialResponse } from "@/lib/auth/google";

export function GoogleSignInButton({
  onCredential,
  disabled,
}: {
  onCredential: (idToken: string) => void;
  disabled?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onCredentialRef = useRef(onCredential);
  const [failed, setFailed] = useState(false);
  const clientId = getGoogleClientId();

  useEffect(() => {
    onCredentialRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!clientId || !containerRef.current) return;
    let cancelled = false;

    loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: GoogleCredentialResponse) => onCredentialRef.current(response.credential),
        });
        window.google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          width: 360,
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  if (!clientId) return null;

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-ink/10" />
        <span className="text-xs font-semibold tracking-wide text-ink/40 uppercase">or</span>
        <div className="h-px flex-1 bg-ink/10" />
      </div>
      <div className="mt-4 flex justify-center">
        {failed ? (
          <p className="text-sm text-red-600">Could not load Google Sign-In.</p>
        ) : (
          <div ref={containerRef} className={disabled ? "pointer-events-none opacity-50" : ""} />
        )}
      </div>
    </div>
  );
}
