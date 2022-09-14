import type { Props as SelectProps } from "react-select";
import Select, { components } from "react-select";
import styles from "./styles";

interface Props extends SelectProps {}

const Input = ({ type, ...props }: any) => <components.Input {...props} />;

const MultiSelect = (props: Props) => {
  return (
    <Select
      isMulti
      components={{ Input }}
      styles={styles}
      className="outline-none"
      {...props}
    />
  );
};

export default MultiSelect;
