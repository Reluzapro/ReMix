import csv
import json

def clean(s):
    if s is None: return ''
    return s.strip()

questions = []
with open('converted_csvs/chapitre 1.csv', encoding='utf-8') as f:
    reader = csv.reader(f, delimiter=';')
    for idx, row in enumerate(reader, start=1):
        if not row or row[0].strip().startswith('#'):
            continue
        q = clean(row[0]) if len(row) >= 1 else ''
        correct = clean(row[1]) if len(row) >= 2 else ''
        wrongs = [clean(row[i]) for i in range(2,5) if i < len(row)]
        explanation = clean(row[5]) if len(row) >= 6 else ''
        questions.append({
            'line': idx,
            'question': q,
            'correct': correct,
            'wrongs': wrongs,
            'explanation': explanation,
            'raw_cols': len(row)
        })

print(json.dumps({'count': len(questions), 'sample': questions[:3]}, ensure_ascii=False, indent=2))
