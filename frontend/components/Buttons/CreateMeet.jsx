import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { useContext } from "react";
import { ProfileContext } from "@/context/profile";
import useWeb3Storage from "@/hooks/useWeb3Storage";
import axios from "axios";

const CreateMeet = ({
  title,
  host,
  thumbnail,
  setLoading,
  type,
  tokenType,
  chain,
  contractAddress,
  handleClose,
}) => {
  const { address } = useAccount();
  const { meets, setMeets } = useContext(ProfileContext);
  const { storeFile } = useWeb3Storage();

  const handleOnClick = async () => {
    setLoading(true);
    thumbnail = await storeFile(thumbnail);
    var response;
    type === "general"
      ? (response = await axios.post(
          "https://iriko.testing.huddle01.com/api/v1/create-room",
          {
            title: title,
            hostWallets: [host],
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.NEXT_PUBLIC_HUDDLE_API_KEY,
            },
          }
        ))
      : (response = await axios.post(
          "https://iriko.testing.huddle01.com/api/v1/create-room",
          {
            title: title,
            hostWallets: [host],
            tokenType: tokenType,
            chain: chain,
            contractAddress: [contractAddress],
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.NEXT_PUBLIC_HUDDLE_API_KEY,
            },
          }
        ));

    const resp = response.data.data;
    const meetMetadata = {
      thumbnail: thumbnail,
      roomId: resp.roomId,
      creator: address,
      type: type,
      title: title,
    };
    setMeets([...meets, meetMetadata]);
    setLoading(false);
    toast.success("Meet Created", {
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
      handleClose();
    }, 2000);
  };

  return (
    <>
      <button
        className="rounded-lg px-5 mx-2 py-2 hover:scale-95 ease-in-out duration-300 min-w-fit w-[30%]  bg-gradient-to-r from-[#B537E5] via-[#F44A9B]  to-[#FF876E] my-10"
        onClick={handleOnClick}
      >
        Create
      </button>
    </>
  );
};

export default CreateMeet;
