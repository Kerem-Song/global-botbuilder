import { icCollapseClose, icCollapseOpen } from '@assets';
import { Button, Col, Divider, Row, Switch } from '@components';
import { IGNodeEditModel, IHasChildren, IHasClassNameNStyle } from '@models';
import {
  IHasImageCtrlViewBase,
  IHasUtteranceViewBase,
} from '@models/interfaces/res/IGetFlowRes';
import { FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';
interface CollapseProps extends IHasChildren, IHasClassNameNStyle {
  label: string;
  useSwitch: boolean;
  field?: 'useImageCtrl' | 'useUtteranceParam';
}

export const Collapse: FC<CollapseProps> = ({ label, useSwitch, field, children }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const { register } =
    useFormContext<IGNodeEditModel<IHasImageCtrlViewBase | IHasUtteranceViewBase>>();

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
            {useSwitch && field && <Switch {...register(`view.${field}`)} />}
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
