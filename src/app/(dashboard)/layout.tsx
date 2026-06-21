// src/app/(dashboard)/layout.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { prisma } from "@/lib/db/prisma";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Enforce Onboarding
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { profileComplete: true },
  });

  if (!profile || !profile.profileComplete) {
    redirect("/onboarding");
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar user={session.user} />
      <div className="flex flex-1 flex-col lg:pl-64">
        <Topbar user={session.user} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
