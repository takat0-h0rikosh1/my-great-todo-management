import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import Layout from "./layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RecoilRoot>
  );
}
