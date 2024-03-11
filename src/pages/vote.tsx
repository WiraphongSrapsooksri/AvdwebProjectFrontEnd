import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import { Box, Button, Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import background from "../assets/backgroundREG.png";
import { ImageVoteModel } from "../model/ImageVoteModel";
import { Usermodel } from "../model/usermode";
import { getRandomImage } from "../service/GetService";
import { updatevoteImage } from "../service/uploadImage";
interface ImagesComponentProps {
  image: ImageVoteModel;
  isSelected?: boolean; // Mark isSelected as optional
  onSelectImage?: (id: number) => void; // Also, ensure onSelectImage is optional if it's not always provided
}

export default function VotePage() {
  const [image1, setImage1] = useState<ImageVoteModel | null>(null);
  const [image2, setImage2] = useState<ImageVoteModel | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [userdata, setuserdata] = useState<Usermodel>();
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response:ImageVoteModel[] = await getRandomImage(); // This should return an array of two images
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

    const updatedRank1 = Math.round(rank1 + K * (actualScore1 - expScore1));
    const updatedRank2 = Math.round(rank2 + K * (actualScore2 - expScore2));

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
    console.log("Selected Image: " + selectedImageId);
    console.log("updatedRank1", updatedRank1);
    console.log("updatedRank2", updatedRank2);

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

    console.log("Updated rank1: ", updatedRank1);
    console.log("Updated rank2: ", updatedRank2);

    if (response1.status && response2.status) {
      // Handle the success case
      console.log("Image updated successfully");
      window.location.reload();
    }

    // return { updatedRank1, updatedRank2 };
  }

  // const row1 = () => {
  //   const handleImageClick1 = () => {
  //     // Log the image details or handle them as needed
  //     console.log("Clicked on Image 1", image1);
  //   };
  //   return (
  //     <Box
  //       sx={{
  //         display: "flex",

  //         justifyContent: "center",
  //         alignItems: "center",
  //         //   maxWidth: "80vw",
  //         width: "100%",

  //         margin: 0,
  //         padding: 2,

  //         //   backgroundColor: "rgba(255, 255, 255, 1)",
  //       }}
  //     >
  //       <Box
  //         sx={{
  //           display: "flex",
  //           justifyContent: "center",
  //           alignItems: "center",
  //           padding: 1,
  //           margin: 0,
  //           backgroundColor: "rgba(255, 255, 255, 1)",
  //           height: "30vh",
  //           borderRadius: "30px",
  //           minWidth: "20vw",
  //           minHeight: "60vh",
  //           transition: "transform 0.3s ease-in-out", // Add this line
  //           "&:hover": {
  //             // Add this block
  //             transform: "scale(0.9)", // Change the scale to your preference
  //           },
  //         }}
  //         onClick={handleImageClick1}
  //       >
  //         <img
  //           src={image1?.image_url}
  //           style={{ height: "100%", borderRadius: "30px" }}
  //           alt=""
  //         />
  //       </Box>
  //     </Box>
  //   );
  // };

  // const ImagesComponent = ({ image }) => {
  //   // State to track if the image has been clicked (selected)
  //   const [isSelected, setIsSelected] = useState(false);

  //   const handleImageClick = () => {
  //     if (!isSelected) {
  //       // If the image is not already selected, select it
  //       setIsSelected(true);
  //       console.log("Selected Image", image);
  //     } else {
  //       // If the image is already selected, this click confirms the selection
  //       console.log("Confirmed selection of Image", image);
  //       // Here, add any logic to handle the confirmation, such as updating the database or navigating to another page
  //     }
  //   };

  //   return (
  //     <Box
  //       sx={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         width: "100%",
  //         margin: 0,
  //         padding: 2,
  //       }}
  //     >
  //       <Box
  //         sx={{
  //           position: "relative", // Needed to position the overlay correctly
  //           display: "flex",
  //           justifyContent: "center",
  //           alignItems: "center",
  //           padding: 1,
  //           margin: 0,
  //           backgroundColor: "rgba(255, 255, 255, 1)",
  //           height: "30vh",
  //           borderRadius: "30px",
  //           minWidth: "20vw",
  //           minHeight: "60vh",
  //           transition: "transform 0.3s ease-in-out",
  //           "&:hover": {
  //             transform: "scale(0.9)",
  //           },
  //           ...(isSelected && {
  //             // Apply a style when the image is selected
  //             "&::after": {
  //               content: '""',
  //               position: "absolute",
  //               top: 0,
  //               left: 0,
  //               width: "100%",
  //               height: "100%",
  //               backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
  //               borderRadius: "30px",
  //             },
  //           }),
  //         }}
  //         onClick={handleImageClick}
  //       >
  //         <img
  //           src={image?.image_url}
  //           style={{
  //             height: "100%",
  //             borderRadius: "30px",
  //             position: "relative",
  //             zIndex: 1,
  //           }}
  //           alt=""
  //         />
  //       </Box>
  //     </Box>
  //   );
  // };

  // const row2 = () => {
  //   const handleImageClick2 = () => {
  //     // Log the image details or handle them as needed
  //     console.log("Clicked on Image 2", image2);
  //   };
  //   return (
  //     <Box
  //       sx={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         //   maxWidth: "80vw",
  //         width: "100%",
  //         margin: 0,
  //         padding: 2,
  //       }}
  //     >
  //       <Box
  //         sx={{
  //           display: "flex",
  //           justifyContent: "center",
  //           alignItems: "center",
  //           padding: 1,
  //           margin: 0,
  //           backgroundColor: "rgba(255, 255, 255, 1)",
  //           height: "30vh",
  //           borderRadius: "30px",
  //           minWidth: "20vw",
  //           minHeight: "60vh",
  //           transition: "transform 0.3s ease-in-out", // Add this line
  //           "&:hover": {
  //             // Add this block
  //             transform: "scale(0.9)", // Change the scale to your preference
  //           },
  //         }}
  //         onClick={handleImageClick2}
  //       >
  //         <img
  //           src={image2?.image_url}
  //           style={{ height: "100%", borderRadius: "30px" }}
  //           alt=""
  //         />
  //       </Box>
  //     </Box>
  //   );
  // };

  const ImagesComponent: React.FC<ImagesComponentProps> = ({
    image,
    isSelected = false, // Default to false if not provided
    onSelectImage,
  }) => {
    const handleImageClick = () => {
      if (onSelectImage && image?.id) {
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
            // height: "100vw",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            marginTop: "10px",
            borderRadius: "30px",
          }}
        >
          {/* <Grid
            container
            spacing={2}
            sx={{
              margin: 0,
              display: "flex",
              alignItems: "start",
              justifyContent: "center",
            }}
          >
            <Grid item xs={12} md={5}>
              <Link to="/">
                <ArrowCircleLeftIcon className="arrow-icon" />
              </Link>
            </Grid>
            <Grid item xs={12} md={6}>
              <p style={{ fontFamily: "Kanit", fontSize: "35px", margin: 0 }}>
                Vote
              </p>
            </Grid>
          </Grid> */}

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
              >
                VOTE
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Container>
  );
}
