import { IStepNavigator } from "./IStepNavigator.js";

export abstract class ButtonHandlerBase {
  public stepNavigator: IStepNavigator;

  constructor(stepNavigator: IStepNavigator) {
    this.stepNavigator = stepNavigator;
  }

  abstract handleButtonClick(buttonId: string, stepIndex: number): void;
}
