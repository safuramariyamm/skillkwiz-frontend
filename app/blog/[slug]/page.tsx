"use client";

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Tag, Share2, Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';

// This would typically come from a CMS or API
const allBlogPosts = [
  {
    id: 1,
    img: "/images/blogpage/1.png",
    title: "The Importance of Upskilling in Today's Job Market",
    excerpt: "In an era of rapid technological advancement, upskilling has become essential for career longevity and professional growth.",
    category: "Career Development",
    readTime: "5 min read",
    date: "March 15, 2025",
    slug: "importance-of-upskilling-2025",
    author: "SkillKwiz Team",
    content: `
      <h2>The Rapid Evolution of Job Requirements</h2>
      <p>In today's fast-paced digital landscape, the job market is undergoing unprecedented transformation. What was considered cutting-edge technology just five years ago is now becoming the baseline requirement for most professional roles.</p>

      <h2>Why Upskilling Is No Longer Optional</h2>
      <p>The World Economic Forum's Future of Jobs Report 2023 revealed that 44% of workers' skills will be disrupted in the next five years. This means that staying current with technological advancements and industry trends is not just advantageous—it's essential for career survival.</p>

      <h2>Key Areas for Upskilling</h2>
      <ul>
        <li><strong>Digital Literacy:</strong> Basic computer skills have evolved into advanced digital proficiency</li>
        <li><strong>Data Analytics:</strong> Understanding data-driven decision making</li>
        <li><strong>AI and Automation:</strong> Working alongside intelligent systems</li>
        <li><strong>Soft Skills:</strong> Communication, adaptability, and emotional intelligence</li>
      </ul>

      <h2>The Financial Impact</h2>
      <p>According to LinkedIn's 2024 Workplace Learning Report, professionals who continuously upskill earn 20-30% more than those who don't. The investment in learning pays dividends throughout your career.</p>

      <h2>Getting Started with Upskilling</h2>
      <p>Begin by assessing your current skill set against industry requirements. Identify gaps and create a personalized learning roadmap. Platforms like SkillKwiz offer comprehensive assessments to help you understand where to focus your efforts.</p>
    `,
    tags: ["Upskilling", "Career Development", "Job Market", "Professional Growth"]
  },
  {
    id: 2,
    img: "/images/blogpage/2.png",
    title: "How Gamified Learning Enhances Skill Retention",
    excerpt: "Discover how game-based learning techniques can significantly improve knowledge retention and skill acquisition.",
    category: "Learning Science",
    readTime: "7 min read",
    date: "March 12, 2025",
    slug: "gamified-learning-retention",
    author: "Dr. Sarah Chen",
    content: `
      <h2>The Science Behind Gamification</h2>
      <p>Gamification leverages psychological principles that have been refined over millions of years of human evolution. By tapping into our innate desire for achievement, competition, and reward, gamified learning creates an environment where knowledge acquisition becomes both enjoyable and memorable.</p>

      <h2>Dopamine and Learning Motivation</h2>
      <p>When we accomplish tasks in a game-like environment, our brains release dopamine—the neurotransmitter associated with pleasure and motivation. This chemical response creates positive associations with learning activities, making us more likely to engage with educational content repeatedly.</p>

      <h2>Key Gamification Elements</h2>
      <h3>Progress Tracking</h3>
      <p>Visual progress indicators, experience points, and level systems provide clear feedback on learning advancement. This transparency motivates learners by showing tangible evidence of their improvement.</p>

      <h3>Immediate Feedback</h3>
      <p>Unlike traditional learning methods where feedback might be delayed by days or weeks, gamified systems provide instant responses to actions. This rapid feedback loop accelerates the learning process and helps identify areas needing attention.</p>

      <h3>Achievement Systems</h3>
      <p>Badges, certificates, and leaderboard rankings tap into our competitive nature. These social proof elements encourage continued engagement and create a sense of accomplishment.</p>

      <h2>Retention Statistics</h2>
      <p>Research from the Journal of Applied Psychology shows that gamified training programs improve knowledge retention by up to 40%. More importantly, these gains are sustained over longer periods compared to traditional learning methods.</p>

      <h2>Practical Applications</h2>
      <p>SkillKwiz incorporates gamification principles through:</p>
      <ul>
        <li>Progress visualizations</li>
        <li>Achievement badges</li>
        <li>Interactive assessments</li>
        <li>Performance analytics</li>
      </ul>

      <h2>The Future of Learning</h2>
      <p>As we move toward more personalized and engaging learning experiences, gamification will play an increasingly important role. The combination of technology and psychological insights creates learning environments that are both effective and enjoyable.</p>
    `,
    tags: ["Gamification", "Learning Science", "Skill Retention", "Educational Technology"]
  },
  {
    id: 3,
    img: "/images/blogpage/3.png",
    title: "Soft Skills vs. Hard Skills: Finding the Perfect Balance",
    excerpt: "While technical expertise opens doors, soft skills determine how far you can go in your career journey.",
    category: "Skill Development",
    readTime: "6 min read",
    date: "March 10, 2025",
    slug: "soft-skills-vs-hard-skills",
    author: "Marcus Johnson",
    content: `
      <h2>The False Dichotomy</h2>
      <p>For too long, we've treated soft skills and hard skills as opposing forces in the professional world. The reality is far more nuanced. Both skill categories are essential components of career success, and the most effective professionals excel at both.</p>

      <h2>Defining the Categories</h2>
      <h3>Hard Skills</h3>
      <p>Technical abilities that can be quantified and measured:</p>
      <ul>
        <li>Programming languages</li>
        <li>Data analysis</li>
        <li>Project management methodologies</li>
        <li>Industry-specific certifications</li>
      </ul>

      <h3>Soft Skills</h3>
      <p>Interpersonal and cognitive abilities that enhance professional effectiveness:</p>
      <ul>
        <li>Communication</li>
        <li>Emotional intelligence</li>
        <li>Adaptability</li>
        <li>Leadership</li>
      </ul>

      <h2>The Research Evidence</h2>
      <p>A comprehensive study by Harvard University found that soft skills contribute 85% to career success, while hard skills account for only 15%. This doesn't diminish the importance of technical expertise—it highlights the critical role of interpersonal abilities in translating skills into results.</p>

      <h2>The Synergy Effect</h2>
      <p>The most successful professionals don't choose between soft and hard skills—they cultivate both. Technical expertise provides the foundation, while soft skills determine how effectively that expertise is applied.</p>

      <h3>Real-World Examples</h3>
      <ul>
        <li><strong>Communication:</strong> A developer with excellent coding skills but poor communication will struggle to collaborate effectively</li>
        <li><strong>Adaptability:</strong> A project manager with strong organizational skills but low adaptability will struggle in dynamic environments</li>
        <li><strong>Emotional Intelligence:</strong> A leader with technical expertise but low EQ will struggle to motivate and retain team members</li>
      </ul>

      <h2>Developing Both Skill Sets</h2>
      <h3>Building Hard Skills</h3>
      <p>Focus on continuous learning through:</p>
      <ul>
        <li>Online courses and certifications</li>
        <li>Hands-on projects</li>
        <li>Mentorship programs</li>
        <li>Industry conferences</li>
      </ul>

      <h3>Cultivating Soft Skills</h3>
      <p>Develop interpersonal abilities through:</p>
      <ul>
        <li>Active listening exercises</li>
        <li>Public speaking opportunities</li>
        <li>Team collaboration projects</li>
        <li>Leadership training</li>
      </ul>

      <h2>The Path Forward</h2>
      <p>The future belongs to professionals who can combine technical mastery with emotional intelligence. Organizations increasingly recognize that hiring decisions should balance both skill categories. As you plan your career development, remember that your technical abilities open doors, but your soft skills determine how far you'll go through them.</p>
    `,
    tags: ["Soft Skills", "Hard Skills", "Career Development", "Professional Growth"]
  },
  {
    id: 4,
    img: "/images/blogpage/4.png",
    title: "Top 10 Tech Skills That Can Land You a High-Paying Job",
    excerpt: "From AI and machine learning to cloud computing, discover the most in-demand technical skills for 2025.",
    category: "Technology",
    readTime: "8 min read",
    date: "March 8, 2025",
    slug: "top-tech-skills-2025",
    author: "Tech Insights Team",
    content: `
      <h2>The Evolving Tech Landscape</h2>
      <p>As we stand on the threshold of 2025, the technology sector continues its unprecedented growth. According to the U.S. Bureau of Labor Statistics, tech occupations are projected to grow 15% from 2021 to 2031, much faster than the average for all occupations.</p>

      <h2>1. Artificial Intelligence & Machine Learning</h2>
      <p>AI and ML have moved from buzzwords to business necessities. Organizations across industries are implementing AI solutions to optimize operations, enhance customer experiences, and drive innovation.</p>
      <p><strong>Average Salary:</strong> $140,000 - $180,000 annually</p>
      <p><strong>Key Skills:</strong> Python, TensorFlow, PyTorch, data preprocessing, model deployment</p>

      <h2>2. Cloud Computing & DevOps</h2>
      <p>The shift to cloud infrastructure continues unabated. Companies are moving critical applications and data to cloud platforms, creating massive demand for cloud expertise.</p>
      <p><strong>Average Salary:</strong> $120,000 - $150,000 annually</p>
      <p><strong>Key Skills:</strong> AWS, Azure, GCP, Docker, Kubernetes, CI/CD pipelines</p>

      <h2>3. Cybersecurity</h2>
      <p>With cyber threats becoming increasingly sophisticated, organizations are prioritizing security. The global cybersecurity market is expected to reach $300 billion by 2025.</p>
      <p><strong>Average Salary:</strong> $130,000 - $160,000 annually</p>
      <p><strong>Key Skills:</strong> Network security, ethical hacking, risk assessment, compliance frameworks</p>

      <h2>4. Data Science & Analytics</h2>
      <p>Data-driven decision making is now a competitive necessity. Organizations need professionals who can extract insights from complex datasets.</p>
      <p><strong>Average Salary:</strong> $110,000 - $140,000 annually</p>
      <p><strong>Key Skills:</strong> SQL, Python/R, statistical analysis, data visualization, machine learning</p>

      <h2>5. Full-Stack Development</h2>
      <p>The ability to work across the entire technology stack remains highly valuable. Full-stack developers can handle both frontend and backend development.</p>
      <p><strong>Average Salary:</strong> $110,000 - $135,000 annually</p>
      <p><strong>Key Skills:</strong> React, Node.js, databases, API development, cloud deployment</p>

      <h2>6. Blockchain Technology</h2>
      <p>Beyond cryptocurrencies, blockchain is finding applications in supply chain, healthcare, and finance. Enterprise adoption is accelerating rapidly.</p>
      <p><strong>Average Salary:</strong> $130,000 - $160,000 annually</p>
      <p><strong>Key Skills:</strong> Smart contracts, decentralized applications, cryptography, blockchain platforms</p>

      <h2>7. Internet of Things (IoT)</h2>
      <p>IoT continues to expand across industries, from smart cities to industrial automation. The market is projected to reach $1.1 trillion by 2025.</p>
      <p><strong>Average Salary:</strong> $115,000 - $145,000 annually</p>
      <p><strong>Key Skills:</strong> Embedded systems, sensor networks, edge computing, IoT protocols</p>

      <h2>8. Augmented Reality/Virtual Reality</h2>
      <p>AR/VR technologies are moving beyond gaming into enterprise applications including training, design, and remote collaboration.</p>
      <p><strong>Average Salary:</strong> $125,000 - $155,000 annually</p>
      <p><strong>Key Skills:</strong> Unity, Unreal Engine, 3D modeling, AR/VR development frameworks</p>

      <h2>9. Quantum Computing</h2>
      <p>While still emerging, quantum computing represents the next frontier in computational power. Early adopters are positioning for future dominance.</p>
      <p><strong>Average Salary:</strong> $150,000 - $200,000+ annually</p>
      <p><strong>Key Skills:</strong> Quantum algorithms, Qiskit, quantum cryptography, quantum machine learning</p>

      <h2>10. Sustainable Technology (Green Tech)</h2>
      <p>Climate change and sustainability goals are driving demand for technology solutions that reduce environmental impact.</p>
      <p><strong>Average Salary:</strong> $105,000 - $135,000 annually</p>
      <p><strong>Key Skills:</strong> Renewable energy systems, carbon tracking, sustainable computing, environmental data analysis</p>

      <h2>Building Your Tech Career</h2>
      <p>The key to success in the tech industry is continuous learning and adaptability. Focus on building a strong foundation while staying current with emerging technologies. Platforms like SkillKwiz can help you assess your current skills and identify areas for growth.</p>

      <h2>Final Thoughts</h2>
      <p>The technology sector offers unprecedented opportunities for career growth and financial success. By focusing on the skills listed above and maintaining a commitment to continuous learning, you can position yourself for a rewarding and stable career in technology.</p>
    `,
    tags: ["Technology", "High-Paying Jobs", "Career Development", "Tech Skills"]
  },
  {
    id: 5,
    img: "/images/blogpage/5.png",
    title: "How to Stay Motivated While Learning New Skills",
    excerpt: "Building sustainable learning habits requires more than just discipline—it needs the right motivation strategies.",
    category: "Learning Tips",
    readTime: "6 min read",
    date: "March 5, 2025",
    slug: "staying-motivated-learning",
    author: "Dr. Emily Rodriguez",
    content: `
      <h2>The Motivation Challenge</h2>
      <p>Learning new skills is one of the most rewarding investments you can make in yourself. However, maintaining motivation throughout the learning journey can be challenging. Research shows that 80% of New Year's resolutions fail within the first two months, and similar statistics apply to learning goals.</p>

      <h2>Understanding Motivation Types</h2>
      <h3>Intrinsic Motivation</h3>
      <p>Learning driven by internal satisfaction and personal interest. This type of motivation is more sustainable and leads to better long-term retention.</p>

      <h3>Extrinsic Motivation</h3>
      <p>Learning driven by external rewards such as promotions, certifications, or social recognition. While effective for starting, it may not sustain long-term engagement.</p>

      <h2>Building Intrinsic Motivation</h2>
      <h3>Connect Learning to Purpose</h3>
      <p>Identify how new skills align with your personal or professional goals. Ask yourself: "How will this skill improve my life or career?" Create a clear vision of the benefits you'll gain.</p>

      <h3>Start with Curiosity</h3>
      <p>Begin with topics that genuinely interest you. Use the "adjacent possible" principle—learn skills that are one step removed from your current expertise. This creates natural curiosity and reduces overwhelm.</p>

      <h3>Celebrate Small Wins</h3>
      <p>Break learning into small, achievable milestones. Celebrate each completion with meaningful rewards. This creates positive reinforcement and builds momentum.</p>

      <h2>Creating Sustainable Habits</h2>
      <h3>The 2-Minute Rule</h3>
      <p>When motivation is low, commit to just 2 minutes of learning. Often, this small commitment will carry you forward for much longer. Starting is often the hardest part.</p>

      <h3>Habit Stacking</h3>
      <p>Attach new learning habits to existing routines. For example, listen to educational podcasts during your commute or review flashcards while having morning coffee.</p>

      <h3>Environment Design</h3>
      <p>Create a dedicated learning space free from distractions. Keep learning materials visible and easily accessible. Use tools like website blockers during focused study sessions.</p>

      <h2>Overcoming Common Barriers</h2>
      <h3>Dealing with Overwhelm</h3>
      <p>When faced with complex topics, break them into smaller, manageable chunks. Focus on understanding concepts rather than memorizing details initially.</p>

      <h3>Handling Plateaus</h3>
      <p>Learning progress is rarely linear. When you hit a plateau, remember that consolidation is occurring. Take a short break and return with fresh perspective.</p>

      <h3>Managing Setbacks</h3>
      <p>View mistakes as learning opportunities rather than failures. Adopt a growth mindset that sees challenges as temporary obstacles rather than insurmountable barriers.</p>

      <h2>The Role of Community</h2>
      <p>Learning doesn't have to be solitary. Join communities of learners who share your interests:</p>
      <ul>
        <li>Online forums and discussion groups</li>
        <li>Study groups and accountability partners</li>
        <li>Social media communities</li>
        <li>Professional networking groups</li>
      </ul>

      <h2>Leveraging Technology</h2>
      <p>Modern tools can help maintain motivation:</p>
      <ul>
        <li><strong>Learning Apps:</strong> Gamified platforms that make learning engaging</li>
        <li><strong>Progress Trackers:</strong> Visual indicators of advancement</li>
        <li><strong>Reminder Systems:</strong> Apps that keep you accountable</li>
        <li><strong>Social Learning:</strong> Platforms that connect learners</li>
      </ul>

      <h2>Maintaining Long-Term Motivation</h2>
      <h3>Regular Review Sessions</h3>
      <p>Schedule weekly reviews of your learning progress. Reflect on what worked well and what could be improved.</p>

      <h3>Periodic Goal Adjustment</h3>
      <p>As you grow, your goals may need adjustment. Be flexible and willing to modify your learning path based on new insights and changing circumstances.</p>

      <h3>Teaching Others</h3>
      <p>One of the best ways to reinforce learning is to teach concepts to others. This not only solidifies your understanding but also builds confidence and motivation.</p>

      <h2>The Journey Mindset</h2>
      <p>Learning is not a destination—it's a continuous journey. Embrace the process rather than focusing solely on outcomes. The skills you develop and the person you become along the way are often more valuable than the specific knowledge acquired.</p>

      <h2>Final Thoughts</h2>
      <p>Maintaining motivation while learning new skills requires a combination of mindset, strategy, and support systems. By understanding what drives you, creating sustainable habits, and building a supportive environment, you can transform learning from a chore into a rewarding lifelong pursuit.</p>
    `,
    tags: ["Motivation", "Learning Habits", "Skill Development", "Personal Growth"]
  },
  {
    id: 6,
    img: "/images/blogpage/6.png",
    title: "The Future of Online Learning: What's Next in 2025",
    excerpt: "Virtual reality classrooms, AI-powered tutors, and personalized learning paths are reshaping education.",
    category: "Future Trends",
    readTime: "4 min read",
    date: "March 3, 2025",
    slug: "future-online-learning-2025",
    author: "Future Learning Institute",
    content: `
      <h2>The Evolution of Digital Education</h2>
      <p>Online learning has come a long way since its inception in the early 2000s. What began as simple video lectures and discussion forums has evolved into sophisticated, immersive learning experiences that rival traditional classroom education.</p>

      <h2>AI-Powered Personalization</h2>
      <p>Artificial intelligence is personalizing education at scale. Machine learning algorithms analyze learning patterns, preferences, and performance data to create personalized learning paths for each student.</p>

      <h3>Adaptive Learning Systems</h3>
      <p>These systems adjust content difficulty and presentation based on real-time performance. If a student struggles with a concept, the system provides additional explanations and practice opportunities. Advanced learners receive more challenging material automatically.</p>

      <h2>Immersive Technologies</h2>
      <h3>Virtual Reality Classrooms</h3>
      <p>VR technology is creating virtual classrooms where students can interact with 3D models, conduct virtual experiments, and collaborate with peers from around the world. Medical students can practice surgeries in virtual operating rooms, while history students can explore ancient civilizations firsthand.</p>

      <h3>Augmented Reality Integration</h3>
      <p>AR overlays digital information on the physical world, enabling contextual learning experiences. Engineering students can see mechanical systems in action, while language learners can practice conversations with virtual native speakers.</p>

      <h2>Microlearning Revolution</h2>
      <p>Attention spans are shrinking, and learners increasingly prefer bite-sized content. Microlearning delivers information in short, focused bursts that fit into busy schedules.</p>

      <ul>
        <li>5-minute video lessons</li>
        <li>Interactive quizzes</li>
        <li>Quick reference guides</li>
        <li>Mobile-optimized content</li>
      </ul>

      <h2>Social Learning Networks</h2>
      <p>Learning is becoming increasingly social. Online platforms are incorporating collaborative features that connect learners with peers, mentors, and subject matter experts.</p>

      <h3>Peer-to-Peer Learning</h3>
      <p>Study groups, collaborative projects, and peer feedback systems create communities of practice that enhance learning outcomes.</p>

      <h3>Mentor Matching</h3>
      <p>AI algorithms connect learners with mentors who have complementary skills and experience levels, creating personalized guidance relationships.</p>

      <h2>Blockchain Credentials</h2>
        <p>Digital badges and certificates are being replaced by blockchain-verified credentials that are immutable, shareable, and instantly verifiable by employers.</p>

        <h2>The Human Element</h2>
        <p>Despite technological advancements, the human element remains crucial. The most effective online learning experiences combine cutting-edge technology with human guidance, mentorship, and emotional support.</p>
      `,
      tags: ["Online Learning", "Future Trends", "Education Technology", "AI"]
    },
    {
      id: 7,
      img: "/images/blogpage/7.png",
      title: "Essential Skills to Boost Your Career in 2025",
      excerpt: "Adaptability, digital literacy, and emotional intelligence will be your competitive advantage.",
      category: "Career Growth",
      readTime: "5 min read",
      date: "March 1, 2025",
      slug: "essential-career-skills-2025",
      author: "Career Development Center",
      content: `
        <h2>The Changing Workplace Landscape</h2>
        <p>As we navigate through 2025, the workplace continues to evolve at an unprecedented pace. Remote work, AI integration, and global connectivity have fundamentally changed how we work and what skills are most valuable.</p>

        <h2>1. Digital Literacy and Technical Proficiency</h2>
        <p>Beyond basic computer skills, digital literacy now encompasses understanding cloud platforms, collaboration tools, and digital workflows. Professionals need to be comfortable with technology that enhances rather than hinders productivity.</p>

        <h3>Key Areas:</h3>
        <ul>
          <li>Cloud computing platforms (AWS, Azure, GCP)</li>
          <li>Collaboration tools (Slack, Microsoft Teams, Zoom)</li>
          <li>Project management software (Asana, Trello, Jira)</li>
          <li>Basic coding and automation skills</li>
        </ul>

        <h2>2. Adaptability and Resilience</h2>
        <p>The ability to navigate change has become one of the most critical professional skills. Organizations face constant disruption, and employees who can adapt quickly are invaluable assets.</p>

        <h3>Building Adaptability:</h3>
        <ul>
          <li>Embrace lifelong learning</li>
          <li>Develop a growth mindset</li>
          <li>Practice flexibility in problem-solving</li>
          <li>Learn from failure and feedback</li>
        </ul>

        <h2>3. Emotional Intelligence</h2>
        <p>As AI handles more technical tasks, human skills become increasingly important. Emotional intelligence affects how we communicate, collaborate, and lead others.</p>

        <h3>Core Components:</h3>
        <ul>
          <li>Self-awareness and self-regulation</li>
          <li>Empathy and social awareness</li>
          <li>Relationship management</li>
          <li>Motivational skills</li>
        </ul>

        <h2>4. Critical Thinking and Problem-Solving</h2>
        <p>In an AI-augmented workplace, the ability to think critically and solve complex problems becomes a key differentiator. Machines can process data, but humans provide context, creativity, and ethical judgment.</p>

        <h3>Developing Critical Thinking:</h3>
        <ul>
          <li>Question assumptions</li>
          <li>Analyze information objectively</li>
          <li>Consider multiple perspectives</li>
          <li>Make evidence-based decisions</li>
        </ul>

        <h2>5. Communication and Collaboration</h2>
        <p>Effective communication remains essential in remote and hybrid work environments. The ability to articulate ideas clearly and collaborate across cultures and time zones is crucial.</p>

        <h3>Essential Communication Skills:</h3>
        <ul>
          <li>Written and verbal communication</li>
          <li>Active listening</li>
          <li>Cultural awareness</li>
          <li>Virtual presentation skills</li>
        </ul>

        <h2>6. Data Literacy</h2>
        <p>As organizations become more data-driven, the ability to understand, interpret, and communicate data insights becomes increasingly important across all roles.</p>

        <h3>Data Skills for Everyone:</h3>
        <ul>
          <li>Basic statistical concepts</li>
          <li>Data visualization interpretation</li>
          <li>Understanding data-driven decision making</li>
          <li>Basic data analysis tools</li>
        </ul>

        <h2>7. Creativity and Innovation</h2>
        <p>While AI can automate routine tasks, creativity remains a uniquely human capability. Organizations need employees who can generate novel solutions and think outside conventional boundaries.</p>

        <h3>Fostering Creativity:</h3>
        <ul>
          <li>Diverse experiences and perspectives</li>
          <li>Design thinking methodologies</li>
          <li>Brainstorming and ideation techniques</li>
          <li>Risk-taking and experimentation</li>
        </ul>

        <h2>8. Leadership and Influence</h2>
        <p>Leadership is no longer reserved for management positions. Every employee can demonstrate leadership through influence, initiative, and the ability to drive change.</p>

        <h3>Modern Leadership Skills:</h3>
        <ul>
          <li>Influence without authority</li>
          <li>Change management</li>
          <li>Mentoring and coaching</li>
          <li>Stakeholder management</li>
        </ul>

        <h2>Developing These Skills</h2>
        <h3>Self-Assessment</h3>
        <p>Begin by evaluating your current skill set against these essential competencies. Identify strengths and areas for improvement.</p>

        <h3>Learning Strategies</h3>
        <ul>
          <li>Online courses and certifications</li>
          <li>Mentorship and coaching</li>
          <li>On-the-job experience</li>
          <li>Professional development programs</li>
        </ul>

        <h3>Practice and Application</h3>
        <p>Skills develop through practice. Look for opportunities to apply new skills in your current role and volunteer for projects that stretch your capabilities.</p>

        <h2>The Competitive Advantage</h2>
        <p>In a crowded job market, these skills provide a significant competitive advantage. Employers increasingly recognize that technical skills can be taught, but these foundational competencies are more difficult to develop.</p>

        <h2>Looking Ahead</h2>
        <p>As we move further into the digital age, these skills will become even more critical. The most successful professionals will be those who combine technical proficiency with these essential human capabilities. Invest in your development today to thrive in tomorrow's workplace.</p>
      `,
      tags: ["Career Skills", "Professional Development", "Workplace Trends", "Soft Skills"]
    },
    {
      id: 8,
      img: "/images/blogpage/8.png",
      title: "How Gamification Enhances Learning & Engagement",
      excerpt: "Game mechanics in education create immersive experiences that boost retention by up to 40%.",
      category: "Education Tech",
      readTime: "6 min read",
      date: "February 28, 2025",
      slug: "gamification-learning-engagement",
      author: "EduTech Research Group",
      content: `
        <h2>The Gamification Revolution</h2>
        <p>Gamification has emerged as a powerful tool in education, transforming traditional learning experiences into engaging, interactive journeys. By incorporating game design elements into educational content, we can create learning environments that are both effective and enjoyable.</p>

        <h2>The Psychology of Game-Based Learning</h2>
        <p>Games tap into fundamental psychological principles that drive human behavior. Understanding these mechanisms helps us design more effective learning experiences.</p>

        <h3>Dopamine and Reward Systems</h3>
        <p>When learners achieve goals or unlock new content, their brains release dopamine, creating positive associations with learning activities. This neurochemical response motivates continued engagement and creates a desire to learn more.</p>

        <h3>Flow State Achievement</h3>
        <p>Well-designed games create "flow states" where learners are fully immersed and focused. This optimal learning state occurs when challenge levels match skill levels, leading to deep concentration and accelerated learning.</p>

        <h2>Key Gamification Elements</h2>
        <h3>Points and Scoring Systems</h3>
        <p>Points provide immediate feedback and create a sense of progression. Learners can track their advancement and compete with themselves or others, driving continuous improvement.</p>

        <h3>Badges and Achievements</h3>
        <p>Digital badges represent completed challenges or mastered skills. These visual representations of accomplishment build confidence and provide social proof of learning achievements.</p>

        <h3>Progress Bars and Level Systems</h3>
        <p>Visual progress indicators show learners how far they've come and how much remains. Level systems create goals and milestones that maintain motivation throughout the learning journey.</p>

        <h3>Leaderboards and Social Competition</h3>
        <p>Leaderboards introduce healthy competition while fostering community. Learners can see how they compare to peers, encouraging both individual and collaborative achievement.</p>

        <h2>Research-Backed Benefits</h2>
        <h3>Improved Retention</h3>
        <p>Studies show that gamified learning improves knowledge retention by 40-60% compared to traditional methods. Game mechanics help move information from short-term to long-term memory.</p>

        <h3>Increased Engagement</h3>
        <p>Gamification reduces dropout rates in online courses by up to 50%. Learners are more likely to complete courses when they find the experience enjoyable and rewarding.</p>

        <h3>Enhanced Motivation</h3>
        <p>Game elements tap into intrinsic motivation, making learning feel like play rather than work. This sustainable form of motivation leads to better long-term learning outcomes.</p>

        <h2>Practical Applications in Education</h2>
        <h3>Corporate Training</h3>
        <p>Companies use gamification to train employees on compliance, product knowledge, and soft skills. Interactive scenarios and simulations create memorable learning experiences.</p>

        <h3>K-12 Education</h3>
        <p>Educational games teach complex subjects through interactive challenges. Students learn math, science, and history through quests, puzzles, and collaborative games.</p>

        <h3>Higher Education</h3>
        <p>Universities incorporate gamification into online courses, MOOCs, and flipped classrooms. Game elements help maintain student engagement in large, impersonal learning environments.</p>

        <h3>Professional Development</h3>
        <p>Platforms like SkillKwiz use gamification to make skill assessment and development engaging. Progress tracking, achievement badges, and performance analytics motivate continuous learning.</p>

        <h2>Design Principles for Effective Gamification</h2>
        <h3>Clear Goals and Rules</h3>
        <p>Learners should understand what they're trying to achieve and how the game mechanics work. Transparent systems build trust and encourage participation.</p>

        <h3>Appropriate Challenge Levels</h3>
        <p>Tasks should be challenging enough to be engaging but not so difficult that they cause frustration. Adaptive difficulty ensures optimal learning experiences.</p>

        <h3>Immediate Feedback</h3>
        <p>Players need instant feedback on their actions. This rapid response loop accelerates learning and helps identify areas needing attention.</p>

        <h3>Meaningful Rewards</h3>
        <p>Rewards should feel valuable and connected to learning outcomes. Points, badges, and certificates should represent genuine achievement.</p>

        <h2>Potential Challenges</h2>
        <h3>Overemphasis on Competition</h3>
        <p>Some learners may feel discouraged by competitive elements. Balance individual achievement with collaborative learning opportunities.</p>

        <h3>Superficial Engagement</h3>
        <p>Poorly designed gamification can focus on game mechanics rather than learning outcomes. Ensure game elements support educational goals.</p>

        <h3>Accessibility Concerns</h3>
        <p>Game elements should be accessible to all learners, regardless of ability level or background. Avoid designs that favor competitive personalities.</p>

        <h2>The Future of Gamified Learning</h2>
        <p>As technology advances, gamification will become more sophisticated and personalized. AI-driven systems will adapt game mechanics to individual learning styles and preferences, creating truly customized educational experiences.</p>

        <h3>Emerging Trends:</h3>
        <ul>
          <li>AI-powered adaptive difficulty</li>
          <li>Virtual reality learning environments</li>
          <li>Social learning games</li>
          <li>Mobile-first gamified apps</li>
          <li>Cross-platform learning ecosystems</li>
        </ul>

        <h2>Measuring Success</h2>
        <p>Effective gamification requires careful measurement and iteration. Key metrics include:</p>
        <ul>
          <li>Completion rates</li>
          <li>Knowledge retention</li>
          <li>Learner satisfaction</li>
          <li>Behavioral changes</li>
          <li>Return on investment</li>
        </ul>

        <h2>Conclusion</h2>
        <p>Gamification represents a powerful bridge between entertainment and education. By thoughtfully incorporating game design principles into learning experiences, we can create environments that are not only effective but also enjoyable. As we continue to explore the potential of gamified learning, the boundary between "work" and "play" in education will continue to blur, leading to better outcomes for learners worldwide.</p>
      `,
      tags: ["Gamification", "Learning Engagement", "Education Technology", "Game-Based Learning"]
    },
    {
      id: 9,
      img: "/images/blogpage/1.png",
      title: "The Power of Microlearning in Professional Development",
      excerpt: "Short, focused learning sessions deliver better results than traditional long-form training.",
      category: "Innovation",
      readTime: "5 min read",
      date: "February 25, 2025",
      slug: "microlearning-power",
      author: "Learning Innovation Lab",
      content: `
        <h2>The Attention Economy Challenge</h2>
        <p>In an age of information overload and shrinking attention spans, traditional learning methods are becoming increasingly ineffective. The average human attention span has dropped from 12 seconds in 2000 to just 8 seconds in 2025, shorter than that of a goldfish.</p>

        <h2>What is Microlearning?</h2>
        <p>Microlearning delivers educational content in small, focused bursts typically lasting 5-10 minutes. These bite-sized learning experiences are designed to fit into busy schedules and accommodate modern attention patterns.</p>

        <h3>Key Characteristics:</h3>
        <ul>
          <li>Short duration (1-10 minutes)</li>
          <li>Focused on single concepts or skills</li>
          <li>Mobile-friendly and accessible</li>
          <li>Self-contained learning units</li>
          <li>Just-in-time delivery</li>
        </ul>

        <h2>The Science Behind Microlearning</h2>
        <h3>Working Memory Limitations</h3>
        <p>Research shows that working memory can only hold 3-7 items simultaneously. Microlearning respects these cognitive limitations by focusing on one concept at a time, reducing cognitive load and improving comprehension.</p>

        <h3>Spaced Repetition</h3>
        <p>Microlearning leverages the spacing effect, where information is better retained when learning sessions are spread out over time rather than concentrated in long sessions.</p>

        <h3>Contextual Learning</h3>
        <p>Short learning sessions can be delivered in the moment of need, making them more relevant and easier to apply immediately.</p>

        <h2>Benefits for Professional Development</h2>
        <h3>Improved Knowledge Retention</h3>
        <p>Studies show that learners retain up to 80% of information from microlearning experiences, compared to 20-30% from traditional training methods.</p>

        <h3>Flexibility and Accessibility</h3>
        <p>Microlearning fits into busy work schedules. Employees can learn during commute time, between meetings, or during short breaks.</p>

        <h3>Reduced Training Time</h3>
        <p>Organizations report 50% reduction in training time while maintaining or improving learning outcomes.</p>

        <h3>Increased Engagement</h3>
        <p>Short, focused sessions are less intimidating and more likely to be completed. Completion rates for microlearning programs often exceed 90%.</p>

        <h2>Effective Microlearning Strategies</h2>
        <h3>Content Chunking</h3>
        <p>Break complex topics into smaller, digestible pieces. Each microlearning unit should focus on a single learning objective.</p>

        <h3>Multimedia Integration</h3>
        <p>Combine text, images, videos, and interactive elements to create engaging learning experiences that cater to different learning styles.</p>

        <h3>Progressive Disclosure</h3>
        <p>Present information gradually, revealing complexity as learners master foundational concepts.</p>

        <h3>Interactive Elements</h3>
        <p>Incorporate quizzes, polls, and interactive scenarios to reinforce learning and provide immediate feedback.</p>

        <h2>Implementation in Organizations</h2>
        <h3>Just-in-Time Learning</h3>
        <p>Deliver microlearning content when employees need it most. For example, a quick reference guide before a client meeting or a process reminder before performing a task.</p>

        <h3>Spaced Reinforcement</h3>
        <p>Use microlearning to reinforce important concepts over time. A series of related microlearning units delivered over weeks or months.</p>

        <h3>Performance Support</h3>
        <p>Provide on-demand access to quick reference materials and job aids that employees can consult as needed.</p>

        <h2>Technology Enabling Microlearning</h2>
        <h3>Mobile Applications</h3>
        <p>Mobile apps make microlearning accessible anytime, anywhere. Push notifications can deliver content at optimal times.</p>

        <h3>Learning Management Systems</h3>
        <p>Modern LMS platforms support microlearning through modular course design and mobile-responsive interfaces.</p>

        <h3>AI-Powered Delivery</h3>
        <p>Artificial intelligence can analyze learning patterns and deliver personalized microlearning recommendations.</p>

        <h2>Measuring Microlearning Success</h2>
        <h3>Completion Rates</h3>
        <p>Track how many learners complete microlearning modules and identify drop-off points.</p>

        <h3>Knowledge Retention</h3>
        <p>Measure retention through follow-up assessments and observe behavioral changes in the workplace.</p>

        <h3>Application in Practice</h3>
        <p>Monitor how learners apply new knowledge in their daily work and track performance improvements.</p>

        <h3>Learner Feedback</h3>
        <p>Collect feedback on content relevance, format preferences, and overall satisfaction.</p>

        <h2>Challenges and Solutions</h2>
        <h3>Content Creation</h3>
        <p>Creating effective microlearning content requires different skills than traditional course development. Invest in training content creators and leverage templates.</p>

        <h3>Contextual Relevance</h3>
        <p>Ensure microlearning content is directly applicable to job roles. Involve subject matter experts and end-users in content development.</p>

        <h3>Integration with Workflows</h3>
        <p>Make microlearning part of daily work routines rather than an add-on. Integrate with existing tools and processes.</p>

        <h2>Future of Microlearning</h2>
        <p>As technology advances, microlearning will become even more sophisticated and personalized. Expect to see:</p>
        <ul>
          <li>AI-driven content personalization</li>
          <li>Augmented reality job aids</li>
          <li>Voice-activated learning assistants</li>
          <li>Blockchain-verified micro-credentials</li>
        </ul>

        <h2>Getting Started with Microlearning</h2>
        <h3>Start Small</h3>
        <p>Begin with one or two microlearning modules to test the approach and gather feedback.</p>

        <h3>Focus on High-Impact Topics</h3>
        <p>Identify critical skills or knowledge areas where microlearning can have the greatest impact.</p>

        <h3>Invest in Quality</h3>
        <p>While microlearning is concise, it still requires high-quality content and thoughtful design.</p>

        <h3>Measure and Iterate</h3>
        <p>Track effectiveness and continuously improve based on data and feedback.</p>

        <h2>Conclusion</h2>
        <p>Microlearning represents the future of professional development. By respecting human attention patterns and delivering learning in digestible, actionable chunks, organizations can achieve better outcomes with less time investment. As the workplace continues to evolve, microlearning will become an essential tool for staying competitive in an increasingly complex world.</p>
      `,
      tags: ["Microlearning", "Professional Development", "Learning Innovation", "Education Technology"]
    },
    {
      id: 10,
      img: "/images/blogpage/4.png",
      title: "Revolutionizing the Way We Learn: Digital Innovation",
      excerpt: "Technology is not just changing how we learn—it's transforming what learning means.",
      category: "Digital Transformation",
      readTime: "7 min read",
      date: "February 22, 2025",
      slug: "digital-learning-revolution",
      author: "Digital Education Consortium",
      content: `
        <h2>The Digital Learning Revolution</h2>
        <p>We stand at the threshold of a profound transformation in education. Digital technologies are not merely tools for delivering content—they are fundamentally reshaping what it means to learn, how we teach, and why we pursue knowledge.</p>

        <h2>The Technology Stack Reshaping Education</h2>
        <h3>Artificial Intelligence and Machine Learning</h3>
        <p>AI is personalizing education at scale. Machine learning algorithms analyze individual learning patterns, adapt content difficulty in real-time, and predict which teaching methods will be most effective for each learner.</p>

        <h3>Virtual and Augmented Reality</h3>
        <p>VR and AR are creating immersive learning environments where students can explore ancient Rome, conduct virtual chemistry experiments, or practice surgical procedures without risk.</p>

        <h3>Blockchain and Digital Credentials</h3>
        <p>Blockchain technology is creating verifiable, portable digital credentials that eliminate the friction of traditional degree and certification systems.</p>

        <h3>5G and Edge Computing</h3>
        <p>High-speed, low-latency networks enable real-time collaboration and interactive experiences that were previously impossible.</p>

        <h2>The Shift from Teaching to Learning</h2>
        <p>Traditional education focused on teaching—delivering content from experts to passive recipients. Digital learning shifts the focus to learning—creating active, engaged experiences where learners construct knowledge through exploration and discovery.</p>

        <h3>Active Learning Environments</h3>
        <p>Digital platforms enable project-based learning, collaborative problem-solving, and real-world application of concepts.</p>

        <h3>Self-Paced Mastery</h3>
        <p>Learners can progress at their own pace, revisiting difficult concepts and accelerating through familiar material.</p>

        <h3>Continuous Assessment</h3>
        <p>Rather than high-stakes exams, continuous assessment provides ongoing feedback and identifies learning gaps in real-time.</p>

        <h2>The Democratization of Education</h2>
        <h3>Global Access</h3>
        <p>Digital learning breaks down geographical barriers. Students in remote areas can access world-class education from top institutions.</p>

        <h3>Reduced Costs</h3>
        <p>Online platforms eliminate many of the fixed costs associated with traditional education, making high-quality learning more affordable.</p>

        <h3>Lifelong Learning</h3>
        <p>Digital credentials and microlearning make it easier for professionals to continuously update their skills throughout their careers.</p>

        <h2>The Role of Human Teachers</h2>
        <p>Technology is not replacing teachers—it's empowering them. Educators can focus on what they do best: mentoring, inspiring, and guiding personalized learning journeys.</p>

        <h3>From Sage to Guide</h3>
        <p>Teachers transition from being "sages on the stage" to "guides on the side," facilitating rather than directing learning.</p>

        <h3>Data-Driven Instruction</h3>
        <p>Learning analytics provide teachers with insights into student progress, enabling them to provide targeted support.</p>

        <h3>Personalized Coaching</h3>
        <p>AI handles routine assessment and content delivery, freeing teachers to focus on emotional support and complex problem-solving.</p>

        <h2>Challenges and Opportunities</h2>
        <h3>The Digital Divide</h3>
        <p>While technology expands access, it also risks widening the gap between those with and without digital literacy and resources.</p>

        <h3>Quality Assurance</h3>
        <p>With the proliferation of online content, ensuring educational quality becomes increasingly important.</p>

        <h3>Assessment Innovation</h3>
        <p>Traditional testing methods don't capture the full range of skills developed through digital learning experiences.</p>

        <h2>The Future Learning Ecosystem</h2>
        <h3>Integrated Learning Platforms</h3>
        <p>Single platforms will connect formal education, professional development, and personal enrichment into seamless learning journeys.</p>

        <h3>AI Tutors and Mentors</h3>
        <p>Intelligent tutoring systems will provide 24/7 support, adapting to individual learning styles and preferences.</p>

        <h3>Immersive Learning Worlds</h3>
        <p>Virtual reality will create entire learning universes where concepts come alive through interactive exploration.</p>

        <h2>Preparing for the Future</h2>
        <h3>Digital Literacy</h3>
        <p>Educational systems must prioritize digital literacy alongside traditional subjects.</p>

        <h3>Adaptive Mindset</h3>
        <p>Learners need to develop adaptability and continuous learning skills that will serve them throughout their lives.</p>

        <h3>Ethical Technology Use</h3>
        <p>As technology becomes more integrated into education, we must address issues of privacy, equity, and ethical AI use.</p>

        <h2>The Human Element</h2>
        <p>Despite the technological advances, the most important elements of education remain fundamentally human: curiosity, creativity, critical thinking, and the relationships that support learning.</p>

        <h3>Emotional Intelligence</h3>
        <p>Digital learning environments must foster emotional development alongside cognitive skills.</p>

        <h3>Collaborative Learning</h3>
        <p>Technology should enhance human connections, not replace them.</p>

        <h3>Ethical Reasoning</h3>
        <p>As AI becomes more prevalent, teaching ethical reasoning becomes increasingly important.</p>

        <h2>Measuring Success</h2>
        <p>Traditional metrics like test scores and completion rates are insufficient for measuring the success of digital learning experiences.</p>

        <h3>Holistic Assessment</h3>
        <ul>
          <li>Skill application in real-world contexts</li>
          <li>Development of learning agility</li>
          <li>Growth mindset and resilience</li>
          <li>Collaborative problem-solving abilities</li>
        </ul>

        <h2>The Road Ahead</h2>
        <p>The digital learning revolution is not just about technology—it's about reimagining education for the 21st century and beyond. As we embrace these changes, we have the opportunity to create learning experiences that are more effective, equitable, and engaging than ever before.</p>

        <h2>Call to Action</h2>
        <p>The future of learning is being written now. Whether you're an educator, learner, or technology developer, you have a role to play in shaping this future. Embrace innovation, prioritize human needs, and work toward creating learning experiences that empower every individual to reach their full potential.</p>
      `,
      tags: ["Digital Learning", "Education Innovation", "Technology", "Future of Education"]
    }
  ];

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const post = allBlogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-headingXl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/blog')}
            className="bg-[#00418d] text-white px-6 py-3 rounded-lg hover:bg-[#003580] transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Calculate estimated reading time based on content length
  const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readingTimeMinutes = Math.ceil(wordCount / 200); // Average reading speed

  // Get previous and next posts
  const currentIndex = allBlogPosts.findIndex(p => p.slug === slug);
  const prevPost = currentIndex > 0 ? allBlogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allBlogPosts.length - 1 ? allBlogPosts[currentIndex + 1] : null;

  // Handle scroll progress
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sharePost = async () => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="bg-[#f0f7ff]">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-[#00418d] transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 bg-[#00418d] text-white text-body font-medium rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="text-headingLg md:text-headingXl lg:text-headingXl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-headingSm md:text-headingSm text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author and Meta Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-body text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#00418d] rounded-full flex items-center justify-center text-body font-semibold">
                  {post.author.charAt(0)}
                </div>
                <span>By {post.author}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>{post.date}</span>
                <span>•</span>
                <span>{readingTimeMinutes} min read</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative max-w-4xl mx-auto">
            <Image
              src={post.img}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-64 md:h-96 object-cover rounded-xl shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
            <Link
              href="/blog"
              className="flex items-center text-[#00418d] hover:text-[#003580] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Blog
            </Link>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'bg-[#00418d] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                {isBookmarked ? 'Saved' : 'Save'}
              </button>

              <button
                onClick={sharePost}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-ul:text-gray-700 prose-li:marker:text-[#00418d]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-body rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Author Bio */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#00418d] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{post.author}</h3>
                  <p className="text-body text-gray-600 mb-3">
                    Expert in {post.category.toLowerCase()} and educational innovation. Passionate about leveraging technology to enhance learning experiences.
                  </p>
                  <div className="flex gap-4 text-body text-gray-500">
                    <span>📝 {allBlogPosts.filter(p => p.author === post.author).length} articles</span>
                    <span>👥 {post.category} Specialist</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Post Navigation */}
        {(prevPost || nextPost) && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {prevPost && (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group flex items-center gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex-shrink-0">
                  <ArrowLeft className="w-6 h-6 text-[#00418d] group-hover:-translate-x-1 transition-transform duration-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body text-gray-500 mb-1">Previous Article</p>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#00418d] transition-colors line-clamp-2">
                    {prevPost.title}
                  </h3>
                </div>
              </Link>
            )}

            {nextPost && (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group flex items-center gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 md:col-start-2"
              >
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-body text-gray-500 mb-1">Next Article</p>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#00418d] transition-colors line-clamp-2">
                    {nextPost.title}
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  <ArrowLeft className="w-6 h-6 text-[#00418d] rotate-180 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Link>
            )}
          </div>
        )}

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-headingMd font-bold text-gray-900 mb-8 text-center">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allBlogPosts
              .filter(p => p.id !== post.id && p.category === post.category)
              .slice(0, 3)
              .map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <Image
                    src={relatedPost.img}
                    alt={relatedPost.title}
                    width={300}
                    height={200}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#00418d] transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-body text-gray-600 line-clamp-2">{relatedPost.excerpt}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </article>
    </div>
  );
}