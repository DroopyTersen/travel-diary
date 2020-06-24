import React, { useState, useEffect } from "react";
import slugify from "slugify";

export function TagsInput({ onChange, initialTags = [] }) {
  let [value, setValue] = useState(initialTags.join(", "));

  useEffect(() => {
    let tags = value
      .replace(/, /g, ",")
      .replace(/ /g, ",")
      .split(",")
      .map((tag) => slugify(tag.trim().toLowerCase()))
      .filter(Boolean);
    onChange(tags);
  }, [value]);

  return (
    <label>
      Tags
      <input name={name} value={value} onChange={(e) => setValue(e.target.value)} />
    </label>
  );
}

export function TagsDisplay({ tags, ...rest }) {
  return (
    <div className="tags row tight" {...rest}>
      {tags?.map((tag) => (
        <div key={tag} className="badge secondary">
          {tag}
        </div>
      ))}
    </div>
  );
}