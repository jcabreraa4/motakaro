'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useAuth, useSignUp } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { RefreshCwIcon } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@workspace/ui/components/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@workspace/ui/components/input-otp';

const pageStatus = process.env.NEXT_PUBLIC_SIGN_UP_ACTIVE!;
const redirectPage = process.env.NEXT_PUBLIC_REDIRECT_PAGE!;

const signUpSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    surname: z.string().min(1, 'Surname is required'),
    password: z.string().min(1, 'Password is required').min(6, 'Password is too short'),
    confirm: z.string().min(1, 'Password is required')
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Passwords do not match',
    path: ['confirm']
  });

type SignUpFormType = z.infer<typeof signUpSchema>;

const errorMessage = 'An internal error has occurred.';
const successMessage = 'You signed up successfully.';
const checkMessage = 'Please check your credentials.';

export default function SignUp() {
  const { push } = useRouter();
  const { isSignedIn } = useAuth();
  const { signUp, fetchStatus } = useSignUp();
  const searchParams = useSearchParams();

  const [emailCode, setEmailCode] = useState('');

  const clerkTicket = searchParams.get('__clerk_ticket');
  const clerkStatus = searchParams.get('__clerk_status');

  useEffect(() => {
    if (isSignedIn) push(redirectPage as Route);
  }, [isSignedIn, push]);

  const isDisabled = pageStatus === 'false';
  const isLoading = fetchStatus === 'fetching';

  const signUpForm = useForm<SignUpFormType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      surname: '',
      password: '',
      confirm: ''
    }
  });

  // Sign Up Submit
  async function handleSubmit(data: SignUpFormType) {
    // Clerk Legacy Fix, Update in the Future
    const { error } = await signUp.create({
      strategy: 'ticket',
      ticket: clerkTicket!,
      firstName: data.name,
      lastName: data.surname,
      password: data.password
    } as any);
    if (error) {
      toast.error(errorMessage);
      return;
    }
    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl(redirectPage);
          toast.success(successMessage);
          push(url as Route);
        }
      });
    } else if (signUp.status === 'missing_requirements') {
      if (signUp.unverifiedFields.includes('email_address')) {
        const { error: emailError } = await signUp.verifications.sendEmailCode();
        if (emailError) {
          toast.error(errorMessage);
        } else {
          toast.info('A code has been sent to your email.');
        }
      }
    } else {
      toast.error(errorMessage);
    }
  }

  // Verify Email Submit
  async function handleVerify(e: React.SubmitEvent) {
    e.preventDefault();
    const { error } = await signUp.verifications.verifyEmailCode({ code: emailCode });
    if (error) {
      toast.error(checkMessage);
      return;
    }
    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl(redirectPage);
          toast.success(successMessage);
          push(url as Route);
        }
      });
    } else {
      toast.error(errorMessage);
    }
  }

  // Resend Email Code
  function handleEmail() {
    signUp.verifications
      .sendEmailCode()
      .then(() => toast.success('New code sent successfully.'))
      .catch(() => toast.error('An internal error has ocurred.'));
  }

  // Reset Process
  function handleReset() {
    signUp.reset().catch(() => toast.error('An internal error has ocurred.'));
  }

  // Disabled Card
  if (isDisabled) {
    return (
      <FieldGroup>
        <div className="flex flex-col items-center gap-1">
          <p className="text-2xl font-bold">Access Disabled</p>
          <p className="text-sm text-balance text-muted-foreground">Sign ups are not available at the moment</p>
        </div>
        <Field>
          <FieldDescription className="text-center">
            Already have an account? <Link href={'/sign-in' as Route}>Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    );
  }

  // No Invitation
  if (!clerkTicket || !clerkStatus) {
    return (
      <FieldGroup>
        <div className="flex flex-col items-center gap-1">
          <p className="text-2xl font-bold">Access Restricted</p>
          <p className="text-sm text-balance text-muted-foreground">Sign ups are only available with an invitation</p>
        </div>
        <Field>
          <FieldDescription className="text-center">
            Already have an account? <Link href={'/sign-in' as Route}>Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    );
  }

  // Verify Email Form
  if (signUp.status === 'missing_requirements' && signUp.unverifiedFields.includes('email_address') && signUp.missingFields.length === 0) {
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
              {isLoading ? 'Signing Up...' : 'Sign Up'}
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

  // Sign Up Form
  return (
    <form onSubmit={signUpForm.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1">
          <p className="text-2xl font-bold">Create an Account</p>
          <p className="text-sm text-balance text-muted-foreground">Introduce your credentials to sign up</p>
        </div>
        <div className="flex gap-3">
          <Controller
            control={signUpForm.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">First Name</FieldLabel>
                <Input
                  {...field}
                  id="name"
                  type="text"
                  disabled={isLoading}
                  placeholder="John"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={signUpForm.control}
            name="surname"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="surname">Last Name</FieldLabel>
                <Input
                  {...field}
                  id="surname"
                  type="text"
                  disabled={isLoading}
                  placeholder="Doe"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
        <Controller
          control={signUpForm.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
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
        <Controller
          control={signUpForm.control}
          name="confirm"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirm">Confirm Password</FieldLabel>
              <Input
                {...field}
                id="confirm"
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
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Already have an account? <Link href={'/sign-in' as Route}>Sign in</Link>
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
