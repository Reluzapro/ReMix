import fs from 'fs/promises';
import { CSVParser } from './js/csvParser.js';

async function main() {
  try {
    const text = await fs.readFile('./converted_csvs/chapitre 1.csv', 'utf8');
    const res = CSVParser.parse(text);
    console.log(JSON.stringify({ success: res.success, count: res.count, isAnkiDeck: res.isAnkiDeck || false, sample: (res.questions||[]).slice(0,3) }, null, 2));
  } catch (e) {
    console.error('Erreur lors du test de parsing:', e);
    process.exit(2);
  }
}

main();
