import { Link } from 'react-router';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ArrowLeftIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Modal } from '../../../components/Modal.tsx';

export const SessionHeader = ({
  handleDelete,
  handleEdit,
}: {
  handleDelete: (callback: () => void) => Promise<void>;
  handleEdit: () => void;
}) => {
  return (
    <div className={'flex p-2 items-center'}>
      <Link to={'/sessions'} className={'flex gap-2 items-center'}>
        <ArrowLeftIcon /> Sessions
      </Link>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className='ml-auto' aria-label='Edit Session'>
            <DotsHorizontalIcon className={'size-6'} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className='min-w-48 shadow-lg p-4 z-20 bg-1'
            sideOffset={5}
          >
            <DropdownMenu.Item asChild className={'block'}>
              <button className={' mb-2'} onClick={handleEdit}>
                Edit details
              </button>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Modal
                title={'Delete Session'}
                trigger={<button className={''}>Delete session</button>}
                renderChildren={({ closeModal }) => {
                  return (
                    <div>
                      <p className={'text-lg mb-4'}>
                        Are you sure you want to delete this session?
                      </p>
                      <div className={'flex gap-4 items-center'}>
                        <button className={'primary'} onClick={closeModal}>
                          No, keep it
                        </button>
                        <button
                          className={'danger'}
                          onClick={() => {
                            void handleDelete(closeModal);
                          }}
                        >
                          Yes, ditch it.
                        </button>
                      </div>
                    </div>
                  );
                }}
              />
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};
