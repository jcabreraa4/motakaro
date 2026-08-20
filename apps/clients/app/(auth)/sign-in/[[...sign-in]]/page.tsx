'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useAuth, useSession, useSignIn } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { RefreshCwIcon } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@workspace/ui/components/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@workspace/ui/components/input-otp';

const pageStatus = process.env.NEXT_PUBLIC_SIGN_IN_ACTIVE!;
const redirectPage = process.env.NEXT_PUBLIC_REDIRECT_PAGE!;

const signInSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required')
});

type SignInFormType = z.infer<typeof signInSchema>;

const errorMessage = 'An internal error has occurred.';
const successMessage = 'You signed in successfully.';
const checkMessage = 'Please check your credentials.';

export default function SignInPage() {
  const { push } = useRouter();
  const { isSignedIn, orgId } = useAuth();
  const { signIn, fetchStatus } = useSignIn();
  const { session } = useSession();
  const searchParams = useSearchParams();

  const [emailCode, setEmailCode] = useState('');
  const invitationAttempted = useRef(false);

  const clerkTicket = searchParams.get('__clerk_ticket');
  const clerkStatus = searchParams.get('__clerk_status');

  useEffect(() => {
    if (isSignedIn) push(redirectPage);
    if (session && !orgId) push('/org-selection');
  }, [isSignedIn, session, orgId, push]);

  useEffect(() => {
    // Clerk Legacy Fix, Update in the Future
    async function checkInvitation() {
      if (!clerkTicket || clerkStatus !== 'sign_in' || !signIn || invitationAttempted.current) return;
      invitationAttempted.current = true;
      const result = await (signIn as any).create({
        strategy: 'ticket',
        ticket: clerkTicket
      });
      if (result.status === 'complete') {
        await (signIn as any).setActive({ session: result.createdSessionId });
        toast.success(successMessage);
        push(redirectPage);
      } else {
        toast.error(errorMessage);
      }
    }
    checkInvitation();
  }, [clerkTicket, clerkStatus, signIn, push]);

  const isDisabled = pageStatus === 'false';
  const isLoading = fetchStatus === 'fetching';

  const signInForm = useForm<SignInFormType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Sign In Submit
  async function handleSubmit(data: SignInFormType) {
    const { error } = await signIn.password({
      emailAddress: data.email,
      password: data.password
    });
    if (error) {
      toast.error(checkMessage);
      return;
    }
    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl(redirectPage);
          toast.success(successMessage);
          push(url);
        }
      });
    } else if (signIn.status === 'needs_client_trust') {
      const emailCodeFactor = signIn.supportedSecondFactors.find((factor) => factor.strategy === 'email_code');
      if (emailCodeFactor) await signIn.mfa.sendEmailCode();
      toast.info('A code has been sent to your email.');
    } else {
      toast.error(errorMessage);
    }
  }

  // Verify Email Submit
  async function handleVerify(e: React.SubmitEvent) {
    e.preventDefault();
    const { error } = await signIn.mfa.verifyEmailCode({ code: emailCode });
    if (error) {
      toast.error(checkMessage);
      return;
    }
    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl(redirectPage);
          toast.success(successMessage);
          push(url);
        }
      });
    } else {
      toast.error(errorMessage);
    }
  }

  // Resend Email Code
  function handleEmail() {
    signIn.mfa
      .sendEmailCode()
      .then(() => toast.success('New code sent successfully.'))
      .catch(() => toast.error('An internal error has ocurred.'));
  }

  // Reset Process
  function handleReset() {
    signIn.reset().catch(() => toast.error('An internal error has ocurred.'));
  }

  // Disabled Card
  if (isDisabled) {
    return (
      <FieldGroup>
        <div className="flex flex-col items-center gap-1">
          <p className="text-2xl font-bold">Access Disabled</p>
          <p className="text-sm text-balance text-muted-foreground">Sign ins are not available at the moment</p>
        </div>
        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    );
  }

  // Verify Email Form
  if (signIn.status === 'needs_client_trust') {
    return (
      <form onSubmit={handleVerify}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1">
            <p className="text-2xl font-bold">Verify your Email</p>
            <p className="text-sm text-balance text-muted-foreground">Introduce the code sent to your email address</p>
          </div>
          <Field>
            <div className="flex items-end justify-between">
              <FieldLabel htmlFor="code">Verification Code</FieldLabel>
              <Button
                size="xs"
                type="button"
                variant="outline"
                onClick={handleEmail}
              >
                <RefreshCwIcon />
                Resend Code
              </Button>
            </div>
            <InputOTP
              required
              name="code"
              maxLength={6}
              value={emailCode}
              onChange={setEmailCode}
            >
              <InputOTPGroup className="w-full *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-full *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator className="mx-2" />
              <InputOTPGroup className="w-full *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-full *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </Field>
          <Field>
            <Button
              type="submit"
              className="font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Field>
          <Field>
            <FieldDescription className="text-center">
              Did something go wrong?{' '}
              <span
                className="cursor-pointer underline underline-offset-4 hover:text-black dark:hover:text-white"
                onClick={handleReset}
              >
                Start over
              </span>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    );
  }

  // Sign In Form
  return (
    <form onSubmit={signInForm.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1">
          <p className="text-2xl font-bold">Welcome Back</p>
          <p className="text-sm text-balance text-muted-foreground">Introduce your credentials to sign in</p>
        </div>
        <Controller
          control={signInForm.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                disabled={isLoading}
                placeholder="m@example.com"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={signInForm.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <span
                  className="ml-auto cursor-pointer text-sm underline-offset-4 hover:underline"
                  onClick={() => toast.info('Contact support to reset your password.')}
                >
                  Forgot your password?
                </span>
              </div>
              <Input
                {...field}
                id="password"
                type="password"
                disabled={isLoading}
                placeholder="••••••••••"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button
            type="submit"
            className="font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
      <div
        id="clerk-captcha"
        className="hidden"
      />
    </form>
  );
}
