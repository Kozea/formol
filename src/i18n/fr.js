export default {
  // General
  yes: 'Oui',
  no: 'Non',
  submit: 'Envoyer',
  cancel: 'Annuler',
  required: 'Veuillez renseigner ce champ',
  unmodified: 'Auncun changement dans le formulaire',
  // CalendarField
  calendar: {
    dateFormat: 'dd/MM/yyyy',
    datePattern: /^([0-2][0-9]|30|31)\/(0[0-9]|10|11|12)\/[0-9]{4}$/,
    dateError: 'La date doit être au format jj/mm/aaaa',
    locale: 'fr',
  },
  file: {
    rejected: 'Veuillez sélectionner un fichier valide.',
    rejectedMultiple: 'Certains de vos fichiers ne sont pas valides.',
    noFile: 'Aucun fichier',
  },
  tel: {
    pattern: /^(?:0|\(?\+33\)?\s?|0033\s?)[1-79](?:[.\-\s]?\d\d){4}$/,
  },
  html: {
    placeholder: 'Entrez votre texte ici…',
  },
  passwordStrength: {
    tooshort: 'trop court',
    tooweak: 'très peu sécurisé',
    weak: 'peu sécurisé',
    average: 'passable',
    strong: 'sécurisé',
    stronger: 'très sécurisé',
    error: 'Veuillez entrer un mot de passe plus sécurisé.',
  },
  money: {
    unit: '€',
    precision: 2,
  },
  selectMenu: {
    noOptions: () => 'Aucun résultat',
    loading: () => 'Chargement',
    select: 'Sélectionner…',
  },
}
