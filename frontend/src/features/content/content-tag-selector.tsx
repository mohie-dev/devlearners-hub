"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/providers/toast-provider";
import { useSubjectTagMutations, useSubjectTags } from "@/hooks/use-subject-tags";

interface ContentTagSelectorProps {
  subjectId: string;
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
}

export function ContentTagSelector({
  subjectId,
  selectedTagIds,
  onChange,
}: ContentTagSelectorProps) {
  const [newTagName, setNewTagName] = useState("");
  const { data: tags, isLoading, isError, error } = useSubjectTags(subjectId);
  const { createTag, isCreatingTag } = useSubjectTagMutations();
  const { success, error: toastError } = useToast();

  const handleCreateTag = async () => {
    const name = newTagName.trim();
    if (!name) {
      toastError("Enter a tag name before adding it.");
      return;
    }

    try {
      const tag = await createTag({ subjectId, dto: { name } });
      onChange([...selectedTagIds, tag.id]);
      setNewTagName("");
      success(`Tag "${tag.name}" created.`);
    } catch (createError: unknown) {
      toastError(
        createError instanceof Error ? createError.message : "Failed to create tag.",
      );
    }
  };

  if (!subjectId) {
    return <p className="text-xs text-[#667085]">Choose a subject to manage its tags.</p>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-[#172033]">Topics / tags</p>
        {selectedTagIds.length > 0 && (
          <span className="text-xs font-medium text-[#193DA0]">
            {selectedTagIds.length} selected
          </span>
        )}
      </div>
      {isLoading ? (
        <p className="text-xs text-[#667085]">Loading subject tags…</p>
      ) : isError ? (
        <p role="alert" className="text-xs text-red-600">
          {(error as Error).message || "Could not load subject tags."}
        </p>
      ) : tags?.length ? (
        <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded-lg border border-[#E6EBF5] bg-white p-2">
          {tags.map((tag) => (
            <label
              key={tag.id}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#DCE5F5] px-3 py-2 text-sm text-[#172033] transition-colors hover:border-[#98A9D3] hover:bg-[#F7F9FE]"
            >
              <input
                type="checkbox"
                checked={selectedTagIds.includes(tag.id)}
                onChange={(event) => {
                  onChange(
                    event.target.checked
                      ? [...selectedTagIds, tag.id]
                      : selectedTagIds.filter((id) => id !== tag.id),
                  );
                }}
                className="accent-[#193DA0]"
              />
              {tag.name}
            </label>
          ))}
        </div>
      ) : (
        <p className="text-xs text-[#667085]">No tags have been created for this subject yet.</p>
      )}

      <div className="flex gap-2">
        <Input
          aria-label="New tag name"
          value={newTagName}
          onChange={(event) => setNewTagName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void handleCreateTag();
            }
          }}
          placeholder="Create a subject tag"
          maxLength={50}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isCreatingTag}
          isLoading={isCreatingTag}
          className="shrink-0 whitespace-nowrap"
          onClick={() => void handleCreateTag()}
        >
          Add tag
        </Button>
      </div>
    </div>
  );
}
