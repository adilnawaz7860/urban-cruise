import { PackageForm } from "../package-form";

export default function NewPackagePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">New Package</h1>
      <div className="mt-6">
        <PackageForm />
      </div>
    </div>
  );
}
