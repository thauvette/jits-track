import { Route, Routes } from 'react-router';
import { TeamList } from './TeamList.tsx';
import { Teammate } from './Teammate.tsx';

export const TeamRoutes = () => {
  return (
    <Routes>
      <Route index path={'/'} element={<TeamList />} />
      <Route path={':id'} element={<Teammate />} />
    </Routes>
  );
};
