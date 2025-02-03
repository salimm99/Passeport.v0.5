//import { WizardViewModel } from "./wizardVM.js";

// Root ViewModel-Launcher - From Salim-Mouhoubi
$(() => {
  let allWizards = $('*[data-component="smart-wizard"]');
  allWizards.map((index, singleWiz) => {
    new WizardViewModel(singleWiz);
  });
});
