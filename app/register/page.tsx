'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Apple, Github, Mail } from 'lucide-react';
import Image from 'next/image';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      router.push('/');
      toast.success('Welcome to Aisha Therapy!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary/50" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          Aisha Therapy
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Join our community of individuals committed to mental wellness. Your journey to better mental health starts here."
            </p>
            <footer className="text-sm">Dr. Emily Chen, Clinical Psychologist</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>
                Choose your preferred sign up method
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-6">
                <Button variant="outline" onClick={() => signIn('google')}>
                  <Image
                    src="/google.svg"
                    alt="Google"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Google
                </Button>
                <Button variant="outline" onClick={() => signIn('apple')}>
                  <Apple className="mr-2 h-5 w-5" />
                  Apple
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <form onSubmit={handleRegister}>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      type="text"
                      autoCapitalize="words"
                      autoComplete="name"
                      autoCorrect="off"
                      disabled={isLoading}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      placeholder="••••••••"
                      type="password"
                      autoComplete="new-password"
                      disabled={isLoading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button disabled={isLoading}>
                    {isLoading && (
                      <Mail className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Sign Up
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="px-0 text-muted-foreground" onClick={() => router.push('/login')}>
                Already have an account? Sign in
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 