import React from "react";
import { PageTitle, TagsInput } from "core/components";
import { useFormStateMachine } from "core/hooks/useForm";
import { Footer } from "global/components";

export function TripForm({ values, save }: TripFormProps) {
  let form = useFormStateMachine<TripFormValues>({
    values,
    validate: validateTrip,
    submit: save,
  });

  return (
    <>
      <PageTitle>{values.id ? "Edit Trip" : "New Trip"}</PageTitle>
      <form onSubmit={form.onSubmit}>
        <label htmlFor="title">
          Trip Title
          <textarea rows={2} {...form.getInputProps("title")} autoComplete="off" required />
        </label>
        <div className="row">
          <label htmlFor="start">
            Start Date
            <input {...form.getInputProps("start")} type="date" required />
          </label>

          <label htmlFor="end">
            End Date
            <input {...form.getInputProps("end")} type="date" required autoComplete="off" />
          </label>
        </div>
        <label htmlFor="destination">
          Primary Destination
          <textarea rows={3} {...form.getInputProps("destination")} />
        </label>
        <TagsInput
          name="tags"
          initialTags={form.values.tags}
          onChange={(value) => form.actions.updateField({ field: "tags", value })}
        />
      </form>
      <Footer>
        <button type="button" onClick={() => window.history.back()}>
          Cancel
        </button>
        <button
          type="button"
          className="gold"
          onClick={form.onSubmit}
          disabled={form.status !== "VALID"}
        >
          Save
        </button>
      </Footer>
    </>
  );
}
export interface TripFormValues {
  id?: Number;
  title: string;
  start: string;
  end: string;
  destination?: string;
  tags: string[];
}

interface TripFormProps {
  values: TripFormValues;
  save: (values: TripFormValues) => Promise<any>;
}

export const validateTrip = (values: TripFormValues) => {
  const errors = [];
  if (!values.title) {
    errors.push("Title is required");
  }
  if (!values.start) {
    errors.push("Start date is required");
  }
  if (!values.end) {
    errors.push("End date is required");
  }
  return errors;
};