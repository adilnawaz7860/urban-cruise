"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { customerPost } from "@/lib/customer/api-client";
import { signupSchema, type SignupValues } from "@/lib/validation/customer";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useCustomerStore } from "@/store/customer-store";

export function SignupForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(values: SignupValues) {
    try {
      await customerPost("/api/customer/auth/signup", values);
      await useCustomerStore.getState().refetch();
      toast.success("Account created! Welcome to Urban Cruise.");
      router.push("/account");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign up failed");
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm items-center px-4">
      <div className="w-full rounded-2xl border border-border/60 bg-background p-8 shadow-sm">
        <h1 className="text-xl font-bold">Create Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Save your favourite packages and more.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium">Full Name</label>
            <input
              type="text"
              {...register("name")}
              aria-invalid={!!errors.name}
              className={cn(
                "w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:ring-1",
                errors.name
                  ? "border-destructive focus:border-destructive focus:ring-destructive"
                  : "border-border focus:border-primary focus:ring-primary"
              )}
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
          </div>
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
            <label className="mb-1 block text-sm font-medium">Phone (optional)</label>
            <input
              type="tel"
              {...register("phone")}
              aria-invalid={!!errors.phone}
              className={cn(
                "w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:ring-1",
                errors.phone
                  ? "border-destructive focus:border-destructive focus:ring-destructive"
                  : "border-border focus:border-primary focus:ring-primary"
              )}
            />
            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
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
            {errors.password ? (
              <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">At least 8 characters.</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 disabled:opacity-60"
          >
            <UserPlus className="h-4 w-4" />
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
