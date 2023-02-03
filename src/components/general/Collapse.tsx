import { icCollapseClose, icCollapseOpen } from '@assets';
import { Button, Col, Divider, Row, Space, Switch } from '@components';
import { IGNodeEditModel, IHasChildren, IHasClassNameNStyle } from '@models';
import { IHasImageCtrlViewBase } from '@models/interfaces/res/IGetFlowRes';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { useFormContext } from 'react-hook-form';
interface CollapseProps extends IHasChildren, IHasClassNameNStyle {
  label: string;
  isSwitch: boolean;
}

export const Collapse: FC<CollapseProps> = ({ label, isSwitch, children }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const {
    register,
    getValues,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IHasImageCtrlViewBase>>();
  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="node-item-wrap">
      <div className="m-b-8">
        <Row
          style={{ justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
        >
          <Col style={{ display: 'flex', alignItems: 'center' }} span={20} flex={20}>
            <span className="label" style={{ paddingRight: '10px' }}>
              {label}
            </span>
            {isSwitch && <Switch {...register('view.imageCtrl')} />}
          </Col>
          <Col span={4}>
            <Button shape="ghost" onClick={handleCollapse}>
              <img src={isCollapsed ? icCollapseClose : icCollapseOpen} alt="collapsed" />
            </Button>
          </Col>
        </Row>
        <Divider />
      </div>

      <div className="collapseWrapper" data-collapsed={isCollapsed}>
        {children}
      </div>
    </div>
  );
};
