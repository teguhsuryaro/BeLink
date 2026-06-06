import { useNavigate } from 'react-router-dom';
import { Zap, MapPin, Banknote, MessageSquare, Wrench } from 'lucide-react';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <PageTransition className="flex min-h-screen flex-col bg-surface-light dark:bg-surface-dark">
      {/* Top Navbar Guest */}
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-border-light bg-card-light/90 px-6 py-4 backdrop-blur-xl dark:border-border-dark dark:bg-card-dark/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Wrench className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Be<span className="text-primary">Link</span>
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
              Masuk
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent dark:from-primary/5" />
        
        <StaggerContainer className="relative z-10 mx-auto max-w-3xl text-center">
          <StaggerItem>
            <h1 className="text-4xl font-extrabold tracking-tight text-text-primary-light dark:text-text-primary-dark sm:text-5xl lg:text-6xl">
              Solusi Tepat <br className="hidden sm:block" />
              <span className="text-gradient-primary">Kendaraan Darurat</span>
            </h1>
          </StaggerItem>
          
          <StaggerItem>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-text-muted-light dark:text-text-muted-dark">
              Platform layanan darurat kendaraan terpercaya. Temukan mekanik dan layanan tambal ban terdekat kapanpun Anda butuhkan.
            </p>
          </StaggerItem>
          
          <StaggerItem className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/register')}>
              Mulai Sekarang
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => navigate('/login')}>
              Sudah Punya Akun?
            </Button>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* Features Section */}
      <section className="bg-white px-6 py-24 dark:bg-[#111318]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Kenapa Memilih BeLink?
            </h2>
            <p className="mt-4 text-text-muted-light dark:text-text-muted-dark">
              Berbagai keunggulan platform kami untuk kenyamanan Anda.
            </p>
          </div>

          <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StaggerItem>
              <Card hover className="h-full flex flex-col p-6">
                <div className="mb-4 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                  Akurat & Cepat
                </h3>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  Deteksi lokasi GPS untuk menemukan mekanik terdekat secara instan.
                </p>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card hover className="h-full flex flex-col p-6">
                <div className="mb-4 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                  Respons Tanggap
                </h3>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  Layanan darurat siaga membantu masalah kendaraan Anda dengan cepat.
                </p>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card hover className="h-full flex flex-col p-6">
                <div className="mb-4 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Banknote className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                  Harga Transparan
                </h3>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  Sistem negosiasi harga di awal mencegah biaya tersembunyi.
                </p>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card hover className="h-full flex flex-col p-6">
                <div className="mb-4 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                  Live Chat
                </h3>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  Komunikasi langsung dengan mekanik sebelum mereka berangkat.
                </p>
              </Card>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Cara Kerja
            </h2>
            <p className="mt-4 text-text-muted-light dark:text-text-muted-dark">
              Langkah mudah menggunakan layanan BeLink.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { title: 'Isi form darurat', desc: 'Jelaskan masalah kendaraan Anda dan bagikan lokasi saat ini.' },
              { title: 'Negosiasi dengan mekanik', desc: 'Terima penawaran dari mekanik terdekat dan sepakati harga.' },
              { title: 'Mekanik datang ke lokasimu', desc: 'Tunggu mekanik datang dan perbaiki kendaraan Anda.' },
            ].map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary font-bold text-white shadow-soft">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {step.title}
                </h3>
                <p className="text-text-muted-light dark:text-text-muted-dark">
                  {step.desc}
                </p>
                
                {/* Connector line for desktop */}
                {index < 2 && (
                  <div className="absolute left-[60%] top-8 hidden w-[80%] border-t-2 border-dashed border-border-light dark:border-border-dark md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border-light bg-card-light py-8 text-center dark:border-border-dark dark:bg-card-dark">
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
          &copy; {new Date().getFullYear()} BeLink. Platform layanan darurat kendaraan.
        </p>
      </footer>
    </PageTransition>
  );
}
