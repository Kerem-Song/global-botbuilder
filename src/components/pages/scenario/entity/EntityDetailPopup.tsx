import { icPopupClose, icPrev } from '@assets';
import { Button, Input, Title } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEntityClient, usePage, useRootState, useSystemModal } from '@hooks';
import { ISaveEntryGroup } from '@models';
import { ENTITY_NAME_REGEX } from '@modules';
import { lunaToast } from '@modules/lunaToast';
import { FC, useEffect, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import * as yup from 'yup';

import { EntityRegistry } from './EntityRegistry';
import { EntriesRegistry } from './EntriesRegistry';

export interface IEntityDetailProps {
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
  entryId?: string;
  setEntryId: (value: string) => void;
}

export const EntityDetailPopup: FC<IEntityDetailProps> = ({
  isOpen,
  handleIsOpen,
  entryId,
  setEntryId,
}) => {
  const { t, tc } = usePage();
  const { entryGroupMutateAsync, getEntryDetailQuery } = useEntityClient();
  const { confirm, error } = useSystemModal();
  const token = useRootState((state) => state.botInfoReducer.token);
  const entryDetails = getEntryDetailQuery(entryId);
  const [entryNameInputError, setEntryNameInputError] = useState<string>('');
  const [regexInputError, setRegexInputError] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);

  const defaultValues: ISaveEntryGroup = {
    name: '',
    isRegex: false,
    entries: [],
  };

  const entitySchema = yup
    .object({
      name: yup
        .string()
        .trim()
        .required(t('VALIDATION_REQUIRED'))
        .matches(ENTITY_NAME_REGEX, '특수문자는 - _만 입력 가능합니다.')
        .max(20, `20자를 초과할 수 없습니다.`),
      entries: yup.array().min(1, t('VALIDATION_REQUIRED')),
    })
    .required();

  const formMethods = useForm<ISaveEntryGroup>({
    defaultValues,
    resolver: yupResolver(entitySchema),
  });

  const { reset, control, trigger, watch, setValue, getValues } = formMethods;

  const { remove } = useFieldArray({ control, name: 'entries' });

  const preventGoBack = async () => {
    const result = await confirm({
      title: t('SAVE_ENTITY'),
      description: <p style={{ whiteSpace: 'pre-wrap' }}>{tc('SAVE_CONFIRM_MESSAGE')}</p>,
    });
    if (result) {
      history.go(-1);
    } else {
      history.pushState(null, '', location.href);
    }
  };

  const handleSave = async (entryData: ISaveEntryGroup): Promise<void> => {
    const saveEntry: ISaveEntryGroup = {
      sessionToken: token,
      name: entryData.name,
      isRegex: entryData.isRegex,
      entries: entryData.entries,
      entryGroupid: entryData.entryGroupid,
    };

    entryGroupMutateAsync(saveEntry, {
      onSuccess: (res) => {
        if (res && res.isSuccess) {
          reset();
          remove();
          setEntryId('');
          handleIsOpen(false);
          lunaToast.success(t('MODIFY_MESSAGE'));
        } else if (res?.exception.errorCode === 7608) {
          setEntryNameInputError(t('DUPLICATE_ENTRY_MESSAGE'));
        } else if (
          entryData.isRegex === true &&
          res?.exception.invalidateProperties.includes('Entries')
        ) {
          setRegexInputError(t('VALIDATION_REQUIRED'));
        } else if (
          res?.exception.errorCode === 7000 &&
          res?.exception.invalidateProperties.includes('RepresentativeEntry')
        ) {
          const result = error({
            title: 'error',
            description: (
              <span>
                Validation failed: -- RepresentativeEntry: There are characters that are
                not allowed in the representative entry. Severity: Error
              </span>
            ),
          });
          return result;
        }
      },
    });
  };

  const handleClose = async () => {
    if (isActive === false) {
      reset();
      remove();
      setEntryId('');
      handleIsOpen(false);
    } else {
      const result = await confirm({
        title: t('SAVE_ENTITY'),
        description: (
          <p style={{ whiteSpace: 'pre-wrap' }}>{tc('SAVE_CONFIRM_MESSAGE')}</p>
        ),
      });
      if (result) {
        reset();
        remove();
        setEntryId('');
        handleIsOpen(false);
      }
    }
  };

  useEffect(() => {
    if (entryDetails && entryDetails.data) {
      const resetValue = {
        entryGroupid: entryDetails.data.id,
        name: entryDetails.data.name,
        entryGroupType: entryDetails.data.entryGroupType,
        isRegex: entryDetails.data.entryGroupType === 2,
        usingName: entryDetails.data.usingName,
        entryStr: entryDetails.data.entryStr,
        entries: entryDetails.data.entries,
      };
      reset(resetValue);
    }
  }, [entryDetails?.data]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'isRegex' && type === 'change') {
        setValue('entries', []);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch]);

  useEffect(() => {
    if (isActive === true) {
      (() => {
        history.pushState(null, '', location.href);
        window.addEventListener('popstate', preventGoBack);
      })();

      return () => {
        window.removeEventListener('popstate', preventGoBack);
      };
    }
  }, [isActive]);

  return (
    <ReactModal
      style={{ overlay: { display: 'flex', background: 'transparent' } }}
      className="entityModal detail"
      isOpen={isOpen}
    >
      <div className="detail header">
        <div className="listBtn">
          <Button icon={icPrev} onClick={handleClose}>
            {t('ENTITY_LIST')}
          </Button>
        </div>
        <button className="closeBtn" onClick={handleClose}>
          <img src={icPopupClose} alt="modal close btn"></img>
        </button>
      </div>
      <FormProvider {...formMethods}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="entitiesContainer">
            <div className="entitiesWrapper">
              <div className="entityDetailHeader">
                <Title level={2}>{t('ENTITY_DETAIL')}</Title>
                <Button
                  type="primary"
                  large
                  onClick={() => {
                    trigger(['name', 'entries', 'isRegex']);
                    handleSave(getValues());
                  }}
                >
                  {t('SAVE_ENTITY')}
                </Button>
              </div>
              <EntityRegistry
                entryId={entryId}
                formMethods={formMethods}
                regexInputError={regexInputError}
                entryNameInputError={entryNameInputError}
                setEntryNameInputError={setEntryNameInputError}
                setIsActive={setIsActive}
              />
              {watch('isRegex') === false && (
                <div className="searchInput">
                  <Input
                    size="small"
                    search
                    placeholder={t('INPUT_SEARCH_WORD')}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>
              )}
              <div className="registerEntry">
                {watch('isRegex') === false && (
                  <EntriesRegistry
                    formMethods={formMethods}
                    searchKeyword={searchKeyword}
                    setIsActive={setIsActive}
                  />
                )}
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </ReactModal>
  );
};
