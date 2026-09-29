from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
import sys

def create_pdf():
    pdf_filename = "c:\\Users\\ASUS\\Desktop\\sih_2\\SkillPulse_Overview.pdf"
    
    # Setup document
    doc = SimpleDocTemplate(
        pdf_filename, 
        pagesize=letter,
        rightMargin=40, leftMargin=40,
        topMargin=50, bottomMargin=50
    )
    
    # Styles
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor("#4f46e5"),
        spaceAfter=20,
        alignment=1 # Center
    )
    
    subtitle_style = ParagraphStyle(
        'SubtitleStyle',
        parent=styles['Normal'],
        fontSize=12,
        textColor=colors.HexColor("#64748b"),
        spaceAfter=30,
        alignment=1
    )

    section_style = ParagraphStyle(
        'SectionStyle',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor("#1e293b"),
        spaceBefore=20,
        spaceAfter=15,
        borderPadding=5,
    )
    
    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontSize=11,
        lineHeight=16,
        textColor=colors.HexColor("#334155"),
        spaceAfter=15
    )

    highlight_style = ParagraphStyle(
        'HighlightStyle',
        parent=styles['Normal'],
        fontSize=11,
        lineHeight=16,
        textColor=colors.HexColor("#ffffff"),
        backColor=colors.HexColor("#0ea5e9"),
        borderPadding=8,
        spaceBefore=10,
        spaceAfter=10,
        borderRadius=5
    )

    elements = []
    
    # Header
    elements.append(Paragraph("<b>SkillPulse AI</b> ⚡", title_style))
    elements.append(Paragraph("A Beginner-Friendly Overview & Architecture Guide", subtitle_style))
    
    # What is What Section
    elements.append(Paragraph("<b>1. The Tech Stack (What is What?)</b>", section_style))
    
    tech_data = [
        [Paragraph("<b>🧩 Frontend</b> (The Face)", body_style), Paragraph("Built with <b>React</b>. This is the beautiful, interactive website that you actually see and click on. It includes the user dashboards and the Light/Dark mode.", body_style)],
        [Paragraph("<b>🚦 Backend</b> (The Traffic Cop)", body_style), Paragraph("Built with <b>Node.js & Express</b>. It sits securely in the middle. When you click a button on the website, the backend fetches data, checks security, and sends the answer back to your screen.", body_style)],
        [Paragraph("<b>🗄️ Database</b> (The Filing Cabinet)", body_style), Paragraph("Built with <b>MongoDB</b>. This safely stores all the long-term information: user accounts, the 18,000+ training records, district details, and live job postings.", body_style)],
        [Paragraph("<b>🧠 Machine Learning</b> (The Prediction Engine)", body_style), Paragraph("Built with <b>Python (FastAPI)</b>. This is a separate, highly intelligent calculator. It scans thousands of real job postings to figure out what skills are trending and predicts the probability of a student getting hired.", body_style)],
    ]
    
    t = Table(tech_data, colWidths=[150, 350])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), colors.HexColor("#e0e7ff")),
        ('BACKGROUND', (0, 1), (0, 1), colors.HexColor("#fce7f3")),
        ('BACKGROUND', (0, 2), (0, 2), colors.HexColor("#dcfce7")),
        ('BACKGROUND', (0, 3), (0, 3), colors.HexColor("#fef3c7")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor("#e2e8f0")),
        ('PADDING', (0, 0), (-1, -1), 12),
    ]))
    
    elements.append(t)
    elements.append(Spacer(1, 25))
    
    # Unique Selling Points Section
    elements.append(Paragraph("<b>2. Unique Selling Points (Why this project is special)</b>", section_style))
    
    usp1 = "<b>1. The Auto-Updating Syllabus (No More Outdated Classes)</b><br/>Instead of humans taking 5 years to rewrite a syllabus, the AI constantly reads real job ads (like from LinkedIn). It automatically points out exactly which college subjects are useless now (e.g., old mechanical engines) and exactly what new topics must be taught instead (e.g., Electric Vehicles)."
    elements.append(Paragraph(usp1, body_style))
    
    usp2 = "<b>2. The 'No-Guessing' District Planner</b><br/>The AI predicts exactly how many jobs will open up in a specific city (like Pune or Bengaluru) over the next 3 years. It then tells the government exactly how many training seats to fund, preventing both wasted budget and graduate unemployment."
    elements.append(Paragraph(usp2, body_style))
    
    usp3 = "<b>3. The Direct Employer Loop</b><br/>Real companies (like Tata Motors or Infosys) can log into the platform, view the updated syllabus, vote 'Yes' or 'No' on what is being taught, and directly pledge to hire the students who complete it."
    elements.append(Paragraph(usp3, body_style))
    
    usp4 = "<b>4. Zero-Downtime Guarantee</b><br/>If the Python Machine Learning engine ever crashes or goes offline for maintenance, the Node.js backend has a built-in 'backup' math formula. This means the website keeps working perfectly for the user without ever showing an error screen."
    elements.append(Paragraph(usp4, body_style))
    
    elements.append(Spacer(1, 15))
    elements.append(Paragraph("<b>End of Summary</b>", subtitle_style))
    
    # Build PDF
    doc.build(elements)
    print("PDF generated successfully at:", pdf_filename)

if __name__ == "__main__":
    create_pdf()
