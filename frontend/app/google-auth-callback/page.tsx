// Trang này dùng để nhận kết quả đăng nhập Google OAuth
// Nếu đăng nhập thành công, gửi message về tab cha và tự đóng tab

'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function GoogleAuthCallbackInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const loginStatus = searchParams.get('login');

    useEffect(() => {
        if (window.opener && (loginStatus === 'success' || loginStatus === 'error')) {
            window.opener.postMessage({ type: 'google-auth', status: loginStatus }, '*');
            window.close();
        } else {
            router.replace('/');
        }
    }, [loginStatus, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Đang xử lý đăng nhập Google...</h2>
            <p>Nếu không tự đóng, bạn có thể đóng tab này.</p>
        </div>
    );
}

export default function GoogleAuthCallback() {
    return (
        <Suspense>
            <GoogleAuthCallbackInner />
        </Suspense>
    );
}
