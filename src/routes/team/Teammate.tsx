import { useParams } from 'react-router';
import { useTeammates } from '../../hooks/useTeammates.ts';
import { LoadingSpinner } from '../../components/LoadingSpinner.tsx';

export const Teammate = () => {
  const { id } = useParams();

  const { data: teammates, isLoading } = useTeammates({
    id: id ? +id : undefined,
  });

  const teammate = id
    ? teammates?.find((teammate) => teammate.id === +id)
    : null;

  return isLoading ? (
    <div className={'p-4 flex items-center justify-center'}>
      <LoadingSpinner />
    </div>
  ) : teammate ? (
    <div className={'p-4'}>
      <h1>{teammate.name}</h1>
      <p>{teammate.beltName} belt</p>
    </div>
  ) : (
    <div className={'p-4 flex items-center justify-center'}>
      <p>404</p>
    </div>
  );
};
