import { icToastClosed } from '@assets';
import { Button } from '@components';

export const ToastCloseButton = () => {
  return <Button className="luna-toast-closeBtn" shape="ghost" icon={icToastClosed} />;
};
