import io
import csv
import tempfile
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

from app.services.data import DataService


def export_csv(work_year=None, job_category=None, experience_level=None) -> str:
    df = DataService.filter_cleaned(
        work_year=work_year,
        job_category=job_category,
        experience_level=experience_level,
        limit=5000,
    )
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(df.columns.tolist())
    for _, row in df.iterrows():
        writer.writerow(row.tolist())
    return output.getvalue()


def export_pdf(work_year=None, job_category=None, experience_level=None) -> bytes:
    df = DataService.filter_cleaned(
        work_year=work_year,
        job_category=job_category,
        experience_level=experience_level,
        limit=500,
    )

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=30, leftMargin=30)
    styles = getSampleStyleSheet()
    elements = []

    elements.append(Paragraph("Job Market Analysis Report", styles["Title"]))
    elements.append(Spacer(1, 12))
    elements.append(
        Paragraph(
            f"Generated report with {len(df)} records. "
            f"Filter: year={work_year or 'All'}, "
            f"category={job_category or 'All'}, "
            f"level={experience_level or 'All'}",
            styles["Normal"],
        )
    )
    elements.append(Spacer(1, 12))

    table_data = [df.columns.tolist()] + df.head(50).values.tolist()
    table = Table(table_data, repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2c3e50")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f5f5f5")]),
    ]))
    elements.append(table)

    doc.build(elements)
    buffer.seek(0)
    return buffer.getvalue()
