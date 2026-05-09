import { Mail, Phone, Linkedin, Globe, MapPin } from "lucide-react";
import { ResumeData } from "../types";

interface ResumePreviewProps {
  data: ResumeData;
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  return (
    <div 
      id="resume-to-print"
      className="resume-container max-w-[800px] mx-auto bg-white p-12 shadow-2xl min-h-[1050px] text-slate-800"
    >
      {/* Header */}
      <header className="border-b-2 border-slate-900 pb-6 mb-8">
        <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900 mb-2 uppercase">
          {data.name}
        </h1>
        <div className="flex flex-wrap justify-between items-center text-sm font-medium text-slate-500">
          <span>{data.profession}</span>
          <div className="flex gap-4">
            <span>{data.contact.email}</span>
            <span>{data.contact.phone}</span>
          </div>
        </div>
      </header>

      {/* Summary */}
      <section className="mb-8">
        <h2 className="status-tag text-blue-600 mb-3">Professional Summary</h2>
        <p className="text-slate-600 leading-relaxed italic text-sm">
          {data.summary}
        </p>
      </section>

      <div className="space-y-8">
        {/* Experience */}
        <section>
          <h2 className="status-tag text-blue-600 mb-4 pb-1 border-b border-slate-100">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="relative">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-bold text-slate-900">
                    {exp.company} <span className="font-normal text-slate-400">|</span> {exp.title}
                  </h3>
                  <span className="text-xs font-mono text-slate-500 uppercase">
                    {exp.duration}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">
                  {exp.location}
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1.5">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="text-[13px] leading-relaxed text-slate-700">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-12">
          {/* Skills */}
          <section>
            <h2 className="status-tag text-blue-600 mb-4 pb-1 border-b border-slate-100">
              Technical Expertise
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, idx) => (
                <span 
                  key={idx}
                  className="text-[11px] px-2 py-1 bg-slate-50 border border-slate-200 text-slate-700 rounded font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="status-tag text-blue-600 mb-4 pb-1 border-b border-slate-100">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{edu.degree}</h3>
                    <p className="text-xs text-slate-500">{edu.institution}</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{edu.year}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
