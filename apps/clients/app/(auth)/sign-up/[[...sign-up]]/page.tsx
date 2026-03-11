'use client';

import { useEffect } from 'react';
import { useSignUp, useAuth } from '@clerk/nextjs';
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

const disabled = true;

const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password is too short')
});

const redirectPage = '/overview';

type SignUpFormType = z.infer<typeof signUpSchema>;

export default function SignInPage() {
  const { isSignedIn } = useAuth();
  const { signUp, fetchStatus } = useSignUp();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) router.push(redirectPage);
  }, [isSignedIn, router]);

  const isLoading = fetchStatus === 'fetching';

  const signUpForm = useForm<SignUpFormType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      password: ''
    }
  });

  async function handleSubmit(data: SignUpFormType) {
    try {
      await signUp.password({
        emailAddress: data.email,
        password: data.password,
        firstName: data.name,
        lastName: data.surname
      });
      if (signUp.status === 'complete') {
        toast.success('You are successfully signed up.');
        router.push(redirectPage);
      } else {
        toast.error('An internal error has occurred.');
      }
    } catch {
      toast.error('Please check your credentials.');
    }
  }

  if (disabled)
    return (
      <Card className="w-md py-4 xl:py-6">
        <CardHeader className="px-4 lg:px-6">
          <CardTitle>Sign Up</CardTitle>
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

  return (
    <Card className="w-md py-4 xl:py-6">
      <CardHeader className="px-4 lg:px-6">
        <CardTitle>Sign Up</CardTitle>
        <CardDescription className="hidden xl:block">Introduce your credentials.</CardDescription>
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
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
          <Controller
            control={signUpForm.control}
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
          <Button
            type="submit"
            className="w-full cursor-pointer"
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
