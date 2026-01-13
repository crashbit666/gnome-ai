#!/usr/bin/env python3
import sys
import json
import os
import datetime

# tool.quick_note - High Value, Low Risk (R1)
# Appends a note to a daily markdown file.

NOTES_DIR = os.path.expanduser("~/Documents/Notes/Daily")

def main():
    # Expecting input: {"note": "text to save"}
    input_data = sys.stdin.read()
    try:
        data = json.loads(input_data)
        note_text = data.get("note", "")
    except:
        note_text = "No content"

    today = datetime.date.today().isoformat()
    filename = os.path.join(NOTES_DIR, f"{today}.md")
    
    os.makedirs(NOTES_DIR, exist_ok=True)
    
    with open(filename, "a") as f:
        timestamp = datetime.datetime.now().strftime("%H:%M")
        f.write(f"\n- [{timestamp}] {note_text}")

    print(json.dumps({
        "status": "success",
        "file": filename,
        "message": "Note appended"
    }))

if __name__ == "__main__":
    main()
