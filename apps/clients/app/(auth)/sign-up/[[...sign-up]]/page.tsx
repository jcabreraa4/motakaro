'use client';

import { z } from 'zod';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Field, FieldLabel, FieldError } from '@workspace/ui/components/field';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@workspace/ui/components/input-otp';
import { useSignUp, useAuth, useSession } from '@clerk/nextjs';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { RefreshCwIcon } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

// Env Variables
const pageStatus = process.env.NEXT_PUBLIC_SIGN_UP_ACTIVE!;
const redirectPage = process.env.NEXT_PUBLIC_REDIRECT_PAGE!;

// Sign Up Schema
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

export default function SignInPage() {
  // Page Hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, orgId } = useAuth();
  const { signUp, fetchStatus } = useSignUp();
  const { session } = useSession();

  const [emailCode, setEmailCode] = useState('');

  useEffect(() => {
    if (isSignedIn) router.push(redirectPage);
    if (session && !orgId) router.push('/org-selection');
  }, [isSignedIn, session, orgId, router]);

  // Page Status
  const clerkTicket = searchParams.get('__clerk_ticket');
  const clerkStatus = searchParams.get('__clerk_status');

  const isDisabled = pageStatus === 'false';
  const isLoading = fetchStatus === 'fetching';

  // Sign Up Form
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
    const { error } = await signUp.create({
      strategy: 'ticket',
      ticket: clerkTicket!,
      firstName: data.name,
      lastName: data.surname,
      password: data.password
    } as any);
    if (error) {
      toast.error('An internal error has occurred.');
      return;
    }
    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl(redirectPage);
          toast.success('You are successfully signed up.');
          if (url.startsWith('http')) {
            window.location.href = url;
          } else {
            router.push(url);
          }
        }
      });
    } else if (signUp.status === 'missing_requirements') {
      if (signUp.unverifiedFields.includes('email_address')) {
        const { error: emailError } = await signUp.verifications.sendEmailCode();
        if (emailError) {
          toast.error('An internal error has occurred.');
        } else {
          toast.info('A code has been sent to your email.');
        }
      }
    } else {
      toast.error('An internal error has occurred.');
    }
  }

  // Verify Email Submit
  async function handleVerify(e: React.SubmitEvent) {
    e.preventDefault();
    const { error } = await signUp.verifications.verifyEmailCode({ code: emailCode });
    if (error) {
      toast.error('Please check your credentials.');
      return;
    }
    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl(redirectPage);
          toast.success('You are successfully signed up.');
          if (url.startsWith('http')) {
            window.location.href = url;
          } else {
            router.push(url);
          }
        }
      });
    } else {
      toast.error('An internal error has occurred.');
    }
  }

  // Disabled Card
  if (isDisabled) {
    return (
      <Card className="w-md py-4 xl:py-6">
        <CardHeader className="pointer-events-none px-4 select-none lg:px-6">
          <CardTitle className="text-xl font-bold">Sign Up</CardTitle>
          <CardDescription>Sign ups are currently disabled.</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-2 px-4 lg:flex-row lg:px-6">
          <Label>You already have an account?</Label>
          <Link href="/sign-in">
            <Label className="cursor-pointer underline">Sign In</Label>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  // No Invitation
  if (!clerkTicket || !clerkStatus) {
    return (
      <Card className="w-md py-4 xl:py-6">
        <CardHeader className="pointer-events-none px-4 select-none lg:px-6">
          <CardTitle className="text-xl font-bold">Access Restricted</CardTitle>
          <CardDescription>Sign ups are only available with an invitation.</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-2 px-4 lg:flex-row lg:px-6">
          <Label>You already have an account?</Label>
          <Link href="/sign-in">
            <Label className="cursor-pointer underline">Sign In</Label>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  // Verify Email Form
  if (signUp.status === 'missing_requirements' && signUp.unverifiedFields.includes('email_address') && signUp.missingFields.length === 0) {
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
                    signUp.verifications.sendEmailCode().finally(() => {
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
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="px-4 lg:px-6">
          <Label
            className="cursor-pointer underline"
            onClick={() => signUp.reset()}
          >
            I want to start over
          </Label>
        </CardFooter>
      </Card>
    );
  }

  // Sign Up Form
  return (
    <Card className="w-md py-4 xl:py-6">
      <CardHeader className="pointer-events-none px-4 select-none lg:px-6">
        <CardTitle className="text-xl font-bold">Create Account</CardTitle>
        <CardDescription>Introduce your credentials.</CardDescription>
      </CardHeader>
      <CardContent className="px-4 lg:px-6">
        <form
          onSubmit={signUpForm.handleSubmit(handleSubmit)}
          className="flex flex-col gap-5"
        >
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
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div
            id="clerk-captcha"
            className="hidden"
          />
          <Button
            type="submit"
            className="w-full cursor-pointer font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 px-4 lg:flex-row lg:px-6">
        <Label>You already have an account?</Label>
        <Link href="/sign-in">
          <Label className="cursor-pointer underline">Sign In</Label>
        </Link>
      </CardFooter>
    </Card>
  );
}
