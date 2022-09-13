import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import cx from "classnames";
import { useState } from "react";

interface AutocompleteOption {
  label: string;
  value: string;
}

interface AutocompleteProps {
  options: AutocompleteOption[];
  name: string;
  label: string;
}

function AutoComplete({ options, name, label }: AutocompleteProps) {
  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState();

  const filteredPeople =
    query === ""
      ? options
      : options.filter((option) => {
          return option.label.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox as="div" value={selectedPerson} onChange={setSelectedPerson}>
      <Combobox.Label className="block dark:text-white/80 text-sm font-medium text-gray-700">
        {label}
      </Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          name={name}
          className="w-full rounded-md border border-gray-900 py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm bg-[#30363d]"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(option: AutocompleteOption) => option?.label}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredPeople.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredPeople.map((person) => (
              <Combobox.Option
                key={person.value}
                value={person}
                className={({ active }) =>
                  cx(
                    "relative cursor-default select-none py-2 pl-8 pr-4",
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={cx(
                        "block truncate",
                        selected && "font-semibold"
                      )}
                    >
                      {person.label}
                    </span>

                    {selected && (
                      <span
                        className={cx(
                          "absolute inset-y-0 left-0 flex items-center pl-1.5",
                          active ? "text-white" : "text-indigo-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
export default AutoComplete;
