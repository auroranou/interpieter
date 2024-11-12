import css from "components/layout/Footer.module.css";

export function Footer() {
  return (
    <footer>
      <span>
        made with ❤️ at the{" "}
        <a href="https://www.recurse.com/">recurse center</a>{" "}
      </span>
      <span className={css.separator}>|</span>{" "}
      <span>
        view on <a href="https://github.com/auroranou/interpieter">github</a>
      </span>
    </footer>
  );
}
