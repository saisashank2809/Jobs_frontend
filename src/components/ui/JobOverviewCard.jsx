import { MapPin, Clock3, Sparkles, GraduationCap, IndianRupee } from 'lucide-react';

const JobOverviewCard = ({
  overviewSentences = [],
  skills = [],
  location = 'Not Specified',
  experience = 'Not Specified',
  qualification = null,
  salary = null,
}) => (
  <div className="w-full mb-12 p-10 rounded-[32px] border border-zinc-100 bg-[#FAFAFA] relative overflow-hidden group hover:bg-white transition-all shadow-sm">
    <div className="absolute -top-6 -right-6 p-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity rotate-12">
      <Sparkles size={160} className="text-zinc-900" />
    </div>

    <div className="flex items-center gap-2 text-zinc-400 mb-8 border-b border-zinc-100 pb-4 inline-flex w-full">
      <Sparkles size={14} className="text-zinc-900" />
      <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Smart Summary Analysis</span>
    </div>

    <div className="relative z-10 flex flex-col gap-8">
      <div className="p-6 rounded-[24px] border border-zinc-100 bg-white/80">
        <div className="flex flex-col gap-4 text-sm font-semibold text-zinc-900">
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-zinc-400" />
            <span className={(!location || location === 'Not Specified' || location === 'Not specified') ? "text-zinc-400" : ""}>
              {location || 'Not Specified'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock3 size={16} className="text-zinc-400" />
            <span className={(!experience || experience === 'Not Specified' || experience === 'Not specified') ? "text-zinc-400" : ""}>
              {experience || 'Not Specified'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <GraduationCap size={16} className="text-zinc-400" />
            <span className={(!qualification || qualification === 'Not specified') ? "text-zinc-400" : ""}>
              {qualification || 'Not specified'}
            </span>
          </div>
          {(salary && salary !== 'Not specified' && salary !== 'Not Specified') && (
            <div className="flex items-center gap-3">
              <IndianRupee size={16} className="text-zinc-400" />
              <span>{salary}</span>
            </div>
          )}
        </div>
      </div>

      {overviewSentences && overviewSentences.length > 0 && (
        <div className="pb-4">
          <h3 className="text-xl font-bold text-zinc-900 mb-4">Role Overview</h3>
          <ul className="grid gap-3">
            {overviewSentences.map((sentence, index) => (
              <li key={`overview-${index}`} className="flex items-start gap-3 text-sm text-zinc-600 font-medium leading-relaxed">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-zinc-900/40 shrink-0" />
                <span>{sentence}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold text-zinc-900 mb-4">Key Skills</h3>
        {skills.length > 0 ? (
          <ul className="grid gap-3">
            {skills.map((skill, index) => (
              <li key={`${index}-${skill}`} className="flex items-start gap-3 text-sm text-zinc-600 font-medium">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-zinc-300 shrink-0" />
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500 font-medium">Relevant skills will appear here once the job data is fully enriched.</p>
        )}
      </div>
    </div>
  </div>
);

export default JobOverviewCard;
