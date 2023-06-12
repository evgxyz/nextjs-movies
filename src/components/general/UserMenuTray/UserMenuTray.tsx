
import {useRouter} from 'next/router';
import {useAppSelector, useAppDispatch} from '@/store';
import {Lang, isLang, langs, langKeys, langDefault, strlang} from '@/units/lang';
import {setLang} from '@/store/settings';
import css from './UserMenuTray.module.scss';

export function UserMenuTray() {

  const router = useRouter();
  const lang = useAppSelector(state => state.settings.lang);
  const dispatch = useAppDispatch();

  const changeLang = function(ev: React.ChangeEvent<HTMLSelectElement>) {
    ev.preventDefault();
    
    const lang = ev.target.value;
    if (isLang(lang)) {
      dispatch(setLang(lang as Lang));
      
      const query = {...router.query};

      if (lang !== langDefault) {
        query.lang = lang;
      } else {
        delete query.lang;
      }
      
      router.push({query}, undefined, {shallow: true});
    }
  }

  return (
    <div className={css['body']}>
      <select value={lang} onChange={changeLang}>
        { langs.map(lang => 
            <option key={lang} value={lang}>
              {strlang(langKeys[lang])}
            </option>
          )
        }
      </select>
    </div>
  )
}