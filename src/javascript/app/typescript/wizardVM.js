"use strict";
class WizardViewModel {
    constructor(wizardComponent) {
        this.Countries = ["Algérie", "Canada", "Autre"];
        this.Wilayas = [
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
        this.Provinces = ["Québec", "Nouveau-Brunswick", "Nouvelle-Écosse", "Île-du-Prince-Édouard", "Terre-Neuve et Labrador"];
        this.additionnalPersons = 0;
        this.additionnalPersonIndex = 0;
        this.WizardComponent = wizardComponent;
        let steps = this.GetViewComponents("data-step");
        $(steps[0]).attr("data-navigation", "next");
        const stepNavigator = new StepNavigation(steps);
        steps.map((step, index) => {
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
            let activateTargets = [];
            let dataAcivatedFieldString = $(optionHtmlItem).attr("data-activate-field");
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
        let inputsDefinition = "input[type='text'][data-pattern], textarea[data-pattern], input[type='email'], input[type='date'], select[required], input[type='checkbox'] ";
        this.AttachValidationListeners(inputsDefinition);
        // start
        stepNavigator.showStep(0);
        // Submit button handling
        $("#submit").on("click", () => {
            let formData = $("#appointmentForm")
                .serializeArray()
                .filter((item) => {
                return item.value.trim().length > 0 && item.name.trim().toLowerCase() != "disponibilite";
            });
            let selectedDays = [];
            $("input[name='disponibilite']:checked").each(function () {
                selectedDays.push($(this).val());
            });
            formData.push({ name: "disponibilite", value: selectedDays.join(", ") });
            let mailto = "mailto:rendezvous.passeport@consulatdz.ca?subject=Demande%20de%20Rendez-vous%20Passeport&body=";
            formData.forEach(function (field) {
                mailto += encodeURIComponent(field.name) + ": " + encodeURIComponent(field.value) + "%0D%0A";
            });
            // Open the mailto link
            window.location.href = mailto;
            setTimeout(() => { }, 2000);
        });
        $(".fold-icon").on("click", (e) => {
            let foldIcon = e.target;
            let parent = $(foldIcon).parents(".accordion").first();
            let isUnfold = $(parent).hasClass("unfold");
            if (isUnfold) {
                $(parent).removeClass("unfold");
            }
            else {
                $(parent).addClass("unfold");
            }
        });
    }
    AttachChangeOnActivatedSelect(parentSelect, optionHtmlItem, activateTargets) {
        $(parentSelect).on("change", (event) => {
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
                                var events = $._data($(innerInput)[0], "events");
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
    AttachValidationListeners(inputsDefinition) {
        $(inputsDefinition).map((index, inputElement) => {
            let input = $(inputElement);
            let pattern = new RegExp(input.attr("data-pattern"));
            let errorMessageId = input.attr("id") + "-error";
            input.after('<i id="' + errorMessageId + '" class="hidden text-xs font-bold error-msg">' + input.data("error-message") + "</i>");
            input.on("blur change", (event) => {
                let value = $(event.target).val();
                const inputContainer = $(event.target).parents(".input-container").first();
                const requiredAlertIcon = inputContainer.find(".required-alert");
                const validFieldIcon = inputContainer.find(".valid-field-info");
                const errorFieldIcon = inputContainer.find(".error-field-info");
                if (value != null && value.trim() != "") {
                    requiredAlertIcon.hide();
                }
                else {
                    requiredAlertIcon.show();
                }
                if (!pattern.test(value) && value.trim().length > 0) {
                    $(event.target).addClass("border-red-500");
                    $(event.target).addClass("error");
                    $("#" + errorMessageId).show();
                    validFieldIcon.hide();
                    errorFieldIcon.show();
                }
                else {
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
    AttachDynamicActions(element = null) {
        let actionElements = $("button[data-action], input[data-action]");
        if (element != null) {
            actionElements = $(element).find("button[data-action], input[data-action]");
        }
        actionElements.map((index, actionBtn) => {
            let actionName = $(actionBtn).attr("data-action");
            let eventName = $(actionBtn).attr("data-event") != null ? $(actionBtn).attr("data-event") : "click";
            if (actionName != null) {
                $(actionBtn).off(eventName);
                $(actionBtn).on(eventName, (event) => {
                    this[actionName](event.target);
                });
            }
        });
    }
    toggleCanadianConsulates(source) {
        var isChecked = $(source).prop("checked");
        if (isChecked) {
            $("#emis_par_autre_canada").hide();
            $("#emis_par_autre_canada").val("Montréal");
        }
        else {
            $("#emis_par_autre_canada").show();
            $("#emis_par_autre_canada").val("");
        }
    }
    setCardValidityState(source) {
        var dateString = $(source).val();
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
            }
            else {
                $("#message_imm_invalide").hide();
                $("#message_imm_valide").show();
                $("#validite_carte_consulaire").val("Carte consulaire valide");
                $("#non_immatricule_confirmation").show();
            }
        }
        else {
            $("#message_imm_invalide").hide();
            $("#message_imm_valide").hide();
            $("#validite_carte_consulaire").val("");
            $("#non_immatricule_confirmation").hide();
        }
    }
    setPassportValidityState(source) {
        var dateString = $(source).val();
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
            }
            else if (dateEntered <= validity_sixmonth) {
                $("#message_pass_invalide").hide();
                $("#message_pass_valide").show();
                $("#validite_passeport").val("Passeport expire dans moins de 6 mois");
            }
            else {
                $("#message_pass_invalide").hide();
                $("#message_pass_valide").show();
                $("#validite_passeport").val("Passeport est encore valide");
            }
        }
        else {
            $("#message_pass_invalide").hide();
            $("#message_pass_valide").hide();
            $("#validite_passeport").val("");
        }
    }
    //setBirthDate
    setBirthDate(source) {
        let birthDateString = $(source).val();
        let birthDate = new Date(birthDateString);
        let age = this.calculateDaysBetween(birthDate, new Date());
        $("#immatriculation-tuteur").hide();
        $("#immatriculation-requerant").show();
        if (age < 19) {
            $("#immatriculation-tuteur").show();
            $("#immatriculation-requerant").hide();
        }
    }
    calculateDaysBetween(startDate, endDate) {
        const diffTime = Math.abs(startDate.getTime() - endDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays / 365;
    }
    personHasSameName(source) {
        let lastName = $('input[name="nom"]').first().val();
        let ischecked = $(source).is(":checked");
        let parentDiv = $(source).parents(".additional-person").first();
        let personNameInput = $(parentDiv).find("input.lastname").first();
        if (lastName && ischecked) {
            personNameInput.val(lastName);
            personNameInput.attr("disabled", "disabled");
            personNameInput.trigger("change");
        }
        else {
            personNameInput.removeAttr("disabled");
        }
    }
    presetProvince(source) {
        let postalCode = $(source).val();
        if (postalCode != null && postalCode.trim().length > 0) {
            postalCode = postalCode.toUpperCase().trim();
            let province = "";
            if (postalCode.startsWith("H") || postalCode.startsWith("G") || postalCode.startsWith("J"))
                province = "Québec";
            else if (postalCode.startsWith("B"))
                province = "Nouvelle-Écosse";
            else if (postalCode.startsWith("A"))
                province = "Terre-Neuve et Labrador";
            else if (postalCode.startsWith("E"))
                province = "Nouveau-Brunswick";
            else if (postalCode.startsWith("C"))
                province = "Île-du-Prince-Édouard";
            let selectProvince = $("#province_residence");
            $(selectProvince).val(province);
            $(selectProvince).trigger("change");
        }
    }
    changePresumedBorn(source) {
        let isPesumedBorn = $(source).is(":checked");
        if (isPesumedBorn) {
            $("#full-birth-date").hide();
            $("#year-birth-date").show();
        }
        else {
            $("#full-birth-date").show();
            $("#year-birth-date").hide();
        }
    }
    addAdditionnalPerson(source) {
        this.additionnalPersons++;
        let clonedElement = $("#additionnal_person_pattern").clone().removeClass("hidden");
        // Supprimer l'ID pour éviter les doublons
        let id = clonedElement.attr("id").replace("pattern", `${this.additionnalPersonIndex++}`);
        $(clonedElement).attr("id", id);
        $(clonedElement)
            .find("*[id]")
            .map((index, element) => {
            let id2 = $(element).attr("id").replace("pattern", `${this.additionnalPersonIndex}`);
            $(element).attr("id", id2);
        });
        $(clonedElement)
            .find("*[id]")
            .map((index, element) => {
            let id2 = $(element).attr("id").replace("pattern", `${this.additionnalPersonIndex}`);
            $(element).attr("id", id2);
            if ($(element).attr("name") != undefined) {
                let name = $(element).attr("name").replace("pattern", `${this.additionnalPersonIndex}`);
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
            .on("click", (event) => {
            event.preventDefault();
            $(clonedElement).remove();
            this.additionnalPersons--;
            $("#nombre_personnes").val(`${this.additionnalPersons}`);
            StepNavigation.validateStep(parentStep);
        });
        this.AttachDynamicActions(clonedElement);
        StepNavigation.validateStep(parentStep);
    }
    showFinalSummary() {
        let summaryContainer = "#summary";
        let summaryHtml = new SummaryGenerator().generateSummary();
        $(summaryContainer).append(summaryHtml);
    }
    GetViewComponents(selecter) {
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
    constructor(countries) {
        this.countries = countries;
    }
    populateCountrySelect(selectors) {
        this.countries.forEach((country) => {
            selectors.map((index, selector) => {
                let selectorId = $(selector).attr("id");
                let fieldToActivate = "";
                if (selectorId == "pays_naissance") {
                    fieldToActivate = country.toLowerCase() === "algérie" ? "lieu_naissance_algerie" : "lieu_naissance_etranger";
                }
                else if (selectorId == "pays_emission") {
                    if (country.toLowerCase() === "algérie") {
                        fieldToActivate = "pass-emis-algerie";
                    }
                    else if (country.toLowerCase() === "canada") {
                        fieldToActivate = "pass-emis-canada";
                    }
                    else {
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
    generateSummary() {
        let formData = $("#appointmentForm")
            .serializeArray()
            .filter((item) => {
            return item.value.trim().length > 0 && item.name.trim().toLowerCase() != "disponibilite";
        });
        let selectedDays = [];
        $("input[name='disponibilite']:checked").each(function () {
            selectedDays.push($(this).val());
        });
        formData.push({ name: "disponibilite", value: selectedDays.join(", ") });
        let formattedSummary = formData.map((summaryItem) => {
            return `<strong> ${summaryItem.name.toUpperCase()} :</strong> ${summaryItem.value}`;
        });
        return formattedSummary.join(" <br/>");
    }
}
class FormManager {
    constructor(summaryGenerator) {
        this.summaryGenerator = summaryGenerator;
    }
    handleFormSubmission(formId, summaryContainer) {
        $(formId).submit((event) => {
            event.preventDefault();
            const summaryHtml = this.summaryGenerator.generateSummary();
            $(summaryContainer).html(summaryHtml);
        });
    }
}
class StepNavigation {
    constructor(steps) {
        this.steps = steps;
        this.stepsValidation = [];
        this.steps.map((stepSelecter, index) => {
            this.stepsValidation[index] = false;
        });
        this.appendNavigationButtons();
    }
    static validateStep(step) {
        if (step) {
            let actionName = $(step).attr("data-step-validation");
            let args = $(step).attr("data-validate-args");
            let stepIsValid = true;
            if (actionName != null && actionName.trim().length > 0) {
                let param = args != null ? parseInt(args) : 0;
                stepIsValid = this[actionName](param);
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
                return reqElementValue == null || reqElementValue == "" || reqElementValue.trim() == "";
            });
            if (fieldsInError.length > 0 || requiredFieelds.length > 0 || stepIsValid == false) {
                $(step).find(".next-button").addClass("disabled");
            }
            else {
                $(step).find(".next-button").removeClass("disabled");
            }
        }
    }
    appendNavigationButtons() {
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
                }
                else if (stepBtnType.trim() == "previous") {
                    $(stepSelecter).find(".next-button").remove();
                    $(stepSelecter).find(".submit-button").remove();
                }
                else if (stepBtnType.trim() == "submit") {
                    $(stepSelecter).find(".next-button").remove();
                }
                else if (stepBtnType.trim() == "full") {
                    $(stepSelecter).find(".submit-button").remove();
                }
            }
        });
    }
    showStep(stepIndex) {
        $("*[data-step]").hide();
        let stepName = $(this.steps[stepIndex]).attr("data-step-name");
        $(this.steps[stepIndex]).show(80);
        setTimeout(() => {
            StepNavigation.validateStep($(this.steps[stepIndex]));
        }, 800);
    }
    navigateTo(stepIndex) {
        this.showStep(stepIndex);
    }
    static checkSelectedDays(minNumberOfDays) {
        let selectedDays = [];
        $("input[name='disponibilite']:checked").each(function () {
            selectedDays.push($(this).val());
        });
        return selectedDays.length >= minNumberOfDays;
    }
    static checkImatriculationSituation() {
        let firstDiv = $("#non_immatricule_info_hors_montreal");
        let secondDiv = $("#non_immatricule_confirmation");
        let nonImmatriculeHorsMontreal = firstDiv.is(":visible");
        let nonImmatriculeDeMontreal = secondDiv.is(":visible");
        if (nonImmatriculeHorsMontreal || nonImmatriculeDeMontreal) {
            $("#end-process").show();
            $(firstDiv).parents("[data-step]").first().find(".navigation-buttons").hide();
            return false;
        }
        else {
            $("#end-process").hide();
            $(firstDiv).parents("[data-step]").first().find(".navigation-buttons").show();
        }
        return true;
    }
}
class ButtonHandlerBase {
    constructor(stepNavigator) {
        this.stepNavigator = stepNavigator;
    }
}
class NavigationButtonHandler extends ButtonHandlerBase {
    handleButtonClick(btnElement, attributeName = "data-nav-btn") {
        $(btnElement).on("click", (event) => {
            let btnElement = event.target;
            let parent = $(btnElement).parents(".nav-button").first();
            let isNextBtn = $(btnElement).parents(".next-button").length != 0;
            let isPreviousBtn = $(btnElement).parents(".previous-button").length != 0;
            let currentStep = parseInt($(btnElement).parents("[data-step]").first().attr("data-step"));
            let navigationTarget = isPreviousBtn ? currentStep - 1 : currentStep + 1;
            if (parent.hasClass("disabled") == false) {
                this.stepNavigator.navigateTo(navigationTarget);
            }
        });
    }
}
