import { icPopupClose, icPrev } from '@assets';
import { Button, Input, Title } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEntityClient, usePage, useRootState, useSystemModal } from '@hooks';
import { usePrompt } from '@hooks/usePrompt';
import { IResponseEntity, IResponseSaveEntryGroup, ISaveEntryGroup } from '@models';
import { ENTITY_NAME_REGEX } from '@modules';
import { lunaToast } from '@modules/lunaToast';
import { FC, useEffect, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import * as yup from 'yup';

import { EntityRegistry } from './EntityRegistry';
import { EntriesRegistry } from './EntriesRegistry';

export interface IEntityDetailProps {
  handleIsOpen: (value: boolean) => void;
  isOpenEntityDetailPopup: boolean;
  handleIsOpenEntityDetailPopup: (value: boolean) => void;
  entryId?: string;
  setEntryId: (value: string) => void;
}

export const EntityDetailPopup: FC<IEntityDetailProps> = ({
  handleIsOpen,
  isOpenEntityDetailPopup,
  handleIsOpenEntityDetailPopup,
  entryId,
  setEntryId,
}) => {
  const { t, tc } = usePage();
  const { entryGroupAsync, getEntryDetailQuery } = useEntityClient();
  const { confirm, error } = useSystemModal();
  const token = useRootState((state) => state.botInfoReducer.token);
  const entryDetails = getEntryDetailQuery(entryId);
  const [entryNameInputError, setEntryNameInputError] = useState<string>('');
  const [regexInputError, setRegexInputError] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);

  usePrompt(isActive);

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

  const handleResetEntryInfo = () => {
    reset();
    remove();
    setEntryId('');
    handleIsOpenEntityDetailPopup(false);
    handleIsOpen(true);
  };

  const handleDuplicateEntryValidation = () => {
    setEntryNameInputError(t('DUPLICATE_ENTRY_MESSAGE'));
  };

  const handleRegexValidation = () => {
    setRegexInputError(t('VALIDATION_REQUIRED'));
  };

  const isTrue = (value: boolean) => Boolean(value);

  const hasInvalidEntries = (res: IResponseEntity<IResponseSaveEntryGroup>) =>
    isTrue(res?.exception.invalidateProperties?.includes('Entries'));

  const hasInvalidRepresentativeEntry = (res: IResponseEntity<IResponseSaveEntryGroup>) =>
    isTrue(
      res?.exception.errorCode === 7000 &&
        res?.exception.invalidateProperties?.includes('RepresentativeEntry'),
    );

  const handleError = (res: IResponseEntity<IResponseSaveEntryGroup>) => {
    console.log(res);
    const result = error({
      title: 'error',
      description: (
        <span>
          Validation failed: -- RepresentativeEntry: There are characters that are not
          allowed in the representative entry. Severity: Error
        </span>
      ),
    });
    return result;
  };

  const handleSave = async (entryData: ISaveEntryGroup) => {
    const { name, isRegex, entries, entryGroupid } = entryData;
    const saveEntry: ISaveEntryGroup = {
      sessionToken: token,
      name: name,
      isRegex: isRegex,
      entries: entries,
      entryGroupid: entryGroupid,
    };

    const res = await entryGroupAsync(saveEntry);

    if (res && res.isSuccess) {
      handleResetEntryInfo();
      lunaToast.success(t('MODIFY_MESSAGE'));
    } else if (res?.exception.errorCode === 7608) {
      handleDuplicateEntryValidation();
    } else if (res && isRegex && hasInvalidEntries(res)) {
      handleRegexValidation();
    } else if (res && hasInvalidRepresentativeEntry(res)) {
      handleError(res);
    }
  };

  const handleClose = async () => {
    if (isActive === false) {
      handleResetEntryInfo();
    } else {
      const result = await confirm({
        title: t('SAVE_ENTITY'),
        description: (
          <p style={{ whiteSpace: 'pre-wrap' }}>{tc('SAVE_CONFIRM_MESSAGE')}</p>
        ),
      });
      if (result) {
        handleResetEntryInfo();
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

  return (
    <ReactModal
      style={{ overlay: { display: 'flex' } }}
      className="entityModal detail"
      isOpen={isOpenEntityDetailPopup}
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
