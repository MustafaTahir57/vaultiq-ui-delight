import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Percent, Bitcoin, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import useLeadershipPool from "@/hooks/dataFetcher/useLeadershipPool";
import useClaimLeadershipBTC from "@/hooks/dataSender/useClaimLeadershipBTC";
import LeaderRow from "./LeaderRow";
import { formatUnits } from "viem";
import { useToast } from "@/hooks/use-toast";

const LeadershipPoolSection = () => {
  const { address } = useWallet();
  const { toast } = useToast();
  const {
    isQualified,
    leaderSales,
    claimableBTC,
    qualifiedCount,
    totalQualifiedSales,
    minLeaderSales,
    minQualifiedLeaders,
    leaders,
    isLoading,
    refetch,
  } = useLeadershipPool(address);

  const { claim, isPending, isConfirming, isConfirmed, isError, error } = useClaimLeadershipBTC();

  useEffect(() => {
    if (isConfirmed) {
      toast({ title: "BTC Claimed!", description: "Your BTCB reward has been sent to your wallet." });
      refetch();
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (isError) {
      toast({ title: "Claim Failed", description: error?.shortMessage || "Transaction failed.", variant: "destructive" });
    }
  }, [isError]);

  const salesNum = Number(formatUnits(leaderSales, 18));
  const minSalesNum = Number(formatUnits(minLeaderSales, 18));
  const claimableNum = Number(formatUnits(claimableBTC, 18));
  const totalSalesNum = Number(formatUnits(totalQualifiedSales, 18));
  const qualifiedNum = Number(qualifiedCount);
  const minLeadersNum = Number(minQualifiedLeaders);

  const progressPercent = minSalesNum > 0 ? Math.min((salesNum / minSalesNum) * 100, 100) : 0;
  const sharePercent = totalSalesNum > 0 ? ((salesNum / totalSalesNum) * 100).toFixed(2) : "0.00";
  const distributionActive = qualifiedNum >= minLeadersNum;
  const leadersNeeded = Math.max(0, minLeadersNum - qualifiedNum);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          BTC Elite Pool
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Proportional BTC rewards for qualified Model B leaders
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* My Status */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isQualified ? (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-sm">
                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Qualified
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground text-sm">
                Not Qualified
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Pool Status */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Users className="h-4 w-4" /> Pool Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-foreground">
              {qualifiedNum} / {minLeadersNum}
            </p>
            <p className="text-xs text-muted-foreground mt-1">qualified leaders</p>
          </CardContent>
        </Card>

        {/* My Share */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Percent className="h-4 w-4" /> My Pool Share
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-foreground">
              {isQualified ? `${sharePercent}%` : "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">of total pool</p>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Banner */}
      {!distributionActive && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
            <p className="text-sm text-amber-300">
              Distribution locked — <span className="font-semibold">{leadersNeeded} more qualified leader{leadersNeeded !== 1 ? "s" : ""}</span> needed before BTC gets distributed.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Qualification Progress (if not qualified) */}
      {!isQualified && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Qualification Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Mining Sales Volume</span>
              <span className="text-foreground font-medium">{progressPercent.toFixed(1)}%</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
            <p className="text-xs text-muted-foreground">
              ${salesNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${minSalesNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Claimable BTC */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bitcoin className="h-5 w-5 text-amber-400" />
            Claimable BTC
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-3xl font-bold text-foreground">
            {claimableNum.toFixed(6)} <span className="text-lg text-muted-foreground">BTCB</span>
          </p>
          <Button
            onClick={claim}
            disabled={!isQualified || claimableBTC === BigInt(0) || isPending || isConfirming}
            className="w-full md:w-auto"
          >
            {isPending || isConfirming ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" /> {isConfirming ? "Confirming..." : "Claiming..."}</>
            ) : (
              "Claim BTC Reward"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      {leaders && leaders?.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Qualified Leaders</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Address</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Sales Volume</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Share</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Claimable</th>
                </tr>
              </thead>
              <tbody>
                {leaders?.map((leader) => (
                  <LeaderRow key={leader} address={leader} totalQualifiedSales={totalQualifiedSales} />
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeadershipPoolSection;
