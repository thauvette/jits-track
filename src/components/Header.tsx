import { Link } from 'react-router';
import { HamburgerMenuIcon, HomeIcon } from '@radix-ui/react-icons';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useSupabase } from '../hooks/useSupabase.ts';

export const Header = () => {
  const { logout } = useSupabase();
  return (
    <header
      className={'bg-purple-900 text-orange-50 py-3 px-2 flex items-center'}
    >
      <Link to={'/'}>
        <HomeIcon className='size-4' />
      </Link>
      <div className='ml-auto'>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className='IconButton ml-auto'
              aria-label='Customise options'
            >
              <HamburgerMenuIcon />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className='DropdownMenuContent bg-white shadow-lg p-4'
              sideOffset={5}
            >
              <DropdownMenu.Item className='DropdownMenuItem'>
                <button onClick={logout}>logout</button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
};
