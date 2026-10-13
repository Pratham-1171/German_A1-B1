# Contributing to Sprachtreppe

Thanks for helping make German A1–B1 easier to study.

## Good first contributions

- Fix an incorrect example, translation or case ending.
- Add a short, level-appropriate example and an English gloss.
- Add a common mistake and explain the correction.
- Improve mobile readability or keyboard accessibility.
- Add a self-test with one unambiguous correct answer.

## Editing guidelines

1. Keep learner-facing explanations in plain English, with German examples.
2. Label the CEFR level and avoid assigning an exact *Netzwerk neu* chapter unless you have checked the relevant book edition.
3. Do not copy textbook pages or answer keys. Write original explanations and examples.
4. Put durable notes in Markdown under `docs/`. Add generated PDFs or exports under `assets/` or `pdf/`.
5. Edit app source under `course/` and never hand-edit generated `www/index.html`.
6. For grammar exercises, check the correct option index, the expected answer and the explanation carefully.

## Before opening a pull request

```bash
npm ci
npm test
python3 scripts/build-course-lms.py
```

Please describe the change, the level it helps, and any manual checks you performed. Keep changes focused so they can be reviewed and tested easily.
