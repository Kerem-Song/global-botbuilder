import { icCollapseClose, icCollapseOpen } from '@assets';
import { Button, Col, Divider, Row, Space, Switch } from '@components';
import { IGNodeEditModel, IHasChildren, IHasClassNameNStyle } from '@models';
import { IHasImageCtrlViewBase } from '@models/interfaces/res/IGetFlowRes';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { useFormContext } from 'react-hook-form';
interface CollapseProps extends IHasChildren, IHasClassNameNStyle {
  label: string;
  useSwitch: boolean;
}

export const Collapse: FC<CollapseProps> = ({ label, useSwitch, children }) => {
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
    <div className="node-item-wrap collapse">
      <div className="collapseHeader">
        <Row
          style={{ justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
        >
          <Col span={20} flex={20} className="collapseTitle">
            <span className="label" style={{ paddingRight: '10px' }}>
              {label}
            </span>
            {useSwitch && <Switch {...register('view.imageCtrl')} />}
          </Col>
          <Col span={4}>
            <Button shape="ghost" onClick={handleCollapse}>
              <img src={isCollapsed ? icCollapseClose : icCollapseOpen} alt="collapsed" />
            </Button>
          </Col>
        </Row>
        <Divider style={{ margin: '0' }} />
      </div>

      <div className="collapseWrapper" data-collapsed={isCollapsed}>
        {children}
      </div>
    </div>
  );
};
