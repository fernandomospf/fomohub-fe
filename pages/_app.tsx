import dynamic from "next/dynamic";
import type { AppProps } from "next/app";

const ClientApp = dynamic(() => import("../src/App"), { ssr: false });

import "../src/index.css";
import { LanguageProvider } from "../src/contexts/LanguageContext";

export default function MyApp({ Component, pageProps }: AppProps) {

  return (
    <LanguageProvider>
      <ClientApp />
    </LanguageProvider>
  );
}
