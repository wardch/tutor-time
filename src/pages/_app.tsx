import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Toaster position={"bottom-center"} />
      <Component {...pageProps} />
      <Analytics />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
