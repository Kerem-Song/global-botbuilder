import { icPopupClose, icPrev } from '@assets';
import { Button, Input, Title } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEntityClient, usePage, useRootState, useSystemModal } from '@hooks';
import { usePrompt } from '@hooks/usePrompt';
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
  const { confirm } = useSystemModal();
  const token = useRootState((state) => state.botInfoReducer.token);
  const entryDetails = getEntryDetailQuery(entryId);
  const [entryNameInputError, setEntryNameInputError] = useState<string>('');
  const [regexInputError, setRegexInputError] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isEntriesActive, setIsEntriesActive] = useState<boolean>(false);
  const [isSaveBtnActive, setIsSaveBtnActive] = useState({
    isActive: false,
    isEntriesActive: false,
  });

  usePrompt(isSaveBtnActive.isActive || isSaveBtnActive.isEntriesActive);

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
        .matches(ENTITY_NAME_REGEX, t('ENTITY_NAME_REGEX'))
        .max(20, t('VALIDATION_STRING_LIMIT')),
      entries: yup
        .array()
        .min(1, t('VALIDATION_REQUIRED'))
        .of(
          yup.object().shape({
            representativeEntry: yup.string().required(t('VALIDATION_REQUIRED')),
          }),
        ),
    })
    .required();

  const formMethods = useForm<ISaveEntryGroup>({
    defaultValues,
    resolver: yupResolver(entitySchema),
  });

  const { reset, control, watch, setValue, handleSubmit } = formMethods;
  const { remove } = useFieldArray({ control, name: 'entries' });

  const handleResetEntryInfo = () => {
    reset();
    remove();
    setEntryId('');
    handleIsOpenEntityDetailPopup(false);
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

    if (isActive && !isEntriesActive) {
      const res = await entryGroupAsync(saveEntry);
      if (res && res.isSuccess) {
        handleResetEntryInfo();
        lunaToast.success(tc('SAVE_MESSAGE'));
        return;
      }
      if (res && res.exception && res.exception.errorCode === 7608) {
        setEntryNameInputError(t('DUPLICATE_ENTRY_MESSAGE'));
        return;
      }
    }
  };

  const handleListBtn = async () => {
    if (!isActive && !isEntriesActive) {
      handleResetEntryInfo();
      handleIsOpen(true);
      return;
    }

    const result = await confirm({
      title: t('SAVE_ENTITY'),
      description: <p style={{ whiteSpace: 'pre-wrap' }}>{tc('SAVE_CONFIRM_MESSAGE')}</p>,
    });

    if (result) {
      handleResetEntryInfo();
      handleIsOpen(true);
    }
  };

  const handleClose = async () => {
    if (!isActive && !isEntriesActive) {
      handleResetEntryInfo();
      return;
    }

    const result = await confirm({
      title: t('SAVE_ENTITY'),
      description: <p style={{ whiteSpace: 'pre-wrap' }}>{tc('SAVE_CONFIRM_MESSAGE')}</p>,
    });

    if (result) {
      handleResetEntryInfo();
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
      overlayClassName="entityPopupOverlay"
      className="entityModal detail node-draggable-ignore"
      isOpen={isOpenEntityDetailPopup}
      onRequestClose={handleResetEntryInfo}
      shouldCloseOnOverlayClick={false}
    >
      <div className="detail header">
        <div className="listBtn">
          <Button icon={icPrev} onClick={handleListBtn}>
            {t('ENTITY_LIST')}
          </Button>
        </div>
        <button className="closeBtn" onClick={handleClose}>
          <img src={icPopupClose} alt="modal close btn"></img>
        </button>
      </div>
      <FormProvider {...formMethods}>
        <form
          role="presentation"
          onSubmit={handleSubmit(handleSave)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
        >
          <div className="entitiesContainer">
            <div className="entitiesWrapper">
              <div className="entityDetailHeader">
                <Title level={2}>{t('ENTITY_DETAIL')}</Title>
                <Button htmlType="submit" type="primary" large disabled={!isActive}>
                  {t('SAVE_ENTITY')}
                </Button>
              </div>
              <EntityRegistry
                entryId={entryId}
                formMethods={formMethods}
                regexInputError={regexInputError}
                entryNameInputError={entryNameInputError}
                setEntryNameInputError={setEntryNameInputError}
                setRegexInputError={setRegexInputError}
                setIsActive={setIsActive}
                setIsSaveBtnActive={setIsSaveBtnActive}
              />
              {!watch('isRegex') && (
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
                {!watch('isRegex') && (
                  <EntriesRegistry
                    formMethods={formMethods}
                    searchKeyword={searchKeyword}
                    setIsActive={setIsActive}
                    setIsEntriesActive={setIsEntriesActive}
                    setIsSaveBtnActive={setIsSaveBtnActive}
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
