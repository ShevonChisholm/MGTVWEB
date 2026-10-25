import { useId, useState } from "react";
import { Input } from "@/components/ui/Input";

export function PasswordField({
  label,
  hint,
  ...props
}: React.ComponentProps<typeof Input> & { label: string; hint?: string }) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <div className="relative mt-2">
        <Input
          {...props}
          id={id}
          type={visible ? "text" : "password"}
          className="w-full pr-20"
          aria-describedby={hint ? id + "-hint" : undefined}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 rounded-r-lg px-4 text-xs font-medium text-gold focus-visible:outline-2 focus-visible:outline-gold"
          aria-label={(visible ? "Hide " : "Show ") + label.toLowerCase()}
          aria-pressed={visible}
          onClick={() => setVisible(!visible)}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {hint && (
        <p
          id={id + "-hint"}
          className="mt-2 text-xs leading-relaxed text-text-secondary"
        >
          {hint}
        </p>
      )}
    </div>
  );
}
