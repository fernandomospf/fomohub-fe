import dynamic from "next/dynamic";
import type { AppProps } from "next/app";

// Load the Vite app component only on client side to avoid SSR issues
const ClientApp = dynamic(() => import("../src/App"), { ssr: false });

import "../src/index.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  // We render the existing App which internally uses react-router-dom and other
  // client-only libraries. This keeps most of the code unchanged and disables
  // server-side rendering for the routed SPA portion.
  return <ClientApp />;
}
