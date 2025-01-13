import { useProfile } from '../../hooks/useProfile.ts';
import { LoadingSpinner } from '../../components/LoadingSpinner.tsx';
import { ProfileForm } from '../../components/ProfileForm.tsx';
import { ResetPasswordForm } from '../../components/ResetPasswordForm.tsx';

export const Profile = () => {
  const { data, isLoading, isRefetching } = useProfile();

  if (isLoading || isRefetching || !data) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={'pt-8'}>
      <div className={'border-b p-8 max-w-2xl'}>
        <p className={'font-lg uppercase font-bold'}>Update your profile</p>
        <ProfileForm
          initialValues={{
            ...data,
          }}
        />
      </div>
      <div className={'p-8 max-w-2xl'}>
        <p className={'font-lg uppercase font-bold mb-4'}>Change Password</p>
        <ResetPasswordForm />
      </div>
    </div>
  );
};
