#!/usr/bin/env python3
"""Apriori association-analysis pipeline without specialized data-mining libraries.

Implements:
- Frequent itemset mining with Apriori using both candidate generation methods:
  1) F(k-1) x F1
  2) F(k-1) x F(k-1)
- Candidate/itemset accounting
- Closed and maximal frequent itemset counting
- Association-rule mining via brute force and confidence-based pruning
- Top-5 rules by confidence and by lift

The script can download UCI datasets automatically or read pre-downloaded files.
"""

from __future__ import annotations

import argparse
import csv
import itertools
import json
import math
import time
import urllib.request
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, FrozenSet, Iterable, List, Sequence, Set, Tuple


DATASETS = {
    "mushroom": {
        "urls": [
            "https://archive.ics.uci.edu/ml/machine-learning-databases/mushroom/agaricus-lepiota.data",
            "http://archive.ics.uci.edu/ml/machine-learning-databases/mushroom/agaricus-lepiota.data",
        ],
        "filename": "mushroom.data",
        "supports": [0.6, 0.45, 0.3],
    },
    "car": {
        "urls": [
            "https://archive.ics.uci.edu/ml/machine-learning-databases/car/car.data",
            "http://archive.ics.uci.edu/ml/machine-learning-databases/car/car.data",
        ],
        "filename": "car.data",
        "supports": [0.5, 0.35, 0.2],
    },
    "adult": {
        "urls": [
            "https://archive.ics.uci.edu/ml/machine-learning-databases/adult/adult.data",
            "http://archive.ics.uci.edu/ml/machine-learning-databases/adult/adult.data",
        ],
        "filename": "adult.data",
        "supports": [0.35, 0.25, 0.15],
    },
}
CONF_LEVELS = [0.5, 0.7, 0.85]


@dataclass
class DatasetTransactions:
    name: str
    transactions: List[Set[int]]
    item_to_id: Dict[str, int]
    id_to_item: Dict[int, str]


@dataclass
class AprioriRunResult:
    method: str
    min_support: float
    min_support_count: int
    frequent_itemsets: Dict[int, Dict[FrozenSet[int], int]]
    total_frequent: int
    total_candidates: int
    candidates_by_k: Dict[int, int]
    runtime_sec: float


@dataclass
class RuleMiningResult:
    method: str
    min_confidence: float
    evaluated_rules: int
    accepted_rules: List[Tuple[FrozenSet[int], FrozenSet[int], float, float, int, int, int]]
    runtime_sec: float


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def _download_with_headers(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as response:
        return response.read()


def ensure_dataset_file(dataset_name: str, destination: Path, allow_download: bool = True) -> None:
    if destination.exists() and destination.stat().st_size > 0:
        return

    if not allow_download:
        raise FileNotFoundError(
            f"Missing local dataset file: {destination}. "
            "Provide this file manually or rerun without --no-download."
        )

    attempts: List[str] = []
    for url in DATASETS[dataset_name]["urls"]:
        try:
            print(f"Downloading {url} -> {destination}")
            content = _download_with_headers(url)
            destination.write_bytes(content)
            return
        except Exception as exc:
            attempts.append(f"{url} :: {exc}")

    joined = "\n  - " + "\n  - ".join(attempts)
    raise RuntimeError(
        "Could not download dataset. Tried URLs:" + joined +
        f"\n\nYou can manually download and place the file at: {destination}"
    )


def quantile_edges(values: List[float], bins: int = 3) -> List[float]:
    if not values:
        return []
    sorted_vals = sorted(values)
    edges: List[float] = []
    for b in range(1, bins):
        idx = min(len(sorted_vals) - 1, max(0, int((len(sorted_vals) * b) / bins)))
        edges.append(sorted_vals[idx])
    return edges


def assign_bin(value: float, edges: Sequence[float]) -> str:
    if not edges:
        return "bin0"
    for i, edge in enumerate(edges):
        if value <= edge:
            return f"bin{i}"
    return f"bin{len(edges)}"


def load_generic_csv(path: Path) -> List[Set[str]]:
    transactions: List[Set[str]] = []
    with path.open("r", encoding="utf-8") as f:
        reader = csv.reader(f)
        for row in reader:
            if not row:
                continue
            tx = {f"a{idx}={val.strip()}" for idx, val in enumerate(row) if val.strip() and val.strip() != "?"}
            if tx:
                transactions.append(tx)
    return transactions


def load_adult(path: Path) -> List[Set[str]]:
    rows: List[List[str]] = []
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = [p.strip() for p in line.split(",")]
            if len(parts) != 15:
                continue
            if any(p == "?" for p in parts):
                continue
            rows.append(parts)

    numeric_cols = [0, 2, 4, 10, 11, 12]
    numeric_values: Dict[int, List[float]] = {c: [] for c in numeric_cols}
    for row in rows:
        for c in numeric_cols:
            numeric_values[c].append(float(row[c]))

    edges = {c: quantile_edges(numeric_values[c], bins=3) for c in numeric_cols}

    transactions: List[Set[str]] = []
    for row in rows:
        tx: Set[str] = set()
        for c, val in enumerate(row):
            if c in numeric_cols:
                tx.add(f"a{c}={assign_bin(float(val), edges[c])}")
            else:
                tx.add(f"a{c}={val}")
        transactions.append(tx)
    return transactions


def build_dataset(name: str, raw_file: Path) -> DatasetTransactions:
    if name in {"mushroom", "car"}:
        transactions = load_generic_csv(raw_file)
    elif name == "adult":
        transactions = load_adult(raw_file)
    else:
        raise ValueError(f"Unknown dataset: {name}")

    unique_items = sorted({item for tx in transactions for item in tx})
    item_to_id = {item: idx for idx, item in enumerate(unique_items)}
    id_to_item = {idx: item for item, idx in item_to_id.items()}
    tx_ids: List[Set[int]] = [{item_to_id[item] for item in tx} for tx in transactions]

    return DatasetTransactions(name=name, transactions=tx_ids, item_to_id=item_to_id, id_to_item=id_to_item)


def count_singletons(transactions: List[Set[int]]) -> Dict[FrozenSet[int], int]:
    counter: Dict[FrozenSet[int], int] = defaultdict(int)
    for tx in transactions:
        for item in tx:
            counter[frozenset([item])] += 1
    return dict(counter)


def all_subsets_frequent(candidate: Tuple[int, ...], prev_set: Set[FrozenSet[int]]) -> bool:
    k = len(candidate)
    for subset in itertools.combinations(candidate, k - 1):
        if frozenset(subset) not in prev_set:
            return False
    return True


def gen_candidates_fk1_f1(prev_freq: Dict[FrozenSet[int], int], freq1_items: Sequence[int], k: int) -> Set[FrozenSet[int]]:
    candidates: Set[FrozenSet[int]] = set()
    prev_sets = set(prev_freq.keys())

    for fset in prev_freq.keys():
        max_item = max(fset)
        for item in freq1_items:
            if item in fset or item <= max_item:
                continue
            candidate_tuple = tuple(sorted(fset | {item}))
            if len(candidate_tuple) == k and all_subsets_frequent(candidate_tuple, prev_sets):
                candidates.add(frozenset(candidate_tuple))

    return candidates


def gen_candidates_fk1_fk1(prev_freq: Dict[FrozenSet[int], int], k: int) -> Set[FrozenSet[int]]:
    candidates: Set[FrozenSet[int]] = set()
    prev_sets = set(prev_freq.keys())
    sorted_prev = sorted(tuple(sorted(fs)) for fs in prev_freq.keys())

    for i in range(len(sorted_prev)):
        for j in range(i + 1, len(sorted_prev)):
            a = sorted_prev[i]
            b = sorted_prev[j]
            if a[: k - 2] != b[: k - 2]:
                break
            merged = tuple(sorted(set(a) | set(b)))
            if len(merged) == k and all_subsets_frequent(merged, prev_sets):
                candidates.add(frozenset(merged))

    return candidates


def count_candidates(transactions: List[Set[int]], candidates: Iterable[FrozenSet[int]]) -> Dict[FrozenSet[int], int]:
    cand_list = list(candidates)
    counts = {c: 0 for c in cand_list}

    for tx in transactions:
        for c in cand_list:
            if c.issubset(tx):
                counts[c] += 1

    return counts


def apriori(transactions: List[Set[int]], min_support: float, method: str) -> AprioriRunResult:
    start = time.time()
    num_tx = len(transactions)
    min_count = max(1, math.ceil(min_support * num_tx))

    singleton_counts = count_singletons(transactions)
    l1 = {itemset: cnt for itemset, cnt in singleton_counts.items() if cnt >= min_count}
    frequent_itemsets: Dict[int, Dict[FrozenSet[int], int]] = {1: l1}

    total_candidates = len(singleton_counts)
    candidates_by_k: Dict[int, int] = {1: len(singleton_counts)}
    freq1_items = sorted(next(iter(fs)) for fs in l1.keys())

    k = 2
    prev = l1
    while prev:
        if method == "fk1xf1":
            candidates_k = gen_candidates_fk1_f1(prev, freq1_items, k)
        elif method == "fk1xfk1":
            candidates_k = gen_candidates_fk1_fk1(prev, k)
        else:
            raise ValueError(f"Unknown method: {method}")

        if not candidates_k:
            break

        total_candidates += len(candidates_k)
        candidates_by_k[k] = len(candidates_k)

        counts_k = count_candidates(transactions, candidates_k)
        lk = {itemset: cnt for itemset, cnt in counts_k.items() if cnt >= min_count}
        if not lk:
            break

        frequent_itemsets[k] = lk
        prev = lk
        k += 1

    runtime = time.time() - start
    total_frequent = sum(len(level) for level in frequent_itemsets.values())

    return AprioriRunResult(
        method=method,
        min_support=min_support,
        min_support_count=min_count,
        frequent_itemsets=frequent_itemsets,
        total_frequent=total_frequent,
        total_candidates=total_candidates,
        candidates_by_k=candidates_by_k,
        runtime_sec=runtime,
    )


def flatten_frequent(frequent_itemsets: Dict[int, Dict[FrozenSet[int], int]]) -> Dict[FrozenSet[int], int]:
    out: Dict[FrozenSet[int], int] = {}
    for level in frequent_itemsets.values():
        out.update(level)
    return out


def count_closed_maximal(frequent_itemsets: Dict[int, Dict[FrozenSet[int], int]]) -> Tuple[int, int]:
    by_size = {k: list(level.keys()) for k, level in frequent_itemsets.items()}
    all_supports = flatten_frequent(frequent_itemsets)

    max_k = max(by_size.keys())
    closed_count = 0
    maximal_count = 0

    for k in sorted(by_size.keys()):
        for itemset in by_size[k]:
            has_frequent_superset = False
            has_equal_support_superset = False

            for larger_k in range(k + 1, max_k + 1):
                for superset in by_size.get(larger_k, []):
                    if itemset.issubset(superset):
                        has_frequent_superset = True
                        if all_supports[superset] == all_supports[itemset]:
                            has_equal_support_superset = True
                            break
                if has_equal_support_superset:
                    break

            if not has_equal_support_superset:
                closed_count += 1
            if not has_frequent_superset:
                maximal_count += 1

    return closed_count, maximal_count


def generate_rules_bruteforce(
    frequent_supports: Dict[FrozenSet[int], int],
    num_transactions: int,
    min_confidence: float,
) -> RuleMiningResult:
    start = time.time()
    accepted = []
    evaluated = 0

    for itemset, sup_union in frequent_supports.items():
        if len(itemset) < 2:
            continue

        items = list(itemset)
        for r in range(1, len(items)):
            for antecedent_tuple in itertools.combinations(items, r):
                antecedent = frozenset(antecedent_tuple)
                consequent = itemset - antecedent

                sup_ante = frequent_supports.get(antecedent, 0)
                sup_cons = frequent_supports.get(consequent, 0)
                if sup_ante == 0 or sup_cons == 0:
                    continue

                evaluated += 1
                confidence = sup_union / sup_ante
                if confidence >= min_confidence:
                    lift = confidence / (sup_cons / num_transactions)
                    accepted.append((antecedent, consequent, confidence, lift, sup_union, sup_ante, sup_cons))

    runtime = time.time() - start
    accepted.sort(key=lambda x: (x[2], x[3], x[4]), reverse=True)

    return RuleMiningResult(
        method="bruteforce",
        min_confidence=min_confidence,
        evaluated_rules=evaluated,
        accepted_rules=accepted,
        runtime_sec=runtime,
    )


def apriori_gen_consequents(prev_h: List[FrozenSet[int]], m_plus_1: int) -> List[FrozenSet[int]]:
    if not prev_h:
        return []

    prev_sorted = sorted(tuple(sorted(h)) for h in prev_h)
    out = set()

    for i in range(len(prev_sorted)):
        for j in range(i + 1, len(prev_sorted)):
            a = prev_sorted[i]
            b = prev_sorted[j]
            if a[: m_plus_1 - 2] != b[: m_plus_1 - 2]:
                break
            union = frozenset(set(a) | set(b))
            if len(union) == m_plus_1:
                out.add(union)

    return sorted(out, key=lambda x: tuple(sorted(x)))


def generate_rules_conf_pruning(
    frequent_supports: Dict[FrozenSet[int], int],
    num_transactions: int,
    min_confidence: float,
) -> RuleMiningResult:
    start = time.time()
    accepted = []
    evaluated = 0

    grouped: Dict[int, List[FrozenSet[int]]] = defaultdict(list)
    for itemset in frequent_supports.keys():
        grouped[len(itemset)].append(itemset)

    for k in sorted(grouped.keys()):
        if k < 2:
            continue

        for lset in grouped[k]:
            h1 = [frozenset([item]) for item in lset]
            valid_h = []

            for h in h1:
                antecedent = lset - h
                sup_union = frequent_supports[lset]
                sup_ante = frequent_supports.get(antecedent, 0)
                sup_cons = frequent_supports.get(h, 0)
                if sup_ante == 0 or sup_cons == 0:
                    continue

                evaluated += 1
                confidence = sup_union / sup_ante
                if confidence >= min_confidence:
                    lift = confidence / (sup_cons / num_transactions)
                    accepted.append((antecedent, h, confidence, lift, sup_union, sup_ante, sup_cons))
                    valid_h.append(h)

            m = 1
            hm = valid_h
            while hm and len(lset) > m + 1:
                hm_plus_1 = apriori_gen_consequents(hm, m + 1)
                next_h = []

                for h in hm_plus_1:
                    antecedent = lset - h
                    sup_union = frequent_supports[lset]
                    sup_ante = frequent_supports.get(antecedent, 0)
                    sup_cons = frequent_supports.get(h, 0)
                    if sup_ante == 0 or sup_cons == 0:
                        continue

                    evaluated += 1
                    confidence = sup_union / sup_ante
                    if confidence >= min_confidence:
                        lift = confidence / (sup_cons / num_transactions)
                        accepted.append((antecedent, h, confidence, lift, sup_union, sup_ante, sup_cons))
                        next_h.append(h)

                hm = next_h
                m += 1

    runtime = time.time() - start
    accepted.sort(key=lambda x: (x[2], x[3], x[4]), reverse=True)

    return RuleMiningResult(
        method="confidence_pruning",
        min_confidence=min_confidence,
        evaluated_rules=evaluated,
        accepted_rules=accepted,
        runtime_sec=runtime,
    )


def itemset_to_str(itemset: FrozenSet[int], id_to_item: Dict[int, str]) -> str:
    return "{" + ", ".join(id_to_item[i] for i in sorted(itemset)) + "}"


def top_rules_table(
    rules: List[Tuple[FrozenSet[int], FrozenSet[int], float, float, int, int, int]],
    id_to_item: Dict[int, str],
    top_n: int,
    metric: str,
) -> List[Dict[str, object]]:
    if metric == "confidence":
        ranked = sorted(rules, key=lambda x: (x[2], x[3], x[4]), reverse=True)
    elif metric == "lift":
        ranked = sorted(rules, key=lambda x: (x[3], x[2], x[4]), reverse=True)
    else:
        raise ValueError(f"Unknown metric: {metric}")

    rows: List[Dict[str, object]] = []
    for ant, cons, conf, lift, sup_u, sup_a, sup_c in ranked[:top_n]:
        rows.append(
            {
                "rule": f"{itemset_to_str(ant, id_to_item)} -> {itemset_to_str(cons, id_to_item)}",
                "confidence": round(conf, 5),
                "lift": round(lift, 5),
                "support_count": sup_u,
                "support_fraction": None,
                "antecedent_support": sup_a,
                "consequent_support": sup_c,
            }
        )

    return rows


def run_experiments(output_dir: Path, data_dir: Path | None = None, allow_download: bool = True) -> None:
    ensure_dir(output_dir)
    raw_dir = data_dir if data_dir is not None else output_dir / "raw_data"
    ensure_dir(raw_dir)

    all_results: Dict[str, object] = {
        "datasets": {},
        "config": {
            "confidence_levels": CONF_LEVELS,
            "datasets": DATASETS,
            "raw_data_dir": str(raw_dir),
        },
    }

    for dname, meta in DATASETS.items():
        raw_file = raw_dir / meta["filename"]
        ensure_dataset_file(dname, raw_file, allow_download=allow_download)

        dataset = build_dataset(dname, raw_file)
        num_tx = len(dataset.transactions)
        print(f"Dataset={dname} transactions={num_tx} unique_items={len(dataset.item_to_id)}")

        dres = {
            "transactions": num_tx,
            "unique_items": len(dataset.item_to_id),
            "supports": {},
        }

        for min_sup in meta["supports"]:
            support_key = f"{min_sup:.2f}"
            run_a = apriori(dataset.transactions, min_sup, method="fk1xf1")
            run_b = apriori(dataset.transactions, min_sup, method="fk1xfk1")

            freq_supports = flatten_frequent(run_b.frequent_itemsets)
            closed_count, maximal_count = count_closed_maximal(run_b.frequent_itemsets)

            confidence_runs = {}
            for min_conf in CONF_LEVELS:
                brute = generate_rules_bruteforce(freq_supports, num_tx, min_conf)
                pruned = generate_rules_conf_pruning(freq_supports, num_tx, min_conf)

                top_conf = top_rules_table(pruned.accepted_rules, dataset.id_to_item, top_n=5, metric="confidence")
                top_lift = top_rules_table(pruned.accepted_rules, dataset.id_to_item, top_n=5, metric="lift")
                for row in top_conf:
                    row["support_fraction"] = round(row["support_count"] / num_tx, 5)
                for row in top_lift:
                    row["support_fraction"] = round(row["support_count"] / num_tx, 5)

                confidence_runs[f"{min_conf:.2f}"] = {
                    "bruteforce": {
                        "evaluated_rules": brute.evaluated_rules,
                        "accepted_rules": len(brute.accepted_rules),
                        "runtime_sec": round(brute.runtime_sec, 5),
                    },
                    "confidence_pruning": {
                        "evaluated_rules": pruned.evaluated_rules,
                        "accepted_rules": len(pruned.accepted_rules),
                        "runtime_sec": round(pruned.runtime_sec, 5),
                    },
                    "savings_vs_bruteforce": {
                        "evaluated_rule_reduction": brute.evaluated_rules - pruned.evaluated_rules,
                        "evaluated_rule_reduction_pct": round(
                            100.0 * (brute.evaluated_rules - pruned.evaluated_rules) / brute.evaluated_rules,
                            3,
                        )
                        if brute.evaluated_rules
                        else 0.0,
                    },
                    "top5_by_confidence": top_conf,
                    "top5_by_lift": top_lift,
                }

            dres["supports"][support_key] = {
                "min_support": min_sup,
                "min_support_count": run_b.min_support_count,
                "apriori": {
                    "fk1xf1": {
                        "total_candidates": run_a.total_candidates,
                        "total_frequent_itemsets": run_a.total_frequent,
                        "candidates_by_k": run_a.candidates_by_k,
                        "runtime_sec": round(run_a.runtime_sec, 5),
                    },
                    "fk1xfk1": {
                        "total_candidates": run_b.total_candidates,
                        "total_frequent_itemsets": run_b.total_frequent,
                        "candidates_by_k": run_b.candidates_by_k,
                        "runtime_sec": round(run_b.runtime_sec, 5),
                    },
                },
                "frequent_set_characterization": {
                    "closed_itemsets": closed_count,
                    "maximal_itemsets": maximal_count,
                    "all_frequent_itemsets": run_b.total_frequent,
                },
                "rules": confidence_runs,
            }

        all_results["datasets"][dname] = dres

    results_path = output_dir / "results.json"
    report_path = output_dir / "REPORT.md"
    results_path.write_text(json.dumps(all_results, indent=2), encoding="utf-8")
    write_markdown_report(all_results, report_path)
    print(f"Wrote results: {results_path}")
    print(f"Wrote report:  {report_path}")


def write_markdown_report(results: Dict[str, object], output_path: Path) -> None:
    lines: List[str] = []
    lines.append("# Apriori Association Analysis Report")
    lines.append("")
    lines.append("## Assumptions and Experimental Setup")
    lines.append("- Specialized data-mining libraries were not used.")
    lines.append("- Three UCI datasets were converted to transactions.")
    lines.append("- Adult numeric columns were discretized into 3 quantile bins.")
    lines.append("")

    for dname, dres in results["datasets"].items():
        lines.append(f"## Dataset: {dname}")
        lines.append(f"- Transactions: {dres['transactions']}")
        lines.append(f"- Unique items: {dres['unique_items']}")
        lines.append("")

        lines.append("### Candidate Generation Comparison")
        lines.append("| MinSup | Method | Candidates | Frequent Itemsets | Runtime (s) |")
        lines.append("|---|---:|---:|---:|---:|")
        for sup_key, sres in dres["supports"].items():
            for method in ["fk1xf1", "fk1xfk1"]:
                m = sres["apriori"][method]
                lines.append(
                    f"| {sup_key} | {method} | {m['total_candidates']} | {m['total_frequent_itemsets']} | {m['runtime_sec']} |"
                )
        lines.append("")

        lines.append("### Frequent vs Closed vs Maximal")
        lines.append("| MinSup | Frequent | Closed | Maximal |")
        lines.append("|---|---:|---:|---:|")
        for sup_key, sres in dres["supports"].items():
            c = sres["frequent_set_characterization"]
            lines.append(f"| {sup_key} | {c['all_frequent_itemsets']} | {c['closed_itemsets']} | {c['maximal_itemsets']} |")
        lines.append("")

        lines.append("### Rule Generation Savings")
        for sup_key, sres in dres["supports"].items():
            lines.append(f"#### MinSup = {sup_key}")
            lines.append("| MinConf | Brute Eval | Pruned Eval | Eval Reduction % | Accepted Rules |")
            lines.append("|---|---:|---:|---:|---:|")
            for conf_key, cres in sres["rules"].items():
                lines.append(
                    f"| {conf_key} | {cres['bruteforce']['evaluated_rules']} | {cres['confidence_pruning']['evaluated_rules']} | "
                    f"{cres['savings_vs_bruteforce']['evaluated_rule_reduction_pct']} | {cres['confidence_pruning']['accepted_rules']} |"
                )
            lines.append("")

    output_path.write_text("\n".join(lines), encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run Apriori association analysis on UCI datasets.")
    parser.add_argument("--output-dir", type=Path, default=Path("association_analysis/out"), help="Output directory")
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=None,
        help="Optional directory containing pre-downloaded raw files: mushroom.data, car.data, adult.data",
    )
    parser.add_argument(
        "--no-download",
        action="store_true",
        help="Do not download datasets; require files to already exist in --data-dir (or output-dir/raw_data).",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    run_experiments(output_dir=args.output_dir, data_dir=args.data_dir, allow_download=not args.no_download)


if __name__ == "__main__":
    main()
