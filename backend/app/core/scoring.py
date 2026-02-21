PENALTIES = {
    "critico": 15.0,
    "medio": 7.5,
    "leve": 2.5
}

MAX_PENALTY_PER_ISSUE_TYPE = 30.0

def calculate_scores(issues: list) -> dict:
    scores = {"visual": 100.0, "motora": 100.0, "cognitiva": 100.0, "auditiva": 100.0}
    issues_summary = {"critico": 0, "medio": 0, "leve": 0}
    detailed_issues_count = {}

    applied_penalties_per_rule_and_disability = {
        disability: {} for disability in scores.keys()
    }

    for issue in issues:
        impact = issue.get("impact", "leve")
        rule = issue.get("rule", "unknown_rule")
        base_penalty = PENALTIES.get(impact, PENALTIES["leve"])

        issues_summary[impact] = issues_summary.get(impact, 0) + 1
        detailed_issues_count[rule] = detailed_issues_count.get(rule, 0) + 1

        for disability in issue.get("disabilities_affected", []):
            if disability in scores:
                current_applied_penalty_for_rule = applied_penalties_per_rule_and_disability[disability].get(rule, 0.0)
                
                penalty_to_apply = base_penalty
                if current_applied_penalty_for_rule + penalty_to_apply > MAX_PENALTY_PER_ISSUE_TYPE:
                    penalty_to_apply = MAX_PENALTY_PER_ISSUE_TYPE - current_applied_penalty_for_rule
                    if penalty_to_apply < 0: penalty_to_apply = 0

                scores[disability] = max(0.0, scores[disability] - penalty_to_apply)
                applied_penalties_per_rule_and_disability[disability][rule] = current_applied_penalty_for_rule + penalty_to_apply

    overall_score = sum(scores.values()) / len(scores) if scores else 0.0

    return {
        "overall_score": round(overall_score, 2),
        "visual_score": round(scores["visual"], 2),
        "motor_score": round(scores["motora"], 2),
        "cognitive_score": round(scores["cognitiva"], 2),
        "auditory_score": round(scores["auditiva"], 2),
        "issues_summary_by_impact": issues_summary,
        "detailed_issues_count_by_rule": detailed_issues_count
    }