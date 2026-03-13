# Association Analysis (Apriori) — Pure Python (No scikit-learn / No Weka)

This directory is a full submission-ready implementation for Apriori association analysis.
It follows the assignment restriction of **not using specialized data-mining libraries**.

## 1) Directory contents

- `apriori_experiment.py`
  - Main program that:
    - converts UCI raw data to transaction format,
    - mines frequent itemsets using Apriori,
    - compares both candidate-generation methods (`F(k-1)×F1` and `F(k-1)×F(k-1)`),
    - computes frequent/closed/maximal counts,
    - generates association rules (brute force and confidence-pruned),
    - reports top-5 rules by confidence and lift.
- `self_test.py`
  - Deterministic toy-data correctness check.
- `out/` (generated)
  - `results.json` machine-readable output.
  - `REPORT.md` table-style report.
  - `raw_data/` downloaded raw files.

## 2) Dependencies

- Python **3.10+**
- Standard library only (no pip packages required)

## 3) UCI datasets used (with links)

The script uses these files:

1. Mushroom:
   - `agaricus-lepiota.data`
   - https://archive.ics.uci.edu/ml/machine-learning-databases/mushroom/agaricus-lepiota.data
2. Car Evaluation:
   - `car.data`
   - https://archive.ics.uci.edu/ml/machine-learning-databases/car/car.data
3. Adult:
   - `adult.data`
   - https://archive.ics.uci.edu/ml/machine-learning-databases/adult/adult.data

## 4) Step-by-step run instructions

> Run from repository root (`/workspace/canvas-stage-craft`).

### Step 1 — Sanity check implementation

```bash
python3 association_analysis/self_test.py
```

Expected: a success line confirming correctness on toy data.

### Step 2 — Run full experiment (auto-download mode)

```bash
python3 association_analysis/apriori_experiment.py --output-dir association_analysis/out
```

This will download UCI files (if missing), run all experiments, and write outputs.

### Step 3 — Alternative: offline/manual-data mode

If your environment blocks outbound downloads:

1. Manually download the three UCI files.
2. Place them in (example): `association_analysis/manual_raw/`
   - `mushroom.data`
   - `car.data`
   - `adult.data`
3. Run:

```bash
python3 association_analysis/apriori_experiment.py \
  --data-dir association_analysis/manual_raw \
  --no-download \
  --output-dir association_analysis/out
```

This mode requires all files to already exist locally.

## 5) Data preprocessing details

- Every row becomes one transaction (`set` of items).
- Categorical values become item tokens like `a3=vhigh`.
- Missing values (`?`) are removed.
- For Adult dataset only:
  - numeric columns `[0,2,4,10,11,12]` are discretized into 3 quantile bins,
  - values become tokens like `a0=bin2`.

## 6) How to interpret output

## `results.json`

Top-level structure:

- `config`: experiment settings
- `datasets[<name>]`: one entry per dataset
  - `supports[<minsup>]`
    - `apriori.fk1xf1` and `apriori.fk1xfk1`
      - `total_candidates`: all generated candidate itemsets
      - `total_frequent_itemsets`: all frequent itemsets
      - `candidates_by_k`: candidates per itemset size `k`
    - `frequent_set_characterization`
      - `all_frequent_itemsets`
      - `closed_itemsets`
      - `maximal_itemsets`
    - `rules[<minconf>]`
      - `bruteforce.evaluated_rules`
      - `confidence_pruning.evaluated_rules`
      - `savings_vs_bruteforce.evaluated_rule_reduction_pct`
      - `top5_by_confidence`
      - `top5_by_lift`

### What metrics mean

- **Confidence** of `X -> Y`: `support(X∪Y) / support(X)`
- **Lift** of `X -> Y`: `confidence(X->Y) / support(Y)`
  - `lift > 1`: positive association
  - `lift = 1`: independence
  - `lift < 1`: negative association

### How to compare methods for the assignment

1. Compare `total_candidates` between `fk1xf1` and `fk1xfk1` (lower is better).
2. Compare closed/maximal counts against all frequent counts.
3. Compare `evaluated_rules` between brute force and confidence pruning.
4. Inspect top-5 by confidence and by lift for rule quality vs interestingness.

## 7) Notes for TA/grader reproducibility

- All experiments are deterministic for fixed input files.
- No random seeds or stochastic steps are used.
- If auto-download is blocked, use manual mode in section 4, Step 3.

## 8) Suggested submission packaging

Zip the full `association_analysis/` directory after producing outputs:

```bash
zip -r HW2.zip association_analysis
```

That zip will contain source, README, tests, and generated results.
