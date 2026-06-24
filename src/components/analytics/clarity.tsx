import Script from "next/script";

/**
 * Microsoft Clarity (free heatmaps + session recordings). Env-gated on
 * NEXT_PUBLIC_CLARITY_ID, so it's a no-op in dev and until the client provides a
 * project ID. Loads `afterInteractive` so it never blocks first paint or LCP.
 *
 * Privacy: Clarity records masked session replays. The footer carries the
 * analytics disclosure (Footer.privacyNote). For this business (a small FL
 * service company) a consent banner isn't legally required; if that changes,
 * gate this `<Script>` behind a consent flag.
 */
export function MicrosoftClarity() {
  const id = process.env.NEXT_PUBLIC_CLARITY_ID;
  if (!id) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${id}");`}
    </Script>
  );
}
