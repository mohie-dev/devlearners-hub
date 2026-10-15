import Image from "next/image";

type SiteLogoProps = {
  variant: "primary-light" | "primary-dark";
  className?: string;
};

const LOGO_ASSETS = {
  "primary-light": {
    src: "/brand/logo-primary-light.svg",
    width: 400,
    height: 104,
  },
  "primary-dark": {
    src: "/brand/logo-primary-dark.svg",
    width: 400,
    height: 104,
  },
} as const;

export function SiteLogo({ variant, className }: SiteLogoProps) {
  const logo = LOGO_ASSETS[variant];

  return (
    <Image
      src={logo.src}
      alt="DevLearners Hub"
      width={logo.width}
      height={logo.height}
      priority
      className={className}
    />
  );
}
