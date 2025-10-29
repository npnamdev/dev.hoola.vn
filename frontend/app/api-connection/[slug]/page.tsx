// app/api-connection/[slug]/page.tsx
interface PageProps {
  params: {
    slug: string;
  };
}

export default function ApiConnectionPage({ params }: PageProps) {
  const { slug } = params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Trang API động</h1>
      <p className="mt-2 text-gray-600">
        Slug hiện tại: <strong>{slug}</strong>
      </p>
    </div>
  );
}
