import { Suspense } from "react";
import WorkspaceSpline from "@/components/features/interactive-os/WorkspaceSpline";

export default async function InteractiveOsPage() {
  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <Suspense>
        <WorkspaceSpline />
      </Suspense>
    </main>
  );
}
