import css from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({
  message = "An error occured while loading data. Please try again later.",
}: ErrorMessageProps) {
  return (
    <div className={css.errorWrapper}>
      <p className={css.text}>{message}</p>
    </div>
  );
}
