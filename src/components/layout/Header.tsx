import '@styles/header.scss';

import { useLocation, useNavigate } from 'react-router-dom';
import Select, { StylesConfig } from 'react-select';

import useI18n from '../../hooks/useI18n';
import { useRootState } from '../../hooks/useRootState';

export const Header = () => {
  const { i18n, t, ts } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const changeLanguageHandler = (lang: string) => {
    i18n.changeLanguage(lang, () => {
      const paths = location.pathname.split('/');
      paths[1] = lang;
      navigate(paths.join('/'));
    });
  };

  const brandName = useRootState((state) => state.brandInfoReducer.brandName);
  const user = 'UserName';

  const languageOptionss = [
    { value: 'ko', label: '한국어' },
    { value: 'ja', label: '日本語' },
    { value: 'en', label: 'English' },
  ];

  const selectStyles: StylesConfig = {
    control: (provided, state) => ({
      ...provided,
      width: '21px',
      height: '14px',
      fontSize: '12px',
      color: '#FFFFFF',
      backgroundColor: '#282828',
      border: '1px solid #222222',
    }),
    option: (provided, state) => ({
      ...provided,
      width: '152px',
      height: '112px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #DCDCDC',
      boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.25)',
      borderRadius: '12px',
    }),
  };

  return (
    <header>
      <div>
        <span className="brandName">{brandName}</span>
        <select
          className="language"
          value={i18n.language}
          onChange={(e) => {
            changeLanguageHandler(e.target.value);
          }}
        >
          <option value="ko">한국어</option>
          <option value="en">ENGLISH</option>
          <option value="ja">日本語</option>
          <option value="key">키확인</option>
        </select>
        {/* <Select
          options={languageOptionss}
          onChange={(options: any) => {
            changeLanguageHandler(options.value);
          }}
          styles={selectStyles}
        /> */}
        <span className="userName">{user}</span>
      </div>
    </header>
  );
};
