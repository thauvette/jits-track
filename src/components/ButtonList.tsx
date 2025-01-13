import { HTMLAttributes } from 'react';

interface Button extends HTMLAttributes<HTMLButtonElement> {
  value: string | number;
  label: string | number;
  isSelected: boolean;
  role?: string;
}

export const SelectableButtonList = ({ buttons }: { buttons: Button[] }) => {
  return (
    <div className={'flex'}>
      {buttons.map(({ label, value, isSelected, role, ...rest }) => {
        return (
          <button
            {...rest}
            role={role ?? 'button'}
            key={value}
            className={`px-4 py-1 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 no-underline border-b-4 border-highlight-900 dark:border-highlight-200 ${isSelected ? '' : 'border-opacity-0 dark:border-opacity-0'}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
