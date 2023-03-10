import { icCollapseClose, icCollapseOpen } from '@assets';
import { Button, Col, Divider, Row, Switch } from '@components';
import { usePage, useSystemModal } from '@hooks';
import { IGNodeEditModel, IHasChildren, IHasClassNameNStyle } from '@models';
import {
  IHasImageCtrlViewBase,
  IHasUtteranceViewBase,
} from '@models/interfaces/res/IGetFlowRes';
import { FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';
interface CollapseProps extends IHasChildren, IHasClassNameNStyle {
  label: string;
  index?: number;
  useSwitch: boolean;
  field?: 'useImageCtrl' | 'useUtteranceParam';
}

export const Collapse: FC<CollapseProps> = ({
  label,
  index,
  useSwitch,
  field,
  children,
}) => {
  const { t } = usePage();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const { register, setValue } =
    useFormContext<IGNodeEditModel<IHasImageCtrlViewBase | IHasUtteranceViewBase>>();
  const { confirm } = useSystemModal();
  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  console.log(
    field === 'useUtteranceParam'
      ? `view.useUtteranceParam`
      : index !== undefined
      ? `view.childrenViews.${index}.useImageCtrl`
      : `view.useImageCtrl`,
  );

  const isCollapsedModal = async () => {
    if (field === 'useImageCtrl' && index !== undefined) {
      const result = await confirm({
        title: t(`IMAGE_SETTING_OFF`),
        description: (
          <>
            <span style={{ whiteSpace: 'pre-line' }}>
              {t(`IMAGE_SETTING_OFF_WARNING`)}
            </span>
          </>
        ),
      });

      if (result) {
        setIsCollapsed(false);
        setValue(`view.useImageCtrl`, false);
        setValue(
          index !== undefined
            ? `view.childrenViews.${index}.imageCtrl`
            : `view.imageCtrl`,
          { imageUrl: '' },
        );
      }
    }
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
            {useSwitch && field && (
              <Switch
                {...register(
                  field === 'useUtteranceParam'
                    ? `view.useUtteranceParam`
                    : `view.useImageCtrl`,
                )}
                onChange={() => field === 'useImageCtrl' && index && isCollapsedModal}
              />
            )}
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
