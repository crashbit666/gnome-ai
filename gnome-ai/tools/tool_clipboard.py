#!/usr/bin/env python3
import sys
import json
import subprocess

# tool.clipboard - High Value, Low Risk (R1/R3 depending on policy)
# Reads clipboard (requires verifying policy first in a real scenario) and summarizes
# For MVP, we assume permissions are handled by the Core before calling this tool.

def get_clipboard_content():
    try:
        # Using wl-paste for Wayland (GNOME default)
        result = subprocess.run(['wl-paste'], capture_output=True, text=True, timeout=1)
        return result.stdout.strip()
    except Exception:
        return ""

def main():
    # Read input from stdin (JSON)
    # real tool would parse args/stdin
    
    content = get_clipboard_content()
    if not content:
        print(json.dumps({"error": "Clipboard empty"}))
        return

    # In a real tool, this would call back to the LLM or handle the summary logic 
    # if it's a specific logic tool. Since this is an "Action Executor", 
    # it might just fetching the content for the Core to send to the LLM.
    
    print(json.dumps({
        "status": "success",
        "content": content,
        "action": "read_clipboard"
    }))

if __name__ == "__main__":
    main()
