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
  const { t, isReadOnly } = usePage();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const { register, setValue, watch, getValues, control } =
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
  const values = getValues();
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

      if (result) {
        const childrenViews = watch('view.childrenViews');
        setIsCollapsed(false);
        setValue(`view.useImageCtrl`, false, { shouldDirty: true });

        if (index !== undefined && childrenViews) {
          for (const i in childrenViews) {
            setValue(`view.childrenViews.${Number(i)}.imageCtrl.imageUrl`, '', {
              shouldDirty: true,
            });
          }
        } else {
          setValue(`view.imageCtrl.imageUrl`, '', {
            shouldDirty: true,
          });
        }
      } else {
        setValue(`view.useImageCtrl`, true, { shouldDirty: true });
      }
    }
  };

  useEffect(() => {
    const childrenViewArr = watch(`view.childrenViews`);

    if (watch(`view.useImageCtrl`) === false && childrenViewArr) {
      for (const i in childrenViewArr) {
        setValue(`view.childrenViews.${Number(i)}.useImageCtrl`, false);
      }
    } else {
      for (const i in childrenViewArr) {
        setValue(`view.childrenViews.${Number(i)}.useImageCtrl`, true);
      }
    }
  }, [watch(`view.useImageCtrl`)]);

  useEffect(() => {
    if (field !== 'useImageCtrl') {
      return;
    }
    const childrenViewArr = watch(`view.childrenViews`);

    if (isReadOnly) {
      // console.log('@childrenViewArr', childrenViewArr);
      // console.log('@getvalue', watch(`view.imageCtrl`));
      if (childrenViewArr && childrenViewArr[0].imageCtrl?.imageUrl) {
        // console.log('@5', watch(`view.useImageCtrl`), watch(`view.imageCtrl.imageUrl`));
        setValue(`view.useImageCtrl`, true);
      } else if (watch(`view.imageCtrl.imageUrl`)) {
        setValue(`view.useImageCtrl`, true);
      } else {
        // console.log('@6', watch(`view.useImageCtrl`), watch(`view.imageCtrl.imageUrl`));
        setValue(`view.useImageCtrl`, false);
      }
      return;
    }

    if (index !== undefined && childrenViewArr) {
      if (
        watch(`view.useImageCtrl`) === false &&
        !watch(`view.childrenViews.${0}.imageCtrl.imageUrl`)
      ) {
        setValue(`view.useImageCtrl`, false);
        // console.log('@1', index, childrenViewArr);
      } else {
        setValue(`view.useImageCtrl`, true);
        // console.log('@2', index, childrenViewArr);
      }
    } else {
      if (watch(`view.useImageCtrl`) === false && !watch(`view.imageCtrl.imageUrl`)) {
        // console.log('@3', index, childrenViewArr);
        // console.log(
        //   '@3 watch(`view.imageCtrl.imageUrl`)',
        //   watch(`view.useImageCtrl`),
        //   watch(`view.imageCtrl.imageUrl`),
        // );
        setValue(`view.useImageCtrl`, false);
      } else {
        // console.log('@4', index, childrenViewArr);
        // console.log(
        //   '@4 watch(`view.imageCtrl.imageUrl`)',
        //   watch(`view.useImageCtrl`),
        //   watch(`view.imageCtrl.imageUrl`),
        // );
        setValue(`view.useImageCtrl`, true);
      }
    }
  }, [watch(`view.imageCtrl`)]);

  return (
    <div className="node-item-wrap collapse">
      <div className="collapseHeader" onClick={handleCollapse} role="presentation">
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
                      if (!e.target.checked && field !== 'useUtteranceParam') {
                        setValue(`view.imageCtrl.imageUrl`, '', {
                          shouldDirty: true,
                        });
                        e.target.files = null;
                        e.target.value = '';
                        isCollapsedModalForImage();
                      } else {
                        setIsCollapsed(true);
                      }
                    },
                  },
                )}
              />
            )}
          </Col>
          <Col span={3}>
            <Button shape="ghost">
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
