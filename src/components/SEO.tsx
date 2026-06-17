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
}: Props) => {
  const url = `${SITE}${path}`;
  const desc = clampDescription(description);
  const ld = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:site_name" content="Evergreen Dental" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
      {ld.map((obj, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(obj)}</script>
      ))}
    </Helmet>
  );
};
