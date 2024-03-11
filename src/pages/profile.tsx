import { Avatar, Container, Grid, ImageList, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import background from "../assets/backgroundREG.png";
import { ChartModel } from "../model/ChartModel";
import { ListImageByID } from "../model/ListImageByID";
import { Usermodel } from "../model/usermode";
import {
  getListDaily_statsByIduser,
  getListimageById,
} from "../service/GetService";
import "../style/profile.css";
import MultiImageChart from "./MultiImageChart";

export default function ProfilePage() {
  const [userdata, setuserdata] = useState<Usermodel>();
  const [listImageofuser, setlistImageofuser] = useState<ListImageByID[]>([]);
  const [chartData, setChartData] = useState<ChartModel[]>([]);
  // useEffect(() => {
  //   async function fetchUserDataAndImages() {
  //     const userDataStr = localStorage.getItem("user_WEBAVD");
  //     if (userDataStr) {
  //       const user: Usermodel = JSON.parse(userDataStr);
  //       setuserdata(user);
  //       if (user?.id) {
  //         const image: ListImageByID[] = await getListimageById(user.id);
  //         setlistImageofuser(image);

  //         // const daily_stats: ChartModel[] = await getdaily_statsByIdImage(19);

  //         // setChartData(daily_stats);
  //       }
  //     }
  //   }
  //   listImageofuser.map((image) => {image.imgid = image.imgid + 1;})
  //   fetchUserDataAndImages();
  // }, []);

  // useEffect(() => {
  //   async function fetchUserDataAndImages() {
  //     const userDataStr = localStorage.getItem("user_WEBAVD");

  //     if (userDataStr) {
  //       const user: Usermodel = JSON.parse(userDataStr);
  //       setuserdata(user);
  //       if (user?.id) {
  //         const image: ListImageByID[] = await getListimageById(user.id);
  //         setlistImageofuser(image);

  //         // Fetch chart data for each image
  //         const allChartData = await Promise.all(
  //           image.map(async (img) => {
  //             return await getdaily_statsByIdImage(img.imgid);
  //           })
  //         );

  //         setChartData(allChartData);
  //       }
  //     }
  //   }

  //   fetchUserDataAndImages();
  // }, []);

  useEffect(() => {
    async function fetchUserDataAndImages() {
      try {
        const userDataStr = localStorage.getItem("user_WEBAVD");
        if (!userDataStr) return;

        const user: Usermodel = JSON.parse(userDataStr);
        setuserdata(user);

        if (!user?.id) return;

        const imageList: ListImageByID[] = await getListimageById(user.id);
        setlistImageofuser(imageList);

        const liststats: ChartModel[] = await getListDaily_statsByIduser(
          user.id
        );
        // console.log(liststats);
        setChartData(liststats);
      } catch (error) {
        console.error("Error fetching user data and images:", error);
      }
    }

    fetchUserDataAndImages();
  }, []);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    flexGrow: 1,
  }));

  const row1 = () => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          //   maxWidth: "80vw",
          width: "100%",
          margin: 0,
          padding: 2,

          //   backgroundColor: "rgba(255, 255, 255, 1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 2,
            backgroundColor: "rgba(255, 255, 255, 1)",
            // margin: 2,
            borderRadius: "30px",
            minWidth: "20vw",
            minHeight: "30vh",
          }}
        >
          <Avatar
            alt="User Profile"
            src={userdata?.image_profile}
            sx={{
              width: (theme) => theme.spacing(22), // Use a fixed size for width
              height: (theme) => theme.spacing(22), // Use a fixed size for height to match the width
              borderRadius: "50%", // This will make it a circle
              maxWidth: "100%", // Ensure the avatar doesn't exceed the container's width
              maxHeight: "100%", // Ensure the avatar doesn't exceed the container's height
              objectFit: "cover", // Cover the area without distorting the aspect ratio
              marginY: 2, // Optional: Add some vertical margin if needed
              margin: 0,
            }}
          />
          <Box sx={{ padding: 4 }}>
            <p className="textprofilesetA">
              <strong>id:</strong>
              {userdata?.id}
            </p>
            <p className="textprofilesetA">
              <strong>Name:</strong> {userdata?.aka}
            </p>
            <p className="textprofilesetA">
              <strong>Username:</strong> {userdata?.username}
            </p>
            <p className="textprofilesetA">
              <strong>Email:</strong>
              {userdata?.email}
            </p>
            <p className="textprofilesetA">
              <strong>created_at:</strong>
              {userdata && userdata.created_at
                ? new Date(userdata.created_at).toLocaleDateString("th-TH")
                : "N/A"}
            </p>
            <p className="textprofilesetA">
              <strong>Bio:</strong>
              {userdata?.textBio}
            </p>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 1)",
            margin: 2,
            borderRadius: "30px",
            minWidth: "20vw",
            // minHeight: "40vh",
          }}
        >
          <Box sx={{ marginTop: 4, minHeight: "30vh" }}>
            {chartData && chartData.length > 0 && (
              <MultiImageChart chartData={chartData} />
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  const row2 = () => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          // alignItems: "center",
          padding: 1,
          backgroundColor: "rgba(255, 255, 255, 1)",
          // margin: 2,
          marginLeft: 4,
          borderRadius: "30px",
          minHeight: "35vh",
        }}
      >
        <Box>
          <ImageList
            cols={5}
            sx={{
              height: "100%",
              margin: 0,
              "&::-webkit-scrollbar": {
                width: "0px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#FCFCFC",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#BBBBBB",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#BBBBBB",
              },
            }}
          >
            {listImageofuser.slice(0, 5)?.map((image) => (
              <Item
                key={image.imgid}
                sx={{
                  borderRadius: "30px",
                  padding: 0,
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.0)",
                  },
                }}
              >
                {" "}
                <img
                  src={image.image_url}
                  alt={image.imgid?.toString() ?? "default-alt"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "30px",
                  }}
                />
              </Item>
            ))}
          </ImageList>
        </Box>
      </Box>
    );
  };
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
          <p style={{ fontFamily: "Kanit", fontSize: "35px", margin: 0 }}>
            Profile
          </p>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              {row1()}
            </Grid>
            <Grid item xs={12} md={12}>
              {row2()}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Container>
  );
}
