import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import LogosBar from './components/LogosBar.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Features from './components/Features.jsx';
import ReportPreview from './components/ReportPreview.jsx';
import CTA from './components/CTA.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LogosBar />
        <HowItWorks />
        <Features />
        <ReportPreview />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
