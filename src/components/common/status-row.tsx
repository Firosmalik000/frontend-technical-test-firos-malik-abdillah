function StatusRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>

      <span className="font-medium">{value}</span>
    </div>
  );
}
export default StatusRow;
