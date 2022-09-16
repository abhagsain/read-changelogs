import type { Props as SelectProps } from "react-select";
import Select, { components } from "react-select";
import styles from "./styles";
import { ClientOnly } from "remix-utils";

interface Props extends SelectProps {}

const Input = ({ type, ...props }: any) => <components.Input {...props} />;

const MultiSelect = (props: Props) => {
  return (
    <ClientOnly
      fallback={
        <div className="w-40 h-12 rounded bg-secondary animate-pulse" />
      }
    >
      {() => (
        <Select
          isMulti
          components={{ Input }}
          styles={styles}
          className="outline-none"
          {...props}
        />
      )}
    </ClientOnly>
  );
};

export default MultiSelect;
