import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import { Box, Button, Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import background from "../assets/backgroundREG.png";
import { ImageVoteModel } from "../model/ImageVoteModel";
import { Usermodel } from "../model/usermode";
import { getRandomImage } from "../service/GetService";
import { updatevoteImage } from "../service/uploadImage";
import MathJaxText from "./MathJaxText";
interface ImagesComponentProps {
  image: ImageVoteModel;
  isSelected?: boolean; // Mark isSelected as optional
  onSelectImage?: (id: number) => void; // Also, ensure onSelectImage is optional if it's not always provided
}

export default function VotePage() {
  const [image1, setImage1] = useState<ImageVoteModel | null>(null);
  const [image2, setImage2] = useState<ImageVoteModel | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [Line1_1, setLine1_1] = useState<string>("");
  const [Line1_2, setLine1_2] = useState<string>("");
  const [Line1_3, setLine1_3] = useState<string>("");

  const [Line2_1, setLine2_1] = useState<string>("");
  const [Line2_2, setLine2_2] = useState<string>("");
  const [Line2_3, setLine2_3] = useState<string>("");
  const [userdata, setuserdata] = useState<Usermodel>();
  const [isvoted, setisvoted] = useState<boolean>(false);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response: ImageVoteModel[] = await getRandomImage(); // This should return an array of two images
        if (response && response.length >= 2) {
          setImage1(response[0]); // Set the first image
          setImage2(response[1]); // Set the second image
        }
      } catch (error) {
        console.error("Error fetching random images:", error);
      }
    };

    const userdata = localStorage.getItem("user_WEBAVD");
    let user;

    if (userdata !== null) {
      user = JSON.parse(userdata);
      setuserdata(user);
    } else {
      // Handle the case when userdata is null
      // For example, you might want to set user to an empty object
      user = {};
    }

    fetchImages();
  }, []);

  const handleSelectImage = (id: number) => {
    setSelectedImageId(id);
  };

  async function calculateElo(
    vote1: number,
    rank1: number,
    vote2: number,
    rank2: number,
    selectedImageId: number
  ) {
    // const actualScore1 = selectedImageId === 1 ? 1 : 0;
    // const actualScore2 = selectedImageId === 2 ? 1 : 0;

    let actualScore1, actualScore2;
    let temp;
    temp = 0;
    if (selectedImageId === image1?.id) {
      actualScore1 = 1;
      actualScore2 = 0;
      temp = image1?.id; // Temp holds the ID of the selected image
    } else if (selectedImageId === image2?.id) {
      actualScore1 = 0;
      actualScore2 = 1;
      temp = image2?.id; // Temp holds the ID of the selected image
    } else {
      actualScore1 = 0;
      actualScore2 = 0;
    }

    let K = 32;

    const totalVotes = vote1 + vote2;
    if (totalVotes < 50) {
      // For images with fewer votes, make the rating more dynamic
      K = 40;
    } else if (totalVotes >= 50 && totalVotes < 200) {
      // Adjust K as the number of votes grows
      K = 30;
    } else {
      // For images with many votes, stabilize the rating changes
      K = 20;
    }

    const expScore1 = 1 / (1 + Math.pow(10, (rank2 - rank1) / 400));
    const expScore2 = 1 / (1 + Math.pow(10, (rank1 - rank2) / 400));
    // setLine1_1(
    //   // `Image 1: 1 / (1 + Math.pow(10, (${rank2} - ${rank1}) / 400)) = ${expScore1}`
    //   `\frac{1}{1 + 10^{(\frac{${rank2}  - ${rank1})}{400})}} = 0.48992755307256153`
    // );
    setLine1_1(
      `\\frac{1}{1 + 10^{(\\frac{${rank2} - ${rank1}}{400})}} = ${expScore1.toFixed(
        5
      )}`
    );

    setLine2_1(
      `\\frac{1}{1 + 10^{(\\frac{${rank1} - ${rank2}}{400})}} = ${expScore2.toFixed(
        5
      )}`
      // `Image 2: 1 / (1 + Math.pow(10, (${rank1} - ${rank2}) / 400)) = ${expScore2}`
    );

    const updatedRank1 = Math.round(rank1 + K * (actualScore1 - expScore1));
    const updatedRank2 = Math.round(rank2 + K * (actualScore2 - expScore2));
    setLine1_2(
      // `Image 1: Math.round(${rank1} + ${K} * (${actualScore1} - ${expScore1})) = ${updatedRank1}`
      `(${rank1} + ${K} \\times (${actualScore1} - ${expScore1.toFixed(
        5
      )})) = ${updatedRank1}`
    );
    setLine2_2(
      // `Image 2: Math.round(${rank2} + ${K} * (${actualScore2} - ${expScore2})) = ${updatedRank2}`
      `(${rank2} + ${K} \\times (${actualScore2} - ${expScore2.toFixed(
        5
      )})) = ${updatedRank2}`
    );

    console.log("USERID: " + userdata?.id);
    console.log(
      "Image 1: " +
        image1?.id +
        "\tRank: " +
        image1?.rank +
        "\tVote: " +
        image1?.votes
    );
    console.log(
      "Image 2: " +
        image2?.id +
        "\tRank: " +
        image2?.rank +
        "\tVote: " +
        image2?.votes
    );

    setLine1_3(
      "Image ID: " +
        (image1?.id || "0") +
        "\tRank: " +
        (image1?.rank || "0") +
        "\tVote: " +
        (image1?.votes || "0") +
        "\tupdate " +
        (updatedRank1 || "")
    );
    setLine2_3(
      "Image ID: " +
        (image2?.id || "0") +
        "\tRank: " +
        (image2?.rank || "0") +
        "\tVote: " +
        (image2?.votes || "0") +
        "\tupdate " +
        (updatedRank2 || "")
    );

    console.log("Selected Image: " + selectedImageId);
    console.log("updatedRank1", updatedRank1);
    console.log("updatedRank2", updatedRank2);
    setisvoted(true);

    if (isvoted) {
      const response1 = await updatevoteImage(
        userdata?.id ?? 0,
        temp, // ID of the selected image
        temp === image1?.id ? updatedRank1 : updatedRank2 // Update with the correct new rank
      );

      const nonSelectedImageId = temp === image1?.id ? image2?.id : image1?.id;
      const nonSelectedImageNewRank =
        temp === image1?.id ? updatedRank2 : updatedRank1;

      const response2 = await updatevoteImage(
        userdata?.id ?? 0,
        nonSelectedImageId ?? 0, // Fix: Add nullish coalescing operator to provide a default value of 0
        nonSelectedImageNewRank
      );

      if (response1.status && response2.status) {
        // Handle the success case
        console.log("Image updated successfully");
        window.location.reload();
        setisvoted(false);
      }
    }
  }

  const ImagesComponent: React.FC<ImagesComponentProps> = ({
    image,
    isSelected = false, // Default to false if not provided
    onSelectImage,
  }) => {
    const handleImageClick = () => {
      if (onSelectImage && image?.id) {
        // console.log("Image clicked");
        // calculateElotemp(
        //   image1?.votes ?? 0,
        //   image1?.rank ?? 0,
        //   image2?.votes ?? 0,
        //   image2?.rank ?? 0,
        //   selectedImageId ?? 0
        // );
        setisvoted(false);
        onSelectImage(image.id);
      }
    };

    // Define the overlay style to match the image dimensions
    const overlayStyle = isSelected
      ? {
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: "30px", // Ensure this matches the image's borderRadius
          },
        }
      : {};

    return (
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
          margin: 0,
          backgroundColor: "rgba(255, 255, 255, 1)",
          borderRadius: "30px",
          height: "50vh",
          width: "9 0%", // The width is set to 100% of the container
          overflow: "hidden", // This ensures no part of the image spills out of the container
          transition: "transform 0.3s ease-in-out",
          "&:hover": { transform: "scale(0.9)" },
          ...overlayStyle,
        }}
        onClick={handleImageClick}
      >
        <img
          src={image?.image_url}
          style={{
            maxHeight: "100%", // Image's maximum height is the container's height
            maxWidth: "100%", // Image's maximum width is the container's width
            objectFit: "contain", // This makes the image scale to fit the box, maintaining the aspect ratio
            borderRadius: "30px",
          }}
          alt=""
        />
      </Box>
    );
  };

  // const ImagesComponent: React.FC<ImagesComponentProps> = ({
  //   image,
  //   isSelected = false, // Default to false if not provided
  //   onSelectImage,
  // }) => {
  //   const handleImageClick = () => {
  //     if (onSelectImage && image?.id) {
  //       onSelectImage(image.id);
  //     }
  //   };

  //   // Example styling based on isSelected
  //   const overlayStyle = isSelected
  //     ? {
  //         "&::after": {
  //           content: '""',
  //           position: "absolute",
  //           top: 0,
  //           left: 0,
  //           width: "100%",
  //           height: "100%",
  //           backgroundColor: "rgba(0, 0, 0, 0.2)",
  //           borderRadius: "30px",

  //           minWidth: "20vw",
  //           minHeight: "60vh",
  //         },
  //       }
  //     : {};

  //   return (
  //     <Box
  //       sx={{
  //         position: "relative",
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         // width: "100%",
  //         padding: 2,
  //         margin: 0,
  //         backgroundColor: "rgba(255, 255, 255, 1)",
  //         height: "30vh",
  //         borderRadius: "30px",
  //         minWidth: "20vw",
  //         minHeight: "60vh",
  //         transition: "transform 0.3s ease-in-out", // Add this line
  //         "&:hover": { transform: "scale(0.9)" },
  //         ...overlayStyle,
  //       }}
  //       onClick={handleImageClick}
  //     >
  //       <img
  //         src={image?.image_url}
  //         style={{ height: "100%", borderRadius: "30px" }}
  //         alt=""
  //       />
  //     </Box>
  //   );
  // };

  return (
    <Container
      sx={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        minWidth: "100vw",
        objectFit: "cover",
        overflow: "hidden",
      }}
    >
      <Container fixed>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 2,
            height: "93vh",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            marginTop: "10px",
            borderRadius: "30px",
          }}
        >

          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // minHeight: "90vh",
            }}
          >
            <Grid
              item
              xs={12}
              md={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative", // ให้สามารถใช้ positioning ได้
              }}
            >
              <Link to="/" style={{ position: "absolute", left: 30 }}>
                <ArrowCircleLeftIcon className="arrow-icon" />
              </Link>
              <p style={{ fontFamily: "Kanit", fontSize: "35px", margin: 0 }}>
                Vote
              </p>
            </Grid>

            <Grid item xs={12} md={6}>
              {/* {image1 && <ImagesComponent image={image1} />} */}
              {image1 && (
                <ImagesComponent
                  image={image1}
                  isSelected={selectedImageId === image1.id}
                  onSelectImage={handleSelectImage}
                />
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              {image2 && (
                <ImagesComponent
                  image={image2}
                  isSelected={selectedImageId === image2.id}
                  onSelectImage={handleSelectImage}
                />
              )}
            </Grid>
            <Grid
              item
              xs={12}
              md={12}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={() =>
                  calculateElo(
                    image1?.votes ?? 0,
                    image1?.rank ?? 0,
                    image2?.votes ?? 0,
                    image2?.rank ?? 0,
                    selectedImageId ?? 0
                  )
                }
                style={{
                  padding: "10px 20px",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: isvoted ? "#4CAF50" : "#e91e63",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                  transition: "all 0.3s ease",
                }}
              >
                {/* VOTE */}
                {isvoted ? "COMFIRM VOTE" : "SELECT"}
              </Button>
            </Grid>
            <Box
              sx={{ display: "flex", fontFamily: "Kanit", fontSize: "16px" ,margin:0}}
            >
              <Box sx={{ padding: 5 ,marginTop:-4}}>
                <p style={{ fontSize: "20px" }}>{Line1_3}</p>
                {/* <p>{Line1_1}</p> */}
                <MathJaxText text={`\\(${Line1_1}\\)`} fontSize="30px" />
                <br />
                <MathJaxText text={`\\(${Line1_2}\\)`} fontSize="20px" />
                {/* <p>{Line1_2}</p> */}
              </Box>
              <Box sx={{ padding: 5,marginTop:-4}}>
                <p style={{ fontSize: "20px" }}>{Line2_3}</p>
                <MathJaxText text={`\\(${Line2_1}\\)`} fontSize="30px" />
                <br />
                <MathJaxText text={`\\(${Line2_2}\\)`} fontSize="20px" />
              </Box>
            </Box>
          </Grid>
        </Box>
      </Container>
    </Container>
  );
}
