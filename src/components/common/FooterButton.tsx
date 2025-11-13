import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface FooterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function FooterButton({
  children,
  className = '',
  ...rest
}: FooterButtonProps) {
  // ⚠️ 고정 크기 클래스를 제거하거나, 재정의 가능한 형태로 변경합니다.
  // 여기서는 재사용성을 위해 w-96 h-12를 제거하고, 패딩과 글꼴만 남깁니다.
  const baseSizeClasses = ' text-xl font-normal';

  const fixedColorClasses =
    'text-white bg-main hover:bg-orange-300 disabled:bg-orange-100';

  // className을 가장 뒤에 놓아 외부에서 전달된 w-[...] h-[...] 클래스가 우선 적용되도록 합니다.
  const classes = `inline-flex items-center justify-center rounded-lg ${baseSizeClasses} ${fixedColorClasses} ${className}`;

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
