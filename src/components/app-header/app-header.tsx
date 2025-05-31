import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const { user } = useSelector((state) => state.userSlice);
  return <AppHeaderUI userName={user?.name} />;
};
