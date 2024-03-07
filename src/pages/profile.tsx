import { Avatar, Container, Grid, ImageList, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import background from "../assets/backgroundREG.png";
import { ChartModel } from "../model/ChartModel";
import { ListImageByID } from "../model/ListImageByID";
import { Usermodel } from "../model/usermode";
import { getListimageById } from "../service/GetService";
import "../style/profile.css";

export default function ProfilePage() {
  const [userdata, setuserdata] = useState<Usermodel>();
  const [listImageofuser, setlistImageofuser] = useState<ListImageByID[]>([]);
  const [chartData, setChartData] = useState<ChartModel[]>([]);

  useEffect(() => {
    async function fetchUserDataAndImages() {
      const userDataStr = localStorage.getItem("user_WEBAVD");
      if (userDataStr) {
        const user: Usermodel = JSON.parse(userDataStr);
        setuserdata(user);
        if (user?.id) {
          const images: ListImageByID[] = await getListimageById(user.id);
          setlistImageofuser(images);
          // Simulated chart data fetch, replace with your actual data fetch logic
          // This is where you would call an API to get your chart data
          // For demonstration, using static data provided
          const demoChartData: ChartModel[] = [
            {
              id: 25,
              image_id: 19,
              date: "2024-02-29T00:00:00.000Z",
              votes_gained: 5,
              rank: null,
            },
            {
              id: 1,
              image_id: 19,
              date: "2024-03-01T00:00:00.000Z",
              votes_gained: 1,
              rank: null,
            },
            // Add all your data points here
          ];
          //   const statsByIdImage = await getdaily_statsByIdImage(19);
          setChartData(demoChartData);
        }
      }
    }

    fetchUserDataAndImages();
  }, [chartData]);

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
          //   alignItems: "center",
          //   maxWidth: "80vw",
          width: "100%",
          margin: 0,
          padding: 2,
          //   backgroundColor: "rgba(255, 255, 255, 1)",
        }}
      >
        <Avatar
          alt="User Profile"
          src={userdata?.image_profile}
          sx={{
            width: (theme) => theme.spacing(25), // Use a fixed size for width
            height: (theme) => theme.spacing(25), // Use a fixed size for height to match the width
            borderRadius: "50%", // This will make it a circle
            maxWidth: "100%", // Ensure the avatar doesn't exceed the container's width
            maxHeight: "100%", // Ensure the avatar doesn't exceed the container's height
            objectFit: "cover", // Cover the area without distorting the aspect ratio
            marginY: 2, // Optional: Add some vertical margin if needed
            margin: 0,
          }}
        />
        <Box
          sx={{
            padding: 2,
            backgroundColor: "rgba(255, 255, 255, 1)",
            margin: 2,
            borderRadius: "30px",
            minWidth: "25vw",
            minHeight: "25vh",
          }}
        >
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
        </Box>
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 1)",
            margin: 2,
            borderRadius: "30px",
            minWidth: "20vw",
            // minHeight: "32vh",
          }}
        >
          <p style={{ textAlign: "center", fontFamily: "Kanit" }}>BIO</p>
          <p>{userdata?.textBio}</p>
          {/* <LineChartComponent data={chartData} /> */}
          <Box sx={{ marginTop: 4 }}>
            {/* Pass chartData to the LineChartComponent */}
            {/* <LineChartComponent key={chartData.length} data={chartData} /> */}

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
          //   alignItems: "center",
          padding: 1,
          backgroundColor: "rgba(255, 255, 255, 1)",
          margin: 2,
          marginLeft: 4,
          borderRadius: "30px",
          minHeight: "40vh",
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
            {listImageofuser.slice(0, 4)?.map((image) => (
              <Item
                sx={{
                  borderRadius: "30px",
                  padding: 0,
                  transition: "transform 0.3s ease-in-out", // Add this line
                  "&:hover": {
                    // Add this block
                    transform: "scale(0.9)", // Change the scale to your preference
                  },
                }}
              >
                {" "}
                <img
                  key={image.imgid}
                  src={image.image_url}
                  alt={image.imgid.toString()}
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
            <Grid xs={12} md={12}>
              {row1()}
            </Grid>
            <Grid xs={12} md={12}>
              {row2()}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Container>
  );
}
