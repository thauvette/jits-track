import { Link } from 'react-router';
import { HamburgerMenuIcon, HomeIcon } from '@radix-ui/react-icons';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useSupabase } from '../hooks/useSupabase.ts';

export const Header = () => {
  const { logout } = useSupabase();
  return (
    <header
      className={'bg-purple-950 text-orange-200 py-3 px-2 flex items-center'}
    >
      <Link to={'/'}>
        <HomeIcon className='size-6' />
      </Link>
      <div className='ml-auto'>
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
              <DropdownMenu.Item className='px-1 py-2 mb-2'>
                <Link to={'/team'}>My Team</Link>
              </DropdownMenu.Item>
              <hr />
              <DropdownMenu.Item className='px-1 py-2'>
                <button onClick={logout}>Logout</button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
};
