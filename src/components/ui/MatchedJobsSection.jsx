import { motion } from 'framer-motion';
import JobCard from './JobCard';
import { Target } from 'lucide-react';

const MatchedJobsSection = ({ matchedJobs, isAuthenticated, error }) => {
    if (error === 'incomplete_profile') {
        return (
            <section className="mb-8">
                 <div className="bg-orange-50 rounded-3xl p-10 border-2 border-orange-100 flex flex-col items-center justify-center text-center">
                    <Target size={32} className="text-orange-400 mb-4" />
                    <h3 className="text-xl font-display font-black text-orange-900 uppercase tracking-widest mb-2">Profile Incomplete</h3>
                    <p className="text-orange-700 font-medium max-w-md">
                        Complete your profile to get matched roles tailored just for you.
                    </p>
                </div>
            </section>
        );
    }

    if (!matchedJobs || matchedJobs.length === 0) {
        return (
            <section className="mb-8">
                <div className="bg-gray-50/50 rounded-3xl p-10 border-2 border-gray-100 flex flex-col items-center justify-center text-center">
                    <Target size={32} className="text-gray-300 mb-4" />
                    <h3 className="text-xl font-display font-black text-gray-900 uppercase tracking-widest mb-2">No strong matches found</h3>
                    <p className="text-gray-500 font-medium max-w-md">
                        Add more skills to your profile to improve results.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="mb-12 mt-4 relative">
            <div className="absolute inset-0 bg-gray-50/80 rounded-[2.5rem] -mx-4 sm:-mx-8 -my-6 z-0 border border-gray-100/50"></div>
            
            <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b-2 border-black/5">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 shadow-lg shadow-zinc-900/10">
                            <Target size={12} className="text-zinc-400" />
                            Personalized
                        </div>
                        <h2 className="text-3xl font-display font-black text-black uppercase tracking-tighter mb-2">
                            Matched Roles
                        </h2>
                        <p className="text-gray-500 font-medium tracking-wide">Roles tailored to your profile</p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {matchedJobs.map((job, idx) => (
                        <JobCard key={job.id || idx} job={job} isAuthenticated={isAuthenticated} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MatchedJobsSection;
