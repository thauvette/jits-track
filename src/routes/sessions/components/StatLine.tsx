import { ReactNode } from 'react';

export const StatLine = ({
  text,
  icon = null,
  subText,
}: {
  text: string | number;
  icon?: ReactNode | null;
  subText?: string;
}) => (
  <div className={'border-t border-b py-2 border-gray-500'}>
    <div className={'flex gap-2 items-center'}>
      {icon}
      <p className={'text-xl font-bold'}>{text}</p>
    </div>
    {subText ? <p className={'text-sm'}>{subText}</p> : null}
  </div>
);
