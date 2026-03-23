"use client";

import { useState } from "react";

type DeleteNoteFormProps = {
  slug: string;
};

export default function DeleteNoteForm({ slug }: DeleteNoteFormProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <form
      action={`/admin/delete/${slug}`}
      method="post"
      onSubmit={(event) => {
        if (
          !window.confirm("Delete this note? This action cannot be undone.")
        ) {
          event.preventDefault();
          return;
        }

        setIsDeleting(true);
      }}
    >
      <button
        type="submit"
        className="nav-link admin-delete-button"
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </form>
  );
}
