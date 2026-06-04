const fs = require('fs');
const path = require('path');
const pages = [
  { file: 'src/pages/public/LandingPage.tsx', func: 'LandingPage', text: 'Landing Page' },
  { file: 'src/pages/public/LoginPage.tsx', func: 'LoginPage', text: 'Login Page' },
  { file: 'src/pages/public/RegisterPage.tsx', func: 'RegisterPage', text: 'Register Page' },
  { file: 'src/pages/user/HomePage.tsx', func: 'HomePage', text: 'Home Page' },
  { file: 'src/pages/user/OrderPage.tsx', func: 'OrderPage', text: 'Order Page' },
  { file: 'src/pages/user/ActiveOrderPage.tsx', func: 'ActiveOrderPage', text: 'Active Order Page' },
  { file: 'src/pages/user/HistoryPage.tsx', func: 'HistoryPage', text: 'History Page' },
  { file: 'src/pages/user/ProfilePage.tsx', func: 'ProfilePage', text: 'Profile Page' },
  { file: 'src/pages/user/RegisterMitraPage.tsx', func: 'RegisterMitraPage', text: 'Register Mitra Page' },
  { file: 'src/pages/mitra/MitraDashboard.tsx', func: 'MitraDashboard', text: 'Mitra Dashboard' },
  { file: 'src/pages/mitra/IncomingOrdersPage.tsx', func: 'IncomingOrdersPage', text: 'Incoming Orders Page' },
  { file: 'src/pages/mitra/ActiveNegotiationPage.tsx', func: 'ActiveNegotiationPage', text: 'Active Negotiation Page' },
  { file: 'src/pages/mitra/MitraHistoryPage.tsx', func: 'MitraHistoryPage', text: 'Mitra History Page' },
  { file: 'src/pages/mitra/DepositPage.tsx', func: 'DepositPage', text: 'Deposit Page' },
  { file: 'src/pages/mitra/MitraProfilePage.tsx', func: 'MitraProfilePage', text: 'Mitra Profile Page' },
  { file: 'src/pages/admin/AdminDashboard.tsx', func: 'AdminDashboard', text: 'Admin Dashboard' },
  { file: 'src/pages/admin/UsersManagementPage.tsx', func: 'UsersManagementPage', text: 'Users Management Page' },
  { file: 'src/pages/admin/MitraVerificationPage.tsx', func: 'MitraVerificationPage', text: 'Mitra Verification Page' },
  { file: 'src/pages/admin/ReportsPage.tsx', func: 'ReportsPage', text: 'Reports Page' },
  { file: 'src/pages/admin/StatisticsPage.tsx', func: 'StatisticsPage', text: 'Statistics Page' },
  { file: 'src/pages/NotFoundPage.tsx', func: 'NotFoundPage', text: '404 - Halaman Tidak Ditemukan' }
];

pages.forEach(p => {
  const fullPath = path.join(__dirname, '..', p.file);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const content = `import { PageTransition } from '@/components/layout/PageTransition';

export default function ${p.func}() {
  return (
    <PageTransition>
      <div className="flex min-h-[60vh] items-center justify-center">
        <h1 className="text-2xl font-bold text-primary">${p.text}</h1>
      </div>
    </PageTransition>
  );
}
`;
  fs.writeFileSync(fullPath, content);
});
console.log('Pages created successfully.');
