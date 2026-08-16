// Module for parsing CSV files and Anki export (.txt) with distractor generation & validation

export class CSVParser {
  static cleanHTML(text) {
    if (!text) return '';
    let cleaned = text.replace(/&nbsp;/g, ' ')
                      .replace(/<br\s*\/?>/gi, '\n')
                      .replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, '')
                      .replace(/\{\{c\d+::(.*?)(?:::.*?)?\}\}/g, '$1')
                      .trim();
    return cleaned;
  }

  static parseMultilineRecords(text) {
    const records = [];
    let currentRecord = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if ((char === '\t' || char === ';') && !inQuotes) {
        // add the current field to the current record
        currentRecord.push(currentField.trim());
        currentField = '';
      } else if (char === '\n' && !inQuotes) {
        currentRecord.push(currentField.trim());
        if (currentRecord.length > 0 && !currentRecord[0].startsWith('#')) {
          records.push(currentRecord);
        }
        currentRecord = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }

    if (currentField || currentRecord.length > 0) {
      currentRecord.push(currentField.trim());
      records.push(currentRecord);
    }

    return records;
  }

  static parseQCMOptions(questionText, answerRaw) {
    const qcmPattern = /\(?\s*a\)\s*(.*?)\s+b\)\s*(.*?)\s+c\)\s*(.*?)\s+d\)\s*(.*?)\s*\)?$/i.exec(questionText);

    if (qcmPattern) {
      const optA = 'a) ' + qcmPattern[1].trim();
      const optB = 'b) ' + qcmPattern[2].trim();
      const optC = 'c) ' + qcmPattern[3].trim();
      const optD = 'd) ' + qcmPattern[4].trim();

      const cleanQ = questionText.slice(0, qcmPattern.index).trim();
      const options = [optA, optB, optC, optD];

      const ansClean = this.cleanHTML(answerRaw);
      let correctOpt = null;

      for (const opt of options) {
        const letter = opt[0].toLowerCase();
        if (ansClean.toLowerCase().includes(`${letter})`) || ansClean.toLowerCase().startsWith(letter)) {
          correctOpt = opt;
          break;
        }
      }

      if (!correctOpt) correctOpt = options[0];

      return { question: cleanQ, options, correct: correctOpt, explanation: ansClean };
    }

    return null;
  }

  static parse(text) {
    try {
      if (!text || text.trim() === '') {
        return { success: false, error: 'Fichier vide ou illisible.' };
      }

      const records = this.parseMultilineRecords(text);
      if (records.length === 0) {
        return { success: false, error: 'Aucun enregistrement valide trouvé dans ce fichier.' };
      }

      const isAnkiDeck = records[0].length >= 3 && (records[0][0].includes('::') || records[0][1].includes('::'));

      const questions = [];
      const allAnswers = [];

      for (let idx = 0; idx < records.length; idx++) {
        const r = records[idx];
        let qRaw = '';
        let aRaw = '';
        let lineNo = idx + 1;

        if (isAnkiDeck && r.length >= 4) {
          qRaw = r[2];
          aRaw = r[3];
        } else if (r.length >= 2) {
          qRaw = r[0];
          aRaw = r[1];
        } else {
          continue;
        }

        const qClean = this.cleanHTML(qRaw);
        const aClean = this.cleanHTML(aRaw);

        if (!qClean) {
          return { success: false, error: `❌ Ligne ${lineNo} : La question est manquante ou vide.` };
        }

        if (!aClean) {
          return { success: false, error: `❌ Ligne ${lineNo} : Aucune bonne réponse spécifiée pour la question "${qClean.slice(0, 30)}...".` };
        }

        const qcmRes = this.parseQCMOptions(qClean, aRaw);

        if (qcmRes) {
          if (!qcmRes.correct) {
            return { success: false, error: `❌ Ligne ${lineNo} : Impossible d'identifier la bonne réponse.` };
          }
          questions.push({
            id: `imported_${Date.now()}_${idx}`,
            question: qcmRes.question,
            correct: qcmRes.correct,
            options: qcmRes.options,
            explanation: qcmRes.explanation
          });
        } else {
          let opts = [];
          let explanation = `Réponse : ${aClean}`;
          if (r.length >= 5 && !isAnkiDeck) {
            opts = [aClean, this.cleanHTML(r[2]), this.cleanHTML(r[3]), this.cleanHTML(r[4])];
            if (r.length >= 6) {
              const explicitExpl = this.cleanHTML(r[5]);
              if (explicitExpl) explanation = explicitExpl;
            }
          } else {
            allAnswers.push(aClean);
            opts = [aClean]; // Will generate distractors below
          }

          questions.push({
            id: `imported_${Date.now()}_${idx}`,
            question: qClean,
            correct: aClean,
            options: opts,
            explanation: explanation
          });
        }
      }

      if (questions.length === 0) {
        return { success: false, error: 'Aucune question valide n\'a pu être extraite.' };
      }

      // Generate distractors for 2-column cards if needed
      const uniqueAnswers = Array.from(new Set(allAnswers));
      questions.forEach((q, idx) => {
        if (q.options.length < 2) {
          const correct = q.correct;
          const others = uniqueAnswers.filter(a => a !== correct);
          const distractors = others.sort(() => Math.random() - 0.5).slice(0, 3);

          let counter = 1;
          while (distractors.length < 3) {
            const dummy = `Option alternative ${counter}`;
            if (!distractors.includes(dummy) && dummy !== correct) {
              distractors.push(dummy);
            }
            counter++;
          }
          q.options = [correct, distractors[0], distractors[1], distractors[2]].sort(() => Math.random() - 0.5);
        }
      });

      return {
        success: true,
        count: questions.length,
        isAnkiDeck,
        questions
      };
    } catch (e) {
      return { success: false, error: `Erreur d'analyse : ${e.message}` };
    }
  }
}
