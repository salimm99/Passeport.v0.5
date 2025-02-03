import { IStepNavigator } from "../_primitives/IStepNavigator.js";

export class StepNavigation implements IStepNavigator {
  private steps: string[];

  constructor(steps: string[]) {
    this.steps = steps;
  }

  showStep(stepIndex: number): void {
    $(".step").hide();
    $(this.steps[stepIndex]).show();
  }

  navigateTo(stepIndex: number): void {
    this.showStep(stepIndex);
  }

  public static GetViewSteps(wizardHtmlComponent: HTMLElement): string[] {
    let steps = $(wizardHtmlComponent)
      .find("[data-step]")
      .map((index, stepElement) => {
        return `[data-step="${$(stepElement).attr("data-step")}"]`;
      });

    return Array.from(steps);
  }
}
