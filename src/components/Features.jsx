import { ScanSearch, AlignLeft, ListChecks, FileWarning } from 'lucide-react';
import './Features.css';

const FEATURES = [
  {
    icon: ScanSearch,
    title: 'Keyword coverage',
    text: "Compares your resume's language against the job description and flags the skills and terms it doesn't find.",
  },
  {
    icon: AlignLeft,
    title: 'Parsing & formatting',
    text: 'Catches things that silently break ATS parsers: tables, text boxes, columns, headers/footers, and images with text in them.',
  },
  {
    icon: ListChecks,
    title: 'Section detection',
    text: "Checks that Experience, Education, and Skills are labeled in a way the software recognizes — not just a human reader.",
  },
  {
    icon: FileWarning,
    title: 'Plain-English fix list',
    text: 'No jargon. Every flagged issue comes with a one-line explanation of what to change and why it matters.',
  },
];

export default function Features() {
  return (
    <section id="features" className="features">
      <div className="container">
        <div className="features__head">
          <p className="eyebrow">// what it checks</p>
          <h2 className="features__title">Everything that quietly gets a resume rejected</h2>
        </div>
        <div className="features__grid">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div className="feature" key={title}>
              <div className="feature__icon">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <h3 className="feature__title">{title}</h3>
              <p className="feature__text">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
