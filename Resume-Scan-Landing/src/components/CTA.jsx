import { useState } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import './CTA.css';

export default function CTA() {
  const [fileName, setFileName] = useState(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  }

  return (
    <section id="cta" className="cta">
      <div className="container cta__inner">
        <h2 className="cta__title">Find out what the bot sees.</h2>
        <p className="cta__sub">
          Upload your resume to run a free scan. No account, no sign-in —
          just the file.
        </p>

        <form className="cta__form" onSubmit={(e) => e.preventDefault()}>
          <label className="cta__dropzone" htmlFor="resume-upload">
            <UploadCloud size={22} strokeWidth={1.75} />
            <span>
              {fileName ? (
                <span className="cta__filename">
                  <FileText size={16} /> {fileName}
                </span>
              ) : (
                <>Drag & drop your resume, or click to browse</>
              )}
            </span>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFile}
              hidden
            />
          </label>

          <button type="submit" className="btn btn-primary" disabled={!fileName}>
            Scan my resume
          </button>
        </form>
        <p className="cta__filetypes">PDF or DOCX, up to 5MB.</p>
      </div>
    </section>
  );
}
