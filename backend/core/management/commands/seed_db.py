from django.core.management.base import BaseCommand
from core.models import (
    UserProfile,
    JobOpportunity,
    JobApplication,
    MentorshipSession,
    CampusPost,
    LibraryBook,
    BookTransferRequest,
    LostAndFoundItem,
    CampusAnnouncement,
    ModerationLog
)


class Command(BaseCommand):
    help = 'Seeds the database with Richfield Graduate Institute of Technology campus records'

    def handle(self, *args, **options):
        self.stdout.write("Seeding Richfield campus relational records...")

        # 1. Users
        users_data = [
            {
                "user_id": "u_super_laylbaal",
                "name": "Superuser Administrator",
                "email": "laylbaal@gmail.com",
                "role": "backend_admin",
                "campus": "Midrand Campus",
                "qualification": "IT",
                "academic_year": "System Administration",
                "verified": True,
                "headline": "Lead Systems Architect & Django Superuser Admin",
                "bio": "Django Database Superuser & Full-Stack Campus Administrator. Full access to database schemas, SQL console, and API gateway.",
                "skills": ["Django ORM", "SQLite", "PostgreSQL", "Python", "Security", "REST APIs"],
                "is_mentor": False,
                "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            },
            {
                "user_id": "user-themba-billa",
                "name": "Themba Billa",
                "email": "themba.billa@richfield.ac.za",
                "role": "student",
                "campus": "Sandton Campus",
                "qualification": "IT",
                "academic_year": "3rd Year",
                "verified": True,
                "headline": "Full-Stack Software Engineer & Distributed Systems Lead",
                "bio": "3rd Year BSc IT student at Sandton Campus. Dean's List honouree. Experienced in React, Django, and cloud microservices with 60s elevator pitch video.",
                "skills": ["TypeScript", "React", "Python", "Django", "Docker", "PostgreSQL"],
                "is_mentor": False,
                "avatar_url": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
            },
            {
                "user_id": "user-thabiso",
                "name": "Thabiso Khosi",
                "email": "student@richfield.ac.za",
                "role": "student",
                "campus": "Newtown Campus",
                "qualification": "IT",
                "academic_year": "3rd Year",
                "verified": True,
                "headline": "Cloud Architect & Cyber Defense Enthusiast | BSc IT 3rd Year",
                "bio": "Active contributor to Richfield CodeHub, inter-campus library researcher, and hackathon finalist.",
                "skills": ["AWS", "Docker", "Python", "Kubernetes", "TypeScript"],
                "is_mentor": False,
                "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
            },
            {
                "user_id": "user-mpho",
                "name": "Mpho Molefe",
                "email": "mentor@richfield.ac.za",
                "role": "mentor",
                "campus": "Pretoria Campus",
                "qualification": "IT",
                "academic_year": "Class of 2022",
                "verified": True,
                "headline": "Senior Cloud Engineer at Vodacom SA | Verified Mentor",
                "bio": "Richfield Alumni mentor dedicated to career coaching, resume audits, and mock technical interviews for final-year students.",
                "skills": ["Cloud Architecture", "Career Mentorship", "Microservices", "System Design"],
                "is_mentor": True,
                "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
            },
            {
                "user_id": "user-campus-admin",
                "name": "Ayanda Sithole",
                "email": "campus.admin@richfield.ac.za",
                "role": "campus_admin",
                "campus": "Newtown Campus",
                "qualification": "IT",
                "academic_year": "Campus Operations",
                "verified": True,
                "headline": "Campus Operations Director & Physical Desk Supervisor",
                "bio": "Managing local campus announcements, physical lost-and-found repository, and inter-campus courier logistics.",
                "skills": ["Campus Operations", "Physical Asset Management", "Student Verification"],
                "is_mentor": False,
                "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
            },
            {
                "user_id": "user-lesiba",
                "name": "Lesiba Khumalo",
                "email": "backend.admin@richfield.ac.za",
                "role": "backend_admin",
                "campus": "Newtown Campus",
                "qualification": "IT",
                "academic_year": "IT Directorate",
                "verified": True,
                "headline": "Director of Institutional Technology & Backend Database Systems",
                "bio": "Managing Django relational database migrations, REST API routing, and AI Content Moderation rules.",
                "skills": ["Database Administration", "Django ORM", "API Gateway", "Security Operations"],
                "is_mentor": False,
                "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
            },
            {
                "user_id": "u_stud_01",
                "name": "Kagiso Molefe",
                "email": "kagiso@richfield.ac.za",
                "role": "student",
                "campus": "Midrand Campus",
                "qualification": "IT",
                "academic_year": "3rd Year",
                "verified": True,
                "headline": "Aspiring Cloud & DevOps Engineer | BSc IT 3rd Year",
                "bio": "Passionate about cloud architecture, microservices, and distributed systems. Student ambassador at Midrand Campus.",
                "skills": ["AWS", "Docker", "Python", "Kubernetes", "TypeScript"],
                "is_mentor": False,
                "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            },
            {
                "user_id": "u_alumni_01",
                "name": "Thabo Bester",
                "email": "alumni@richfield.ac.za",
                "role": "alumni",
                "campus": "Sandton Campus",
                "qualification": "IT",
                "academic_year": "Class of 2023",
                "verified": True,
                "headline": "Senior Full-Stack Engineer at Standard Bank SA | Alumni Mentor",
                "bio": "Graduated BSc IT Cum Laude. Now leading payment gateway systems engineering.",
                "skills": ["React", "Django", "PostgreSQL", "FinTech", "System Architecture"],
                "is_mentor": True,
                "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
            },
            {
                "user_id": "u_lect_01",
                "name": "Dr. Sarah Jenkins",
                "email": "lecturer@richfield.ac.za",
                "role": "lecturer",
                "campus": "Pretoria Campus",
                "qualification": "IT",
                "academic_year": "Faculty",
                "verified": True,
                "headline": "Senior Lecturer & Head of Computer Science Curriculum",
                "bio": "Researcher in Artificial Intelligence and distributed systems. Passionate about empowering South African youth.",
                "skills": ["Machine Learning", "Algorithms", "Curriculum Design", "Mentorship"],
                "is_mentor": True,
                "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
            },
            {
                "user_id": "u_rec_01",
                "name": "Lerato Ndlovu",
                "email": "recruiter@richfield.ac.za",
                "role": "recruiter",
                "campus": "Sandton Campus",
                "qualification": "Business",
                "academic_year": "Talent Partner",
                "verified": True,
                "headline": "Graduate Talent Acquisition Specialist at Vodacom SA",
                "bio": "Connecting South Africa's brightest technology and business graduates with high-impact careers.",
                "skills": ["Talent Acquisition", "Technical Recruiting", "Campus Hiring", "HR"],
                "is_mentor": False,
                "avatar_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
            },
            {
                "user_id": "u_admin_01",
                "name": "Campus Administrator",
                "email": "admin@richfield.ac.za",
                "role": "admin",
                "campus": "Midrand Campus",
                "qualification": "IT",
                "academic_year": "Institutional Directorate",
                "verified": True,
                "headline": "Director of Institutional Technology & Academic Affairs",
                "bio": "Overseeing national digital transformation, library logistics, and student services.",
                "skills": ["Campus Governance", "IT Directorate", "Academic Administration"],
                "is_mentor": False,
                "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
            },
            {
                "user_id": "u_stud_02",
                "name": "Zanele Khumalo",
                "email": "zanele.k@richfield.ac.za",
                "role": "student",
                "campus": "Durban Campus",
                "qualification": "Business",
                "academic_year": "2nd Year",
                "verified": True,
                "headline": "BCom Accounting & Financial Analytics Student",
                "bio": "Aspiring chartered financial analyst. Active in student entrepreneurship society.",
                "skills": ["Financial Modeling", "Excel", "Data Analytics", "Auditing"],
                "is_mentor": False,
                "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
            }
        ]

        for u in users_data:
            user_id = u["user_id"]
            email = u["email"]
            existing = UserProfile.objects.filter(email=email).first() or UserProfile.objects.filter(user_id=user_id).first()
            if existing:
                for k, v in u.items():
                    setattr(existing, k, v)
                existing.save()
            else:
                UserProfile.objects.create(**u)

        self.stdout.write(f"Created/Updated {len(users_data)} users.")

        # 2. Jobs
        jobs_data = [
            {
                "job_id": "job_001",
                "title": "Graduate Cloud & DevOps Engineer",
                "company": "Amazon AWS South Africa",
                "location": "Cape Town / Johannesburg (Hybrid)",
                "campus_target": "All Campuses",
                "job_type": "Graduate Programme",
                "qualification": "IT",
                "stipend_or_salary": "R35,000 / month",
                "deadline": "15 Nov 2026",
                "description": "Join AWS as an Associate Cloud Engineer. Comprehensive 18-month rotational program covering cloud architecture, Kubernetes, and serverless compute.",
                "requirements": ["BSc IT or Diploma in IT", "Python or TypeScript proficiency", "Solid understanding of networking"],
                "status": "approved",
                "recruiter_id": "u_rec_01"
            },
            {
                "job_id": "job_002",
                "title": "Junior Business Analyst (FinTech)",
                "company": "Standard Bank SA",
                "location": "Johannesburg CBD",
                "campus_target": "Gauteng Campuses",
                "job_type": "Full-Time Junior",
                "qualification": "Business",
                "stipend_or_salary": "R28,000 / month",
                "deadline": "30 Oct 2026",
                "description": "Collaborate with cross-functional agile teams to analyze digital banking user flows and financial transaction pipelines.",
                "requirements": ["BCom or BBA", "Analytical thinking", "SQL or PowerBI is an advantage"],
                "status": "approved",
                "recruiter_id": "u_rec_01"
            },
            {
                "job_id": "job_003",
                "title": "Richfield Academic Excellence Bursary 2026",
                "company": "Richfield Directorate Foundation",
                "location": "National Campuses",
                "campus_target": "All Campuses",
                "job_type": "Bursary",
                "qualification": "IT",
                "stipend_or_salary": "100% Tuition + Laptop Allowance",
                "deadline": "31 Dec 2026",
                "description": "Full merit-based bursary covering tuition, prescribed textbooks, and personal tech stipend for top-performing 2nd and 3rd year students.",
                "requirements": ["Academic average > 70%", "Enrolled in Degree or Diploma"],
                "status": "approved",
                "recruiter_id": "u_rec_01"
            }
        ]

        for j in jobs_data:
            JobOpportunity.objects.update_or_create(job_id=j["job_id"], defaults=j)

        self.stdout.write(f"Created/Updated {len(jobs_data)} job opportunities.")

        # 3. Job Applications
        app_data = {
            "application_id": "app_001",
            "job_id": "job_001",
            "applicant_id": "u_stud_01",
            "status": "under_review",
            "resume_url": "https://richfield.ac.za/resumes/kagiso_molefe_devops.pdf",
            "cover_note": "I have completed AWS Cloud Practitioner and built Kubernetes clusters on my CodeHub profile."
        }
        JobApplication.objects.update_or_create(application_id=app_data["application_id"], defaults=app_data)

        # 4. Mentorship Sessions
        session_data = {
            "session_id": "sess_001",
            "mentor_id": "u_alumni_01",
            "mentee_id": "u_stud_01",
            "topic": "Microservices Architecture & Cracking the AWS Technical Interview",
            "domain": "Cloud Computing",
            "status": "scheduled",
            "scheduled_time": "Thursday 14:00 (Google Meet)",
            "notes": "Review Kagiso's GitHub portfolio and architecture diagrams."
        }
        MentorshipSession.objects.update_or_create(session_id=session_data["session_id"], defaults=session_data)

        # 5. Campus Posts
        post_data = {
            "post_id": "post_001",
            "author_id": "u_stud_01",
            "content": "Just deployed my Django REST backend with SQLite persistence for our campus IT project! Anyone interested in peer testing the endpoints?",
            "cohort": "BSc IT 3rd Year",
            "likes_count": 14,
            "moderation_status": "approved",
            "tags": ["Django", "Python", "FullStack", "BScIT"]
        }
        CampusPost.objects.update_or_create(post_id=post_data["post_id"], defaults=post_data)

        # 6. Library Books
        books_data = [
            {
                "book_id": "bk_001",
                "title": "Cloud Computing: Concepts, Technology & Architecture",
                "author": "Thomas Erl, Ricardo Puttini",
                "isbn": "978-0133387520",
                "module_code": "IT301",
                "holding_campus": "Midrand Campus",
                "total_copies": 8,
                "available_copies": 5
            },
            {
                "book_id": "bk_002",
                "title": "Database Systems: Design, Implementation, & Management",
                "author": "Carlos Coronel, Steven Morris",
                "isbn": "978-1337627900",
                "module_code": "IT202",
                "holding_campus": "Pretoria Campus",
                "total_copies": 6,
                "available_copies": 2
            },
            {
                "book_id": "bk_003",
                "title": "Corporate Finance: European & Global Edition",
                "author": "David Hillier, Stephen Ross",
                "isbn": "978-1526848086",
                "module_code": "BCOM201",
                "holding_campus": "Sandton Campus",
                "total_copies": 10,
                "available_copies": 6
            }
        ]

        for b in books_data:
            LibraryBook.objects.update_or_create(book_id=b["book_id"], defaults=b)

        # 7. Book Transfer Request
        transfer_data = {
            "transfer_id": "tr_001",
            "book_id": "bk_002",
            "student_id": "u_stud_01",
            "from_campus": "Pretoria Campus",
            "to_campus": "Midrand Campus",
            "status": "in_transit",
            "courier_tracking_number": "RFC-PTA-MID-8492"
        }
        BookTransferRequest.objects.update_or_create(transfer_id=transfer_data["transfer_id"], defaults=transfer_data)

        # 8. Lost & Found Items
        lost_data = {
            "item_id": "lf_001",
            "title": "HP Envy x360 Charger (65W USB-C)",
            "category": "Electronics",
            "campus_location": "Sandton Campus - Computer Lab 3",
            "description": "Black HP USB-C laptop charger with Richfield student sticker on the adapter block.",
            "status": "held_at_security",
            "held_at_security_desk": True,
            "reported_by_id": "u_admin_01"
        }
        LostAndFoundItem.objects.update_or_create(item_id=lost_data["item_id"], defaults=lost_data)

        # 9. Campus Announcements with high-res campus pictures
        ann_data_list = [
            {
                "announcement_id": "ann_001",
                "title": "End of Semester 2 National Examination Timetables Released",
                "content": "Official examination timetables for all Higher Certificate, Diploma, Degree, and Postgraduate qualifications are now available on the portal. Please verify your exam venues and identity documents.",
                "target_audience": "All Students",
                "priority": "high",
                "image_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80",
                "image_caption": "Richfield Newtown Campus Academic Plaza & Examination Centre"
            },
            {
                "announcement_id": "ann_002",
                "title": "Annual Inter-Campus Hackathon & Career Runway 2026",
                "content": "Registrations are now open for teams across all 9 Richfield campuses. Sponsored by AWS, Vodacom, and Standard Bank with direct graduate recruitment opportunities.",
                "target_audience": "IT & Business",
                "priority": "normal",
                "image_url": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80",
                "image_caption": "Interactive Computer Systems Laboratory & National Hackathon Showcase"
            },
            {
                "announcement_id": "ann_003",
                "title": "New High-Speed Fibre & Cloud Computing Lab Launched at Sandton",
                "content": "Richfield IT Directorate has upgraded the Sandton Campus innovation lab with dedicated 10Gbps symmetric fibre, AWS cloud sandboxes, and collaborative AI workstations.",
                "target_audience": "IT Students",
                "priority": "normal",
                "image_url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
                "image_caption": "Sandton Campus Cloud Computing & Distributed Systems Workstation"
            }
        ]

        for a in ann_data_list:
            CampusAnnouncement.objects.update_or_create(announcement_id=a["announcement_id"], defaults=a)

        self.stdout.write(self.style.SUCCESS("Richfield institutional database seeded successfully!"))
