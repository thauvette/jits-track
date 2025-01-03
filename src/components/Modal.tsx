import { ReactNode, useCallback, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';

import * as Dialog from '@radix-ui/react-dialog';

export const Modal = ({
  renderChildren,
  title,
  trigger,
  children,
  onClose,
  fullScreen = false,
}: {
  title: string;
  trigger: ReactNode;
  renderChildren?: ({ closeModal }: { closeModal: () => void }) => ReactNode;
  children?: ReactNode;
  onClose?: () => void;
  fullScreen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (onClose && !open) {
          onClose();
        }
      }}
    >
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='DialogOverlay' />
        <Dialog.Content
          className={`DialogContent ${fullScreen ? 'full-screen' : ''}`}
        >
          <Dialog.Title title={title} />
          <div className='flex space-between items-center w-full mb-4 border-b pb-2'>
            <Dialog.Description className={'text-xl font-bold'}>
              {title}
            </Dialog.Description>
            <Dialog.Close asChild>
              <button className={'ml-auto'}>
                <Cross2Icon aria-label={'dismiss'} className={'size-6'} />
              </button>
            </Dialog.Close>
          </div>
          {renderChildren
            ? renderChildren({
                closeModal,
              })
            : children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
