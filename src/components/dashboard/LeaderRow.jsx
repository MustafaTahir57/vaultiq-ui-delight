import useLeaderStats from "@/hooks/dataFetcher/useLeaderStats";
import { formatUnits } from "viem";

const LeaderRow = ({ address, totalQualifiedSales }) => {
  const { sales, claimable, isLoading } = useLeaderStats(address);

  const salesNum = Number(formatUnits(sales, 18));
  const claimableNum = Number(formatUnits(claimable, 18));
  const totalSalesNum = Number(formatUnits(totalQualifiedSales, 18));
  const sharePercent = totalSalesNum > 0 ? ((salesNum / totalSalesNum) * 100).toFixed(2) : "0.00";

  const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;

  if (isLoading) {
    return (
      <tr className="border-b border-border/50">
        <td colSpan={4} className="px-4 py-3 text-sm text-muted-foreground">Loading...</td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3 text-sm font-mono text-foreground">{shortAddr}</td>
      <td className="px-4 py-3 text-sm text-foreground">${salesNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td className="px-4 py-3 text-sm text-foreground">{sharePercent}%</td>
      <td className="px-4 py-3 text-sm text-foreground">{claimableNum.toFixed(6)} BTCB</td>
    </tr>
  );
};

export default LeaderRow;
