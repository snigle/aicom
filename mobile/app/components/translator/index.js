import I18n from "react-native-i18n";
import en from "./en";
import fr from "./fr";
import moment from "moment";
import "moment/locale/fr";
import { getLanguages } from 'react-native-i18n'

I18n.fallbacks = true;

I18n.translations = {
  en,
  fr,
};

getLanguages().then(languages => {
  moment.locale(languages);
})

export default I18n;
