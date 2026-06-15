import { Helmet } from "react-helmet-async";

const SITE = "https://my-dental.space";

type Props = {
  title: string;
  description: string;
  path: string;
  jsonLd?: object | object[];
};

export const SEO = ({ title, description, path, jsonLd }: Props) => {
  const url = `${SITE}${path}`;
  const ld = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ld.map((obj, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(obj)}</script>
      ))}
    </Helmet>
  );
};
