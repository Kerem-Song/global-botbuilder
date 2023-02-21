import { Button } from '@components';
import { FC } from 'react';

export interface UserInfoModalProps {
  isOpen: boolean;
}

export const UserInfoModal: FC<UserInfoModalProps> = ({ isOpen }) => {
  return (
    <>
      {isOpen && (
        <div className="userInfoModal">
          <div className="userInfoTitle">
            <p className="user">cs_kimsuky</p>
          </div>
          <div className="userBrandInfo">
            <p className="userBrandName">Lunasoft</p>
            <p className="userAccout">lunacs@lunasoft.co.kr</p>
          </div>
          <Button className="logoutBtn">Log out</Button>
        </div>
      )}
    </>
  );
};
