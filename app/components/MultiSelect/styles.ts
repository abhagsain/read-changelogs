import type { StylesConfig } from "react-select";

const secondary = "#30363d";
const highlighted = "#1d242b";
const optionColor = "#171B21";
const menuBackground = "#22262C";
const borderColor = "#31363C"
const hoverBorderColor = "#252525"
const indicatorSeparator = "#3c434c"

const styles: StylesConfig = {
  input: (provided) => {
    return {
      ...provided,
      backgroundColor: secondary,
      color: "rgba(255, 255, 255, 0.8)",
    };
  },
  option: (provided, state) => {
    return {
      ...provided,
      backgroundColor:
        state.isFocused || state.isSelected ? highlighted : optionColor,
      color: "rgba(255, 255, 255, 0.8)",
      "&:hover": {
        backgroundColor: "#20242B",
      },
    };
  },
  valueContainer: (provided) => {
    return {
      ...provided,
      backgroundColor: secondary,
      borderColor: borderColor,
      borderTopLeftRadius: "3px",
      borderBottomLeftRadius: "3px",
    };
  },
  multiValue: (provided) => {
    return {
      ...provided,
      backgroundColor: highlighted,
    };
  },
  multiValueRemove: (provided) => {
    return {
      ...provided,
      "&:hover": {
        background: highlighted,
      },
    };
  },
  clearIndicator: (provided) => {
    return {
      ...provided,
      "&:hover": {
        color: "rgba(255, 255, 255, 0.4)",
      },
    };
  },
  multiValueLabel: (provided) => {
    return {
      ...provided,
      color: "rgba(255, 255, 255, 0.8)",
    };
  },
  dropdownIndicator: (provided) => {
    return {
      ...provided,
      backgroundColor: secondary,
      borderColor: secondary,
      "&:hover": {
        color: "rgba(255, 255, 255, 0.4)",
      },
    };
  },
  menuList: (provided) => {
    return {
      ...provided,
      backgroundColor: menuBackground,
    };
  },
  indicatorsContainer: (provided) => {
    return {
      ...provided,
      borderColor: secondary,
      backgroundColor: secondary,
    };
  },
  indicatorSeparator: (provided) => {
    return {
      ...provided,
      backgroundColor: indicatorSeparator,
    };
  },
  control: (provided) => {
    return {
      ...provided,
      backgroundColor: menuBackground,
      borderColor: borderColor,
      "&:hover": {
        borderColor: hoverBorderColor,
      },
    };
  },
};

export default styles;
