import { useContext, useEffect, useState } from "react";
import { wishbag } from "../api/api";
import { Box, Heading } from "@chakra-ui/react";
import { AuthContext } from "../context/AuthContext";
import UnknownUser from "../components/UnknownUser";

const WishBag = () => {
  const [info, setInfo] = useState<{ message: string; userid: string }>({
    message: "",
    userid: "",
  });

  const context = useContext(AuthContext);

  useEffect(() => {
    const wish = async () => {
      const results = await wishbag();
      if (results.success) {
        setInfo(results);
      } else {
        setInfo({ message: "Failed Fetching WishBag", userid: "NONE" });
      }
    };
    wish();
  }, []);

  return (
    <Box>
      <Heading>WishBag</Heading>
      {!context.user.userId && <UnknownUser use={"Wish Bag"} />}
    </Box>
  );
};

export default WishBag;
