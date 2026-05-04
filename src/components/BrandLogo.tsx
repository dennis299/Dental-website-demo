type Props = {
  className?: string;
  showWordmark?: boolean;
};

export const BrandLogo = ({ className = "h-10 w-auto", showWordmark = true }: Props) => {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Evergreen Dental">
      <svg
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        aria-hidden="true"
      >
        {/* Tooth + leaf mark */}
        <defs>
          <linearGradient id="evg-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(184 65% 38%)" />
            <stop offset="100%" stopColor="hsl(184 55% 55%)" />
          </linearGradient>
        </defs>
        <path
          d="M20 4c-4.4 0-7 1.8-9 1.8S6.5 4 4.6 4C3 4 2 5.2 2 7.2c0 5.4 1.6 9.4 3 14.2 1.2 4.2 2 14.6 5.5 14.6 2.6 0 2.4-7.4 4.5-7.4s2 7.4 4.5 7.4c2.4 0 3.4-3.8 4.4-7.6"
          fill="url(#evg-grad)"
          opacity="0.95"
          transform="translate(2 0)"
        />
        {/* leaf accent */}
        <path
          d="M30 8c4 0 8 2.5 8 8 0 5-3.5 9-8 9 0-3 1-5.5 3-7.5-2 0-4-1-5-3.5C28 11 28.5 9 30 8z"
          fill="hsl(42 78% 55%)"
        />
      </svg>
      {showWordmark && (
        <span className="text-lg font-bold tracking-tight text-foreground whitespace-nowrap">
          Evergreen<span className="text-primary"> Dental</span>
        </span>
      )}
    </span>
  );
};
