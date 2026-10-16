import { Invitation } from "@/components/Invitation";
import { isWalletEnabled } from "@/lib/wallet";

export default function Home() {
  return <Invitation walletEnabled={isWalletEnabled()} />;
}
