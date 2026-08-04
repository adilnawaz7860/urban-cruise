"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { customerPost } from "@/lib/customer/api-client";
import { loginSchema, type LoginValues } from "@/lib/validation/customer";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useCustomerStore } from "@/store/customer-store";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginValues) {
    try {
      await customerPost("/api/customer/auth/login", values);
      await useCustomerStore.getState().refetch();
      const next = searchParams.get("next") || "/account";
      router.push(next);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm items-center px-4">
      <div className="w-full rounded-2xl border border-border/60 bg-background p-8 shadow-sm">
        <h1 className="text-xl font-bold">Log In</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome back to Urban Cruise.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              aria-invalid={!!errors.email}
              className={cn(
                "w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:ring-1",
                errors.email
                  ? "border-destructive focus:border-destructive focus:ring-destructive"
                  : "border-border focus:border-primary focus:ring-primary"
              )}
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              {...register("password")}
              aria-invalid={!!errors.password}
              className={cn(
                "w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:ring-1",
                errors.password
                  ? "border-destructive focus:border-destructive focus:ring-destructive"
                  : "border-border focus:border-primary focus:ring-primary"
              )}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />
            {isSubmitting ? "Signing in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
