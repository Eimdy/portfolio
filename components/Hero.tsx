"use client";

export default function Hero() {
    return (
        <section
            id="home"
            className="px-6 py-12 md:px-12 md:py-20 flex flex-col md:flex-row gap-10 md:gap-16 items-center"
        >
            {/* Profile Image */}
            <div className="relative shrink-0">
                <div className="w-48 h-48 md:w-64 md:h-64 border shadow overflow-hidden bg-neutral-200">
                    <img
                        alt="Portrait of developer"
                        className="w-full h-full object-cover"
                        src="https://media.licdn.com/dms/image/v2/D5603AQH2WnDSOeqwLg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1687758454631?e=1768435200&v=beta&t=tAv9Q9kmff8mV_MQxs0tLKB3FcNQRu11kZ6J0fwpWvs"
                    />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-black text-white px-3 py-1 border shadow text-xs font-bold rotate-[-3deg]">
                    Available for hire!
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl text-center md:text-left">
                <h1 className="text-5xl md:text-5xl font-black tracking-tighter leading-[1.1] mb-6">
                    Hi, I&apos;m{" "}
                    <span className="inline-block">
                        Andy Mahendra
                    </span>
                </h1>
                <p className="text-xl md:text-2xl font-medium mb-4 text-neutral-700">
                    Software Engineer in Test
                </p>
                <p className="text-lg text-neutral-600 leading-relaxed mb-2">
                    3+ years of experience in quality assurance and test automation.
                    Specialized in manual testing, automation testing, and non-functional testing
                    to ensure robust and reliable software delivery.
                </p>
                <p className="text-lg text-neutral-600 leading-relaxed">
                    Proficient in building scalable test frameworks using JavaScript, Golang,
                    and modern automation tools like Katalon and Playwright, with expertise
                    in CI/CD pipelines and AI-powered testing solutions.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                    <button
                        onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                        className="btn-small bg-black text-white px-7 py-3 font-bold border shadow hover:bg-neutral-800 transition-colors flex items-center gap-2"
                    >
                        View Work
                        <span className="material-symbols-outlined text-sm">
                            arrow_forward
                        </span>
                    </button>
                    <button
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        className="btn-small bg-white text-black px-7 py-3 font-bold border shadow hover:bg-neutral-100 transition-colors"
                    >
                        Contact Me
                    </button>
                </div>
            </div>
        </section>
    );
}
