import { OperationResultsEnum } from "src/utils/enums/general/OperationResultsEnum";

export interface IProcess {
  result: OperationResultsEnum;
  message: string;
  priority?: number;
  closeCb?: () => void;
}
