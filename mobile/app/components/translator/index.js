import I18n from "react-native-i18n";
import en from "./en";
import fr from "./fr";
import moment from "moment";
import "moment/min/moment-with-locales";
import "moment/locale/fr";

import { getLanguages } from "react-native-i18n";

I18n.fallbacks = true;

I18n.translations = {
  en,
  fr,
};

getLanguages().then(languages => {
  console.log("moment language", languages);
  let lang = languages.length && languages[0].split("-")[0];
  if (lang) {
    moment.locale(lang);
  }
});

export default I18n;
