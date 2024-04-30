import { Spinner } from "@/components/Elements/Spinner";
import { lazyImport } from "@/utils/lazyImport";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "@/components/Layout";
const { Dashboard } = lazyImport(
  () => import("@/features/dashboard"),
  "Dashboard",
);
const { Profile } = lazyImport(() => import("@/features/users"), "Profile");
const { Settings } = lazyImport(() => import("@/features/users"), "Settings");
const { Chat } = lazyImport(() => import("@/features/chat"), "Chat");
const { Sell } = lazyImport(() => import("@/features/listing"), "Sell");
const { ItemListing } = lazyImport(
  () => import("@/features/listing"),
  "ItemListing",
);

export const App = () => {
  return (
    <Layout>
      <Suspense
        fallback={
          <div className="h-full w-full flex items-center justify-center">
            <Spinner size="xl" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </Layout>
  );
};

export const protectedRoutes = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "profile/:id", element: <Profile /> },
      { path: "settings", element: <Settings /> },
      { path: "sell", element: <Sell /> },
      { path: "listing/:id", element: <ItemListing /> },
      { path: "chat", element: <Chat /> },
    ],
  },
];
