import type { Metadata } from "next";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Urban Cruise account.",
};

export default function SignupPage() {
  return <SignupForm />;
}
