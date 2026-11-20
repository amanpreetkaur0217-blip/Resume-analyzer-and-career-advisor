import threading
import time
import requests
import os
from app import app

def run_server():
    app.run(host="127.0.0.1", port=5001, debug=False, use_reloader=False)

def test_live_api():
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    
    # Wait for server to start
    time.sleep(1.5)
    
    base_url = "http://127.0.0.1:5001/api"
    
    # 1. Health check
    res_health = requests.get(f"{base_url}/health")
    print(f"[LIVE HTTP] Health Check: Status {res_health.status_code}, Body: {res_health.json()}")
    assert res_health.status_code == 200
    
    # 2. Job Roles
    res_roles = requests.get(f"{base_url}/job-roles")
    print(f"[LIVE HTTP] Job Roles: Status {res_roles.status_code}, Found {len(res_roles.json().get('roles', []))} roles")
    assert res_roles.status_code == 200
    
    # 3. Analyze Resume with real PDF file upload
    pdf_path = os.path.join(os.path.dirname(__file__), "sample_resume.pdf")
    with open(pdf_path, "rb") as f:
        files = {"resume": ("sample_resume.pdf", f, "application/pdf")}
        data = {"role": "Full Stack Developer"}
        res_analyze = requests.post(f"{base_url}/analyze", files=files, data=data)
    
    print(f"[LIVE HTTP] Analyze Endpoint: Status {res_analyze.status_code}")
    assert res_analyze.status_code == 200
    analysis = res_analyze.json()
    print(f"  -> Candidate: {analysis['overview']['candidate_name']}")
    print(f"  -> Education: {analysis['overview']['education']}")
    print(f"  -> Resume Score: {analysis['scoring']['overall_score']}/100")
    print(f"  -> Skill Match: {analysis['matching']['skill_match_percentage']}%")
    print(f"  -> Matched Skills: {analysis['matching']['matched_required_skills']}")
    print(f"  -> Missing Skills: {analysis['matching']['missing_required_skills']}")
    print(f"  -> Engine: {analysis['engine_info']['active_mode']}")
    print(f"  -> Roadmap Milestones: {len(analysis['roadmap'])} steps")
    
    # 4. Download PDF report
    res_report = requests.post(f"{base_url}/download-report", json=analysis)
    print(f"[LIVE HTTP] Download Report Endpoint: Status {res_report.status_code}, Content-Type: {res_report.headers.get('Content-Type')}, Size: {len(res_report.content)} bytes")
    assert res_report.status_code == 200
    assert "application/pdf" in res_report.headers.get("Content-Type", "")
    assert len(res_report.content) > 1000
    
    print("\n>>> ALL LIVE HTTP NETWORK TESTS PASSED SUCCESSFULLY! <<<")

if __name__ == "__main__":
    test_live_api()
