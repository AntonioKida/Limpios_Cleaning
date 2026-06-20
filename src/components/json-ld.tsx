/**
 * Renders a JSON-LD <script>. Data is project-owned; `<` is escaped to
 * `<` to prevent any chance of breaking out of the script element.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
