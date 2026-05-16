import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/authStore';
import { loginSchema, LoginFormData } from '@/schemas/auth.schema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getErrorMessage } from '@/api/client';

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      toast.success('Welcome back!');
      navigate('/dashboard');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-gradient-to-br from-brand-700 to-brand-900 p-12 text-white lg:flex">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg font-bold">
            SL
          </div>
          <span className="text-xl font-semibold">Smart Leads</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Manage your sales pipeline with confidence
          </h1>
          <p className="mt-4 text-brand-100">
            Track leads, filter insights, and close deals faster with our modern dashboard.
          </p>
        </div>
        <p className="text-sm text-brand-200">© 2026 Smart Leads Dashboard</p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                SL
              </div>
              <span className="text-lg font-semibold">Smart Leads</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold">Sign in</h2>
          <p className="mt-1 text-sm text-slate-500">Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="mt-8 space-y-4">
            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
            />
            <Button type="submit" className="w-full" isLoading={mutation.isPending}>
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
