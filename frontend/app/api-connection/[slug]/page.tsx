import CodePreview from "@/components/CodePreview";

export default function Page() {
  const curlExample = `
curl -X POST /api/users -H "Content-Type: application/json" -d '{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "P@ssw0rd",
  "fullName": "John Doe"
}'
`;

  return (
    <div className="grid grid-cols-[1fr_260px] gap-4">
      <CodePreview title="curl" language="bash" code={curlExample} />
    </div>
  );
}
