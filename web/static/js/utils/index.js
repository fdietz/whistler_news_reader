import React from "react";

export function renderErrorsFor(errors, ref) {
  if (!errors) return false;

  return errors.map((error, i) => {
    if (error[ref]) {
      return (
        <div key={i} className="field-errors">
          {error[ref]}
        </div>
      );
    }
  });
}

export function setDocumentTitle(title) {
  document.title = `${title} | WhistlerNewsReader`;
}
