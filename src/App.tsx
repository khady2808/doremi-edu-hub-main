
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { NotificationToastManager } from "@/components/ui/notification-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginForm } from "./components/auth/LoginForm";
import { AppSidebar } from "./components/layout/AppSidebar";
import { MainNavigation } from "./components/layout/MainNavigation";
import { Header } from "./components/layout/Header";
import { Chatbot } from "./components/ui/chatbot";
import { Index } from "./pages/Index";
import { Dashboard } from "./pages/Dashboard";
import { Courses } from "./pages/Courses";
import { Messages } from "./pages/Messages";
import { Library } from "./pages/Library";
import { Premium } from "./pages/Premium";
import { Settings } from "./pages/Settings";
import { VideoCall } from "./pages/VideoCall";
import { InstructorVideoUpload } from "./pages/InstructorVideoUpload";
import { InstructorLiveSession } from "./pages/InstructorLiveSession";
import { Actualites } from "./pages/Actualites";
import { NewsDetail } from "./pages/NewsDetail";
import { Stages } from "./pages/Stages";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminStats } from "./pages/AdminStats";
import { AdminCourses } from "./pages/AdminCourses";
import { AdminUsers } from "./pages/AdminUsers";
import { AdminNews } from "./pages/AdminNews";
import { AdminNewsDetail } from "./pages/AdminNewsDetail";
import { AdminNewsAdd } from "./pages/AdminNewsAdd";
import { AdminNewsEdit } from "./pages/AdminNewsEdit";
import { AdminInternships } from "./pages/AdminInternships";
import { AdminSettings } from "./pages/AdminSettings";
import { AdminDocuments } from "./pages/AdminDocuments";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterOffers from "./pages/RecruiterOffers";
import RecruiterApplications from "./pages/RecruiterApplications";
import NotFound from "./pages/NotFound";
import Footer from "./components/layout/Footer";
import { ApiTest } from "./components/ApiTest";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Use different layouts for homepage vs other pages
  const isHomePage = location.pathname === '/';

  if (isHomePage) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainNavigation />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/video-call" element={<VideoCall />} />
            
            <Route path="/library" element={<Library />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/internships" element={<Stages />} />
            <Route path="/recruiter" element={<RecruiterDashboard />} />
            <Route path="/recruiter/offers" element={<RecruiterOffers />} />
            <Route path="/recruiter/applications" element={<RecruiterApplications />} />
            <Route path="/news" element={<Actualites />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/actualites" element={<Actualites />} />
            <Route path="/actualites/:id" element={<NewsDetail />} />
            <Route path="/students" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">Mes Étudiants</h2><p className="text-muted-foreground">En cours de développement...</p></div>} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/stats" element={<AdminStats />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/news" element={<AdminNews />} />
            <Route path="/admin/internships" element={<AdminInternships />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/documents" element={<AdminDocuments />} />
            <Route path="/instructor-videos" element={<InstructorVideoUpload />} />
            <Route path="/instructor/video-upload" element={<InstructorVideoUpload />} />
            <Route path="/instructor/live-session" element={<InstructorLiveSession />} />
            <Route path="/api-test" element={<ApiTest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Chatbot />
        <Footer />
      </div>
    );
  }

  // Use sidebar layout for non-homepage routes
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900 flex-col">
        <div className="flex flex-1 w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6 overflow-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/video-call" element={<VideoCall />} />
            <Route path="/library" element={<Library />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/settings" element={<Settings />} />
                <Route path="/internships" element={<Stages />} />
                <Route path="/recruiter" element={<RecruiterDashboard />} />
                <Route path="/recruiter/offers" element={<RecruiterOffers />} />
                <Route path="/recruiter/applications" element={<RecruiterApplications />} />
                <Route path="/news" element={<Actualites />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/actualites" element={<Actualites />} />
                <Route path="/actualites/:id" element={<NewsDetail />} />
                <Route path="/students" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">Mes Étudiants</h2><p className="text-muted-foreground">En cours de développement...</p></div>} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/stats" element={<AdminStats />} />
                <Route path="/admin/courses" element={<AdminCourses />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/news" element={<AdminNews />} />
                <Route path="/admin/news/add" element={<AdminNewsAdd />} />
                <Route path="/admin/news/detail/:id" element={<AdminNewsDetail />} />
                <Route path="/admin/news/edit/:id" element={<AdminNewsEdit />} />
                <Route path="/admin/internships" element={<AdminInternships />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/documents" element={<AdminDocuments />} />
                <Route path="/instructor-videos" element={<InstructorVideoUpload />} />
                <Route path="/instructor/video-upload" element={<InstructorVideoUpload />} />
                <Route path="/instructor/live-session" element={<InstructorLiveSession />} />
                <Route path="/api-test" element={<ApiTest />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
          <Chatbot />
        </div>
        {/* Footer avec compensation de la largeur de la sidebar pour éviter le chevauchement */}
        <SidebarPaddingWrapper>
          <Footer />
        </SidebarPaddingWrapper>
      </div>
    </SidebarProvider>
  );
};

// Ajoute une marge gauche dynamique en fonction de l'état de la sidebar (ouverte/collapsée)
const SidebarPaddingWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  // 64 = largeur ouverte (w-64), 16 = largeur fermée (w-16)
  const paddingLeftClass = isCollapsed ? 'pl-16' : 'pl-64';
  return <div className={`w-full ${paddingLeftClass} transition-[padding] duration-200`}>{children}</div>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <AppContent />
        <Toaster />
        <Sonner />
        <NotificationToastManager />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
