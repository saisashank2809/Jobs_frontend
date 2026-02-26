import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "Find Your Dream Job",
  description: "Land your dream job with Ottobon. We connect you with top employers so you can find a role that fits your skills.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Find Your Dream Job | Ottobon",
    description: "Land your dream tech job with Ottobon.",
    url: "/",
  },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ottobon",
  url: "https://your-domain.com",
  logo: "https://your-domain.com/icon.png",
  description: "Land your dream tech job with Ottobon.",
};

const webSiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Ottobon",
  url: "https://your-domain.com",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLd) }}
      />
      <HomeClient />
    </>
  );
}
