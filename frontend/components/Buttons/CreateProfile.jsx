import { useAccount, useContract, useSignMessage, useSigner } from "wagmi";
import HuddleContract from "@/abi/HuddleHubContract.json";
import useWeb3Storage from "@/hooks/useWeb3Sorage";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useNetwork } from "wagmi";

const CreateProfile = ({ handle, userName, profilePic, bio }) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const router = useRouter();
  const { storeFile } = useWeb3Storage();

  const contract = useContract({
    address: HuddleContract.address,
    abi: HuddleContract.abi,
    signerOrProvider: signer,
  });

  const handleOnClick = async () => {
    console.log(chain.id);
    if (chain.id !== 3141) {
      toast.error("Connect to Hyperspace Testnet", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      profilePic = await storeFile(profilePic);
      const metadata = {
        display_name: userName,
        profile_pic: profilePic,
        bio: bio,
        banner: "",
      };
      const blob = new Blob([JSON.stringify(metadata)], {
        type: "application/json",
      });
      const metadataURI = await storeFile(blob);
      console.log(metadataURI, metadata);
      const id = await contract.createUser(handle, metadataURI);
      // setLoading(false);
      toast.success("User Created", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      router.push(`/home`);
    }
  };

  return (
    <button
      className="rounded-lg px-5 mx-2 py-2 hover:scale-95 ease-in-out duration-300 min-w-fit w-[30%]  bg-gradient-to-r from-[#B537E5] via-[#F44A9B]  to-[#FF876E] my-10"
      onClick={handleOnClick}
    >
      Create Profile
    </button>
  );
};

export default CreateProfile;
