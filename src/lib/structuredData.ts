interface ServiceSDOptions {
  name: string;
  description: string;
  url: string;
  extra?: Record<string, unknown>;
}

const base = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  image: "https://uws.com.ua/assets/img/logo.png",
  telephone: ["+380660575202", "+380989478772", "+380633664769"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Київ",
    addressRegion: "Київська область",
    postalCode: "01001",
    addressCountry: "UA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 50.4501,
    longitude: 30.5234,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "09:00",
    closes: "20:00",
  },
  priceRange: "$$",
  sameAs: [
    "https://www.facebook.com/uws.kyiv",
    "https://www.instagram.com/uws_kyiv",
  ],
};

export function getServiceStructuredData(
  opts: ServiceSDOptions,
): Record<string, unknown> {
  return {
    ...base,
    name: opts.name,
    description: opts.description,
    url: opts.url,
    ...(opts.extra ?? {}),
  };
}
