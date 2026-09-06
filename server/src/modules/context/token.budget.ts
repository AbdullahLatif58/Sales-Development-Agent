import { TokenBudgetConfig } from "./context.types.js";

export class TokenBudget {
   constructor(private readonly config: TokenBudgetConfig){}

   getAvaialableTokens(): number {
      return  (
         this.config.modelLimit -
         this.config.maxOutputTokens -
         this.config.safetyMargin
   );
   }

   canFit(inputToken: number): boolean {
      return  inputToken <= this.getAvaialableTokens();
   }
   
}