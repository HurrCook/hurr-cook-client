import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color: 'default' | 'cancel';
  children: ReactNode;
}

const COLOR_MAP: { [k in ButtonProps['color']]: string } = {
  default: 'text-white bg-main hover:bg-orange-300 disabled:bg-orange-100',
  cancel:
    'text-neutral-500 bg-gray-200 hover:bg-neutral-300 disabled:bg-neutral-600',
};

export default function FooterButton({
  color,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const fixedSizeClasses = 'py-[3px] text-lg font-normal';

  const classes = `w-24 inline-flex items-center justify-center rounded-[10px] ${fixedSizeClasses} ${COLOR_MAP[color]} ${className}`;

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
