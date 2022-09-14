const Label = ({
  children,
  htmlFor,
  ...args
}: {
  children: string;
  htmlFor: string;
}) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-gray-700 dark:text-white/95"
    {...args}
  >
    {children}
  </label>
);

export default Label;
