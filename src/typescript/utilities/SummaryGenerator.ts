export class SummaryGenerator {
  generateSummary(): string {
    let summaryHtml = "<h3 class='text-lg font-medium'>1. Informations personnelles</h3>";
    summaryHtml += `<p>Nom: ${$("#nom").val()}</p>`;
    summaryHtml += `<p>Prénom: ${$("#prenom").val()}</p>`;
    summaryHtml += `<p>Sexe: ${$("#sexe").val()}</p>`;
    summaryHtml += `<p>Date de naissance: ${$("#dob").val()}</p>`;
    summaryHtml += `<p>Email: ${$("#email").val()}</p>`;
    summaryHtml += `<p>Adresse: ${$("#adresse").val()}</p>`;

    summaryHtml += "<h3 class='text-lg font-medium'>2. Lieu de naissance</h3>";
    summaryHtml += `<p>Pays de naissance: ${$("#pays_naissance").val()}</p>`;
    if ($("#pays_naissance").val() === "Algérie") {
      summaryHtml += `<p>Commune: ${$("#commune").val()}</p>`;
      summaryHtml += `<p>Wilaya: ${$("#wilaya").val()}</p>`;
    } else {
      summaryHtml += `<p>Consulat de transc.: ${$("#consulat").val()}</p>`;
    }
    summaryHtml += `<p>Situation familiale: ${$("#situation_familiale").val()}</p>`;

    summaryHtml += "<h3 class='text-lg font-medium'>3. Situation actuelle</h3>";
    summaryHtml += `<p>Situation actuelle au Canada: ${$("#situation_canada").val()}</p>`;
    summaryHtml += `<p>Situation professionnelle: ${$("#situation_professionnelle").val()}</p>`;

    summaryHtml += "<h3 class='text-lg font-medium'>4. Situation vis-à-vis du consulat</h3>";
    summaryHtml += `<p>Déjà immatriculé ? ${$("#immatricule").val()}</p>`;
    if ($("#immatricule").val() === "oui") {
      summaryHtml += `<p>Numéro de carte consulaire: ${$("#num_carte").val()}</p>`;
      summaryHtml += `<p>Date d'émission: ${$("#date_emission").val()}</p>`;
      summaryHtml += `<p>Année de première immatriculation: ${$("#annee_premiere_immatriculation").val()}</p>`;
    } else {
      summaryHtml += "<p>Vous devez prendre rendez-vous pour une première immatriculation au consulat.</p>";
    }

    summaryHtml += "<h3 class='text-lg font-medium'>5. Renseignement sur le passeport</h3>";
    summaryHtml += `<p>Première demande ? ${$("#premiere_demande").val()}</p>`;
    if ($("#premiere_demande").val() === "non") {
      summaryHtml += `<p>Numéro de passeport: ${$("#num_passeport").val()}</p>`;
      summaryHtml += `<p>Date d'émission: ${$("#date_emission_passeport").val()}</p>`;
      summaryHtml += `<p>Pays d'émission: ${$("#pays_emission").val()}</p>`;
      summaryHtml += `<p>Émis par: ${$("#emis_par").val()}</p>`;
    }

    summaryHtml += "<h3 class='text-lg font-medium'>6. Jours préférentiels pour le rendez-vous</h3>";
    const selectedDays: string[] = [];
    $("input[name='disponibilite']:checked").each(function () {
      selectedDays.push($(this).val() as string);
    });
    summaryHtml += `<p>Jours sélectionnés: ${selectedDays.join(", ")}</p>`;

    return summaryHtml;
  }
}
