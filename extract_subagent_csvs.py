import json
import re
import os

transcript_path = "/Users/remigaulue/.gemini/antigravity/brain/cb654248-f61e-4390-8fd8-600b74dc4691/.system_generated/logs/transcript_full.jsonl"
out_dir = "/Users/remigaulue/Desktop/site_web_de_revision/converted_csvs/"

subagents = {
    "7df87dff-6e63-4bae-8d27-4e764bf34f9f": "chapitre 5.csv",
    "84f1d575-6eb3-4573-88cf-e340cea6fdd0": "chapitre 8.csv",
    "5af25ecd-7d9d-4e2d-8f67-ab767ad02a1e": "chapitre 9.csv",
    "d81e9009-1c61-4f00-9360-7a0e7ee43efb": "chapitre 11.csv",
}

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
        except:
            continue
        if data.get('type') == 'SYSTEM_MESSAGE':
            content = data.get('content', '')
            for sa_id, filename in subagents.items():
                if f"sender={sa_id}" in content:
                    match = re.search(r'```(?:csv)?\n(.*?)\n```', content, re.DOTALL)
                    if match:
                        csv_data = match.group(1).strip()
                    else:
                        match2 = re.search(r'CSV Content:\n(.*)', content, re.DOTALL)
                        if match2:
                            csv_data = match2.group(1).strip()
                        else:
                            continue
                            
                    out_path = os.path.join(out_dir, filename)
                    with open(out_path, 'w', encoding='utf-8') as out_f:
                        out_f.write(csv_data + '\n')
                    print(f"Wrote {filename}")
