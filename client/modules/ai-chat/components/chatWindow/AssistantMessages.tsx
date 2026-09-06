import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

type Props = {
  message: string;
  isThinking?: boolean;
};

export default function AssistantMessage({
  message,
  isThinking = false,
}: Props) {
  return (
    <div className="mb-8 flex items-start gap-3 sm:gap-4">
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-blue-600
        "
      >
        <Bot size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="mb-2 text-sm font-semibold text-zinc-300">
          AI SDR
        </p>

        <div
          className="
            w-fit
            max-w-full
            rounded-2xl
            rounded-tl-md
            border
            border-zinc-700
            bg-zinc-800
            px-5
            py-4
            text-sm
            leading-7
            text-zinc-100
            shadow-sm
            sm:max-w-[90%]
            md:max-w-[80%]
            lg:max-w-[75%]
            xl:max-w-[70%]
            2xl:max-w-[65%]
          "
        >
          {isThinking ? (

            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
            </div>
          ) : (
           <div className="prose prose-invert max-w-none">

              <ReactMarkdown remarkPlugins={[remarkGfm]}>

                {message}

              </ReactMarkdown>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}


