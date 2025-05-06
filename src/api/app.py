from flask import Flask, request, jsonify
import openai
import os

from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/generate-report', methods=['POST'])
def generate_report():
    data = request.json
    answers = data.get('answers')
    additional_info = data.get('additionalInfo')

    # Generate the business insights report using OpenAI GPT-3.5
    prompt = f"Generate a business A.I. insights report based on the following answers: {answers}. Additional information: {additional_info}. Include actionable insights and potential strategies."

    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=1500
    )

    report = response.choices[0].text.strip()

    # Save the report to a PDF (this is just a placeholder for saving the PDF)
    report_filename = "Business_AI_Insights_Report.pdf"
    with open(report_filename, 'w') as f:
        f.write(report)

    # Upload the PDF to Google Drive or other service (omitted for brevity)

    # For now, we'll just send a dummy URL
    download_url = "https://drive.google.com/your_pdf_link"

    return jsonify({"downloadUrl": download_url})

if __name__ == '__main__':
    openai.api_key = os.getenv("OPENAI_API_KEY")
    app.run(host='0.0.0.0', port=8081)
