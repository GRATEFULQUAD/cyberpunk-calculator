// Standard amortized loan math.

export interface AmortizationRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface LoanResult {
  monthlyPayment: number;
  totalPrincipal: number;
  totalInterest: number;
  totalPayable: number;
  schedule: AmortizationRow[];
}

export function calculateLoan(
  principal: number,
  annualRatePercent: number,
  termMonths: number
): LoanResult {
  const n = Math.max(1, Math.round(termMonths));
  const monthlyRate = annualRatePercent / 100 / 12;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = principal / n;
  } else {
    const factor = Math.pow(1 + monthlyRate, n);
    monthlyPayment = (principal * monthlyRate * factor) / (factor - 1);
  }

  if (!Number.isFinite(monthlyPayment)) monthlyPayment = 0;

  const schedule: AmortizationRow[] = [];
  let balance = principal;
  let totalInterest = 0;

  for (let period = 1; period <= n; period++) {
    const interest = monthlyRate === 0 ? 0 : balance * monthlyRate;
    let principalPaid = monthlyPayment - interest;
    if (period === n) {
      // Correct rounding drift on final payment
      principalPaid = balance;
    }
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interest;
    schedule.push({
      period,
      payment: period === n ? principalPaid + interest : monthlyPayment,
      principal: principalPaid,
      interest,
      balance,
    });
  }

  const totalPayable = principal + totalInterest;

  return {
    monthlyPayment,
    totalPrincipal: principal,
    totalInterest,
    totalPayable,
    schedule,
  };
}

export function groupScheduleByYear(schedule: AmortizationRow[]): { year: number; rows: AmortizationRow[] }[] {
  const groups: { year: number; rows: AmortizationRow[] }[] = [];
  for (const row of schedule) {
    const year = Math.ceil(row.period / 12);
    let group = groups.find((g) => g.year === year);
    if (!group) {
      group = { year, rows: [] };
      groups.push(group);
    }
    group.rows.push(row);
  }
  return groups;
}
