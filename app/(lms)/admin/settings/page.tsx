"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getAdminSettings,
  updateGeneralSettings,
  updatePaymentSettings,
  updateSecuritySettings,
} from "@/lib/api/settings";
import { ApiError } from "@/lib/api/client";
import type { LmsSiteSettings } from "@/types/lms";
import { Card } from "@/components/lms/ui/Card";
import { FormButton } from "@/components/lms/ui/FormButton";
import { Input, Label } from "@/components/lms/ui/Input";
import { Switch } from "@/components/lms/ui/Switch";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export default function AdminSettingsPage() {
  const { accessToken } = useAuth();
  const [settings, setSettings] = useState<LmsSiteSettings | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    getAdminSettings(accessToken)
      .then(setSettings)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load settings."));
  }, [accessToken]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Site Settings</h1>
      <p className="mt-1 text-sm text-ink/60">Configure platform-wide settings.</p>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {!settings && !error && (
        <div className="mt-6 space-y-4">
          <div className="h-48 animate-pulse rounded-2xl bg-white" />
          <div className="h-48 animate-pulse rounded-2xl bg-white" />
          <div className="h-40 animate-pulse rounded-2xl bg-white" />
        </div>
      )}

      {settings && (
        <RevealGroup className="mt-6 space-y-6">
          <RevealItem>
            <GeneralSettingsCard accessToken={accessToken!} initial={settings} />
          </RevealItem>
          <RevealItem>
            <PaymentSettingsCard accessToken={accessToken!} initial={settings} />
          </RevealItem>
          <RevealItem>
            <SecuritySettingsCard accessToken={accessToken!} initial={settings} />
          </RevealItem>
        </RevealGroup>
      )}
    </div>
  );
}

function SectionStatus({ error, saved }: { error: string | null; saved: boolean }) {
  if (error) return <p className="mt-3 text-sm text-red-600">{error}</p>;
  if (saved) return <p className="mt-3 text-sm text-teal">Saved.</p>;
  return null;
}

function GeneralSettingsCard({
  accessToken,
  initial,
}: {
  accessToken: string;
  initial: LmsSiteSettings;
}) {
  const [siteName, setSiteName] = useState(initial.siteName);
  const [tagline, setTagline] = useState(initial.tagline);
  const [contactEmail, setContactEmail] = useState(initial.contactEmail);
  const [supportEmail, setSupportEmail] = useState(initial.supportEmail);
  const [logoUrl, setLogoUrl] = useState(initial.logoUrl);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateGeneralSettings(accessToken, {
        siteName,
        tagline,
        contactEmail,
        supportEmail,
        logoUrl,
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save general settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <h2 className="font-bold text-ink">General Settings</h2>
      <p className="mt-1 text-xs text-ink/50">
        These describe your platform. They&rsquo;re stored here for future use across the
        site — they don&rsquo;t yet override the marketing site&rsquo;s own branding.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="site-name">Site Name</Label>
          <Input id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <Input id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="contact-email">Contact Email</Label>
          <Input
            id="contact-email"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="support-email">Support Email</Label>
          <Input
            id="support-email"
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="logo-url">Logo URL</Label>
          <Input id="logo-url" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
        </div>
      </div>

      <FormButton className="mt-4" onClick={handleSave} loading={saving}>
        Save General Settings
      </FormButton>
      <SectionStatus error={error} saved={saved} />
    </Card>
  );
}

function PaymentSettingsCard({
  accessToken,
  initial,
}: {
  accessToken: string;
  initial: LmsSiteSettings;
}) {
  const [currency, setCurrency] = useState(initial.currency);
  const [taxPercent, setTaxPercent] = useState(String(initial.taxPercent));
  const [razorpayEnabled, setRazorpayEnabled] = useState(initial.razorpayEnabled);
  const [stripeEnabled, setStripeEnabled] = useState(initial.stripeEnabled);
  const [stripePublishableKey, setStripePublishableKey] = useState(initial.stripePublishableKey);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updatePaymentSettings(accessToken, {
        currency,
        taxPercent: Number(taxPercent),
        razorpayEnabled,
        stripeEnabled,
        stripePublishableKey,
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save payment settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <h2 className="font-bold text-ink">Payment &amp; Revenue</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Input id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="tax-percent">Tax Percent (%)</Label>
          <Input
            id="tax-percent"
            type="number"
            min={0}
            max={100}
            value={taxPercent}
            onChange={(e) => setTaxPercent(e.target.value)}
          />
          <p className="mt-1 text-xs text-ink/50">
            Applied to every new order&rsquo;s total at checkout.
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-ink/10 p-4">
        <div>
          <p className="font-semibold text-ink">Razorpay</p>
          <p className="text-xs text-ink/50">Indian payment gateway</p>
        </div>
        <Switch
          checked={razorpayEnabled}
          onChange={setRazorpayEnabled}
          label={razorpayEnabled ? "Enabled" : "Disabled"}
        />
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-ink/10 p-4">
        <div>
          <p className="font-semibold text-ink">Stripe</p>
          <p className="text-xs text-ink/50">
            Global payment gateway — stored for later; checkout doesn&rsquo;t process Stripe
            payments yet.
          </p>
        </div>
        <Switch
          checked={stripeEnabled}
          onChange={setStripeEnabled}
          label={stripeEnabled ? "Enabled" : "Disabled"}
        />
      </div>
      {stripeEnabled && (
        <div className="mt-3">
          <Label htmlFor="stripe-key">Stripe Publishable Key</Label>
          <Input
            id="stripe-key"
            value={stripePublishableKey}
            onChange={(e) => setStripePublishableKey(e.target.value)}
          />
        </div>
      )}

      <FormButton className="mt-4" onClick={handleSave} loading={saving}>
        Save Payment Settings
      </FormButton>
      <SectionStatus error={error} saved={saved} />
    </Card>
  );
}

function SecuritySettingsCard({
  accessToken,
  initial,
}: {
  accessToken: string;
  initial: LmsSiteSettings;
}) {
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(
    String(initial.sessionTimeoutMinutes),
  );
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(String(initial.maxLoginAttempts));
  const [requireEmailVerification, setRequireEmailVerification] = useState(
    initial.requireEmailVerification,
  );
  const [googleOAuthEnabled, setGoogleOAuthEnabled] = useState(initial.googleOAuthEnabled);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateSecuritySettings(accessToken, {
        sessionTimeoutMinutes: Number(sessionTimeoutMinutes),
        maxLoginAttempts: Number(maxLoginAttempts),
        requireEmailVerification,
        googleOAuthEnabled,
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save security settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <h2 className="font-bold text-ink">Security &amp; Access</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
          <Input
            id="session-timeout"
            type="number"
            min={1}
            value={sessionTimeoutMinutes}
            onChange={(e) => setSessionTimeoutMinutes(e.target.value)}
          />
          <p className="mt-1 text-xs text-ink/50">How long a login stays active before expiring.</p>
        </div>
        <div>
          <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
          <Input
            id="max-login-attempts"
            type="number"
            min={1}
            value={maxLoginAttempts}
            onChange={(e) => setMaxLoginAttempts(e.target.value)}
          />
          <p className="mt-1 text-xs text-ink/50">Locks an account for 15 minutes past this.</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-ink/10 p-4">
        <div>
          <p className="font-semibold text-ink">Email Verification</p>
          <p className="text-xs text-ink/50">Require a verified email to log in</p>
        </div>
        <Switch checked={requireEmailVerification} onChange={setRequireEmailVerification} />
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-ink/10 p-4">
        <div>
          <p className="font-semibold text-ink">Google OAuth</p>
          <p className="text-xs text-ink/50">Allow sign in with Google</p>
        </div>
        <Switch checked={googleOAuthEnabled} onChange={setGoogleOAuthEnabled} />
      </div>

      <FormButton className="mt-4" onClick={handleSave} loading={saving}>
        Save Security Settings
      </FormButton>
      <SectionStatus error={error} saved={saved} />
    </Card>
  );
}
