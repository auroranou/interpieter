import { type ChangeEvent, useEffect, useRef, useState } from "react";

import css from "components/execution/Input.module.css";
import { useAppState } from "state/context";

export function UserInput() {
  const { hideUserInput, interpreter, userInput } = useAppState();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [val, setVal] = useState("");
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (userInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [userInput]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length < 2) {
      setDisabled(false);
      setVal(val);
    } else {
      setDisabled(true);
    }
  };

  const handleClick = () => {
    if (val && userInput) {
      interpreter.input(val);
    }

    hideUserInput();
    setDisabled(false);
    setVal("");
  };

  return userInput ? (
    <span className={css.inputWrapper}>
      <label>
        <input
          disabled={disabled}
          onChange={handleChange}
          ref={inputRef}
          type="text"
          value={val}
        />
      </label>
      <button disabled={!val} onClick={handleClick}>
        done
      </button>
    </span>
  ) : null;
}
