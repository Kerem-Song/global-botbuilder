import { icCollapseClose, icCollapseOpen } from '@assets';
import { Button, Col, Divider, Row, Switch } from '@components';
import { usePage, useSystemModal } from '@hooks';
import { IGNodeEditModel, IHasChildren, IHasClassNameNStyle } from '@models';
import {
  IHasImageCtrlViewBase,
  IHasUtteranceViewBase,
} from '@models/interfaces/res/IGetFlowRes';
import { FC, useEffect, useState } from 'react';
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
  const { register, setValue, watch, control } =
    useFormContext<IGNodeEditModel<IHasImageCtrlViewBase | IHasUtteranceViewBase>>();
  const { confirm } = useSystemModal();
  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // console.log(
  //   'field in collapse',
  //   field === 'useUtteranceParam'
  //     ? `view.useUtteranceParam`
  //     : index !== undefined
  //     ? `view.childrenViews.${index}.useImageCtrl`
  //     : `view.useImageCtrl`,
  // );

  const isCollapsedModalForImage = async () => {
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
      console.log('result', result);
      if (result) {
        const childrenViews = watch('view.childrenViews');
        setIsCollapsed(false);
        setValue(`view.useImageCtrl`, false);

        if (index !== undefined && childrenViews) {
          for (const i in childrenViews) {
            setValue(`view.childrenViews.${Number(i)}.imageCtrl.imageUrl`, '');
          }
        } else {
          setValue(`view.imageCtrl.imageUrl`, '');
        }
      } else {
        setValue(`view.useImageCtrl`, true);
      }
    }
  };

  useEffect(() => {
    const childrenViewArr = watch(`view.childrenViews`);

    if (watch(`view.useImageCtrl`) === false && childrenViewArr) {
      for (const i in childrenViewArr) {
        setValue(`view.childrenViews.${Number(i)}.useImageCtrl`, false);
        // setValue(`view.childrenViews.${Number(i)}.imageCtrl.imageUrl`, '');
      }
    } else {
      for (const i in childrenViewArr) {
        setValue(`view.childrenViews.${Number(i)}.useImageCtrl`, true);
      }
    }
  }, [watch(`view.useImageCtrl`)]);

  useEffect(() => {
    console.log('@@@', watch(`view.useImageCtrl`), watch(`view.imageCtrl.imageUrl`));
    if (watch(`view.useImageCtrl`) === false && !watch(`view.imageCtrl.imageUrl`)) {
      setValue(`view.useImageCtrl`, false);
    } else {
      setValue(`view.useImageCtrl`, true);
    }
  }, [watch(`view.imageCtrl.imageUrl`)]);

  return (
    <div className="node-item-wrap collapse">
      <div className="collapseHeader">
        <Row
          style={{ justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
        >
          <Col span={21} flex={20} className="collapseTitle">
            <span className="label" style={{ paddingRight: '10px' }}>
              {label}
            </span>
            {useSwitch && field && (
              <Switch
                {...register(
                  field === 'useUtteranceParam'
                    ? `view.useUtteranceParam`
                    : `view.useImageCtrl`,
                  {
                    onChange: (e) => {
                      if (!e.target.checked) {
                        setValue(
                          index !== undefined
                            ? `view.childrenViews.${index}.imageCtrl.imageUrl`
                            : `view.imageCtrl.imageUrl`,
                          '',
                        );
                        e.target.files = null;
                        e.target.value = '';
                        isCollapsedModalForImage();
                      }
                    },
                  },
                )}
              />
            )}
          </Col>
          <Col span={3}>
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
