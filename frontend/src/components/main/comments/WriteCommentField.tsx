
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

interface Props {
    className?: string
}

export default function WriteCommentField({ className }: Props) {
  return (
    <Field className={className}>
      <FieldDescription>Enter your comment.</FieldDescription>
      <Textarea id="textarea-message" placeholder="Type your message here." />
    </Field>
  )
}
