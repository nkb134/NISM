// Render server-rendered markdown HTML inside the .study-prose box.
// Trust model identical to ChapterReader: input is repo-controlled markdown
// rendered via `marked` server-side. No user input.

export function ProseHtml({ html }: { html: string }) {
  return <article className="study-prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
