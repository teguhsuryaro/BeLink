import { PageTransition } from '@/components/layout/PageTransition';

export default function NotFoundPage() {
  return (
    <PageTransition>
      <div className="flex min-h-[60vh] items-center justify-center">
        <h1 className="text-2xl font-bold text-primary">404 - Halaman Tidak Ditemukan</h1>
      </div>
    </PageTransition>
  );
}
