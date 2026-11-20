from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def create_sample_resume(filename="sample_resume.pdf"):
    doc = SimpleDocTemplate(filename, pagesize=letter, leftMargin=36, rightMargin=36, topMargin=36, bottomMargin=36)
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle('Title', fontName='Helvetica-Bold', fontSize=18, leading=22, textColor=colors.HexColor('#1E1B4B'))
    heading_style = ParagraphStyle('Heading', fontName='Helvetica-Bold', fontSize=12, leading=16, textColor=colors.HexColor('#4F46E5'), spaceBefore=8, spaceAfter=4)
    body_style = ParagraphStyle('Body', fontName='Helvetica', fontSize=9.5, leading=13, textColor=colors.HexColor('#1E293B'))
    
    elements = []
    
    # Header
    elements.append(Paragraph("<b>John Doe</b>", title_style))
    elements.append(Paragraph("john.doe@example.com | +1 (555) 234-5678 | San Francisco, CA | linkedin.com/in/johndoe | github.com/johndoe", body_style))
    elements.append(Spacer(1, 10))
    
    # Professional Summary
    elements.append(Paragraph("PROFESSIONAL SUMMARY", heading_style))
    elements.append(Paragraph("Dedicated and results-oriented Software Developer with 2+ years experience building web applications and REST APIs. Passionate about writing scalable code, clean UI components, and integrating modern full-stack workflows.", body_style))
    elements.append(Spacer(1, 10))
    
    # Education
    elements.append(Paragraph("EDUCATION", heading_style))
    elements.append(Paragraph("<b>Bachelor of Technology in Computer Science & Engineering (B.Tech CSE)</b><br/>California State University | GPA: 3.8/4.0 | Graduated: May 2024", body_style))
    elements.append(Spacer(1, 10))
    
    # Technical Skills
    elements.append(Paragraph("TECHNICAL SKILLS", heading_style))
    elements.append(Paragraph("<b>Languages & Web:</b> Python, JavaScript (ES6+), HTML5, CSS3, SQL<br/><b>Frameworks & Libraries:</b> React.js, Node.js, Flask, Tailwind CSS<br/><b>Tools & Platforms:</b> Git, GitHub, REST APIs, Linux, Agile/Scrum", body_style))
    elements.append(Spacer(1, 10))
    
    # Projects
    elements.append(Paragraph("KEY PROJECTS", heading_style))
    elements.append(Paragraph("<b>E-Commerce Platform & Product Catalog</b> (React, Node.js, REST API, SQL)<br/>• Developed and deployed a responsive web application serving 500+ active users.<br/>• Architected RESTful endpoints and integrated JWT authentication reducing login latency by 25%.<br/>• Designed modern UI components using React hooks and Tailwind CSS.", body_style))
    elements.append(Spacer(1, 6))
    elements.append(Paragraph("<b>Real-Time Task & Project Tracker</b> (Python, Flask, JavaScript, SQLite)<br/>• Built interactive task management dashboard with live status filtering and automated email alerts.<br/>• Implemented relational database schemas and optimized SQL queries achieving sub-50ms response times.<br/>• Set up Git version control workflow with automated testing pipelines.", body_style))
    elements.append(Spacer(1, 10))
    
    # Experience
    elements.append(Paragraph("PROFESSIONAL EXPERIENCE", heading_style))
    elements.append(Paragraph("<b>Software Developer Intern</b> | TechCorp Solutions (June 2023 - Present)<br/>• Collaborated with an agile engineering team to design, test, and release frontend React components.<br/>• Implemented bug fixes and integrated external REST APIs, improving sprint delivery by 18%.<br/>• Participated in weekly peer code reviews and maintained technical documentation on GitHub.", body_style))
    elements.append(Spacer(1, 10))
    
    # Certifications
    elements.append(Paragraph("CERTIFICATIONS & ACHIEVEMENTS", heading_style))
    elements.append(Paragraph("• Certified Associate Python Programmer (PCAP)<br/>• HackerRank 5-Star Problem Solving Badge<br/>• Finalist at National Collegiate Hackathon 2023", body_style))
    
    doc.build(elements)
    print(f"Sample resume created successfully at {filename}")

if __name__ == "__main__":
    create_sample_resume("sample_resume.pdf")
