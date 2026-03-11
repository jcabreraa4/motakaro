'use client';

import { useEffect } from 'react';
import { useAuth, useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldLabel, FieldError } from '@workspace/ui/components/field';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Label } from '@workspace/ui/components/label';
import Link from 'next/link';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required')
});

const redirectPage = '/overview';

type SignInFormType = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const { isSignedIn } = useAuth();
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) router.push(redirectPage);
  }, [isSignedIn, router]);

  const isLoading = fetchStatus === 'fetching';

  const signInForm = useForm<SignInFormType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  async function handleSubmit(data: SignInFormType) {
    try {
      await signIn.password({ emailAddress: data.email, password: data.password });
      if (signIn.status === 'complete') {
        toast.success('You are successfully signed in.');
        router.push(redirectPage);
      } else {
        toast.error('An internal error has occurred.');
      }
    } catch {
      toast.error('Please check your credentials.');
    }
  }

  return (
    <Card className="w-md py-4 xl:py-6">
      <CardHeader className="px-4 lg:px-6">
        <CardTitle>Sign In</CardTitle>
        <CardDescription className="hidden xl:block">Introduce your credentials.</CardDescription>
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
            className="w-full cursor-pointer"
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
