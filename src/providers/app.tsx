import * as React from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { Spinner } from "@/components/Elements/Spinner";
import { AuthProvider } from "@/lib/auth";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center w-screen h-screen">
          <Spinner size="xl" />
        </div>
      }
    >
      <HelmetProvider>
        <AuthProvider>
          <Router>{children}</Router>
        </AuthProvider>
      </HelmetProvider>
    </React.Suspense>
  );
};
