import Script from "next/script";

/**
 * Env-gated GA4 placeholder. Renders nothing unless NEXT_PUBLIC_GA_ID is set,
 * so it's a safe no-op in dev and until the client provides a measurement ID.
 * Vercel Analytics (in the layout) runs independently and needs no key.
 */
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
