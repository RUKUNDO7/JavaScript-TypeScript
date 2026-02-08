type IconProps = {
  size?: number;
  className?: string;
};

export function WhatsAppIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12.04 2C6.5 2 2 6.48 2 12.02c0 1.85.5 3.65 1.45 5.22L2 22l4.92-1.38a10.01 10.01 0 0 0 5.12 1.4h.01c5.54 0 10.03-4.48 10.03-10.02C22.08 6.48 17.58 2 12.04 2zm5.84 14.66c-.24.68-1.43 1.3-1.96 1.37-.5.07-1.12.1-1.8-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.74-4.12-4.88-4.3-.13-.18-1.17-1.55-1.17-2.95 0-1.4.73-2.08.98-2.37.24-.28.54-.36.72-.36.18 0 .36 0 .51.01.16.01.37-.07.58.44.24.58.82 2 .9 2.14.08.14.12.3.02.48-.1.18-.16.3-.31.46-.15.16-.32.36-.46.48-.15.14-.3.29-.13.58.18.29.8 1.3 1.73 2.11 1.2 1.06 2.2 1.39 2.5 1.55.3.16.48.14.66-.08.18-.22.76-.88.96-1.18.2-.3.4-.25.66-.15.26.1 1.66.78 1.95.92.29.14.48.21.55.33.07.12.07.7-.17 1.38z" />
    </svg>
  );
}

export function FacebookIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M13.5 9H16V6h-2.5C10.97 6 9 7.97 9 10.5V12H7v3h2v7h3v-7h2.4l.6-3H12v-1.5c0-.83.67-1.5 1.5-1.5z" />
    </svg>
  );
}

export function XIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 3h4.5l4.2 6.1L16.9 3H21l-7 9.1L21.7 21H17.2l-4.7-6.6L7.4 21H3.2l7.5-9.7L3 3z" />
    </svg>
  );
}

export function InstagramIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zm5.7-8.2a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0z" />
      <path d="M17.2 2.8H6.8A4 4 0 0 0 2.8 6.8v10.4a4 4 0 0 0 4 4h10.4a4 4 0 0 0 4-4V6.8a4 4 0 0 0-4-4zm2.3 14.4a2.3 2.3 0 0 1-2.3 2.3H6.8a2.3 2.3 0 0 1-2.3-2.3V6.8a2.3 2.3 0 0 1 2.3-2.3h10.4a2.3 2.3 0 0 1 2.3 2.3z" />
    </svg>
  );
}
