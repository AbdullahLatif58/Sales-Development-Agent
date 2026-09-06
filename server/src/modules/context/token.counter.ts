import { Tokenizer } from "@huggingface/tokenizers";

import { ContextMessage } from "./context.types.js";

export class TokenCounter {
   constructor ( private readonly tokenizer: Tokenizer  ){}

   countText(text: string) {
     const encoded  = this.tokenizer.encode(text);
      return encoded.ids.length;
   }
   
   countMessage(message: ContextMessage) {
     return  this.countText(message.content);
   }

   countMessages(messages: ContextMessage[]) {
      return messages.reduce((total, message)=> total + this.countMessage(message), 0 );
   }

}
