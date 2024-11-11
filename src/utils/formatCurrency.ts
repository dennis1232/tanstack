const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(amount)
}
export { formatCurrency }
