import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface FooterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function FooterButton({
  children,
  className = '',
  ...rest
}: FooterButtonProps) {
  const fixedSizeClasses = 'px-36 py-3 text-xl';
  const fixedColorClasses =
    'text-white bg-main hover:bg-orange-300 disabled:bg-orange-100';

  const classes = `inline-flex items-center justify-center rounded-lg ${fixedSizeClasses} ${fixedColorClasses} ${className}`;

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
