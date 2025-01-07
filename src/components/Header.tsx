import { Link } from 'react-router';
import { HamburgerMenuIcon, HomeIcon, PlusIcon } from '@radix-ui/react-icons';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useSupabase } from '../hooks/useSupabase.ts';

export const Header = () => {
  const { logout } = useSupabase();
  return (
    <header
      className={
        'bg-purple-950 text-orange-200 py-3 fixed top-0 left-0 right-0'
      }
    >
      <div className={'max-content flex items-center px-2'}>
        <Link to={'/'}>
          <HomeIcon className='size-6' />
        </Link>
        <div className='ml-auto flex items-center gap-6'>
          <div>
            <Link to={'/sessions/create'} className={'flex items-center gap-1'}>
              <PlusIcon /> Session
            </Link>
          </div>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className='ml-auto' aria-label='Customise options'>
                <HamburgerMenuIcon className={'size-6'} />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className='min-w-64 bg-white shadow-lg p-4'
                sideOffset={5}
              >
                <DropdownMenu.Item asChild>
                  <Link className='px-1 py-1 block' to={'/team'}>
                    My Team
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link className='px-1 py-1 block' to={'/sessions'}>
                    Sessions
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link className='px-1 py-1 block' to={'/rolls'}>
                    Rolls
                  </Link>
                </DropdownMenu.Item>
                <hr />
                <DropdownMenu.Item asChild className='px-1 py-2'>
                  <button onClick={logout}>Logout</button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
};
