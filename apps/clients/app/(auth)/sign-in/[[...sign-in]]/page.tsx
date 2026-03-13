'use client';

import { useEffect } from 'react';
import { useSignIn, useAuth, useSession } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Field, FieldLabel, FieldError } from '@workspace/ui/components/field';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Label } from '@workspace/ui/components/label';
import Link from 'next/link';
import { z } from 'zod';

const disabled = process.env.NEXT_PUBLIC_SIGN_IN_ACTIVE! === 'false';
const redirectPage = process.env.NEXT_PUBLIC_REDIRECT_PAGE!;

const signInSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required')
});

type SignInFormType = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const { isSignedIn, orgId } = useAuth();
  const { signIn, fetchStatus } = useSignIn();
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) router.push(redirectPage);
    if (session && !orgId) router.push('/org-selection');
  }, [isSignedIn, session, orgId, router]);

  const isLoading = fetchStatus === 'fetching';

  const signInForm = useForm<SignInFormType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  async function handleSubmit(data: SignInFormType) {
    const { error } = await signIn.password({
      emailAddress: data.email,
      password: data.password
    });
    if (error) {
      toast.error('Please check your credentials.');
      return;
    }
    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl(redirectPage);
          toast.success('You are successfully signed in.');
          if (url.startsWith('http')) {
            window.location.href = url;
          } else {
            router.push(url);
          }
        }
      });
    } else if (signIn.status === 'needs_client_trust') {
      const emailCodeFactor = signIn.supportedSecondFactors.find((factor) => factor.strategy === 'email_code');
      if (emailCodeFactor) await signIn.mfa.sendEmailCode();
      toast.info('A code has been sent to your email.');
    } else {
      console.error(signIn.status);
      toast.error('An internal error has occurred.');
    }
  }

  async function handleVerify(formData: FormData) {
    const code = formData.get('code') as string;
    const { error } = await signIn.mfa.verifyEmailCode({ code });
    if (error) {
      toast.error('Please check your credentials.');
      return;
    }
    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl(redirectPage);
          toast.success('You are successfully signed in.');
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

  if (disabled) {
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

  if (signIn.status === 'needs_client_trust') {
    return (
      <Card className="w-md py-4 xl:py-6">
        <CardHeader className="pointer-events-none px-4 select-none lg:px-6">
          <CardTitle className="text-xl font-bold">Verify your Account</CardTitle>
          <CardDescription>Introduce the code sent to your email address.</CardDescription>
        </CardHeader>
        <CardContent className="px-4 lg:px-6">
          <form
            action={handleVerify}
            className="flex flex-col gap-5"
          >
            <Field>
              <FieldLabel htmlFor="code">Email Code</FieldLabel>
              <Input
                id="code"
                name="code"
                type="text"
              />
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
        <CardFooter className="flex flex-col gap-2 px-4 lg:flex-row lg:px-6">
          <Label
            className="cursor-pointer underline"
            onClick={() =>
              signIn.mfa.sendEmailCode().finally(() => {
                toast.success('New code sent successfully.');
              })
            }
          >
            I Need a New Code
          </Label>
          <Label
            className="cursor-pointer underline"
            onClick={() => signIn.reset()}
          >
            Start Over
          </Label>
        </CardFooter>
      </Card>
    );
  }

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
