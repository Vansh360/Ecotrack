import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function SelectNative({ className, children, ...props }) {
  const options = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === "option"
  );
  const selectedOption = options.find(
    (option) => String(option.props.value) === String(props.value ?? props.defaultValue)
  );

  return (
    <Select
      value={props.value}
      defaultValue={props.defaultValue}
      onValueChange={(value) => props.onChange?.({ target: { value } })}
      disabled={props.disabled}
    >
      <SelectTrigger className={className} id={props.id} aria-label={props["aria-label"]}>
        <SelectValue>{selectedOption?.props.children}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={String(option.props.value)}
            value={String(option.props.value)}
            disabled={option.props.disabled}
          >
            {option.props.children}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { SelectNative };
