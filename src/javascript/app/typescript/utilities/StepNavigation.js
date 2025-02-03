export class StepNavigation {
    constructor(steps) {
        this.steps = steps;
    }
    showStep(stepIndex) {
        $(".step").hide();
        $(this.steps[stepIndex]).show();
    }
    navigateTo(stepIndex) {
        this.showStep(stepIndex);
    }
    static GetViewSteps(wizardHtmlComponent) {
        let steps = $(wizardHtmlComponent)
            .find("[data-step]")
            .map((index, stepElement) => {
            return `[data-step="${$(stepElement).attr("data-step")}"]`;
        });
        return Array.from(steps);
    }
}
