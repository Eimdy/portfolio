export default function Skills() {
    return (
        <>
            <div className="w-full h-0 border-top"></div>
            <section id="skills" className="px-6 py-16 md:px-12 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-black tracking-tight mb-4">
                        Skills & Technologies
                    </h2>
                    <p className="text-neutral-600 font-medium mb-12">
                        Technical expertise in quality assurance and test automation
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            "Manual Testing",
                            "Automation Testing",
                            "Non-Functional Testing",
                            "JavaScript",
                            "Golang",
                            "TypeScript",
                            "Playwright",
                            "Katalon",
                            "Selenium",
                            "CI/CD",
                            "FIX Protocol",
                            "AI Agent",
                        ].map((skill, index) => (
                            <div
                                key={index}
                                className="card bg-white p-4 border shadow hover:shadow-hover transition-all font-bold text-sm"
                            >
                                {skill}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
