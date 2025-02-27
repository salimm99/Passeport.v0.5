class WizardViewModel {
  public WizardComponent: HTMLElement;
  public Countries = ["Algérie", "Canada", "Autre"];

  public Wilayas = [
    { matricule: "01", name: "Adrar" },
    { matricule: "02", name: "Chlef" },
    { matricule: "03", name: "Laghouat" },
    { matricule: "04", name: "Oum El Bouaghi" },
    { matricule: "05", name: "Batna" },
    { matricule: "06", name: "Béjaïa" },
    { matricule: "07", name: "Biskra" },
    { matricule: "08", name: "Béchar" },
    { matricule: "09", name: "Blida" },
    { matricule: "10", name: "Bouira" },
    { matricule: "11", name: "Tamanrasset" },
    { matricule: "12", name: "Tébessa" },
    { matricule: "13", name: "Tlemcen" },
    { matricule: "14", name: "Tiaret" },
    { matricule: "15", name: "Tizi Ouzou" },
    { matricule: "16", name: "Alger" },
    { matricule: "17", name: "Djelfa" },
    { matricule: "18", name: "Jijel" },
    { matricule: "19", name: "Sétif" },
    { matricule: "20", name: "Saïda" },
    { matricule: "21", name: "Skikda" },
    { matricule: "22", name: "Sidi Bel Abbès" },
    { matricule: "23", name: "Annaba" },
    { matricule: "24", name: "Guelma" },
    { matricule: "25", name: "Constantine" },
    { matricule: "26", name: "Médéa" },
    { matricule: "27", name: "Mostaganem" },
    { matricule: "28", name: "M'Sila" },
    { matricule: "29", name: "Mascara" },
    { matricule: "30", name: "Ouargla" },
    { matricule: "31", name: "Oran" },
    { matricule: "32", name: "El Bayadh" },
    { matricule: "33", name: "Illizi" },
    { matricule: "34", name: "Bordj Bou Arreridj" },
    { matricule: "35", name: "Boumerdès" },
    { matricule: "36", name: "El Tarf" },
    { matricule: "37", name: "Tindouf" },
    { matricule: "38", name: "Tissemsilt" },
    { matricule: "39", name: "El Oued" },
    { matricule: "40", name: "Khenchela" },
    { matricule: "41", name: "Souk Ahras" },
    { matricule: "42", name: "Tipaza" },
    { matricule: "43", name: "Mila" },
    { matricule: "44", name: "Aïn Defla" },
    { matricule: "45", name: "Naâma" },
    { matricule: "46", name: "Aïn Témouchent" },
    { matricule: "47", name: "Ghardaïa" },
    { matricule: "48", name: "Relizane" },
    { matricule: "49", name: "Timimoun" },
    { matricule: "50", name: "Bordj Badji Mokhtar" },
    { matricule: "51", name: "Ouled Djellal" },
    { matricule: "52", name: "Béni Abbès" },
    { matricule: "53", name: "In Salah" },
    { matricule: "54", name: "In Guezzam" },
    { matricule: "55", name: "Touggourt" },
    { matricule: "56", name: "Djanet" },
    { matricule: "57", name: "El M'Ghair" },
    { matricule: "58", name: "El Meniaa" },
  ];

  public Provinces = ["Québec", "Nouveau-Brunswick", "Nouvelle-Écosse", "Île-du-Prince-Édouard", "Terre-Neuve et Labrador"];
  public additionnalPersons: number = 0;
  public additionnalPersonIndex: number = 0;

  constructor(wizardComponent: any) {
    this.WizardComponent = wizardComponent;

    let steps = this.GetViewComponents("data-step");
    $(steps[0]).attr("data-navigation", "next");
    const stepNavigator = new StepNavigation(steps);

    steps.map((step, index) => {
      // add hidden field   let stepName = $(this.steps[stepIndex]).attr("data-step-name")
      let stepName = $(step).attr("data-step-name");
      let hiddenFieldToInject = `<input type="hidden" name="Etape-${index + 1}" value="===== [${stepName}] =====" />`;

      $(step).prepend(hiddenFieldToInject);
      let numberContainer = $(step).find("i.step-number");
      $(numberContainer).text(index + 1);
    });

    const navButtons = $("button[data-nav-btn]");
    navButtons.map((index, btnElement) => {
      new NavigationButtonHandler(stepNavigator).handleButtonClick(btnElement);
    });

    let summaryTriggerBtn = $('[data-step-name="disponibilite-pour-rdv"]').find(".next-button button").first();
    $(summaryTriggerBtn).on("click", () => {
      this.showFinalSummary();
    });

    const countryManager = new CountryManager(this.Countries);
    countryManager.populateCountrySelect($(`[data-source="coutries"]`));

    $(`[data-source="wilayas"]`).map((index, selectItem) => {
      this.Wilayas.map((wilaya, index) => {
        let wilayaText = `${wilaya.matricule} - ${wilaya.name}`;
        let optionToInsert = `<option value="${wilayaText}">${wilayaText}</option>`;
        $(selectItem).append(optionToInsert);
      });
    });

    $(`[data-source="provinces"]`).map((index, selectItem) => {
      this.Provinces.map((province, index) => {
        let optionToInsert = `<option value="${province}">${province}</option>`;
        $(selectItem).append(optionToInsert);
      });
    });

    $("*[required]").map((index, requiredInput) => {
      $(requiredInput).after(`<span class="required-alert "><i class="alert-icon fa fa-star"></i></span>`);
      $(requiredInput).after(`<span class="valid-field-info "><i class="valid-field-icon fa fa-check"></i></span>`);
      $(requiredInput).after(`<span class="error-field-info "><i class="error-field-icon fa fa-times"></i></span>`);
    });

    this.AttachDynamicActions();

    let allActivateFieldOptions = $("select option[data-activate-field]");
    // Reactive options
    $(allActivateFieldOptions).map((index, optionHtmlItem) => {
      let activateTargets: string[] = [];

      let dataAcivatedFieldString = $(optionHtmlItem).attr("data-activate-field") as string;
      if (dataAcivatedFieldString != null) {
        activateTargets = dataAcivatedFieldString
          .split(" ")
          .join("")
          .split(",")
          .filter((field) => {
            return field != null && field.trim().length > 0;
          });
      }

      let parentSelect = $(optionHtmlItem).parents("select").first();
      this.AttachChangeOnActivatedSelect(parentSelect, optionHtmlItem, activateTargets);
    });

    let summaryGenerator = new SummaryGenerator();
    let formManager = new FormManager(summaryGenerator);
    formManager.handleFormSubmission("#appointmentForm", "#summary");

    // Validation
    let inputsDefinition =
      "input[type='text'][data-pattern], textarea[data-pattern], input[type='email'], input[type='date'], select[required], input[type='checkbox'] ";
    this.AttachValidationListeners(inputsDefinition);

    // start
    stepNavigator.showStep(0);

    // Submit button handling
    $("#submit").on("click", () => {
      //let formElement = $("#appointmentForm");
      /*  let numCardField = formElement.find('[name="num_carte_consulaire"]');
      if (numCardField.val()?.toString().trim().toUpperCase().startsWith("CA") == false) {
        numCardField.val(`CA${numCardField.val()}`);
      }
*/
      let formData = $("#appointmentForm")
        .find(".included")
        .serializeArray()
        .filter((item) => {
          return item.value.trim().length > 0 && item.name.trim().toLowerCase() != "disponibilite";
        });
      let selectedDays: any[] = [];
      $("input[name='disponibilite']:checked").each(function () {
        selectedDays.push($(this).val());
      });
      formData.push({ name: "disponibilite", value: selectedDays.join(", ") });

      formData.unshift({ name: "null", value: " " });
      formData.unshift({ name: "null", value: " " });
      formData.unshift({ name: "null", value: " " });
      formData.unshift({ name: "null", value: "___________________________________________________________________________________" });
      formData.unshift({ name: "null", value: "|ATTENTION : Contenu généré automatiquement. Ne pas modifier ce courriel.|" });
      formData.unshift({ name: "null", value: " " });
      formData.unshift({ name: "null", value: "___________________________________________________________________________________" });

      let mailto =
        "mailto:rendezvous.passeport@consulatdz.ca?subject=Demande%20de%20Rendez-vous%20Passeport%20[NE%20PAS%20MODIFIER%20LE%20CONTENU]&body=";

      formData.forEach(function (field) {
        mailto += encodeURIComponent(field.name != "null" ? field.name : "#") + ": " + encodeURIComponent(field.value) + "%0D%0A";
      });

      // Open the mailto link
      let mailtoLink = document.createElement("a");
      mailtoLink.href = mailto;
      mailtoLink.click();
    });

    $(".fold-icon").on("click", (e: JQuery.ClickEvent) => {
      let foldIcon = e.target;
      let parent = $(foldIcon).parents(".accordion").first();
      let isUnfold = $(parent).hasClass("unfold");

      if (isUnfold) {
        $(parent).removeClass("unfold");
      } else {
        $(parent).addClass("unfold");
      }
    });

    // Limiter les champs de type "date"
    let today = new Date().toISOString().split("T")[0];

    $('input[type="date"]')
      .attr("max", today)
      .on("change", (event: any) => {
        if (event.target.value > today) {
          event.target.value = today;
        }
      });
  }

  private AttachChangeOnActivatedSelect(parentSelect: JQuery<HTMLSelectElement>, optionHtmlItem: HTMLElement, activateTargets: string[]) {
    $(parentSelect).on("change", (event: JQuery.ChangeEvent) => {
      let source = event.target;
      let sourceId = $(source).attr("id");
      let selectedValue = $(source).val();

      let optionValue = $(optionHtmlItem).val();

      if (activateTargets != null) {
        activateTargets.map((targetToActivate) => {
          $(`#${targetToActivate}`).hide();

          //let innerInputs = `#${targetToActivate} input, #${targetToActivate} select`;
          // $(innerInputs).off("change blur");
        });

        if (selectedValue === optionValue) {
          activateTargets.map((targetToActivate) => {
            setTimeout(() => {
              $(`#${targetToActivate}`).show();

              let innerInputs = `#${targetToActivate} input, #${targetToActivate} select`;
              $(innerInputs).map((index, innerInput) => {
                var events = ($ as any)._data($(innerInput)[0], "events");

                let hasChange = events && events.change;
                let hasBlur = events && events.blur;

                if (!hasBlur || !hasChange) {
                  this.AttachValidationListeners(innerInputs);
                }
              });

              let parentStep = $(parentSelect).parents("[data-step]");
              StepNavigation.validateStep(parentStep);
            }, 30);
          });
        }
      }
    });
  }

  // Configure generic validation
  public AttachValidationListeners(inputsDefinition: string) {
    $(inputsDefinition).map((index, inputElement) => {
      let input = $(inputElement);
      let pattern = new RegExp(input.attr("data-pattern") as string);
      let errorMessageId = input.attr("id") + "-error";

      input.after('<i id="' + errorMessageId + '" class="hidden text-xs font-bold error-msg">' + input.data("error-message") + "</i>");

      input.on("blur change", (event: JQuery.TriggeredEvent) => {
        let value = $(event.target).val() as string;

        const inputContainer = $(event.target).parents(".input-container").first();
        const requiredAlertIcon = inputContainer.find(".required-alert");
        const validFieldIcon = inputContainer.find(".valid-field-info");
        const errorFieldIcon = inputContainer.find(".error-field-info");

        if (value != null && value.trim() != "") {
          requiredAlertIcon.hide();
        } else {
          requiredAlertIcon.show();
        }

        if (!pattern.test(value) && value.trim().length > 0) {
          $(event.target).addClass("border-red-500");
          $(event.target).addClass("error");
          $("#" + errorMessageId).show();
          validFieldIcon.hide();
          errorFieldIcon.show();
        } else {
          $(event.target).removeClass("border-red-500");
          $(event.target).removeClass("error");
          $("#" + errorMessageId).hide();
          validFieldIcon.show();
          errorFieldIcon.hide();
        }
        let parentStep = $(event.target).parents("[data-step]");
        StepNavigation.validateStep(parentStep);
      });
    });
  }

  private AttachDynamicActions(element = null) {
    let actionElements = $("button[data-action], input[data-action]");

    if (element != null) {
      actionElements = $(element).find("button[data-action], input[data-action]");
    }

    actionElements.map((index, actionBtn) => {
      let actionName = $(actionBtn).attr("data-action");
      let eventName = $(actionBtn).attr("data-event") != null ? ($(actionBtn).attr("data-event") as string) : "click";
      if (actionName != null) {
        $(actionBtn).off(eventName);
        $(actionBtn).on(eventName as any, (event: JQuery.ClickEvent) => {
          (this as any)[actionName](event.target);
        });
      }
    });
  }

  public toggleCanadianConsulates(source: HTMLElement) {
    var isChecked = $(source).prop("checked");
    if (isChecked) {
      $("#emis_par_autre_canada").hide();
      $("#emis_par_autre_canada").val("Montréal");
    } else {
      $("#emis_par_autre_canada").show();
      $("#emis_par_autre_canada").val("");
    }
  }

  public setCardValidityState(source: HTMLElement) {
    var dateString = $(source).val() as string;
    let dateEntered = new Date(dateString);
    let currentDate = new Date();
    let fiveYearsAgo = new Date();
    let firstDateLimit = new Date("1990-01-01");
    fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5);

    if (dateEntered > firstDateLimit) {
      if (dateEntered < fiveYearsAgo) {
        $("#message_imm_invalide").show();
        $("#message_imm_valide").hide();
        $("#validite_carte_consulaire").val("Carte consulaire expirée");
        $("#non_immatricule_confirmation").show();
      } else {
        $("#message_imm_invalide").hide();
        $("#message_imm_valide").show();
        $("#validite_carte_consulaire").val("Carte consulaire valide");
        $("#non_immatricule_confirmation").show();
      }
    } else {
      $("#message_imm_invalide").hide();
      $("#message_imm_valide").hide();
      $("#validite_carte_consulaire").val("");
      $("#non_immatricule_confirmation").hide();
    }
  }

  public setPassportValidityState(source: HTMLElement) {
    var dateString = $(source).val() as string;
    let dateEntered = new Date(dateString);

    let now = new Date();
    let currentDate = new Date();
    let validity_sixmonth = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
    let firstDateLimit = new Date("1990-01-01");

    if (dateEntered > firstDateLimit) {
      if (dateEntered <= currentDate) {
        $("#message_pass_invalide").show();
        $("#message_pass_valide").hide();
        $("#validite_passeport").val("Passeport expiré");
      } else if (dateEntered <= validity_sixmonth) {
        $("#message_pass_invalide").hide();
        $("#message_pass_valide").show();
        $("#validite_passeport").val("Passeport expire dans moins de 6 mois");
      } else {
        $("#message_pass_invalide").hide();
        $("#message_pass_valide").show();
        $("#validite_passeport").val("Passeport est encore valide");
      }
    } else {
      $("#message_pass_invalide").hide();
      $("#message_pass_valide").hide();
      $("#validite_passeport").val("");
    }
  }

  //setBirthDate
  public setBirthDate(source: HTMLElement) {
    let birthDateString = $(source).val() as string;
    let birthDate = new Date(birthDateString);
    let age = this.calculateDaysBetween(birthDate, new Date());

    $("#immatriculation-tuteur").hide();
    $("#immatriculation-requerant").show();

    if (age < 19) {
      $("#immatriculation-tuteur").show();
      $("#immatriculation-requerant").hide();
    }
  }

  public calculateDaysBetween(startDate: Date, endDate: Date) {
    const diffTime = Math.abs(startDate.getTime() - endDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays / 365;
  }

  public personHasSameName(source: HTMLElement) {
    let lastName = $('input[name="nom"]').first().val();

    let ischecked = $(source).is(":checked");
    let parentDiv = $(source).parents(".additional-person").first();
    let personNameInput = $(parentDiv).find("input.lastname").first();
    if (lastName && ischecked) {
      personNameInput.val(lastName);
      personNameInput.attr("disabled", "disabled");
      personNameInput.trigger("change");
    } else {
      personNameInput.removeAttr("disabled");
    }
  }

  public presetProvince(source: HTMLElement) {
    let postalCode = $(source).val() as string;
    if (postalCode != null && postalCode.trim().length > 0) {
      postalCode = postalCode.toUpperCase().trim();

      if (postalCode.indexOf(" ") < 0 && postalCode.indexOf("-") < 0) {
        postalCode = postalCode.slice(0, 3) + "-" + postalCode.slice(3);
        $(source).val(postalCode);
      }

      let province = "";
      if (postalCode.startsWith("H") || postalCode.startsWith("G") || postalCode.startsWith("J")) province = "Québec";
      else if (postalCode.startsWith("B")) province = "Nouvelle-Écosse";
      else if (postalCode.startsWith("A")) province = "Terre-Neuve et Labrador";
      else if (postalCode.startsWith("E")) province = "Nouveau-Brunswick";
      else if (postalCode.startsWith("C")) province = "Île-du-Prince-Édouard";

      let selectProvince = $("#province_residence");
      $(selectProvince).val(province);
      $(selectProvince).trigger("change");
    }
  }

  public formatCamelCase(source: HTMLElement) {
    let valueString = $(source).val() as string;
    let capitalised = valueString[0].toUpperCase() + valueString.slice(1).toLowerCase();
    $(source).val(capitalised);
  }

  public formatPhoneNumber(source: HTMLElement) {
    let valueString = ($(source).val() as string).trim().split("(").join("").split(")").join("");
    valueString = valueString.split("-").join("");
    if (!valueString.startsWith("+1") && !valueString.startsWith("1")) {
      valueString = `+1 ${valueString}`;
      $(source).val(valueString);
    }
  }

  public changePresumedBorn(source: HTMLElement) {
    let isPesumedBorn = $(source).is(":checked");

    if (isPesumedBorn) {
      $("#full-birth-date").hide();
      $("#year-birth-date").show();
    } else {
      $("#full-birth-date").show();
      $("#year-birth-date").hide();
    }
  }

  public addAdditionnalPerson(source: HTMLElement) {
    this.additionnalPersons++;

    let clonedElement = $("#additionnal_person_pattern").clone().removeClass("hidden");
    // Supprimer l'ID pour éviter les doublons
    let id = (clonedElement.attr("id") as string).replace("pattern", `${this.additionnalPersonIndex++}`);
    $(clonedElement).attr("id", id);
    $(clonedElement)
      .find("*[id]")
      .map((index, element) => {
        let id2 = ($(element).attr("id") as string).replace("pattern", `${this.additionnalPersonIndex}`);
        $(element).attr("id", id2);
      });

    $(clonedElement)
      .find("*[id]")
      .map((index, element) => {
        let id2 = ($(element).attr("id") as string).replace("pattern", `${this.additionnalPersonIndex}`);
        $(element).attr("id", id2);

        if ($(element).attr("name") != undefined) {
          let name = ($(element).attr("name") as string).replace("pattern", `${this.additionnalPersonIndex}`);
          $(element).attr("name", name);
        }
      });

    $(clonedElement).removeClass("hidden");

    $("#personnes_supplémentaires").append(clonedElement);

    this.AttachValidationListeners(`#${$(clonedElement).attr("id")} input, #${$(clonedElement).attr("id")} select`);

    $("#nombre_personnes").val(`${this.additionnalPersons}`);

    let parentStep = $("#nombre_personnes").parents("[data-step]");

    $(clonedElement)
      .find(".delete-person")
      .on("click", (event: JQuery.ClickEvent) => {
        event.preventDefault();
        $(clonedElement).remove();
        this.additionnalPersons--;
        $("#nombre_personnes").val(`${this.additionnalPersons}`);
        StepNavigation.validateStep(parentStep);
      });

    this.AttachDynamicActions(clonedElement as any);

    StepNavigation.validateStep(parentStep);
  }

  public showFinalSummary() {
    let summaryContainer = "#summary";
    let summaryHtml = SummaryGenerator.generateSummary().join(" <br/>");

    $(summaryContainer).text("").append(summaryHtml);
  }

  public GetViewComponents(selecter: string): string[] {
    let steps = $(this.WizardComponent)
      .find(`[${selecter}]`) //"data-step"
      .filter((index, stepItem) => {
        let skipped = $(stepItem).attr("data-skipped");
        return skipped == null || skipped.trim().toLowerCase() != "true";
      })
      .map((index, selectedElement) => {
        $(selectedElement).attr(`${selecter}`, index);
        return `[${selecter}="${$(selectedElement).attr(`${selecter}`)}"]`;
      });

    return Array.from(steps);
  }
}

class CountryManager {
  private countries: string[];

  constructor(countries: string[]) {
    this.countries = countries;
  }

  populateCountrySelect(selectors: JQuery<HTMLElement>): void {
    this.countries.forEach((country) => {
      selectors.map((index, selector) => {
        let selectorId = $(selector).attr("id");

        let fieldToActivate = "";
        if (selectorId == "pays_naissance") {
          fieldToActivate = country.toLowerCase() === "algérie" ? "lieu_naissance_algerie" : "lieu_naissance_etranger";
        } else if (selectorId == "pays_emission") {
          if (country.toLowerCase() === "algérie") {
            fieldToActivate = "pass-emis-algerie";
          } else if (country.toLowerCase() === "canada") {
            fieldToActivate = "pass-emis-canada";
          } else {
            fieldToActivate = "pass-emis-etranger";
          }
        }

        let option = $("<option>").attr("data-activate-field", fieldToActivate).text(country).val(country);
        $(selector).append(option);
        // $(selector).append($("<option>", { value: country, text: country }));
      });
    });
  }
}

class SummaryGenerator {
  static generateSummary(): string[] {
    let formElement = $("#appointmentForm");
    /*  let numCardField = formElement.find('[name="num_carte_consulaire"]');
    if (numCardField.val()?.toString().trim().toUpperCase().startsWith("CA") == false) {
      numCardField.val(`CA${numCardField.val()}`);
    }
*/
    let formData = $("#appointmentForm")
      .find(".included")
      .serializeArray()
      .filter((item) => {
        return item.value.trim().length > 0 && item.name.trim().toLowerCase() != "disponibilite";
      });
    let selectedDays: any[] = [];
    $("input[name='disponibilite']:checked").each(function () {
      selectedDays.push($(this).val());
    });
    formData.push({ name: "disponibilite", value: selectedDays.join(", ") });

    let formattedSummary = formData.map((summaryItem) => {
      return `<strong> ${summaryItem.name.toUpperCase()} :</strong> ${summaryItem.value}`;
    });
    return formattedSummary;
    // return formattedSummary.join(" <br/>");
  }
}

class FormManager {
  private summaryGenerator: SummaryGenerator;

  constructor(summaryGenerator: SummaryGenerator) {
    this.summaryGenerator = summaryGenerator;
  }

  handleFormSubmission(formId: string, summaryContainer: string): void {
    $(formId).submit((event) => {
      event.preventDefault();
      const summaryHtml = SummaryGenerator.generateSummary().join(" <br/>");
      $(summaryContainer).html(summaryHtml);
    });
  }
}

interface IStepNavigator {
  showStep(stepIndex: number): void;
  navigateTo(stepIndex: number): void;
}

class StepNavigation implements IStepNavigator {
  private steps: string[];

  private stepsValidation: boolean[];

  constructor(steps: string[]) {
    this.steps = steps;
    this.stepsValidation = [];
    this.steps.map((stepSelecter, index) => {
      this.stepsValidation[index] = false;
    });

    this.appendNavigationButtons();
  }

  public static validateStep(step: JQuery<HTMLElement>) {
    if (step) {
      let actionName = $(step).attr("data-step-validation");
      let args = $(step).attr("data-validate-args") as string;
      let stepIsValid = true;
      if (actionName != null && actionName.trim().length > 0) {
        let param = args != null ? parseInt(args) : 0;
        stepIsValid = (this as any)[actionName](param);
      }

      let allInputs = $(step).find("input, select");
      let visibleStepInputs = allInputs.filter((index, input) => {
        return $(input).is(":visible") == true;
      });

      let fieldsInError = visibleStepInputs.filter((index, visibleInput) => {
        return $(visibleInput).hasClass("error");
      });
      let allRequiredFields = visibleStepInputs.filter((index, visibleInput) => {
        return $(visibleInput).attr("required") != null;
      });

      let requiredFieelds = allRequiredFields.filter((index, requiredElement) => {
        let reqElementValue = $(requiredElement).val();
        return reqElementValue == null || reqElementValue == "" || (reqElementValue as string).trim() == "";
      });

      if (fieldsInError.length > 0 || requiredFieelds.length > 0 || stepIsValid == false) {
        $(step).find(".next-button").addClass("disabled");
      } else {
        $(step).find(".next-button").removeClass("disabled");
      }
    }
  }

  private appendNavigationButtons() {
    let buttonsPattern = "div[nav-buttons-pattern]";

    this.steps.map((stepSelecter, index) => {
      let clonedButtons = $(buttonsPattern).clone().removeAttr("nav-buttons-pattern");
      $(clonedButtons).removeClass("hidden");

      let stepBtnType = $(stepSelecter).attr("data-navigation");
      if (stepBtnType != null) {
        $(stepSelecter).append(clonedButtons);

        if (stepBtnType.trim() == "next") {
          $(stepSelecter).find(".previous-button").remove();
          $(stepSelecter).find(".submit-button").remove();
        } else if (stepBtnType.trim() == "previous") {
          $(stepSelecter).find(".next-button").remove();
          $(stepSelecter).find(".submit-button").remove();
        } else if (stepBtnType.trim() == "submit") {
          $(stepSelecter).find(".next-button").remove();
        } else if (stepBtnType.trim() == "full") {
          $(stepSelecter).find(".submit-button").remove();
        }
      }
    });
  }

  public showStep(stepIndex: number): void {
    $("*[data-step]").hide();

    let stepName = $(this.steps[stepIndex]).attr("data-step-name");
    $(this.steps[stepIndex]).show(80);
    setTimeout(() => {
      StepNavigation.validateStep($(this.steps[stepIndex]));
    }, 800);
  }

  public navigateTo(stepIndex: number): void {
    this.showStep(stepIndex);
  }

  public static checkSelectedDays(minNumberOfDays: number) {
    let selectedDays = [];
    $("input[name='disponibilite']:checked").each(function () {
      selectedDays.push($(this).val());
    });

    return selectedDays.length >= minNumberOfDays;
  }

  public static checkImatriculationSituation(): boolean {
    let firstDiv = $("#non_immatricule_info_hors_montreal");
    let secondDiv = $("#non_immatricule_confirmation");

    let nonImmatriculeHorsMontreal = firstDiv.is(":visible");
    let nonImmatriculeDeMontreal = secondDiv.is(":visible");
    if (nonImmatriculeHorsMontreal || nonImmatriculeDeMontreal) {
      $("#end-process").show();
      $(firstDiv).parents("[data-step]").first().find(".navigation-buttons").hide();
      return false;
    } else {
      $("#end-process").hide();
      $(firstDiv).parents("[data-step]").first().find(".navigation-buttons").show();
    }
    return true;
  }
}

abstract class ButtonHandlerBase {
  public stepNavigator: IStepNavigator;

  constructor(stepNavigator: IStepNavigator) {
    this.stepNavigator = stepNavigator;
  }

  abstract handleButtonClick(btnElement: HTMLElement, attributeName?: string): void;
}

class NavigationButtonHandler extends ButtonHandlerBase {
  handleButtonClick(btnElement: HTMLElement, attributeName: string = "data-nav-btn"): void {
    $(btnElement).on("click", (event: JQuery.ClickEvent) => {
      let btnElement = event.target;

      let parent = $(btnElement).parents(".nav-button").first();

      let isNextBtn = $(btnElement).parents(".next-button").length != 0;
      let isPreviousBtn = $(btnElement).parents(".previous-button").length != 0;
      let currentStep = parseInt($(btnElement).parents("[data-step]").first().attr("data-step") as string);

      let navigationTarget = isPreviousBtn ? currentStep - 1 : currentStep + 1;

      if (parent.hasClass("disabled") == false) {
        // mark all Visible-Fields
        let step = $(btnElement).parents("*[data-step]").first();
        let visibleFields = $(step).find('input:visible, select:visible, textarea:visible, input[type="hidden"]');
        let hiddenFields = $(step).find("input:hidden, select:hidden, textarea:hidden");

        hiddenFields.removeClass("included");
        visibleFields.addClass("included");

        this.stepNavigator.navigateTo(navigationTarget);
      }
    });
  }
}
