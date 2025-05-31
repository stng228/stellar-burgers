import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser, getUserOrders } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);

  useEffect(() => {
    dispatch(getUserOrders());
  }, []);

  if (user) {
    const [formValue, setFormValue] = useState({
      name: user.name,
      email: user.email,
      password: ''
    });

    useEffect(() => {
      console.log('upd form:', user);
      setFormValue((prevState) => ({
        ...prevState,
        name: user.name || '',
        email: user.email || ''
      }));
      console.log('form value:', formValue);
    }, [user]);

    const isFormChanged =
      formValue.name !== user?.name ||
      formValue.email !== user?.email ||
      !!formValue.password;

    const handleSubmit = (e: SyntheticEvent) => {
      e.preventDefault();
      dispatch(updateUser(formValue));
    };

    const handleCancel = (e: SyntheticEvent) => {
      e.preventDefault();
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValue((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
      }));
    };

    return (
      <ProfileUI
        formValue={formValue}
        isFormChanged={isFormChanged}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
      />
    );
  }
};
