import io
import datetime
from typing import Dict, Any

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)


class PDFReportGenerator:
    """
    Generates a high-quality, professional PDF report of the candidate's resume analysis,
    skill match evaluation, and personalized career roadmap using ReportLab.
    """

    def generate_pdf_report(self, analysis_data: Dict[str, Any]) -> io.BytesIO:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=40
        )

        styles = getSampleStyleSheet()

        # Custom Palette
        PRIMARY_COLOR = colors.HexColor("#1E1B4B")  # Deep Indigo
        ACCENT_PURPLE = colors.HexColor("#4F46E5")  # Vibrant Indigo
        SUCCESS_GREEN = colors.HexColor("#059669")  # Emerald
        DANGER_RED = colors.HexColor("#DC2626")     # Rose/Red
        TEXT_DARK = colors.HexColor("#0F172A")      # Slate 900
        TEXT_MUTED = colors.HexColor("#475569")     # Slate 600
        BG_LIGHT = colors.HexColor("#F8FAFC")       # Slate 50
        BORDER_COLOR = colors.HexColor("#E2E8F0")   # Slate 200

        # Custom Typography Styles
        title_style = ParagraphStyle(
            "DocTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=26,
            textColor=PRIMARY_COLOR,
            spaceAfter=4
        )
        tagline_style = ParagraphStyle(
            "DocTagline",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=ACCENT_PURPLE,
            spaceAfter=15
        )
        section_heading = ParagraphStyle(
            "SectionHeading",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=17,
            textColor=PRIMARY_COLOR,
            spaceBefore=14,
            spaceAfter=8
        )
        body_style = ParagraphStyle(
            "BodyDark",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=14,
            textColor=TEXT_DARK
        )
        body_muted = ParagraphStyle(
            "BodyMuted",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=12,
            textColor=TEXT_MUTED
        )
        bullet_success = ParagraphStyle(
            "BulletSuccess",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=13,
            textColor=TEXT_DARK,
            leftIndent=15,
            firstLineIndent=-12
        )
        bullet_danger = ParagraphStyle(
            "BulletDanger",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=13,
            textColor=TEXT_DARK,
            leftIndent=15,
            firstLineIndent=-12
        )

        elements = []

        # 1. Header Banner
        elements.append(Paragraph("AI Resume Analyzer &amp; Career Advisor", title_style))
        elements.append(Paragraph("Smart Resume Analysis &amp; Personalized Career Guidance Report", tagline_style))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=ACCENT_PURPLE, spaceAfter=15))

        # 2. Candidate Overview Card
        overview = analysis_data.get("overview", {})
        cand_name = overview.get("candidate_name", "Candidate")
        target_role = overview.get("target_role", "Software Developer")
        education = overview.get("education", "Bachelor's Degree")
        experience = overview.get("experience", "Fresher / Entry-Level")
        email = overview.get("email") or "Not Specified"
        date_str = datetime.datetime.now().strftime("%B %d, %Y")

        overview_data = [
            [
                Paragraph("<b>Candidate Name:</b>", body_style),
                Paragraph(cand_name, body_style),
                Paragraph("<b>Date Generated:</b>", body_style),
                Paragraph(date_str, body_style)
            ],
            [
                Paragraph("<b>Target Role:</b>", body_style),
                Paragraph(f"<b>{target_role}</b>", body_style),
                Paragraph("<b>Education:</b>", body_style),
                Paragraph(education, body_style)
            ],
            [
                Paragraph("<b>Experience:</b>", body_style),
                Paragraph(experience, body_style),
                Paragraph("<b>Contact Email:</b>", body_style),
                Paragraph(email, body_style)
            ]
        ]

        overview_table = Table(overview_data, colWidths=[105, 160, 105, 160])
        overview_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), BG_LIGHT),
            ("BOX", (0, 0), (-1, -1), 1, BORDER_COLOR),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ]))
        elements.append(overview_table)
        elements.append(Spacer(1, 14))

        # 3. Key Score Metrics Block
        scoring = analysis_data.get("scoring", {})
        matching = analysis_data.get("matching", {})
        resume_score = scoring.get("overall_score", 0)
        match_percentage = matching.get("skill_match_percentage", 0)

        metrics_data = [
            [
                Paragraph(
                    f"<font size=20 color='#4F46E5'><b>{resume_score}/100</b></font><br/>"
                    "<b>Overall Resume Score</b><br/>"
                    "<font size=8 color='#64748B'>Rule-based quality evaluation</font>",
                    styles["Normal"]
                ),
                Paragraph(
                    f"<font size=20 color='#059669'><b>{match_percentage}%</b></font><br/>"
                    "<b>Job Role Match Score</b><br/>"
                    f"<font size=8 color='#64748B'>{matching.get('matched_required_count', 0)} of {matching.get('total_required_count', 0)} required skills</font>",
                    styles["Normal"]
                ),
                Paragraph(
                    f"<font size=11 color='#1E1B4B'><b>Analysis Engine</b></font><br/>"
                    f"<font size=9.5 color='#0284C7'><b>{analysis_data.get('engine_mode', 'Local Fallback Engine')}</b></font><br/>"
                    "<font size=8 color='#64748B'>Key phrase &amp; skill matching</font>",
                    styles["Normal"]
                )
            ]
        ]
        metrics_table = Table(metrics_data, colWidths=[175, 175, 180])
        metrics_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#EEF2FF")),
            ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#C7D2FE")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#C7D2FE")),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("TOPPADDING", (0, 0), (-1, -1), 10),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ]))
        elements.append(metrics_table)
        elements.append(Spacer(1, 14))

        # 4. Resume Score Breakdown Table
        elements.append(Paragraph("Resume Quality Evaluation Breakdown", section_heading))
        cat_scores = scoring.get("category_scores", {})
        score_breakdown_data = [
            [
                Paragraph("<b>Evaluation Category</b>", body_style),
                Paragraph("<b>Earned Score</b>", body_style),
                Paragraph("<b>Max Points</b>", body_style),
                Paragraph("<b>Performance</b>", body_style)
            ]
        ]
        for key, val in cat_scores.items():
            pct = val.get("percentage", 0)
            status_text = "Excellent" if pct >= 80 else ("Good" if pct >= 60 else "Needs Improvement")
            score_breakdown_data.append([
                Paragraph(val.get("label", key), body_style),
                Paragraph(f"{val.get('score', 0)} pts", body_style),
                Paragraph(f"{val.get('max', 0)} pts", body_style),
                Paragraph(f"{pct}% ({status_text})", body_style)
            ])

        score_table = Table(score_breakdown_data, colWidths=[200, 100, 100, 130])
        score_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F1F5F9")),
            ("BOX", (0, 0), (-1, -1), 1, BORDER_COLOR),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ]))
        elements.append(score_table)
        elements.append(Spacer(1, 14))

        # 5. Skills Analysis (Matched vs Missing)
        elements.append(Paragraph("Skills Compatibility Analysis", section_heading))
        matched_skills = matching.get("matched_required_skills", [])
        missing_skills = matching.get("missing_required_skills", [])
        pref_matched = matching.get("matched_preferred_skills", [])

        skills_summary_data = [
            [
                Paragraph("<b>Skills Found on Resume (" + str(len(matched_skills)) + ")</b>", body_style),
                Paragraph("<b>Missing Required Skills (" + str(len(missing_skills)) + ")</b>", body_style)
            ],
            [
                Paragraph(
                    ", ".join(matched_skills) if matched_skills else "No core required skills matched yet.",
                    body_style
                ),
                Paragraph(
                    ", ".join(missing_skills) if missing_skills else "None! All required skills matched.",
                    body_style
                )
            ]
        ]
        if pref_matched:
            skills_summary_data.append([
                Paragraph("<b>Preferred / Secondary Skills Found</b>", body_style),
                Paragraph(", ".join(pref_matched), body_style)
            ])

        skills_table = Table(skills_summary_data, colWidths=[265, 265])
        skills_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (0, 0), colors.HexColor("#ECFDF5")),
            ("BACKGROUND", (1, 0), (1, 0), colors.HexColor("#FEF2F2")),
            ("BOX", (0, 0), (-1, -1), 1, BORDER_COLOR),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ]))
        elements.append(skills_table)
        elements.append(Spacer(1, 14))

        # 6. Strengths and Improvement Suggestions
        elements.append(Paragraph("Resume Strengths &amp; Actionable Suggestions", section_heading))
        strengths = scoring.get("strengths", [])
        suggestions = scoring.get("improvement_suggestions", [])

        strengths_p_list = []
        for s in strengths[:4]:
            strengths_p_list.append(Paragraph(f"• <font color='#059669'><b>Strength:</b></font> {s}", bullet_success))
            strengths_p_list.append(Spacer(1, 3))

        suggestions_p_list = []
        for sug in suggestions[:4]:
            suggestions_p_list.append(Paragraph(f"• <font color='#D97706'><b>Action:</b></font> {sug}", bullet_danger))
            suggestions_p_list.append(Spacer(1, 3))

        recs_data = [
            [
                Paragraph("<b>Identified Strengths</b>", body_style),
                Paragraph("<b>Actionable Improvements</b>", body_style)
            ],
            [
                strengths_p_list if strengths_p_list else Paragraph("N/A", body_style),
                suggestions_p_list if suggestions_p_list else Paragraph("Resume is well optimized.", body_style)
            ]
        ]
        recs_table = Table(recs_data, colWidths=[265, 265])
        recs_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), BG_LIGHT),
            ("BOX", (0, 0), (-1, -1), 1, BORDER_COLOR),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ]))
        elements.append(recs_table)
        elements.append(Spacer(1, 14))

        # 7. Personalized Career Roadmap
        roadmap = analysis_data.get("roadmap", [])
        if roadmap:
            elements.append(KeepTogether([
                Paragraph(f"Personalized Career Learning Roadmap ({target_role})", section_heading),
                Paragraph(
                    "Step-by-step sequential learning milestones tailored specifically to your detected skill gaps:",
                    body_muted
                ),
                Spacer(1, 6)
            ]))

            roadmap_data = [
                [
                    Paragraph("<b>Timeline</b>", body_style),
                    Paragraph("<b>Skill &amp; Milestone</b>", body_style),
                    Paragraph("<b>Priority</b>", body_style),
                    Paragraph("<b>Key Project Milestone</b>", body_style)
                ]
            ]

            for step in roadmap[:6]:
                roadmap_data.append([
                    Paragraph(step.get("weeks", "Week 1-2"), body_style),
                    Paragraph(f"<b>{step.get('skill', '')}</b><br/>{step.get('title', '')}", body_style),
                    Paragraph(f"<font color='#4F46E5'><b>{step.get('priority', 'High')}</b></font>", body_style),
                    Paragraph(step.get("milestone_project", "Build an integrated practical module."), body_muted)
                ])

            roadmap_table = Table(roadmap_data, colWidths=[80, 160, 80, 210])
            roadmap_table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#EEF2FF")),
                ("BOX", (0, 0), (-1, -1), 1, BORDER_COLOR),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, BORDER_COLOR),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ]))
            elements.append(roadmap_table)

        # 8. Footer & Educational Notice
        elements.append(Spacer(1, 20))
        elements.append(HRFlowable(width="100%", thickness=0.8, color=BORDER_COLOR, spaceAfter=8))
        disclaimer = (
            "Notice: This analysis report is generated by AI Resume Analyzer & Career Advisor for career guidance "
            "and educational development purposes. Scores represent resume content quality benchmarks and do not guarantee "
            "employment or recruitment decisions."
        )
        elements.append(Paragraph(disclaimer, body_muted))

        # Build PDF
        doc.build(elements)
        buffer.seek(0)
        return buffer
