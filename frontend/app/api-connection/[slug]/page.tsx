// app/api-connection/[slug]/page.tsx
interface Props {
    params: {
        slug: string;
    };
}

export default function ApiConnectionPage({ params }: Props) {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Trang API động</h1>
            <p className="mt-2 text-gray-600">
                Slug hiện tại: <strong>{params.slug}</strong>
            </p>
        </div>
    );
}
