import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { QuestionsProvider } from "@/context/QuestionsContext";
import { ToastProvider } from "@/components/Toast";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "QPark.in - Student Grievance & Question Portal",
  description:
    "A transparent campus question, grievance, and suggestion platform for students and administration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen flex flex-col antialiased bg-slate-50 text-slate-900">
        <AuthProvider>
          <QuestionsProvider>
            <ToastProvider>
              <Navbar />
              <main className="flex-1 w-full">{children}</main>
            </ToastProvider>
          </QuestionsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
