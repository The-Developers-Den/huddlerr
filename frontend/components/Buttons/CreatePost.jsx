import { useAccount, useContract, useSigner } from "wagmi";
import HuddleContract from "@/abi/HuddleHubContract.json";
import useWeb3Storage from "@/hooks/useWeb3Storage";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import { useNetwork } from "wagmi";

const CreatePost = ({ image, body, profileMetadata, username }) => {
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
      image ? (image = await storeFile(image)) : "";
      const profile = await axios.get(profileMetadata);
      const metadata = {
        image: image,
        body: body,
        display_name: profile?.data?.display_name,
        profile_pic: profile?.data?.profile_pic,
        username: username,
      };
      const blob = new Blob([JSON.stringify(metadata)], {
        type: "application/json",
      });
      const file = new File([blob], "post_metadata.json");
      const metadataURI = await storeFile(file);
      console.log(metadataURI, metadata);
      const id = await contract.createPost(metadataURI);
      // setLoading(false);
      toast.success("Post Created", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setTimeout(() => {
        router.reload();
      }, 3000);
      // router.push(`/home`);
    }
  };

  return (
    <button
      className="rounded-lg p-1  hover:scale-95 ease-in-out duration-300 text-base w-[15%] bg-gradient-to-r from-[#B537E5] via-[#F44A9B]  to-[#FF876E]"
      onClick={handleOnClick}
    >
      Post
    </button>
  );
};

export default CreatePost;
