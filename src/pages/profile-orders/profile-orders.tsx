import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getUserOrders } from '../../services/slices/userSlice';

export const ProfileOrders: FC = () => {
  const { orders, isAuthChecked, loading, error } = useSelector(
    (state) => state.userSlice
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthChecked && orders.length === 0) {
      dispatch(getUserOrders());
    }
  }, [isAuthChecked, orders, dispatch]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка загрузки заказов. Попробуйте позже.</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
