export const ConfirmationWindow = (props: {
  hidden?: boolean;
  content: string;
}) => {
  const { hidden = true, content } = props;
  return (
    <div
      id="confirmation-background"
      className={`${
        hidden ? "hidden" : ""
      } absolute z-50 bg-slate-900/50 top-0 left-0 w-screen h-screen flex justify-center items-center`}
    >
      <div
        id="confirmation-box"
        className="bg-white p-6 rounded-lg text-slate-900"
      >
        <p id="confirmation-message" className="mb-4 text-lg">
          {content}
        </p>
        <form className="flex justify-center gap-4">
          <button
            type="submit"
            className="text-white end-2.5 bottom-2.5 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
            Eliminar
          </button>
          <button
            type="submit"
            className="text-white end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmationWindow;
