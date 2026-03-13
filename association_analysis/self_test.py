#!/usr/bin/env python3
"""Correctness checks for Apriori implementation on a deterministic toy dataset."""

from apriori_experiment import (
    apriori,
    count_closed_maximal,
    flatten_frequent,
    generate_rules_bruteforce,
    generate_rules_conf_pruning,
)


def main() -> None:
    transactions = [
        {1, 2, 3},
        {1, 2},
        {1, 3},
        {2, 3},
        {1, 2, 3},
        {1, 2, 4},
    ]

    # min_count = ceil(0.33 * 6) = 2
    min_sup = 0.33
    run_a = apriori(transactions, min_sup, method="fk1xf1")
    run_b = apriori(transactions, min_sup, method="fk1xfk1")

    freq_a = flatten_frequent(run_a.frequent_itemsets)
    freq_b = flatten_frequent(run_b.frequent_itemsets)

    expected_supports = {
        frozenset({1}): 5,
        frozenset({2}): 5,
        frozenset({3}): 4,
        frozenset({1, 2}): 4,
        frozenset({1, 3}): 3,
        frozenset({2, 3}): 3,
        frozenset({1, 2, 3}): 2,
    }

    assert freq_a == freq_b, "Both candidate-generation methods must return identical frequent itemsets"
    assert freq_a == expected_supports, "Frequent itemset supports differ from expected toy truth"

    closed_count, maximal_count = count_closed_maximal(run_b.frequent_itemsets)
    assert (closed_count, maximal_count) == (7, 1), "Unexpected closed/maximal counts on toy dataset"

    min_conf = 0.6
    brute = generate_rules_bruteforce(freq_a, len(transactions), min_conf)
    pruned = generate_rules_conf_pruning(freq_a, len(transactions), min_conf)

    brute_rules = {(a, c, round(conf, 8)) for a, c, conf, *_ in brute.accepted_rules}
    pruned_rules = {(a, c, round(conf, 8)) for a, c, conf, *_ in pruned.accepted_rules}
    assert brute_rules == pruned_rules, "Pruned and brute-force should return identical accepted rules"

    print("Self-test passed: frequent itemsets, supports, closed/maximal counts, and rule equivalence are correct.")


if __name__ == "__main__":
    main()
