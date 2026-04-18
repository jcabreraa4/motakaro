'use client';

import { z } from 'zod';
import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Field, FieldLabel, FieldError } from '@workspace/ui/components/field';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@workspace/ui/components/input-otp';
import { useSignIn, useAuth, useSession } from '@clerk/nextjs';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { RefreshCwIcon } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

// Env Variables
const pageStatus = process.env.NEXT_PUBLIC_SIGN_IN_ACTIVE!;
const redirectPage = process.env.NEXT_PUBLIC_REDIRECT_PAGE!;

// Sign In Schema
const signInSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required')
});

type SignInFormType = z.infer<typeof signInSchema>;

// Toast Messages
const errorMessage = 'An internal error has occurred.';
const successMessage = 'You are successfully signed in.';
const checkMessage = 'Please check your credentials.';

export default function SignInPage() {
  // Basic Hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, orgId } = useAuth();
  const { signIn, fetchStatus } = useSignIn();
  const { session } = useSession();

  // State Hooks
  const [emailCode, setEmailCode] = useState('');
  const invitationAttempted = useRef(false);

  // Clerk Params
  const clerkTicket = searchParams.get('__clerk_ticket');
  const clerkStatus = searchParams.get('__clerk_status');

  // Effect Hooks
  useEffect(() => {
    if (isSignedIn) router.push(redirectPage);
    if (session && !orgId) router.push('/org-selection');
  }, [isSignedIn, session, orgId, router]);

  useEffect(() => {
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
        router.push(redirectPage);
      } else {
        toast.error(errorMessage);
      }
    }
    checkInvitation();
  }, [clerkTicket, clerkStatus, signIn]);

  // Page Status
  const isDisabled = pageStatus === 'false';
  const isLoading = fetchStatus === 'fetching';

  // Sign In Form
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
          router.push(url);
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
          router.push(url);
        }
      });
    } else {
      toast.error(errorMessage);
    }
  }

  // Disabled Card
  if (isDisabled) {
    return (
      <Card className="w-md py-4 xl:py-6">
        <CardHeader className="pointer-events-none px-4 select-none lg:px-6">
          <CardTitle className="text-xl font-bold">Sign In</CardTitle>
          <CardDescription>Sign ins are currently disabled.</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-2 px-4 lg:flex-row lg:px-6">
          <Label>You don&apos;t have an account?</Label>
          <Link href="/sign-up">
            <Label className="cursor-pointer underline">Sign Up</Label>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  // Verify Email Form
  if (signIn.status === 'needs_client_trust') {
    return (
      <Card className="w-md py-4 xl:py-6">
        <CardHeader className="pointer-events-none px-4 select-none lg:px-6">
          <CardTitle className="text-xl font-bold">Verify your Email</CardTitle>
          <CardDescription>Introduce the code sent to your email address.</CardDescription>
        </CardHeader>
        <CardContent className="px-4 lg:px-6">
          <form
            onSubmit={handleVerify}
            className="flex flex-col gap-5"
          >
            <Field>
              <div className="flex items-end justify-between">
                <FieldLabel htmlFor="code">Verification Code</FieldLabel>
                <Button
                  size="xs"
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() =>
                    signIn.mfa.sendEmailCode().finally(() => {
                      toast.success('New code sent successfully.');
                    })
                  }
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
                className="w-full"
              >
                <InputOTPGroup className="flex-1 *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-full *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot
                    index={0}
                    className="flex-1"
                  />
                  <InputOTPSlot
                    index={1}
                    className="flex-1"
                  />
                  <InputOTPSlot
                    index={2}
                    className="flex-1"
                  />
                </InputOTPGroup>
                <InputOTPSeparator className="mx-2" />
                <InputOTPGroup className="flex-1 *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-full *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot
                    index={3}
                    className="flex-1"
                  />
                  <InputOTPSlot
                    index={4}
                    className="flex-1"
                  />
                  <InputOTPSlot
                    index={5}
                    className="flex-1"
                  />
                </InputOTPGroup>
              </InputOTP>
            </Field>
            <Button
              type="submit"
              className="w-full cursor-pointer font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="px-4 lg:px-6">
          <Label
            className="cursor-pointer underline"
            onClick={() => signIn.reset()}
          >
            I want to start over
          </Label>
        </CardFooter>
      </Card>
    );
  }

  // Sign In Form
  return (
    <Card className="w-md py-4 xl:py-6">
      <CardHeader className="pointer-events-none px-4 select-none lg:px-6">
        <CardTitle className="text-xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Introduce your credentials.</CardDescription>
      </CardHeader>
      <CardContent className="px-4 lg:px-6">
        <form
          onSubmit={signInForm.handleSubmit(handleSubmit)}
          className="flex flex-col gap-5"
        >
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
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  {...field}
                  id="password"
                  type="password"
                  disabled={isLoading}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button
            type="submit"
            className="w-full cursor-pointer font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 px-4 lg:flex-row lg:px-6">
        <Label>You don&apos;t have an account?</Label>
        <Link href="/sign-up">
          <Label className="cursor-pointer underline">Sign Up</Label>
        </Link>
      </CardFooter>
    </Card>
  );
}
