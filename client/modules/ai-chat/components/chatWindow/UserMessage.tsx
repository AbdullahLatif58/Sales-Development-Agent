type Props = {
  message: string;
};

export default function UserMessage({
  message,
}: Props) {
  return (
    <div className="mb-8 flex justify-end">
      <div
        className="
          w-fit
          max-w-full
          rounded-2xl
          rounded-tr-md
          bg-blue-600
          px-5
          py-4
          text-sm
          leading-7
          text-white
          shadow-sm

          sm:max-w-[90%]
          md:max-w-[80%]
          lg:max-w-[75%]
          xl:max-w-[70%]
          2xl:max-w-[65%]
        "
      >
        {message}
      </div>
    </div>
  );
}