import { useReadContract } from "wagmi";
import { BranchFactoryABI } from "@/constants/abis";
import { BranchFactory_Address } from "@/constants/contracts";

const useOpenDeployment = () => {
  const { data: isOpenDeployment, isLoading: checkingOpen } = useReadContract({
    address: BranchFactory_Address,
    abi: BranchFactoryABI,
    functionName: "openDeployment",
  });

  return { isOpenDeployment: !!isOpenDeployment, checkingOpen };
};

export default useOpenDeployment;
