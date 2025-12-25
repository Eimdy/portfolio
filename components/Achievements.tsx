export default function Achievements() {
    const achievements = [
        {
            icon: "school",
            title: "ISTQB - CTFL",
            organization: "International Software Testing Qualifications Board",
            date: "Certified Tester Foundation Level",
        },
        {
            icon: "workspace_premium",
            title: "Katalon Professional",
            organization: "Katalon Academy",
            date: "Professional Certification",
        },
        {
            icon: "emoji_events",
            title: "FIX Protocol Performance Tools",
            organization: "Built high-performance testing tools for financial trading systems",
            date: "Achievement",
        },
        {
            icon: "verified",
            title: "Productivity Tools Development",
            organization: "Developed automation tools to enhance team productivity",
            date: "Achievement",
        },
    ];

    return (
        <>
            <div className="w-full h-0 border-top"></div>
            <section id="achievements" className="px-6 py-16 md:px-12 bg-white">
                <div className="max-w-5xl mx-auto">
                    {/* Section Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-neutral-100 text-black flex items-center justify-center border shadow rounded-full">
                            <span className="material-symbols-outlined">military_tech</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight">
                            Achievements & Certifications
                        </h2>
                    </div>

                    {/* Achievements Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {achievements.map((achievement, index) => (
                            <div
                                key={index}
                                className="card bg-white p-6 border shadow hover:shadow-hover transition-all flex items-start gap-4"
                            >
                                {/* Icon */}
                                <div className="w-12 h-12 bg-black text-white flex items-center justify-center border shadow shrink-0">
                                    <span className="material-symbols-outlined text-xl">
                                        {achievement.icon}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold mb-1">
                                        {achievement.title}
                                    </h3>
                                    <p className="text-sm text-neutral-600 mb-1">
                                        {achievement.organization}
                                    </p>
                                    <p className="text-xs text-neutral-500 font-medium">
                                        {achievement.date}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
