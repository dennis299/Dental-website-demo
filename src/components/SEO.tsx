import { Helmet } from "react-helmet-async";

const SITE = "https://my-dental.space";
const DEFAULT_OG_IMAGE = `${SITE}/og-image.jpg`;

type Props = {
  title: string;
  description: string;
  path: string;
  jsonLd?: object | object[];
  noindex?: boolean;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  ogTitle?: string;
  ogDescription?: string;
  keywords?: string;
};

// Defensive cap to keep meta descriptions under the 160-char limit.
const clampDescription = (d: string) =>
  d.length <= 158 ? d : d.slice(0, 155).trimEnd() + "…";

export const SEO = ({
  title,
  description,
  path,
  jsonLd,
  noindex,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  ogTitle,
  ogDescription,
  keywords,
}: Props) => {
  const url = `${SITE}${path}`;
  const desc = clampDescription(description);
  const ogT = ogTitle ?? title;
  const ogD = clampDescription(ogDescription ?? description);
  const ld = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={desc} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:site_name" content="Evergreen Dental" />
      <meta property="og:title" content={ogT} />
      <meta property="og:description" content={ogD} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content="Evergreen Dental, premium private dentistry in Marylebone, London" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogT} />
      <meta name="twitter:description" content={ogD} />
      <meta name="twitter:image" content={ogImage} />
      {ld.map((obj, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(obj)}</script>
      ))}
    </Helmet>
  );
};
